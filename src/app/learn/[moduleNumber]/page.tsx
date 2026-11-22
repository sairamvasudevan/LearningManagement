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

  // Sequential progression check:
  // Module 1 is always unlocked.
  // Module N requires Module N-1 to be marked completed in SQLite.
  if (moduleNumber > 1) {
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
