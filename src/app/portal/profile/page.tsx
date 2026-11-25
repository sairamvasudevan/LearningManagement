import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { StudentCareerForm } from "@/components/student-career-form";
import { requireIdentity, getRole } from "@/lib/auth";
import {
  getStudentCareerProfile,
  getUserById,
  getUserCommunicationSubmissions,
  getUserProgress,
  getUserSolvedDsaProblemIds,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudentCareerProfilePage() {
  const identity = await requireIdentity();
  if ((await getRole(identity.id)) === "admin") {
    redirect("/admin/placements");
  }

  const user = getUserById(identity.id);
  const career = getStudentCareerProfile(identity.id);
  if (!user || !career) {
    redirect("/portal");
  }

  const modulesCompleted = getUserProgress(identity.id).filter(
    (p) => p.status === "completed",
  ).length;
  const dsaSolvedCount = getUserSolvedDsaProblemIds(identity.id).size;
  const commSubs = getUserCommunicationSubmissions(identity.id);
  const bestVersantScore = commSubs.length
    ? Math.max(...commSubs.map((s) => s.overall_score))
    : null;
  const latestCefr = commSubs[0]?.cefr_level || null;

  const safeUser = {
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
  };

  return (
    <>
      <SiteHeader signedIn admin={false} />
      <main>
        <StudentCareerForm
          user={safeUser}
          initialCareer={{ ...career }}
          platformStats={{
            modulesCompleted,
            dsaSolvedCount,
            bestVersantScore,
            latestCefr,
          }}
        />
      </main>
    </>
  );
}
