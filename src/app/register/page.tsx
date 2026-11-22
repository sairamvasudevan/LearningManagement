import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "@/components/auth-forms";
import { COURSE_PACKAGES } from "@/lib/courses";

export default function RegisterPage() {
  const course = COURSE_PACKAGES[0];

  return (
    <>
      <SiteHeader />
      <main className="register-layout">
        <div className="register-intro">
          <span className="eyebrow">STUDENT REGISTRATION</span>
          <h1>Register once. Track every step of your learning.</h1>
          <p>
            Create your student account to enroll in available learning packages. Your profile,
            lesson progress, assessment scores, and unlocks stay saved to this account.
          </p>

          <div className="selected-package-card">
            <div className="selected-package-head">
              <span className="eyebrow">SELECTED PACKAGE</span>
              <span className="badge badge-live">{course.priceLabel} · ₹0</span>
            </div>
            <h3>{course.title}</h3>
            <p>
              {course.totalHours} hours · {course.totalPaths} learning paths · Sequential
              criterion-referenced progression
            </p>
            <Link href={`/courses/${course.slug}`} className="inline-link">
              View full syllabus →
            </Link>
          </div>

          <div className="privacy-note">
            <b>Student data protection</b>
            <span>
              Your profile and learning progress are visible to you and authorised course
              administrators. Other students cannot access your personal or academic details.
            </span>
          </div>
        </div>

        <section className="register-card">
          <h2>Create your student account</h2>
          <p>All fields marked with * are required. Registration for {course.title} is free.</p>
          <RegisterForm />
          <div className="auth-bottom">
            Already registered? <Link href="/login">Sign in</Link>
          </div>
        </section>
      </main>
    </>
  );
}
