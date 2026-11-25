import { SiteHeader } from "@/components/site-header";
import { CommunicationStudio } from "@/components/communication-studio";
import { getCurrentIdentity } from "@/lib/auth";
import {
  getUserCommunicationSubmissions,
  getUserCompletedCommunicationExerciseIds,
} from "@/lib/db";
import type { LsrwSkill } from "@/lib/communication-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ tab?: string; skill?: string }>;
};

export default async function CommunicationStudioPage({ searchParams }: PageProps) {
  const { tab, skill } = await searchParams;
  const identity = await getCurrentIdentity();

  const validTab =
    tab === "curriculum" || tab === "practice" || tab === "assessment" ? tab : "practice";
  const validSkill: "all" | LsrwSkill =
    skill === "listening" || skill === "speaking" || skill === "reading" || skill === "writing"
      ? skill
      : "all";

  const submissions = identity ? getUserCommunicationSubmissions(identity.id) : [];
  const completedIds = identity
    ? Array.from(getUserCompletedCommunicationExerciseIds(identity.id))
    : [];
  const bestScore = submissions.length
    ? Math.max(...submissions.map((s) => s.overall_score))
    : null;

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />
      <main>
        <CommunicationStudio
          initialTab={validTab}
          initialSkill={validSkill}
          completedIds={completedIds}
          recentBestScore={bestScore}
          signedIn={Boolean(identity)}
        />
      </main>
    </>
  );
}
