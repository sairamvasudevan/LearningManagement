"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  DbStudentCareerProfile,
  DbUser,
  StudentExperienceItem,
  StudentProjectItem,
} from "@/lib/db";

interface StudentCareerFormProps {
  user: DbUser;
  initialCareer: DbStudentCareerProfile;
  platformStats: {
    modulesCompleted: number;
    dsaSolvedCount: number;
    bestVersantScore: number | null;
    latestCefr: string | null;
  };
}

const GALGOTIAS_BRANCHES = [
  "B.Tech CSE",
  "B.Tech CSE (AI & ML)",
  "B.Tech CSE (Data Science)",
  "B.Tech CSE (Cyber Security)",
  "B.Tech IT",
  "B.Tech ECE",
  "MCA",
  "BCA",
];

export function StudentCareerForm({
  user,
  initialCareer,
  platformStats,
}: StudentCareerFormProps) {
  const [career, setCareer] = useState<DbStudentCareerProfile>(initialCareer);
  const [skillsText, setSkillsText] = useState(initialCareer.skills.join(", "));
  const [certsText, setCertsText] = useState(initialCareer.certifications.join(", "));
  const [achievementsText, setAchievementsText] = useState(initialCareer.achievements.join(", "));

  const [newProj, setNewProj] = useState<Omit<StudentProjectItem, "id"> & { stackText: string }>({
    title: "",
    techStack: [],
    stackText: "",
    summary: "",
    impactMetric: "",
    repoUrl: "",
    liveUrl: "",
  });
  const [newExp, setNewExp] = useState<Omit<StudentExperienceItem, "id">>({
    company: "",
    role: "",
    duration: "",
    highlights: "",
  });

  const [activeView, setActiveView] = useState<"editor" | "resume">("editor");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const parseCommaList = (raw: string): string[] =>
    Array.from(
      new Set(
        raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    );

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    const skills = parseCommaList(skillsText);
    const certifications = parseCommaList(certsText);
    const achievements = parseCommaList(achievementsText);

    try {
      const res = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...career,
          skills,
          certifications,
          achievements,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setCareer(data.career);
      setSkillsText((data.career as DbStudentCareerProfile).skills.join(", "));
      setCertsText((data.career as DbStudentCareerProfile).certifications.join(", "));
      setAchievementsText((data.career as DbStudentCareerProfile).achievements.join(", "));
      setSaveMessage("✓ Career Profile, Coding Handles & Resume saved to Galgotias T&P Registry.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    if (!newProj.title.trim()) return;
    const item: StudentProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProj.title.trim(),
      techStack: parseCommaList(newProj.stackText),
      summary: newProj.summary.trim(),
      impactMetric: newProj.impactMetric?.trim(),
      repoUrl: newProj.repoUrl?.trim(),
      liveUrl: newProj.liveUrl?.trim(),
    };
    setCareer((prev) => ({ ...prev, projects: [...prev.projects, item] }));
    setNewProj({ title: "", techStack: [], stackText: "", summary: "", impactMetric: "", repoUrl: "", liveUrl: "" });
  };

  const addExperience = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return;
    const item: StudentExperienceItem = {
      id: `exp-${Date.now()}`,
      company: newExp.company.trim(),
      role: newExp.role.trim(),
      duration: newExp.duration.trim(),
      highlights: newExp.highlights.trim(),
    };
    setCareer((prev) => ({ ...prev, experiences: [...prev.experiences, item] }));
    setNewExp({ company: "", role: "", duration: "", highlights: "" });
  };

  const filledChecks = [
    Boolean(career.admission_no),
    career.cgpa > 0,
    Boolean(career.headline),
    parseCommaList(skillsText).length >= 3,
    career.projects.length >= 1,
    Boolean(career.codolio_handle || career.leetcode_handle),
    Boolean(career.github_handle),
  ];
  const completenessPct = Math.round(
    (filledChecks.filter(Boolean).length / filledChecks.length) * 100,
  );

  return (
    <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "24px 20px 64px" }}>
      {/* Campus Profile Banner */}
      <div className="portal-welcome-card no-print" style={{ marginBottom: "20px" }}>
        <div className="portal-welcome-main">
          <div className="portal-badges">
            <span className="badge-flame" style={{ background: "rgba(0, 113, 227, 0.16)", color: "#60a5fa", border: "1px solid rgba(96, 165, 250, 0.35)" }}>
              🎓 GALGOTIAS UNIVERSITY · STUDENT CAREER REGISTRY
            </span>
            <span className="badge-free">Codolio · LeetCode · Projects · Resume</span>
            <span className="badge-roll">{career.admission_no || user.register_number}</span>
          </div>
          <h1 style={{ fontSize: "26px", margin: "8px 0 6px" }}>
            {user.full_name} — Campus Placement &amp; Resume Studio
          </h1>
          <p style={{ margin: 0, maxWidth: "700px" }}>
            Maintain your official Galgotias University placement dossier. Your academics, Codolio &amp; coding
            ratings, verified projects, and LSRW Versant scores feed directly into company JD shortlisting.
          </p>
        </div>
        <div className="portal-overall-stat" style={{ minWidth: "190px" }}>
          <div className="stat-circle">
            <span className="stat-number">{completenessPct}%</span>
            <span className="stat-label">Resume Ready</span>
          </div>
          <div className="stat-sub">
            {career.cgpa > 0 ? `CGPA ${career.cgpa.toFixed(2)}` : "Add CGPA"} · {career.projects.length} Projects
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`ed-filter-pill ${activeView === "editor" ? "active" : ""}`}
            onClick={() => setActiveView("editor")}
          >
            ✍️ Edit Profile, Coding Handles &amp; Projects
          </button>
          <button
            type="button"
            className={`ed-filter-pill ${activeView === "resume" ? "active" : ""}`}
            onClick={() => setActiveView("resume")}
          >
            📄 Live ATS Resume Preview &amp; Print PDF
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/portal" className="button button-quiet" style={{ fontSize: "12.5px" }}>
            ← Student Portal
          </Link>
          <button
            type="button"
            className="button button-cn-primary"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving to T&P DB..." : "Save Profile & Resume ✓"}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="dsa-status-banner banner-accepted no-print" style={{ marginBottom: "16px" }}>
          <span>{saveMessage}</span>
        </div>
      )}
      {saveError && (
        <div className="dsa-status-banner banner-failed no-print" style={{ marginBottom: "16px" }}>
          <span>⚠️ {saveError}</span>
        </div>
      )}

      {activeView === "editor" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 1. Institutional Academics */}
          <section className="surface-card" style={{ padding: "24px" }}>
            <span className="eyebrow">SECTION 01 · GALGOTIAS UNIVERSITY ACADEMICS</span>
            <h2 style={{ margin: "6px 0 16px", fontSize: "19px" }}>Institutional &amp; Eligibility Details</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" }}>
              <label className="form-field-label">
                Admission Number
                <input
                  type="text"
                  value={career.admission_no}
                  onChange={(e) => setCareer({ ...career, admission_no: e.target.value })}
                  placeholder="24SCSE1010842"
                />
              </label>
              <label className="form-field-label">
                Enrollment Number
                <input
                  type="text"
                  value={career.enrollment_no}
                  onChange={(e) => setCareer({ ...career, enrollment_no: e.target.value })}
                  placeholder="GU-2022-88421"
                />
              </label>
              <label className="form-field-label">
                School / Department
                <input
                  type="text"
                  value={career.school}
                  onChange={(e) => setCareer({ ...career, school: e.target.value })}
                />
              </label>
              <label className="form-field-label">
                Programme / Branch
                <select
                  value={career.branch}
                  onChange={(e) => setCareer({ ...career, branch: e.target.value })}
                >
                  {GALGOTIAS_BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="form-field-label">
                Graduation Batch Year
                <input
                  type="number"
                  min={2022}
                  max={2032}
                  value={career.batch_year}
                  onChange={(e) => setCareer({ ...career, batch_year: Number(e.target.value) })}
                />
              </label>
              <label className="form-field-label">
                Section &amp; Semester
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={career.section}
                    onChange={(e) => setCareer({ ...career, section: e.target.value })}
                    placeholder="Sec A"
                  />
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={career.semester}
                    onChange={(e) => setCareer({ ...career, semester: Number(e.target.value) })}
                  />
                </div>
              </label>
              <label className="form-field-label">
                Current CGPA (0–10)
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={10}
                  value={career.cgpa}
                  onChange={(e) => setCareer({ ...career, cgpa: Number(e.target.value) })}
                />
              </label>
              <label className="form-field-label">
                10th % / 12th %
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    value={career.tenth_pct}
                    onChange={(e) => setCareer({ ...career, tenth_pct: Number(e.target.value) })}
                    placeholder="10th %"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    value={career.twelfth_pct}
                    onChange={(e) => setCareer({ ...career, twelfth_pct: Number(e.target.value) })}
                    placeholder="12th %"
                  />
                </div>
              </label>
              <label className="form-field-label">
                Active Backlogs
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={career.active_backlogs}
                  onChange={(e) => setCareer({ ...career, active_backlogs: Number(e.target.value) })}
                />
              </label>
              <label className="checklist-item" style={{ alignSelf: "end" }}>
                <input
                  type="checkbox"
                  checked={career.placement_eligible}
                  onChange={(e) => setCareer({ ...career, placement_eligible: e.target.checked })}
                />
                <div>
                  <b>Opt-In for Campus Placement Drives</b>
                  <small>Include me in T&amp;P shortlists</small>
                </div>
              </label>
            </div>
          </section>

          {/* 2. Coding Profiles (Codolio + Major Judges) */}
          <section className="surface-card" style={{ padding: "24px" }}>
            <span className="eyebrow" style={{ color: "#22d3ee" }}>SECTION 02 · CODOLIO &amp; CODING PROFILES</span>
            <h2 style={{ margin: "6px 0 6px", fontSize: "19px" }}>Unified Coding Telemetry</h2>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#94a3b8" }}>
              Enter your **Codolio** aggregated profile along with LeetCode, Codeforces, CodeChef, GFG, and GitHub stats.
              Campus telemetry (LMS Modules: <b>{platformStats.modulesCompleted}</b>, DSA Solved: <b>{platformStats.dsaSolvedCount}</b>,
              Versant LSRW: <b>{platformStats.bestVersantScore ?? "Pending"}</b>) links automatically.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              <label className="form-field-label">
                Codolio Handle
                <input
                  type="text"
                  value={career.codolio_handle}
                  onChange={(e) => setCareer({ ...career, codolio_handle: e.target.value })}
                  placeholder="aditya_gu"
                />
              </label>
              <label className="form-field-label">
                Codolio Profile URL
                <input
                  type="url"
                  value={career.codolio_url}
                  onChange={(e) => setCareer({ ...career, codolio_url: e.target.value })}
                  placeholder="https://codolio.com/profile/..."
                />
              </label>
              <label className="form-field-label">
                Codolio Unified Solved Count
                <input
                  type="number"
                  min={0}
                  value={career.codolio_total_solved}
                  onChange={(e) => setCareer({ ...career, codolio_total_solved: Number(e.target.value) })}
                />
              </label>

              <label className="form-field-label">
                LeetCode Handle / Solved / Rating
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={career.leetcode_handle}
                    onChange={(e) => setCareer({ ...career, leetcode_handle: e.target.value })}
                    placeholder="handle"
                  />
                  <input
                    type="number"
                    min={0}
                    value={career.leetcode_solved}
                    onChange={(e) => setCareer({ ...career, leetcode_solved: Number(e.target.value) })}
                    placeholder="solved"
                  />
                  <input
                    type="number"
                    min={0}
                    value={career.leetcode_rating}
                    onChange={(e) => setCareer({ ...career, leetcode_rating: Number(e.target.value) })}
                    placeholder="rating"
                  />
                </div>
              </label>

              <label className="form-field-label">
                Codeforces Handle &amp; Rating
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={career.codeforces_handle}
                    onChange={(e) => setCareer({ ...career, codeforces_handle: e.target.value })}
                    placeholder="handle"
                  />
                  <input
                    type="number"
                    min={0}
                    value={career.codeforces_rating}
                    onChange={(e) => setCareer({ ...career, codeforces_rating: Number(e.target.value) })}
                    placeholder="rating"
                  />
                </div>
              </label>

              <label className="form-field-label">
                CodeChef Handle &amp; Rating
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={career.codechef_handle}
                    onChange={(e) => setCareer({ ...career, codechef_handle: e.target.value })}
                    placeholder="handle"
                  />
                  <input
                    type="number"
                    min={0}
                    value={career.codechef_rating}
                    onChange={(e) => setCareer({ ...career, codechef_rating: Number(e.target.value) })}
                    placeholder="rating"
                  />
                </div>
              </label>

              <label className="form-field-label">
                GFG Handle &amp; Solved
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={career.gfg_handle}
                    onChange={(e) => setCareer({ ...career, gfg_handle: e.target.value })}
                    placeholder="handle"
                  />
                  <input
                    type="number"
                    min={0}
                    value={career.gfg_solved}
                    onChange={(e) => setCareer({ ...career, gfg_solved: Number(e.target.value) })}
                    placeholder="solved"
                  />
                </div>
              </label>

              <label className="form-field-label">
                GitHub Handle &amp; Public Repos
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={career.github_handle}
                    onChange={(e) => setCareer({ ...career, github_handle: e.target.value })}
                    placeholder="username"
                  />
                  <input
                    type="number"
                    min={0}
                    value={career.github_repos}
                    onChange={(e) => setCareer({ ...career, github_repos: Number(e.target.value) })}
                    placeholder="repos"
                  />
                </div>
              </label>

              <label className="form-field-label">
                LinkedIn Profile URL
                <input
                  type="url"
                  value={career.linkedin_url}
                  onChange={(e) => setCareer({ ...career, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </label>
              <label className="form-field-label">
                Resume PDF / Drive Link (Optional)
                <input
                  type="url"
                  value={career.resume_url}
                  onChange={(e) => setCareer({ ...career, resume_url: e.target.value })}
                  placeholder="https://..."
                />
              </label>
            </div>
          </section>

          {/* 3. Resume Summary, Skills, Certifications */}
          <section className="surface-card" style={{ padding: "24px" }}>
            <span className="eyebrow" style={{ color: "#c084fc" }}>SECTION 03 · RESUME HEADLINE, SKILLS &amp; CREDENTIALS</span>
            <h2 style={{ margin: "6px 0 16px", fontSize: "19px" }}>Skills &amp; Career Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label className="form-field-label">
                Professional Headline
                <input
                  type="text"
                  value={career.headline}
                  onChange={(e) => setCareer({ ...career, headline: e.target.value })}
                  placeholder="Full-Stack Developer & Competitive Programmer | React, Node.js, C++, SQL"
                />
              </label>
              <label className="form-field-label">
                Executive Resume Summary
                <textarea
                  rows={3}
                  value={career.career_summary}
                  onChange={(e) => setCareer({ ...career, career_summary: e.target.value })}
                  placeholder="Describe your strongest engineering areas, domain impact, and target roles..."
                />
              </label>
              <label className="form-field-label">
                Technical Skills (comma-separated — parsed directly by Company JD Matcher)
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="C++, Java, Python, React, Next.js, Node.js, SQL, PostgreSQL, Docker, AWS"
                />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                <label className="form-field-label">
                  Certifications (comma-separated)
                  <input
                    type="text"
                    value={certsText}
                    onChange={(e) => setCertsText(e.target.value)}
                    placeholder="AWS Cloud Practitioner, NPTEL Algorithms"
                  />
                </label>
                <label className="form-field-label">
                  Honors &amp; Achievements (comma-separated)
                  <input
                    type="text"
                    value={achievementsText}
                    onChange={(e) => setAchievementsText(e.target.value)}
                    placeholder="SIH Finalist 2025, Dean's Merit List"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* 4. Engineering Projects Portfolio */}
          <section className="surface-card" style={{ padding: "24px" }}>
            <span className="eyebrow" style={{ color: "#34d399" }}>SECTION 04 · VERIFIED ENGINEERING PROJECTS</span>
            <h2 style={{ margin: "6px 0 14px", fontSize: "19px" }}>Projects ({career.projects.length})</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
              {career.projects.map((p) => (
                <div key={p.id} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "14px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#f5f5f7" }}>{p.title}</div>
                    <div style={{ fontSize: "12px", color: "#60a5fa", margin: "4px 0" }}>
                      {p.techStack.join(" · ")}
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#cbd5e1" }}>{p.summary}</p>
                    {p.impactMetric && (
                      <small style={{ color: "#34d399", fontWeight: 600 }}>📈 Impact: {p.impactMetric}</small>
                    )}
                  </div>
                  <button
                    type="button"
                    className="button button-quiet button-small"
                    style={{ color: "#fca5a5", alignSelf: "flex-start" }}
                    onClick={() =>
                      setCareer((prev) => ({
                        ...prev,
                        projects: prev.projects.filter((x) => x.id !== p.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#111113", border: "1px dashed var(--border-normal)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#f5f5f7", marginBottom: "10px" }}>
                + Add Project to Resume
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  placeholder="Project Title"
                />
                <input
                  type="text"
                  value={newProj.stackText}
                  onChange={(e) => setNewProj({ ...newProj, stackText: e.target.value })}
                  placeholder="Tech Stack (e.g. React, Node.js, PostgreSQL)"
                />
                <input
                  type="text"
                  value={newProj.impactMetric}
                  onChange={(e) => setNewProj({ ...newProj, impactMetric: e.target.value })}
                  placeholder="Measurable Impact (e.g. 40% faster queries)"
                />
                <input
                  type="url"
                  value={newProj.repoUrl}
                  onChange={(e) => setNewProj({ ...newProj, repoUrl: e.target.value })}
                  placeholder="GitHub Repo URL (https://github.com/...)"
                />
              </div>
              <textarea
                rows={2}
                value={newProj.summary}
                onChange={(e) => setNewProj({ ...newProj, summary: e.target.value })}
                placeholder="Architecture & key engineering contributions..."
                style={{ marginBottom: "10px" }}
              />
              <button type="button" className="button button-quiet" onClick={addProject}>
                + Append Project
              </button>
            </div>
          </section>

          {/* 5. Internships / Work Experience */}
          <section className="surface-card" style={{ padding: "24px" }}>
            <span className="eyebrow" style={{ color: "#fbbf24" }}>SECTION 05 · INTERNSHIPS &amp; WORK EXPERIENCE</span>
            <h2 style={{ margin: "6px 0 14px", fontSize: "19px" }}>Experience ({career.experiences.length})</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {career.experiences.map((ex) => (
                <div key={ex.id} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "14px", display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14.5px", color: "#f5f5f7" }}>
                      {ex.role} · <span style={{ color: "#60a5fa" }}>{ex.company}</span>
                    </div>
                    <small style={{ color: "#86868b" }}>{ex.duration}</small>
                    <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{ex.highlights}</p>
                  </div>
                  <button
                    type="button"
                    className="button button-quiet button-small"
                    style={{ color: "#fca5a5", alignSelf: "flex-start" }}
                    onClick={() =>
                      setCareer((prev) => ({
                        ...prev,
                        experiences: prev.experiences.filter((x) => x.id !== ex.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#111113", border: "1px dashed var(--border-normal)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  placeholder="Company / Organization"
                />
                <input
                  type="text"
                  value={newExp.role}
                  onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                  placeholder="Role (e.g. SDE Intern)"
                />
                <input
                  type="text"
                  value={newExp.duration}
                  onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                  placeholder="Duration (e.g. May 2025 – Jul 2025)"
                />
              </div>
              <textarea
                rows={2}
                value={newExp.highlights}
                onChange={(e) => setNewExp({ ...newExp, highlights: e.target.value })}
                placeholder="Key deliverables and technical outcomes..."
                style={{ marginBottom: "10px" }}
              />
              <button type="button" className="button button-quiet" onClick={addExperience}>
                + Append Experience
              </button>
            </div>
          </section>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="button button-cn-primary" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save Complete Galgotias Profile ✓"}
            </button>
          </div>
        </div>
      ) : (
        /* Live Printable ATS Resume View */
        <div>
          <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "14px" }}>
            <button type="button" className="button button-cn-primary" onClick={() => window.print()}>
              🖨️ Print / Save Resume PDF
            </button>
          </div>

          <article
            className="printable-resume-sheet"
            style={{
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "12px",
              padding: "40px 44px",
              maxWidth: "860px",
              margin: "0 auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <header style={{ borderBottom: "2px solid #0f172a", paddingBottom: "14px", marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Galgotias University · {career.school} · Adm No: {career.admission_no || user.register_number}
              </div>
              <h1 style={{ margin: "4px 0 4px", fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>
                {user.full_name}
              </h1>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#1d4ed8", marginBottom: "8px" }}>
                {career.headline || `${career.branch} (${career.batch_year} Batch)`}
              </div>
              <div style={{ fontSize: "12.5px", color: "#334155", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <span>📧 {user.email}</span>
                <span>📞 {user.phone}</span>
                {career.codolio_handle && <span>Codolio: {career.codolio_handle} ({career.codolio_total_solved}+ solved)</span>}
                {career.github_handle && <span>GitHub: github.com/{career.github_handle}</span>}
              </div>
            </header>

            {career.career_summary && (
              <section style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "6px" }}>
                  Summary
                </h2>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55, color: "#1e293b" }}>{career.career_summary}</p>
              </section>
            )}

            <section style={{ marginBottom: "16px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "6px" }}>
                Education &amp; Academic Record
              </h2>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700 }}>
                <span>Galgotias University — {career.branch}</span>
                <span>Batch {career.batch_year} · CGPA: {career.cgpa.toFixed(2)}/10</span>
              </div>
              <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>
                Class XII: {career.twelfth_pct}% · Class X: {career.tenth_pct}% · Active Backlogs: {career.active_backlogs} ·
                Campus LSRW Versant: {platformStats.bestVersantScore ? `${platformStats.bestVersantScore}/80 (${platformStats.latestCefr})` : "Pending"}
              </div>
            </section>

            <section style={{ marginBottom: "16px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "6px" }}>
                Technical Skills &amp; Coding Profiles
              </h2>
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#0f172a" }}>
                <b>Skills:</b> {parseCommaList(skillsText).join(", ") || "—"}
              </p>
              <p style={{ margin: 0, fontSize: "12.5px", color: "#334155" }}>
                <b>Competitive Benchmarks:</b> Codolio ({career.codolio_total_solved} solved) · LeetCode ({career.leetcode_solved} solved, Rating {career.leetcode_rating}) ·
                Codeforces ({career.codeforces_rating}) · CodeChef ({career.codechef_rating}) · GFG ({career.gfg_solved}) · Campus DSA ({platformStats.dsaSolvedCount} accepted)
              </p>
            </section>

            {career.experiences.length > 0 && (
              <section style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "8px" }}>
                  Experience
                </h2>
                {career.experiences.map((ex) => (
                  <div key={ex.id} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700 }}>
                      <span>{ex.role} — {ex.company}</span>
                      <span style={{ color: "#475569" }}>{ex.duration}</span>
                    </div>
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#334155" }}>{ex.highlights}</p>
                  </div>
                ))}
              </section>
            )}

            {career.projects.length > 0 && (
              <section style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "8px" }}>
                  Projects
                </h2>
                {career.projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>
                      {p.title}{" "}
                      <span style={{ fontWeight: 500, color: "#475569", fontSize: "12px" }}>
                        [{p.techStack.join(", ")}]
                      </span>
                    </div>
                    <p style={{ margin: "2px 0", fontSize: "12.5px", color: "#334155" }}>{p.summary}</p>
                    {p.impactMetric && (
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f766e" }}>• {p.impactMetric}</div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {(parseCommaList(certsText).length > 0 || parseCommaList(achievementsText).length > 0) && (
              <section>
                <h2 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "6px" }}>
                  Certifications &amp; Achievements
                </h2>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#334155", lineHeight: 1.5 }}>
                  {[...parseCommaList(certsText), ...parseCommaList(achievementsText)].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
