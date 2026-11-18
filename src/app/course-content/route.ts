import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: claims, error: authError } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (authError || !userId) return new NextResponse("Authentication required", { status: 401 });

    const { data: canAccess, error: accessError } = await supabase.rpc("can_access_module", { p_module_number: 1 });
    if (accessError || canAccess !== true) return new NextResponse("Course access required", { status: 403 });

    await supabase.rpc("start_lesson", { p_module_number: 1 });
    const { data: savedActivities } = await supabase.from("lesson_activity_responses")
      .select("activity_id,response").eq("student_id", String(userId)).eq("module_number", 1);
    const drafts = Object.fromEntries((savedActivities || []).map((row: {activity_id:string;response:string}) => [row.activity_id,row.response]));
    const safeJson = (value: unknown) => JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    let html = await readFile(join(process.cwd(), "private-content", "module-01.html"), "utf8");
    html = html.replace("<script>\nconst COURSE =", `<script>window.__PSL_STUDENT_ID=${safeJson(String(userId))};window.__PSL_SAVED_ACTIVITY_DRAFTS=${safeJson(drafts)};</script>\n<script>\nconst COURSE =`);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'",
      },
    });
  } catch {
    return new NextResponse("Course content is temporarily unavailable", { status: 500 });
  }
}
