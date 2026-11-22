import { notFound, redirect } from "next/navigation";
import { requireIdentity, getRole } from "@/lib/auth";
import { ModulePlayer } from "@/components/module-player";
import { MODULES_CURRICULUM } from "@/lib/curriculum-data";
import { getUserProgress } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ moduleNumber: string }> };

export default async function LearnModulePage({ params }: PageProps) {
  const { moduleNumber: raw } = await params;
  const moduleNumber = Number(raw);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 100) notFound();

  const identity = await requireIdentity();
  if ((await getRole(identity.id)) === "admin") redirect("/admin");

  // Check if authored in curriculum
  const curriculum = MODULES_CURRICULUM[moduleNumber];
  if (!curriculum) {
    redirect("/portal");
  }

  // Stage start modules (1, 11, 21, 31, 41, 51, 61, 71, 81, 91) are unlocked by default.
  // Subsequent modules require the immediate preceding module to be completed with >= 80%.
  const isStageStart = moduleNumber % 10 === 1;
  if (!isStageStart && moduleNumber > 1) {
    const progressList = getUserProgress(identity.id);
    const completedSet = new Set(
      progressList.filter((p) => p.status === "completed").map((p) => p.module_number),
    );
    if (!completedSet.has(moduleNumber - 1)) {
      redirect("/portal");
    }
  }

  return <ModulePlayer key={moduleNumber} curriculum={curriculum} />;
}
