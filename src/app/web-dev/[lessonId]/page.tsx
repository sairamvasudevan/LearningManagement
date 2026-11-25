import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { WebDevPlayground } from "@/components/web-dev-playground";
import { WEB_DEV_LESSONS, getWebDevLessonById } from "@/lib/web-dev-data";
import { getCurrentIdentity } from "@/lib/auth";
import { checkCourseAccess } from "@/lib/course-prerequisites";
import { PrerequisiteLockScreen } from "@/components/prerequisite-lock";

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
  const access = checkCourseAccess(identity?.id, "web-dev-mern-lab");

  // If course is locked and this is not the free preview chapter (html-intro)
  if (access.isLocked && lesson.id !== "html-intro") {
    return (
      <>
        <SiteHeader signedIn={!!identity} admin={identity?.role === "admin"} />
        <PrerequisiteLockScreen
          access={access}
          courseTitle="Full-Stack Web Development & MERN Lab"
          lessonTitle={`Chapter #${lesson.number}: ${lesson.title}`}
          firstPartLabel="Chapter 01 (HTML5 Skeleton)"
          previewUrl="/web-dev/html-intro"
          syllabusUrl="/web-dev"
        />
      </>
    );
  }

  return (
    <>
      <SiteHeader signedIn={!!identity} admin={identity?.role === "admin"} />
      {access.isLocked && lesson.id === "html-intro" && (
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
            👁️ <b>Free Chapter Preview:</b> You are previewing Chapter 1. Complete the <b>100-Hour Problem Solving Lab</b> ({access.completedModulesCount}/100 done) to unlock the remaining 25 chapters.
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
      <WebDevPlayground lesson={lesson} allLessons={WEB_DEV_LESSONS} />
    </>
  );
}
