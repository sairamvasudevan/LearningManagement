import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DsaCodeArena } from "@/components/dsa-code-arena";
import { DSA_PROBLEMS } from "@/lib/dsa-problems";
import { getCurrentIdentity } from "@/lib/auth";
import { getUserSolvedDsaProblemIds } from "@/lib/db";
import { checkCourseAccess } from "@/lib/course-prerequisites";
import { PrerequisiteLockScreen } from "@/components/prerequisite-lock";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ problemId: string }> };

export default async function DsaProblemDetailPage({ params }: PageProps) {
  const { problemId } = await params;
  const problem = DSA_PROBLEMS.find((p) => p.id === problemId);
  if (!problem) notFound();

  const identity = await getCurrentIdentity();
  const userId = identity?.id || "";
  const solvedIds = userId ? Array.from(getUserSolvedDsaProblemIds(userId)) : [];
  const access = checkCourseAccess(identity?.id, "dsa-mastery-lab");

  // If course is locked and this is not the free preview problem (two-sum)
  if (access.isLocked && problemId !== "two-sum") {
    return (
      <>
        <SiteHeader signedIn={!!identity} />
        <PrerequisiteLockScreen
          access={access}
          courseTitle="DSA CodeStudio: Algorithmic Arena"
          lessonTitle={`Problem: ${problem.title}`}
          firstPartLabel="Problem 01 (Two Sum)"
          previewUrl="/dsa/two-sum"
          syllabusUrl="/dsa"
        />
      </>
    );
  }

  return (
    <>
      <SiteHeader signedIn={!!identity} />
      {access.isLocked && problemId === "two-sum" && (
        <div
          style={{
            background: "#1e1b4b",
            borderBottom: "1px solid #4338ca",
            color: "#e0e7ff",
            padding: "8px 16px",
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span>
            👁️ <b>Free Problem Preview:</b> You are previewing Problem 01 (Two Sum). Complete the <b>100-Hour Problem Solving Lab</b> ({access.completedModulesCount}/100 done) to unlock the remaining 11 problems.
          </span>
          <a
            href="/portal"
            style={{
              color: "#38bdf8",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Go to Problem Solving Lab →
          </a>
        </div>
      )}
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
