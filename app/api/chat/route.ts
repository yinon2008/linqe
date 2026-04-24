import { NextRequest } from "next/server";
import { anthropic, CACHED_LIVE_PREVIEW_EDITOR_SYSTEM } from "@/lib/anthropic";
import { FileTagParser } from "@/lib/fileParser";

export const runtime = "nodejs";
export const maxDuration = 120;

function send(controller: ReadableStreamDefaultController, data: object) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
}

export async function POST(req: NextRequest) {
  let body: { message: string; html: string; projectId: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { message, html } = body;
  if (!message?.trim()) {
    return new Response("Missing message", { status: 400 });
  }

  const userContent = html?.trim()
    ? `Current app HTML:\n${html}\n\nUser request: ${message}`
    : message;

  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";
      const parser = new FileTagParser();

      try {
        const stream = anthropic.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 16000,
          system: CACHED_LIVE_PREVIEW_EDITOR_SYSTEM,
          messages: [{ role: "user", content: userContent }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            fullText += chunk;
            const { content, isComplete } = parser.feed(chunk);
            if (content) {
              send(controller, { htmlChunk: content });
            }
            if (isComplete) break;
          }
        }

        const htmlToSend = parser.accumulated || fullText;
        send(controller, { done: true, html: htmlToSend });
      } catch (err) {
        console.error("Chat error:", err);
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
