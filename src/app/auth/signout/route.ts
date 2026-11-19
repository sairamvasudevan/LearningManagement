import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { hasSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return new NextResponse("Cross-origin request rejected", { status: 403 });

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Proceed even if Supabase network call fails
    }
  }

  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  response.cookies.delete("psl_dev_session");
  return response;
}
