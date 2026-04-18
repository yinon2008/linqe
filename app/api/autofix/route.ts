import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { ProjectPlan } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { deviceMode, projectPlan } = (await req.json()) as {
      deviceMode: "tablet" | "mobile";
      projectPlan: ProjectPlan;
    };

    if (!deviceMode || !projectPlan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const deviceWidth = deviceMode === "mobile" ? "375px" : "768px";
    const deliverableTitles = projectPlan.deliverables.map((d) => d.title).join(", ");
    const taskCount = projectPlan.deliverables.reduce((n, d) => n + d.tasks.length, 0);

    const prompt = `You are a CSS expert. A project planning UI displays a 3-column grid layout with deliverables, tasks, and cost sections at full width. It must be adapted for ${deviceMode} (${deviceWidth} viewport).

Project: "${projectPlan.project_title}" — ${projectPlan.deliverables.length} deliverables (${deliverableTitles}), ${taskCount} tasks.

The layout uses Tailwind CSS class names like: grid grid-cols-1 lg:grid-cols-3, flex items-start, rounded-2xl, p-5, text-sm, text-2xl, max-w-5xl.

Return ONLY a JSON object with a single key "cssRules" containing a CSS string that fixes the layout for ${deviceMode}. Fix these common issues:
- Oversized headings (reduce text-2xl/3xl to appropriate mobile sizes)
- Overflow text in cards (add word-break, overflow-wrap)
- Cramped padding (reduce p-5 sections for small screens)
- Font sizes too large for narrow widths
- Any flex items that overflow

Use specific selectors targeting Tailwind-generated classes or generic element types. Keep the fix minimal and targeted. Respond with ONLY valid JSON — no markdown, no explanation.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    let cssRules = "";
    try {
      const parsed = JSON.parse(text);
      cssRules = parsed.cssRules ?? "";
    } catch {
      // If Claude returns fenced JSON, strip fences and retry
      const stripped = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      try {
        const parsed = JSON.parse(stripped);
        cssRules = parsed.cssRules ?? "";
      } catch {
        return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
      }
    }

    return NextResponse.json({ cssRules });
  } catch (err) {
    console.error("Autofix error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
