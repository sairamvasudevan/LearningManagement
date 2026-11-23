import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "@/components/auth-forms";
import { COURSE_PACKAGES } from "@/lib/courses";
import { getCurrentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const identity = await getCurrentIdentity();
  const course = COURSE_PACKAGES[0];

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />
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
          <span className="eyebrow">NEW STUDENT ENROLLMENT</span>
          <h2>Create your student account</h2>
          <p>All fields marked with * are required. Registration for {course.title} is free.</p>

          {identity && (
            <div
              style={{
                marginBottom: "22px",
                padding: "16px 18px",
                background: "rgba(0, 113, 227, 0.12)",
                border: "1px solid rgba(0, 113, 227, 0.35)",
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--apple-blue-accent)", fontWeight: 700 }}>
                ✓ Currently signed in as {identity.fullName || identity.email} ({identity.role})
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <Link
                  href={identity.role === "admin" ? "/admin" : "/portal"}
                  className="button button-small button-cn-primary"
                  style={{ textDecoration: "none", fontSize: "11px", padding: "6px 14px" }}
                >
                  Go to {identity.role === "admin" ? "Admin Portal" : "Student Hub"} →
                </Link>
                <form action="/auth/signout" method="POST" style={{ margin: 0 }}>
                  <button
                    type="submit"
                    className="button button-small button-quiet"
                    style={{
                      fontSize: "11px",
                      padding: "6px 14px",
                      color: "var(--apple-red)",
                      borderColor: "rgba(255, 69, 58, 0.3)",
                    }}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}

          <RegisterForm />
          <div className="auth-bottom">
            Already registered? <Link href="/login">Sign in</Link>
          </div>
        </section>
      </main>
    </>
  );
}
