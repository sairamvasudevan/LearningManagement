import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getModuleFeedbackMetrics, getAllModuleFeedback } from "@/lib/db";
import { AdminFeedbackView } from "@/components/admin-feedback-view";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  await requireAdmin();

  // Load live telemetry metrics and reviews from SQLite backend (serialized to plain objects for React Client Component)
  const metrics = JSON.parse(JSON.stringify(getModuleFeedbackMetrics()));
  const feedbackList = JSON.parse(JSON.stringify(getAllModuleFeedback({ limit: 150 })));

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">FACULTY &amp; CURRICULUM INTELLIGENCE · 100-HOUR FLAGSHIP</span>
          <h1>Module Feedback &amp; Platform Upgrades</h1>
          <p>
            Real-time student feedback on content quality, difficulty calibration, and platform user-friendliness across all 100 modules.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/admin" className="button button-outline button-small">
            ← Back to Overview
          </Link>
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
            ⚡ Live SQLite Telemetry
          </span>
          <span className="admin-chip">ADMIN</span>
        </div>
      </div>

      <AdminFeedbackView initialMetrics={metrics} initialFeedback={feedbackList} />
    </>
  );
}
