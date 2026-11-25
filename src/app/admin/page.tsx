import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminMetrics, getModuleFeedbackMetrics, getRegistrationMode } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const identity = await requireAdmin();

  // Load live SQLite metrics
  const metrics = getAdminMetrics();
  const feedbackMetrics = getModuleFeedbackMetrics();
  let studentCount = metrics.totalStudents;
  let approvedCount = metrics.approvedStudents;
  let pendingCount = Math.max(0, metrics.totalStudents - metrics.approvedStudents);
  let completedLessonsCount = metrics.totalModulesMastered;
  let registrationMode = getRegistrationMode() as string;

  if (isSupabaseConfigured() && !identity.isDevSession) {
    try {
      const supabase = await createClient();
      const [
        { count: sCount },
        { count: aCount },
        { count: pCount },
        { count: cCount },
        { data: modeRow },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("course_enrollments")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase
          .from("course_enrollments")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed"),
        supabase
          .from("course_settings")
          .select("registration_mode,pass_percent")
          .eq("singleton", true)
          .maybeSingle(),
      ]);
      studentCount = sCount || studentCount;
      approvedCount = aCount || approvedCount;
      pendingCount = pCount || pendingCount;
      completedLessonsCount = cCount || completedLessonsCount;
      if (modeRow?.registration_mode) registrationMode = modeRow.registration_mode;
    } catch {
      // Keep SQLite metrics
    }
  }

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · LEARNING HUB</span>
          <h1>Course &amp; student overview</h1>
          <p>
            Manage course packages, approve registrations, and monitor student learning progress.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#065f46",
              background: "#d1fae5",
              padding: "6px 10px",
              borderRadius: 99,
            }}
          >
            ⚡ Persistent SQLite Engine
          </span>
          <span className="admin-chip">ADMIN</span>
        </div>
      </div>

      <section className="dashboard-metrics admin-metrics">
        <div>
          <b>{studentCount}</b>
          <span>Student accounts</span>
        </div>
        <div>
          <b>{approvedCount}</b>
          <span>Approved enrolments</span>
        </div>
        <div>
          <b>{pendingCount}</b>
          <span>Pending approval</span>
        </div>
        <div>
          <b>{completedLessonsCount}</b>
          <span>Lessons completed</span>
        </div>
        <div>
          <b>{feedbackMetrics.totalCount}</b>
          <span>Module reviews</span>
        </div>
        <div>
          <b>{feedbackMetrics.avgHelpfulness} / 5.0</b>
          <span>Avg content rating</span>
        </div>
      </section>

      <section className="admin-nav-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <Link className="admin-nav-card" href="/admin/students">
          <div className="admin-nav-icon">01</div>
          <h2>Students &amp; progress tracker</h2>
          <p>
            Search registered students, view their college &amp; roll numbers, inspect completed
            lessons, and review their assessment scores.
          </p>
          <b>Open student tracker →</b>
        </Link>
        <Link className="admin-nav-card" href="/admin/access">
          <div className="admin-nav-icon">02</div>
          <h2>Registration &amp; access control</h2>
          <p>
            Current mode: <b>{registrationMode}</b>. Switch between open, approval, or invite-only
            enrollment and assign students by email.
          </p>
          <b>Manage access →</b>
        </Link>
        <Link className="admin-nav-card" href="/admin/feedback">
          <div className="admin-nav-icon" style={{ background: "rgba(255, 159, 10, 0.15)", color: "#ff9f0a" }}>03</div>
          <h2>Module Feedback &amp; Upgrades</h2>
          <p>
            Student ratings on content helpfulness, difficulty level, and user-friendliness across all 100 modules. Automated platform upgrade suggestions.
          </p>
          <b>Review module telemetry →</b>
        </Link>
      </section>

      <section className="surface-card" style={{ marginTop: 24 }}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">COURSE PACKAGES DEPLOYED</span>
            <h2>Active Learning Tracks</h2>
            <p>Courses currently available or catalogued on this learning platform.</p>
          </div>
        </div>

        <div className="table-scroll" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>Package Title</th>
                <th>Category</th>
                <th>Hours</th>
                <th>Price</th>
                <th>Enrollment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Problem Solving Lab</b>
                  <small>100 modules · 10 paths · Stage 01 (10 Modules) live</small>
                </td>
                <td>Core Algorithmic Reasoning</td>
                <td>100 hrs</td>
                <td>
                  <span className="badge badge-live">Free / ₹0 Scholarship</span>
                </td>
                <td>
                  <span className="table-status approved">Active Flagship</span>
                </td>
                <td>
                  <Link href="/courses/problem-solving-lab" className="inline-link">
                    View Syllabus →
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Distributed Systems &amp; Architecture</b>
                  <small>Planned roadmap track</small>
                </td>
                <td>Systems &amp; Data</td>
                <td>60 hrs</td>
                <td>Coming Soon</td>
                <td>
                  <span className="table-status pending">Roadmap</span>
                </td>
                <td>
                  <span style={{ fontSize: 10, color: "#7a8b9e" }}>In Planning</span>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Generative AI Systems &amp; LLM Engineering</b>
                  <small>Planned roadmap track</small>
                </td>
                <td>Artificial Intelligence</td>
                <td>45 hrs</td>
                <td>Coming Soon</td>
                <td>
                  <span className="table-status pending">Roadmap</span>
                </td>
                <td>
                  <span style={{ fontSize: 10, color: "#7a8b9e" }}>In Planning</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
