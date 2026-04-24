import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminClient = createServiceRoleClient();

    const { data } = await adminClient
      .from("projects")
      .select("views")
      .eq("id", params.id)
      .eq("is_public", true)
      .single();

    if (!data) return NextResponse.json({ ok: false });

    await adminClient
      .from("projects")
      .update({ views: (data.views ?? 0) + 1 })
      .eq("id", params.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
