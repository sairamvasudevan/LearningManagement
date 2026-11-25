import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { PlacementJdMatcher } from "@/components/placement-jd-matcher";
import {
  getAllPlacementDrives,
  getAllStudentsCareerSnapshots,
} from "@/lib/db";
import { rankCandidatesForCompanyDrive } from "@/lib/placement-matcher";

export const dynamic = "force-dynamic";

export default async function AdminPlacementsPage() {
  await requireAdmin();

  const snapshots = getAllStudentsCareerSnapshots();
  const drives = getAllPlacementDrives();
  const { candidates } = rankCandidatesForCompanyDrive(snapshots, {
    jdText:
      "Seeking strong problem solvers with B.Tech CSE or IT, minimum 7.5 CGPA and no active backlogs. Must have deep Data Structures, Algorithms, C++ or Java, System Design fundamentals, SQL/PostgreSQL, and proven Codolio or LeetCode track record.",
    minCgpa: 7.0,
    maxBacklogs: 0,
    includeIneligible: true,
  });

  const eligibleDefault = candidates.filter((c) => c.eligible).length;
  const avgCgpa =
    snapshots.length > 0
      ? (
          snapshots.reduce((sum, s) => sum + s.career.cgpa, 0) / snapshots.length
        ).toFixed(2)
      : "0.00";
  const codolioActive = snapshots.filter((s) => s.career.codolio_total_solved > 0).length;

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">GALGOTIAS UNIVERSITY · CAMPUS PLACEMENT CELL (T&amp;P)</span>
          <h1>Student Data Management, Coding Profiles &amp; Company JD Matcher</h1>
          <p>
            Filter student cohorts by CGPA, branches, active backlogs, Codolio/LeetCode performance, projects, and
            Versant LSRW scores — rank fits for incoming company JDs and export clean recruiter shortlists.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/admin" className="button button-quiet button-small">
            ← Admin Overview
          </Link>
          <Link href="/admin/students" className="button button-quiet button-small">
            Student Tracker
          </Link>
          <span className="admin-chip">T&amp;P CELL</span>
        </div>
      </div>

      <section className="dashboard-metrics">
        <div>
          <b>{snapshots.length}</b>
          <span>Registered Students</span>
        </div>
        <div>
          <b>{eligibleDefault}</b>
          <span>Zero-Backlog (7.0+ CGPA)</span>
        </div>
        <div>
          <b>{avgCgpa}</b>
          <span>Cohort Mean CGPA</span>
        </div>
        <div>
          <b>{codolioActive}</b>
          <span>Codolio Linked Profiles</span>
        </div>
        <div>
          <b>{drives.length}</b>
          <span>Saved Drive Shortlists</span>
        </div>
      </section>

      <PlacementJdMatcher initialCandidates={candidates} initialDrives={drives} />
    </>
  );
}
