import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/security";
import { getCurrentIdentity } from "@/lib/auth";
import {
  getStudentCareerProfile,
  getUserById,
  upsertStudentCareerProfile,
  type DbStudentCareerProfile,
} from "@/lib/db";

const MAX_BODY_BYTES = 32_768;

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    const user = getUserById(identity.id);
    const career = getStudentCareerProfile(identity.id);
    const safeUser = user
      ? {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone,
          college: user.college,
          register_number: user.register_number,
          department: user.department,
          degree: user.degree,
          graduation_year: user.graduation_year,
          enrollment_status: user.enrollment_status,
          created_at: user.created_at,
        }
      : null;
    return NextResponse.json({ ok: true, user: safeUser, career });
  } catch {
    return NextResponse.json({ error: "Could not load career profile." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Profile payload exceeds 32KB limit." }, { status: 413 });
    }

    const body = JSON.parse(raw) as Partial<Omit<DbStudentCareerProfile, "user_id" | "updated_at">>;
    const updated = upsertStudentCareerProfile(identity.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Student profile record not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, career: updated });
  } catch {
    return NextResponse.json({ error: "Failed to save career profile." }, { status: 400 });
  }
}
