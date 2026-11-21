import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUserBySessionToken, getUserById } from "@/lib/db";

export type SessionIdentity = {
  id: string;
  email: string;
  role: "admin" | "student";
  fullName?: string;
  phone?: string;
  college?: string;
  registerNumber?: string;
  department?: string;
  degree?: string;
  graduationYear?: number | null;
  isDevSession?: boolean;
};

export const DEV_DEFAULT_STUDENT: SessionIdentity = {
  id: "00000000-0000-4000-a000-000000000001",
  email: "student@learninghub.edu",
  role: "student",
  fullName: "Aditya Sharma",
  phone: "+91 98401 11223",
  college: "National Institute of Technology, Trichy",
  registerNumber: "NITT-2024-CS-0842",
  department: "Computer Science and Engineering",
  degree: "B.Tech Computer Science",
  graduationYear: 2026,
  isDevSession: false,
};

export const DEV_DEFAULT_ADMIN: SessionIdentity = {
  id: "00000000-0000-4000-a000-000000000099",
  email: "admin@learninghub.edu",
  role: "admin",
  fullName: "Prof. Sairam Vasudevan",
  phone: "+91 98401 00099",
  college: "Learning Management System Admin",
  registerNumber: "ADMIN-FACULTY-01",
  department: "Academic & Placement Affairs",
  degree: "Head of Technical Learning",
  graduationYear: 2020,
  isDevSession: false,
};

export async function getCurrentIdentity(): Promise<SessionIdentity | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims?.sub) return null;
      const role = await getRole(String(data.claims.sub));
      return {
        id: String(data.claims.sub),
        email: String(data.claims.email ?? ""),
        role,
        isDevSession: false,
      };
    } catch {
      return null;
    }
  }

  // Real persistent backend session via SQLite
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("psl_session")?.value;
  if (sessionToken) {
    try {
      const user = getUserBySessionToken(sessionToken);
      if (user) {
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
          phone: user.phone,
          college: user.college,
          registerNumber: user.register_number,
          department: user.department,
          degree: user.degree,
          graduationYear: user.graduation_year,
          isDevSession: false,
        };
      }
    } catch {
      // ignore
    }
  }

  // Fallback dev session via HTTP cookie
  const sessionCookie = cookieStore.get("psl_dev_session");
  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsed && parsed.id && parsed.role) {
        return parsed as SessionIdentity;
      }
    } catch {
      // invalid cookie format
    }
  }
  return null;
}

export async function requireIdentity(): Promise<SessionIdentity> {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login");
  return identity;
}

export async function getRole(userId: string): Promise<"admin" | "student"> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
      return data?.role === "admin" ? "admin" : "student";
    } catch {
      return "student";
    }
  }

  try {
    const user = getUserById(userId);
    if (user) return user.role;
  } catch {
    // ignore
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("psl_dev_session");
  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      return parsed.role === "admin" ? "admin" : "student";
    } catch {
      return "student";
    }
  }
  return "student";
}

export async function requireAdmin(): Promise<SessionIdentity> {
  const identity = await requireIdentity();
  if (identity.role !== "admin") redirect("/portal");
  return identity;
}
