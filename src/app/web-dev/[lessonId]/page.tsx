import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { WebDevPlayground } from "@/components/web-dev-playground";
import { WEB_DEV_LESSONS, getWebDevLessonById } from "@/lib/web-dev-data";
import { getCurrentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function WebDevLessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getWebDevLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const identity = await getCurrentIdentity();

  return (
    <>
      <SiteHeader signedIn={!!identity} />
      <WebDevPlayground lesson={lesson} allLessons={WEB_DEV_LESSONS} />
    </>
  );
}
