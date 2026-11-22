import { getUserProgress, getUserById } from "@/lib/db";

export interface CourseAccessStatus {
  courseSlug: string;
  isFlagship: boolean;
  isLocked: boolean;
  canStudy: boolean;
  canPreviewFirstPart: boolean;
  completedModulesCount: number;
  totalRequiredModules: number;
  percentageCompleted: number;
  reason: string | null;
  previewLessonId: string;
  previewProblemId: string;
}

export const FLAGSHIP_SLUG = "problem-solving-lab";
export const FLAGSHIP_TOTAL_MODULES = 100;

/**
 * Checks whether a student has met the prerequisite requirement
 * (completing the 100-Hour Problem Solving Lab) before accessing advanced tracks.
 */
export function checkCourseAccess(userId: string | null | undefined, courseSlug: string): CourseAccessStatus {
  // Flagship 100-Hour Problem Solving Lab is always unlocked for study
  if (courseSlug === FLAGSHIP_SLUG) {
    return {
      courseSlug,
      isFlagship: true,
      isLocked: false,
      canStudy: true,
      canPreviewFirstPart: true,
      completedModulesCount: 0,
      totalRequiredModules: FLAGSHIP_TOTAL_MODULES,
      percentageCompleted: 100,
      reason: null,
      previewLessonId: "html-intro",
      previewProblemId: "two-sum",
    };
  }

  // Admin users have full master access to view and test all courses
  if (userId) {
    const user = getUserById(userId);
    if (user?.role === "admin") {
      return {
        courseSlug,
        isFlagship: false,
        isLocked: false,
        canStudy: true,
        canPreviewFirstPart: true,
        completedModulesCount: FLAGSHIP_TOTAL_MODULES,
        totalRequiredModules: FLAGSHIP_TOTAL_MODULES,
        percentageCompleted: 100,
        reason: null,
        previewLessonId: "html-intro",
        previewProblemId: "two-sum",
      };
    }
  }

  // For students: check completed modules in the flagship Problem Solving Lab
  let completedCount = 0;
  if (userId) {
    const progressList = getUserProgress(userId);
    completedCount = progressList.filter((p) => p.status === "completed").length;
  }

  const isCompleted = completedCount >= FLAGSHIP_TOTAL_MODULES;
  const pct = Math.min(100, Math.round((completedCount / FLAGSHIP_TOTAL_MODULES) * 100));

  return {
    courseSlug,
    isFlagship: false,
    isLocked: !isCompleted,
    canStudy: isCompleted,
    canPreviewFirstPart: true,
    completedModulesCount: completedCount,
    totalRequiredModules: FLAGSHIP_TOTAL_MODULES,
    percentageCompleted: pct,
    reason: isCompleted
      ? null
      : `Prerequisite Required: You must complete all 100 modules of the foundational Problem Solving Lab before unlocking full interactive access for this course. You can preview the initial chapter/problem.`,
    previewLessonId: "html-intro",
    previewProblemId: "two-sum",
  };
}
