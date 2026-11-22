import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DsaCodeArena } from "@/components/dsa-code-arena";
import { DSA_PROBLEMS } from "@/lib/dsa-problems";
import { getCurrentIdentity } from "@/lib/auth";
import { getUserSolvedDsaProblemIds } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ problemId: string }> };

export default async function DsaProblemDetailPage({ params }: PageProps) {
  const { problemId } = await params;
  const problem = DSA_PROBLEMS.find((p) => p.id === problemId);
  if (!problem) notFound();

  const identity = await getCurrentIdentity();
  const userId = identity?.id || "";
  const solvedIds = userId ? Array.from(getUserSolvedDsaProblemIds(userId)) : [];

  return (
    <>
      <SiteHeader signedIn={!!identity} />
      <main style={{ minHeight: "calc(100vh - 64px)", background: "#f8fafc" }}>
        <DsaCodeArena
          initialProblem={problem}
          allProblems={DSA_PROBLEMS}
          solvedProblemIds={solvedIds}
        />
      </main>
    </>
  );
}
