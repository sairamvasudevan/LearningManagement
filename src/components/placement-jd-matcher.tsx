"use client";

import { useState } from "react";
import Link from "next/link";
import type { DbPlacementDrive } from "@/lib/db";
import type { ParsedJdCriteria, RankedCandidateResult } from "@/lib/placement-matcher";

interface PlacementJdMatcherProps {
  initialCandidates: RankedCandidateResult[];
  initialDrives: DbPlacementDrive[];
}

const JD_PRESETS = [
  {
    company: "Amazon Development Centre",
    role: "SDE Intern / SDE-1",
    ctc: "₹18–24 LPA",
    jd: "Seeking strong problem solvers with B.Tech CSE or IT, minimum 7.5 CGPA and no active backlogs. Must have deep Data Structures, Algorithms, C++ or Java, System Design fundamentals, SQL/PostgreSQL, and proven competitive programming / Codolio or LeetCode track record.",
  },
  {
    company: "Accenture India",
    role: "Advanced Associate Software Engineer",
    ctc: "₹6.5 LPA",
    jd: "Open to B.Tech CSE, AI & ML, IT, Data Science with minimum 6.5 CGPA and 0 active backlogs. Requires Java or Python, SQL, REST APIs, Git, cloud fundamentals, and strong Versant English communication skills (written and spoken).",
  },
  {
    company: "TCS Prime / Digital",
    role: "Systems & Full-Stack Engineer",
    ctc: "₹9.0 LPA",
    jd: "Full-stack and backend roles across Python, Java, React, Node.js, Spring Boot, SQL, Docker, REST API, DBMS, Operating Systems. Minimum 7.0 CGPA, 0 active backlogs, clear written & spoken client communication.",
  },
  {
    company: "CortexAI Labs",
    role: "Applied ML Engineer",
    ctc: "₹14.0 LPA",
    jd: "B.Tech CSE / AI & ML minimum 8.0 CGPA, no active backlogs. Strong Python, PyTorch, Machine Learning, FastAPI, PostgreSQL, Docker, AWS, and RAG / LLM production projects.",
  },
];

