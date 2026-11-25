import { InterviewStudio } from "@/components/interview-studio";
import { getCurrentIdentity } from "@/lib/auth";
import { getUserInterviewCredits, listUserInterviewSessions } from "@/lib/db";
import { INTERVIEW_BOTS, INTERVIEW_QUESTIONS } from "@/lib/interview-bots";

export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const identity = await getCurrentIdentity();
  const credits = identity ? getUserInterviewCredits(identity.id) : null;
  const sessions = identity ? listUserInterviewSessions(identity.id) : [];

  // InterviewStudio renders its own full-page layout (header + main).
  // Do NOT wrap in SiteHeader or <main> — it would create a double header.
  return (
    <InterviewStudio
      initialBots={INTERVIEW_BOTS}
      initialQuestions={INTERVIEW_QUESTIONS}
      initialCredits={credits}
      initialSessions={sessions}
      signedIn={Boolean(identity)}
    />
  );
}
