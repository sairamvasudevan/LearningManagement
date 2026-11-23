import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/auth-forms";
import { getCurrentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const identity = await getCurrentIdentity();

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />
      <main className="auth-page">
        <div className="auth-aside">
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Continue where your thinking left off.</h1>
          <p>Your lessons, attempts, scores and learning path are saved to your student account.</p>
          <div className="aside-rule">
            <span>01</span> One student account · One continuous learning record
          </div>
        </div>
        <section className="auth-card">
          <span className="eyebrow">STUDENT PORTAL</span>
          <h2>Sign in</h2>
          <p>Use the email address and password linked to your course registration.</p>

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
                  Continue to {identity.role === "admin" ? "Admin Portal" : "Student Hub"} →
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

          <LoginForm />
          <div className="auth-bottom">
            New to the course? <Link href="/register">Create an account</Link>
          </div>
        </section>
      </main>
    </>
  );
}
