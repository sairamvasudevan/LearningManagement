import { notFound, redirect } from "next/navigation";
import { requireIdentity, getRole } from "@/lib/auth";
import { ModulePlayer } from "@/components/module-player";
import { MODULES_CURRICULUM } from "@/lib/curriculum-data";
import { getUserProgress, getPracticeSubmissions } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ moduleNumber: string }> };

export default async function LearnModulePage({ params }: PageProps) {
  const { moduleNumber: raw } = await params;
  const moduleNumber = Number(raw);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 100) notFound();

  const identity = await requireIdentity();
  const role = await getRole(identity.id);
  const isAdmin = role === "admin";

  // Check if authored in curriculum
  const curriculum = MODULES_CURRICULUM[moduleNumber];
  if (!curriculum) {
    redirect(isAdmin ? "/admin/feedback" : "/portal");
  }

  // Stage start modules (1, 11, 21, 31, 41, 51, 61, 71, 81, 91) are unlocked by default.
  // Subsequent modules require the immediate preceding module to be completed with >= 80%.
  // Faculty & Administrators can freely inspect and review any curriculum module!
  const isStageStart = moduleNumber % 10 === 1;
  if (!isAdmin && !isStageStart && moduleNumber > 1) {
    const progressList = getUserProgress(identity.id);
    const completedSet = new Set(
      progressList.filter((p) => p.status === "completed").map((p) => p.module_number),
    );
    if (!completedSet.has(moduleNumber - 1)) {
      redirect("/portal");
    }
  }

  const existingSubmissions = getPracticeSubmissions(identity.id, moduleNumber);
  const initialPracticeSubmission = existingSubmissions[0]?.submission || "";

  return (
    <ModulePlayer
      key={moduleNumber}
      curriculum={curriculum}
      isAdmin={isAdmin}
      initialPracticeSubmission={initialPracticeSubmission}
      currentUser={{
        id: identity.id,
        name: identity.fullName || identity.email.split("@")[0],
        email: identity.email,
        role,
      }}
    />
  );
}
