import { SiteHeader } from "@/components/site-header";
import { StandaloneIde } from "@/components/standalone-ide";
import { getCurrentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function IdePage() {
  const identity = await getCurrentIdentity();

  return (
    <>
      <SiteHeader signedIn={!!identity} />
      <main style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
        <StandaloneIde />
      </main>
    </>
  );
}