export function PlacementJdMatcher({
  initialCandidates,
  initialDrives,
}: PlacementJdMatcherProps) {
  const [companyName, setCompanyName] = useState("Amazon Development Centre");
  const [roleTitle, setRoleTitle] = useState("SDE-1 (Campus Drive)");
  const [ctcPackage, setCtcPackage] = useState("₹18 LPA");
  const [jdText, setJdText] = useState(JD_PRESETS[0].jd);

  const [minCgpa, setMinCgpa] = useState<string>("7.0");
  const [maxBacklogs, setMaxBacklogs] = useState<string>("0");
  const [minCodingSolved, setMinCodingSolved] = useState<string>("0");
  const [minLsrwScore, setMinLsrwScore] = useState<string>("0");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [customSkills, setCustomSkills] = useState<string>("");
  const [includeIneligible, setIncludeIneligible] = useState<boolean>(true);

  const [parsedJd, setParsedJd] = useState<ParsedJdCriteria | null>(null);
  const [candidates, setCandidates] = useState<RankedCandidateResult[]>(initialCandidates);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drives, setDrives] = useState<DbPlacementDrive[]>(initialDrives);
  const [inspectCandidate, setInspectCandidate] = useState<RankedCandidateResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastCsv, setLastCsv] = useState("");

  const buildFilterPayload = () => ({
    companyName,
    roleTitle,
    ctcPackage,
    jdText,
    minCgpa: Number(minCgpa || 0),
    maxBacklogs: Number(maxBacklogs || 0),
    allowedBranches: branchFilter === "all" ? [] : [branchFilter],
    requiredSkills: customSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    minCodingSolved: Number(minCodingSolved || 0),
    minLsrwScore: Number(minLsrwScore || 0),
    includeIneligible,
  });

  const handleAnalyzeAndRank = async () => {
    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");
    try {
      const res = await fetch("/api/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rank", ...buildFilterPayload() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ranking failed");

      const ranked = data.candidates as RankedCandidateResult[];
      setParsedJd(data.parsedJd);
      setCandidates(ranked);
      setLastCsv(data.csv || "");

      const eligibleTop = ranked.filter((c) => c.eligible).map((c) => c.userId);
      setSelectedIds(new Set(eligibleTop));
      setStatusMsg(
        `Ranked ${ranked.length} students (${eligibleTop.length} strictly eligible for ${companyName}).`,
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not rank candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDrive = async () => {
    setSaving(true);
    setErrorMsg("");
    setStatusMsg("");
    try {
      const res = await fetch("/api/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_drive",
          ...buildFilterPayload(),
          shortlistedUserIds: Array.from(selectedIds),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save drive");
      setDrives((prev) => [data.drive as DbPlacementDrive, ...prev]);
      setLastCsv(data.csv || lastCsv);
      setStatusMsg(
        `✓ Saved company drive shortlist for ${companyName} (${(data.drive as DbPlacementDrive).shortlisted_user_ids.length} students).`,
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save drive");
    } finally {
      setSaving(false);
    }
  };

  const downloadCsv = () => {
    const chosen = candidates.filter((c) => selectedIds.size === 0 || selectedIds.has(c.userId));
    const lines =
      lastCsv && selectedIds.size === candidates.filter((c) => c.eligible).length
        ? lastCsv
        : [
            "Rank,Eligible,Fit Score,Full Name,Admission No,Email,Branch,CGPA,Backlogs,Codolio Solved,LeetCode Solved,Versant LSRW,Matched Skills",
            ...chosen.map((c) =>
              [
                c.rank,
                c.eligible ? "Eligible" : "Ineligible",
                `${c.fitScore}%`,
                `"${c.fullName.replace(/"/g, '""')}"`,
                c.admissionNo,
                c.email,
                `"${c.branch}"`,
                c.cgpa.toFixed(2),
                c.activeBacklogs,
                c.codingSummary.codolioTotalSolved,
                c.codingSummary.leetcodeSolved,
                c.lsrwSummary.bestVersantScore ?? "N/A",
                `"${c.matchedSkills.join("; ")}"`,
              ].join(","),
            ),
          ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(companyName || "campus-shortlist").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-ranked.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyRecruiterBrief = async () => {
    const chosen = candidates.filter((c) =>
      selectedIds.size > 0 ? selectedIds.has(c.userId) : c.eligible,
    );
    const lines = [
      `GALGOTIAS UNIVERSITY — T&P CELL CANDIDATE SHORTLIST`,
      `Company: ${companyName} | Role: ${roleTitle} | CTC: ${ctcPackage}`,
      `Shortlisted Count: ${chosen.length}`,
      "",
      ...chosen.map(
        (c) =>
          `#${c.rank} ${c.fullName} (${c.admissionNo}) — ${c.branch}, CGPA ${c.cgpa.toFixed(2)}, Fit ${c.fitScore}% | Codolio: ${c.codingSummary.codolioTotalSolved} | LSRW: ${c.lsrwSummary.bestVersantScore ?? "N/A"} | Matched: ${c.matchedSkills.join(", ")}`,
      ),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setStatusMsg(`✓ Copied recruiter-ready dossier (${chosen.length} candidates) to clipboard.`);
    } catch {
      setStatusMsg("Use Download CSV to export shortlist cleanly.");
    }
  };

  const eligibleCount = candidates.filter((c) => c.eligible).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Company JD Input & Filter Studio */}
      <section className="surface-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <span className="eyebrow" style={{ color: "#60a5fa" }}>
              GALGOTIAS UNIVERSITY · TRAINING &amp; PLACEMENT CELL
            </span>
            <h2 style={{ margin: "6px 0 4px", fontSize: "22px" }}>
              Company Job Description (JD) Filter &amp; Student Ranking Engine
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
              Paste a visiting recruiter&apos;s JD or set cutoff criteria. Automatically ranks Galgotias students by skill
              match, verified project stack, Codolio/LeetCode performance, CGPA, and LSRW Versant score.
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {JD_PRESETS.map((preset) => (
              <button
                key={preset.company}
                type="button"
                className="dsa-sample-pill"
                onClick={() => {
                  setCompanyName(preset.company);
                  setRoleTitle(preset.role);
                  setCtcPackage(preset.ctc);
                  setJdText(preset.jd);
                }}
              >
                {preset.company.split(" ")[0]} Preset
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px", marginBottom: "12px" }}>
          <label className="form-field-label">
            Visiting Company Name
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </label>
          <label className="form-field-label">
            Job Role Title
            <input type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
          </label>
          <label className="form-field-label">
            CTC / Stipend Package
            <input type="text" value={ctcPackage} onChange={(e) => setCtcPackage(e.target.value)} />
          </label>
          <label className="form-field-label">
            Target Branch
            <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <option value="all">All Computing Branches</option>
              <option value="CSE">CSE</option>
              <option value="AI & ML">CSE (AI &amp; ML)</option>
              <option value="Data Science">CSE (Data Science)</option>
              <option value="IT">IT</option>
              <option value="MCA">MCA</option>
            </select>
          </label>
        </div>

        <label className="form-field-label" style={{ marginBottom: "14px" }}>
          Paste Full Company Job Description (JD)
          <textarea
            rows={4}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste JD text including required skills, minimum CGPA, backlog rules, and communication expectations..."
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px", marginBottom: "16px" }}>
          <label className="form-field-label">
            Min CGPA
            <input type="number" step="0.1" min={0} max={10} value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} />
          </label>
          <label className="form-field-label">
            Max Active Backlogs
            <input type="number" min={0} max={10} value={maxBacklogs} onChange={(e) => setMaxBacklogs(e.target.value)} />
          </label>
          <label className="form-field-label">
            Min Codolio/Coding Solved
            <input type="number" min={0} value={minCodingSolved} onChange={(e) => setMinCodingSolved(e.target.value)} />
          </label>
          <label className="form-field-label">
            Min Versant LSRW Score
            <input type="number" min={0} max={80} value={minLsrwScore} onChange={(e) => setMinLsrwScore(e.target.value)} />
          </label>
          <label className="form-field-label">
            Override Skills (Optional CSV)
            <input
              type="text"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              placeholder="Auto-extracted from JD"
            />
          </label>
          <label className="checklist-item" style={{ alignSelf: "end" }}>
            <input
              type="checkbox"
              checked={includeIneligible}
              onChange={(e) => setIncludeIneligible(e.target.checked)}
            />
            <div>
              <b>Show Borderline</b>
              <small>Include misses</small>
            </div>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="button button-cn-primary"
            disabled={loading}
            onClick={handleAnalyzeAndRank}
          >
            {loading ? "Analyzing JD & Ranking..." : "🎯 Parse JD & Rank Galgotias Students"}
          </button>
          <button type="button" className="button button-quiet" onClick={downloadCsv}>
            ⬇ Export Selected CSV ({selectedIds.size > 0 ? selectedIds.size : eligibleCount})
          </button>
          <button type="button" className="button button-quiet" onClick={copyRecruiterBrief}>
            📋 Copy Recruiter Email List
          </button>
          <button
            type="button"
            className="button button-quiet"
            disabled={saving}
            onClick={handleSaveDrive}
          >
            {saving ? "Saving..." : "💾 Save Drive Shortlist"}
          </button>
        </div>

        {parsedJd && (
          <div style={{ marginTop: "14px", padding: "12px 14px", background: "#111113", borderRadius: "10px", border: "1px solid var(--border-subtle)", fontSize: "12.5px" }}>
            <b style={{ color: "#60a5fa" }}>Parsed JD Signals:</b>{" "}
            <span>
              Skills detected: <b>{parsedJd.extractedSkills.join(", ") || "General SWE"}</b>
              {parsedJd.detectedMinCgpa ? ` · JD CGPA: ${parsedJd.detectedMinCgpa}+` : ""}
              {parsedJd.detectedMaxBacklogs === 0 ? " · Zero Backlogs" : ""}
              {parsedJd.prioritizesCommunication ? " · Communication Weighted High" : ""}
            </span>
          </div>
        )}

        {statusMsg && (
          <div className="dsa-status-banner banner-accepted" style={{ marginTop: "12px", marginBottom: 0 }}>
            <span>{statusMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="dsa-status-banner banner-failed" style={{ marginTop: "12px", marginBottom: 0 }}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}
      </section>

      {/* Ranked Leaderboard */}
      <section className="surface-card table-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
          <div>
            <h3 style={{ margin: "0 0 2px", fontSize: "18px" }}>
              Ranked Shortlist — {companyName} ({eligibleCount} Eligible / {candidates.length} Shown)
            </h3>
            <small style={{ color: "#86868b" }}>
              Score Formula: Skills &amp; Project Proof (35%) + Codolio/LeetCode/GitHub (25%) + Academics (15%) + LSRW &amp; LMS (15%) + Resume (10%)
            </small>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="button button-quiet button-small"
              onClick={() =>
                setSelectedIds(new Set(candidates.filter((c) => c.eligible).map((c) => c.userId)))
              }
            >
              Select All Eligible
            </button>
            <button
              type="button"
              className="button button-quiet button-small"
              onClick={() =>
                setSelectedIds(new Set(candidates.filter((c) => c.eligible).slice(0, 3).map((c) => c.userId)))
              }
            >
              Top 3 Only
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Send</th>
                <th>Rank</th>
                <th>Student &amp; Admission No.</th>
                <th>Academics</th>
                <th>Fit Score &amp; Breakdown</th>
                <th>Matched Skills &amp; Projects</th>
                <th>Coding &amp; LSRW</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.userId} style={!c.eligible ? { opacity: 0.7 } : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.userId)}
                      onChange={() =>
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(c.userId)) next.delete(c.userId);
                          else next.add(c.userId);
                          return next;
                        })
                      }
                      aria-label={`Select ${c.fullName}`}
                    />
                  </td>
                  <td>
                    <b style={{ fontSize: "16px", color: c.eligible ? "#34d399" : "#94a3b8" }}>
                      #{c.rank}
                    </b>
                    <div>
                      <span className={`table-status ${c.eligible ? "approved" : "pending"}`}>
                        {c.eligible ? "Eligible" : "Ineligible"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <b>{c.fullName}</b>
                    <small>{c.admissionNo} · {c.branch}</small>
                    <small>{c.email}</small>
                  </td>
                  <td>
                    <b>CGPA {c.cgpa.toFixed(2)}</b>
                    <small>10th {c.tenthPct}% · 12th {c.twelfthPct}%</small>
                    <small style={{ color: c.activeBacklogs > 0 ? "#f87171" : "#34d399" }}>
                      Backlogs: {c.activeBacklogs}
                    </small>
                  </td>
                  <td>
                    <b style={{ fontSize: "15px", color: c.fitScore >= 75 ? "#34d399" : c.fitScore >= 55 ? "#60a5fa" : "#fbbf24" }}>
                      {c.fitScore}% Fit
                    </b>
                    <div className="mini-progress-bar" style={{ margin: "4px 0" }}>
                      <span style={{ width: `${c.fitScore}%` }} />
                    </div>
                    <small>
                      Skill {c.breakdown.skillAndProjectScore}/35 · Code {c.breakdown.codingProfileScore}/25 · Acad {c.breakdown.academicScore}/15
                    </small>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "240px" }}>
                      {c.matchedSkills.slice(0, 6).map((sk) => (
                        <span key={sk} className="tag-pill" style={{ background: "rgba(52, 211, 153, 0.14)", color: "#34d399", fontSize: "10.5px" }}>
                          ✓ {sk}
                        </span>
                      ))}
                      {c.missingSkills.slice(0, 2).map((ms) => (
                        <span key={ms} className="tag-pill" style={{ background: "rgba(255, 69, 58, 0.12)", color: "#fca5a5", fontSize: "10.5px" }}>
                          ✗ {ms}
                        </span>
                      ))}
                    </div>
                    {c.projectEvidenceTitles.length > 0 && (
                      <small style={{ marginTop: "4px", display: "block" }}>
                        📁 Projects: {c.projectEvidenceTitles.slice(0, 2).join(", ")}
                      </small>
                    )}
                    {!c.eligible && c.eligibilityGaps.length > 0 && (
                      <small style={{ color: "#fca5a5", display: "block" }}>
                        Gap: {c.eligibilityGaps.join("; ")}
                      </small>
                    )}
                  </td>
                  <td>
                    <div>
                      <b>Codolio: {c.codingSummary.codolioTotalSolved}</b>
                      <small>
                        LC: {c.codingSummary.leetcodeSolved} ({c.codingSummary.leetcodeRating}) · CF: {c.codingSummary.codeforcesRating}
                      </small>
                      <small>
                        GH Repos: {c.codingSummary.githubRepos} · Campus DSA: {c.codingSummary.platformDsaSolved}
                      </small>
                      <small style={{ color: "#c084fc" }}>
                        Versant LSRW: {c.lsrwSummary.bestVersantScore ? `${c.lsrwSummary.bestVersantScore}/80 (${c.lsrwSummary.cefrLevel})` : "Pending"}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="table-action-group">
                      <button
                        type="button"
                        className="button button-small"
                        onClick={() => setInspectCandidate(c)}
                      >
                        Inspect Dossier
                      </button>
                      <Link className="inline-link" href={`/admin/students/${c.userId}`}>
                        Full Profile →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Candidate Dossier Quick Modal / Drawer */}
      {inspectCandidate && (
        <section className="surface-card" style={{ padding: "24px", border: "1px solid #60a5fa" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <span className="eyebrow">RECRUITER DOSSIER PREVIEW</span>
              <h3 style={{ margin: "4px 0" }}>
                #{inspectCandidate.rank} · {inspectCandidate.fullName} ({inspectCandidate.admissionNo})
              </h3>
            </div>
            <button type="button" className="button button-quiet button-small" onClick={() => setInspectCandidate(null)}>
              Close ✕
            </button>
          </div>
          <p style={{ color: "#cbd5e1", fontSize: "13.5px" }}>{inspectCandidate.headline}</p>
          <p style={{ color: "#94a3b8", fontSize: "13px" }}>{inspectCandidate.careerSummary}</p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12.5px", color: "#e5e5ea" }}>
            <span>CGPA: <b>{inspectCandidate.cgpa.toFixed(2)}</b></span>
            <span>Codolio: <b>@{inspectCandidate.codingSummary.codolioHandle || "N/A"}</b> ({inspectCandidate.codingSummary.codolioTotalSolved} solved)</span>
            <span>GitHub: <b>@{inspectCandidate.codingSummary.githubHandle || "N/A"}</b></span>
            <span>Projects: <b>{inspectCandidate.projectsCount}</b> · Internships: <b>{inspectCandidate.experiencesCount}</b></span>
          </div>
        </section>
      )}

      {/* Saved Drives History */}
      {drives.length > 0 && (
        <section className="surface-card" style={{ padding: "24px" }}>
          <span className="eyebrow">SAVED RECRUITER DRIVES</span>
          <h3 style={{ margin: "6px 0 12px" }}>Recent Campus Shortlists ({drives.length})</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
            {drives.map((d) => (
              <div key={d.id} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "14px" }}>
                <div style={{ fontWeight: 700, color: "#f5f5f7" }}>{d.company_name}</div>
                <div style={{ fontSize: "12.5px", color: "#60a5fa" }}>{d.role_title} · {d.ctc_package || "Campus Drive"}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                  Min CGPA: {d.min_cgpa} · Shortlisted: <b>{d.shortlisted_user_ids.length} students</b>
                </div>
                <small style={{ color: "#64748b" }}>{new Date(d.created_at).toLocaleString("en-IN")}</small>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
