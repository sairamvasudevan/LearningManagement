import { SiteHeader } from "@/components/site-header";
import { InterviewStudio } from "@/components/interview-studio";
import { getCurrentIdentity } from "@/lib/auth";
import { getUserInterviewCredits, listUserInterviewSessions } from "@/lib/db";
import { INTERVIEW_BOTS, INTERVIEW_QUESTIONS } from "@/lib/interview-bots";

export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const identity = await getCurrentIdentity();
  const credits = identity ? getUserInterviewCredits(identity.id) : null;
  const sessions = identity ? listUserInterviewSessions(identity.id) : [];

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />
      <main>
        <InterviewStudio
          initialBots={INTERVIEW_BOTS}
          initialQuestions={INTERVIEW_QUESTIONS}
          initialCredits={credits}
          initialSessions={sessions}
          signedIn={Boolean(identity)}
        />
      </main>
    </>
  );
}
