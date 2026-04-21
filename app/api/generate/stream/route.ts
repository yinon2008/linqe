import { NextRequest } from "next/server";
import { anthropic, CACHED_SYSTEM } from "@/lib/anthropic";
import { createServiceRoleClient } from "@/lib/supabase-server";
import type { ProjectPlan } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

function send(controller: ReadableStreamDefaultController, data: object) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
}

const LOG_MILESTONES: Array<{ at: number; message: string }> = [
  { at: 0,    message: "Analyzing your idea..." },
  { at: 0.15, message: "Structuring deliverables..." },
  { at: 0.40, message: "Calculating costs..." },
  { at: 0.65, message: "Writing task details..." },
  { at: 0.85, message: "Finalizing your plan..." },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("id");

  if (!projectId) {
    return new Response("Missing project id", { status: 400 });
  }

  const adminClient = createServiceRoleClient();

  const { data: project, error: fetchError } = await adminClient
    .from("projects")
    .select("raw_prompt, status, ai_response")
    .eq("id", projectId)
    .single();

  if (fetchError || !project) {
    return new Response("Project not found", { status: 404 });
  }

  // Already done — stream a single done event with cached logs
  if (project.ai_response) {
    const stream = new ReadableStream({
      start(controller) {
        send(controller, { done: true, plan: project.ai_response });
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";
      let logIndex = 0;

      // Estimate max tokens to calculate progress ratio
      const MAX_EXPECTED = 3500;

      function maybeEmitLog(charsReceived: number) {
        const ratio = Math.min(charsReceived / (MAX_EXPECTED * 3.5), 1); // ~3.5 chars per token
        while (
          logIndex < LOG_MILESTONES.length &&
          ratio >= LOG_MILESTONES[logIndex].at
        ) {
          send(controller, { log: LOG_MILESTONES[logIndex].message });
          logIndex++;
        }
      }

      try {
        // Emit first log immediately
        send(controller, { log: LOG_MILESTONES[0].message });
        logIndex = 1;

        const stream = anthropic.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 4096,
          system: CACHED_SYSTEM,
          messages: [{ role: "user", content: project.raw_prompt }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            fullText += chunk;
            send(controller, { chunk });
            maybeEmitLog(fullText.length);
          }
        }

        // Emit any remaining logs
        while (logIndex < LOG_MILESTONES.length) {
          send(controller, { log: LOG_MILESTONES[logIndex].message });
          logIndex++;
        }

        const cleaned = fullText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        let plan: ProjectPlan;
        try {
          plan = JSON.parse(cleaned);
        } catch {
          throw new Error("Claude returned invalid JSON");
        }

        await adminClient
          .from("projects")
          .update({
            title: plan.project_title,
            description: plan.project_description,
            ai_response: plan,
            status: "building",
          })
          .eq("id", projectId);

        const allTasks = plan.deliverables.flatMap((d) =>
          d.tasks.map((t) => ({
            id: t.id,
            project_id: projectId,
            title: t.title,
            description: t.description,
            status: "pending" as const,
            automation_type: t.automation_type,
            estimated_cost_usd: t.estimated_cost_usd,
          }))
        );

        if (allTasks.length > 0) {
          await adminClient.from("tasks").upsert(allTasks, { onConflict: "id" });
        }

        send(controller, { done: true, plan });
      } catch (err) {
        console.error("Stream error:", err);
        await adminClient
          .from("projects")
          .update({ status: "draft" })
          .eq("id", projectId);
        send(controller, {
          error: err instanceof Error ? err.message : "Generation failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
