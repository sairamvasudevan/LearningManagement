import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getCurrentIdentity() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return { id: String(data.claims.sub), email: String(data.claims.email ?? "") };
}

export async function requireIdentity() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login");
  return identity;
}

export async function getRole(userId: string): Promise<"admin" | "student"> {
  const supabase = await createClient();
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
  return data?.role === "admin" ? "admin" : "student";
}

export async function requireAdmin() {
  const identity = await requireIdentity();
  const role = await getRole(identity.id);
  if (role !== "admin") redirect("/portal");
  return identity;
}
