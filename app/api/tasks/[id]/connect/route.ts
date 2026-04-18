import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;
  const adminClient = createServiceRoleClient();

  try {
    // Immediately mark as connecting
    const { error: connectingError } = await adminClient
      .from("tasks")
      .update({ status: "connecting" })
      .eq("id", taskId);

    if (connectingError) throw connectingError;

    // Simulate integration delay on the server with a proper async approach.
    // We return 202 immediately; the background work uses the Vercel function
    // timeout window.  For production, swap with a real queue/webhook.
    void (async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 3000));
      const { error } = await adminClient
        .from("tasks")
        .update({ status: "connected", completed_at: new Date().toISOString() })
        .eq("id", taskId);
      if (error) {
        console.error("Task connect finalise error:", error);
        await adminClient
          .from("tasks")
          .update({ status: "failed" })
          .eq("id", taskId);
      }
    })();

    return NextResponse.json({ success: true }, { status: 202 });
  } catch (err) {
    console.error("Connect error:", err);
    await adminClient
      .from("tasks")
      .update({ status: "failed" })
      .eq("id", taskId)
      .then(() => null, () => null);
    return NextResponse.json({ error: "Failed to connect task" }, { status: 500 });
  }
}
