import { SiteHeader } from "@/components/site-header";
import { AudioDsaStudio } from "@/components/audio-dsa-studio";
import { getCurrentIdentity } from "@/lib/auth";
import { getUserAudioDsaProgress } from "@/lib/db";

export const dynamic = "force-dynamic";

type AudioDsaPageProps = {
  searchParams: Promise<{ ep?: string }>;
};

export default async function AudioDsaPage({ searchParams }: AudioDsaPageProps) {
  const { ep } = await searchParams;
  const identity = await getCurrentIdentity();
  const rows = identity ? getUserAudioDsaProgress(identity.id) : [];
  const completedIds = rows
    .filter((r) => r.passed === 1)
    .map((r) => r.episode_id);

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />
      <main>
        <AudioDsaStudio
          initialEpisodeId={ep}
          initialCompletedIds={completedIds}
          signedIn={Boolean(identity)}
        />
      </main>
    </>
  );
}
