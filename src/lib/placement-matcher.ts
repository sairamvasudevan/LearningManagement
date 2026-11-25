import type { StudentCareerSnapshot } from "@/lib/db";

export interface ParsedJdCriteria {
  extractedSkills: string[];
  detectedMinCgpa: number | null;
  detectedMaxBacklogs: number | null;
  detectedBranches: string[];
  prioritizesCommunication: boolean;
  prioritizesAlgorithms: boolean;
  keywords: string[];
}

export interface PlacementFilterConfig {
  jdText: string;
  minCgpa?: number;
  maxBacklogs?: number;
  allowedBranches?: string[];
  batchYear?: number | null;
  requiredSkills?: string[];
  minCodingSolved?: number;
  minLsrwScore?: number;
  minModulesCompleted?: number;
  includeIneligible?: boolean;
}

export interface RankedCandidateResult {
  rank: number;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  admissionNo: string;
  branch: string;
  batchYear: number;
  cgpa: number;
  tenthPct: number;
  twelfthPct: number;
  activeBacklogs: number;
  eligible: boolean;
  eligibilityGaps: string[];
  fitScore: number; // 0..100
  breakdown: {
    skillAndProjectScore: number; // 0..35
    codingProfileScore: number;   // 0..25
    academicScore: number;        // 0..15
    lsrwAndLmsScore: number;      // 0..15
    resumeDepthScore: number;     // 0..10
  };
  matchedSkills: string[];
  missingSkills: string[];
  projectEvidenceTitles: string[];
  codingSummary: {
    codolioHandle: string;
    codolioUrl: string;
    codolioTotalSolved: number;
    leetcodeHandle: string;
    leetcodeSolved: number;
    leetcodeRating: number;
    codeforcesRating: number;
    codechefRating: number;
    githubHandle: string;
    githubRepos: number;
    platformDsaSolved: number;
  };
  lsrwSummary: {
    bestVersantScore: number | null;
    cefrLevel: string | null;
    modulesCompleted: number;
  };
  headline: string;
  careerSummary: string;
  projectsCount: number;
  experiencesCount: number;
  resumeUrl: string;
  linkedinUrl: string;
}

const KNOWN_SKILL_SYNONYMS: { canonical: string; patterns: RegExp[] }[] = [
  { canonical: "C++", patterns: [/\bc\+\+/i, /\bcpp\b/i] },
  { canonical: "Java", patterns: [/\bjava\b(?!script)/i] },
  { canonical: "Python", patterns: [/\bpython\b/i] },
  { canonical: "JavaScript", patterns: [/\bjavascript\b/i, /\bjs\b/i] },
  { canonical: "TypeScript", patterns: [/\btypescript\b/i, /\bts\b/i] },
  { canonical: "React", patterns: [/\breact(\.js)?\b/i] },
  { canonical: "Next.js", patterns: [/\bnext(\.js|js)\b/i] },
  { canonical: "Node.js", patterns: [/\bnode(\.js|js)\b/i] },
  { canonical: "Express", patterns: [/\bexpress(\.js)?\b/i] },
  { canonical: "Spring Boot", patterns: [/\bspring\s*boot\b/i] },
  { canonical: "FastAPI", patterns: [/\bfastapi\b/i] },
  { canonical: "SQL", patterns: [/\bsql\b/i] },
  { canonical: "PostgreSQL", patterns: [/\bpostgres(ql)?\b/i] },
  { canonical: "MySQL", patterns: [/\bmysql\b/i] },
  { canonical: "MongoDB", patterns: [/\bmongodb\b/i] },
  { canonical: "Docker", patterns: [/\bdocker\b/i] },
  { canonical: "Kubernetes", patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { canonical: "AWS", patterns: [/\baws\b/i, /amazon web services/i] },
  { canonical: "Data Structures", patterns: [/data\s*structures/i, /\bdsa\b/i] },
  { canonical: "Algorithms", patterns: [/\balgorithms?\b/i, /\bdsa\b/i] },
  { canonical: "Dynamic Programming", patterns: [/dynamic\s*programming/i] },
  { canonical: "System Design", patterns: [/system\s*design/i, /distributed\s*systems/i] },
  { canonical: "REST API", patterns: [/rest(\s*ful)?\s*apis?/i, /\bmicroservices\b/i] },
  { canonical: "DBMS", patterns: [/\bdbms\b/i, /database management/i] },
  { canonical: "Operating Systems", patterns: [/operating\s*systems/i, /\bos\b/i] },
  { canonical: "Machine Learning", patterns: [/machine\s*learning/i, /\bml\b/i] },
  { canonical: "PyTorch", patterns: [/\bpytorch\b/i] },
  { canonical: "TensorFlow", patterns: [/\btensorflow\b/i] },
  { canonical: "Tailwind", patterns: [/\btailwind/i] },
  { canonical: "Git", patterns: [/\bgit\b/i] },
];

export function parseJobDescription(jdText: string): ParsedJdCriteria {
  const text = jdText || "";
  const extractedSkills: string[] = [];

  for (const entry of KNOWN_SKILL_SYNONYMS) {
    if (entry.patterns.some((re) => re.test(text))) {
      extractedSkills.push(entry.canonical);
    }
  }

  let detectedMinCgpa: number | null = null;
  const cgpaMatch =
    text.match(/(?:min(?:imum)?\s*cgpa|cgpa\s*(?:>=|>|of|at\s*least)?)\s*[:\-]?\s*(\d(?:\.\d{1,2})?)/i) ||
    text.match(/(\d(?:\.\d{1,2})?)\s*\+?\s*cgpa/i);
  if (cgpaMatch?.[1]) {
    const val = Number(cgpaMatch[1]);
    if (val > 0 && val <= 10) detectedMinCgpa = val;
  }

  let detectedMaxBacklogs: number | null = null;
  if (/no\s*(?:active\s*)?(?:backlogs?|arrears)|0\s*(?:active\s*)?backlogs?/i.test(text)) {
    detectedMaxBacklogs = 0;
  } else {
    const blMatch = text.match(/max(?:imum)?\s*(\d+)\s*backlogs?/i);
    if (blMatch?.[1]) detectedMaxBacklogs = Number(blMatch[1]);
  }

  const detectedBranches: string[] = [];
  if (/\bcse\b|computer science/i.test(text)) detectedBranches.push("B.Tech CSE");
  if (/ai\s*&?\s*ml|artificial intelligence/i.test(text)) detectedBranches.push("B.Tech CSE (AI & ML)");
  if (/data science/i.test(text)) detectedBranches.push("B.Tech CSE (Data Science)");
  if (/\bit\b|information technology/i.test(text)) detectedBranches.push("B.Tech IT");
  if (/\bmca\b/i.test(text)) detectedBranches.push("MCA");

  const prioritizesCommunication = /\b(communication|verbal|written|lsrw|versant|client-facing|presentation)\b/i.test(
    text,
  );
  const prioritizesAlgorithms = /\b(dsa|algorithms?|competitive|coding test|leetcode|codolio|problem solving)\b/i.test(
    text,
  );

  const keywords = Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+.#\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4),
    ),
  ).slice(0, 40);

  return {
    extractedSkills,
    detectedMinCgpa,
    detectedMaxBacklogs,
    detectedBranches,
    prioritizesCommunication,
    prioritizesAlgorithms,
    keywords,
  };
}

export function rankCandidatesForCompanyDrive(
  snapshots: StudentCareerSnapshot[],
  config: PlacementFilterConfig,
): { parsedJd: ParsedJdCriteria; candidates: RankedCandidateResult[] } {
  const parsedJd = parseJobDescription(config.jdText);
  const targetSkills =
    config.requiredSkills && config.requiredSkills.length > 0
      ? config.requiredSkills
      : parsedJd.extractedSkills;

  const minCgpa =
    typeof config.minCgpa === "number" && config.minCgpa > 0
      ? config.minCgpa
      : parsedJd.detectedMinCgpa || 0;
  const maxBacklogs =
    typeof config.maxBacklogs === "number"
      ? config.maxBacklogs
      : parsedJd.detectedMaxBacklogs ?? 10;
  const minCodingSolved = Number(config.minCodingSolved || 0);
  const minLsrwScore = Number(config.minLsrwScore || 0);
  const minModules = Number(config.minModulesCompleted || 0);
  const allowedBranches =
    config.allowedBranches && config.allowedBranches.length > 0 ? config.allowedBranches : [];

  const scored: RankedCandidateResult[] = [];

  for (const snap of snapshots) {
    const { user, career, platformStats } = snap;
    const effectiveSolved = Math.max(
      career.codolio_total_solved,
      career.leetcode_solved + career.gfg_solved + platformStats.dsaSolvedCount,
    );

    const eligibilityGaps: string[] = [];
    if (!career.placement_eligible) {
      eligibilityGaps.push("Opted out / flagged ineligible by student profile");
    }
    if (minCgpa > 0 && career.cgpa < minCgpa) {
      eligibilityGaps.push(`CGPA ${career.cgpa.toFixed(2)} < ${minCgpa.toFixed(2)}`);
    }
    if (career.active_backlogs > maxBacklogs) {
      eligibilityGaps.push(`${career.active_backlogs} active backlogs > ${maxBacklogs}`);
    }
    if (
      allowedBranches.length > 0 &&
      !allowedBranches.some((b) => career.branch.toLowerCase().includes(b.toLowerCase()))
    ) {
      eligibilityGaps.push(`Branch ${career.branch} not in target filter`);
    }
    if (config.batchYear && career.batch_year !== config.batchYear) {
      eligibilityGaps.push(`Batch ${career.batch_year} != ${config.batchYear}`);
    }
    if (minCodingSolved > 0 && effectiveSolved < minCodingSolved) {
      eligibilityGaps.push(`Coding solved (${effectiveSolved}) < ${minCodingSolved}`);
    }
    if (
      minLsrwScore > 0 &&
      (platformStats.bestVersantScore === null || platformStats.bestVersantScore < minLsrwScore)
    ) {
      eligibilityGaps.push(
        `Versant LSRW (${platformStats.bestVersantScore ?? 0}) < ${minLsrwScore}`,
      );
    }
    if (minModules > 0 && platformStats.modulesCompleted < minModules) {
      eligibilityGaps.push(`Modules completed (${platformStats.modulesCompleted}) < ${minModules}`);
    }

    const eligible = eligibilityGaps.length === 0;
    if (!eligible && !config.includeIneligible) {
      continue;
    }

    // 1. Skill + Applied Project Evidence Score (0..35)
    const studentSkillLower = new Set(career.skills.map((s) => s.toLowerCase()));
    const corpusText = [
      career.headline,
      career.career_summary,
      ...career.skills,
      ...career.certifications,
      ...career.projects.flatMap((p) => [p.title, p.summary, ...p.techStack]),
      ...career.experiences.flatMap((e) => [e.role, e.highlights]),
    ]
      .join(" ")
      .toLowerCase();

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    let projectSkillHits = 0;

    for (const reqSkill of targetSkills) {
      const lower = reqSkill.toLowerCase();
      const inProfile = studentSkillLower.has(lower) || corpusText.includes(lower);
      if (inProfile) {
        matchedSkills.push(reqSkill);
        const inProjects = career.projects.some(
          (p) =>
            p.techStack.some((t) => t.toLowerCase() === lower) ||
            p.summary.toLowerCase().includes(lower),
        );
        if (inProjects) projectSkillHits++;
      } else {
        missingSkills.push(reqSkill);
      }
    }

    const skillRatio =
      targetSkills.length > 0 ? matchedSkills.length / targetSkills.length : Math.min(1, career.skills.length / 8);
    const projectEvidenceBonus =
      targetSkills.length > 0 ? (projectSkillHits / targetSkills.length) * 8 : Math.min(8, career.projects.length * 3);
    const skillAndProjectScore = Math.min(
      35,
      Math.round(skillRatio * 27 + projectEvidenceBonus),
    );

    const projectEvidenceTitles = career.projects
      .filter((p) =>
        targetSkills.length === 0
          ? true
          : targetSkills.some(
              (sk) =>
                p.techStack.some((t) => t.toLowerCase() === sk.toLowerCase()) ||
                `${p.title} ${p.summary}`.toLowerCase().includes(sk.toLowerCase()),
            ),
      )
      .map((p) => p.title);

    // 2. Coding Profile Strength (Codolio + LeetCode + CF + CC + GitHub + Platform DSA) (0..25)
    const solvedPts = Math.min(13, (effectiveSolved / 600) * 13);
    const ratingRef = Math.max(career.leetcode_rating, career.codechef_rating, career.codeforces_rating + 250);
    const ratingPts = ratingRef > 0 ? Math.min(7, Math.max(0, ((ratingRef - 1200) / 800) * 7)) : 0;
    const githubPts = Math.min(5, (career.github_repos / 25) * 5);
    const codingProfileScore = Math.min(25, Math.round(solvedPts + ratingPts + githubPts));

    // 3. Academic Standing (0..15)
    const cgpaPts = Math.min(11, (career.cgpa / 9.5) * 11);
    const boardAvg = (career.tenth_pct + career.twelfth_pct) / 2;
    const boardPts = boardAvg > 0 ? Math.min(4, (boardAvg / 95) * 4) : 2;
    const backlogPenalty = career.active_backlogs * 4;
    const academicScore = Math.max(0, Math.min(15, Math.round(cgpaPts + boardPts - backlogPenalty)));

    // 4. LSRW Versant + Campus LMS Modules (0..15)
    const versantNorm = platformStats.bestVersantScore
      ? Math.max(0, (platformStats.bestVersantScore - 20) / 60)
      : 0.45;
    const lsrwPts = versantNorm * (parsedJd.prioritizesCommunication ? 11 : 8);
    const lmsPts = Math.min(
      parsedJd.prioritizesCommunication ? 4 : 7,
      (platformStats.modulesCompleted / 10) * 4 + (platformStats.dsaSolvedCount / 10) * 3,
    );
    const lsrwAndLmsScore = Math.min(15, Math.round(lsrwPts + lmsPts));

    // 5. Resume Depth (0..10)
    const hasHeadline = career.headline.length > 5 ? 2 : 0;
    const projDepth = Math.min(4, career.projects.length * 2);
    const expDepth = Math.min(3, career.experiences.length * 2 + (career.certifications.length > 0 ? 1 : 0));
    const linkDepth = career.codolio_url || career.linkedin_url || career.resume_url ? 1 : 0;
    const resumeDepthScore = Math.min(10, hasHeadline + projDepth + expDepth + linkDepth);

    const rawFit =
      skillAndProjectScore +
      codingProfileScore +
      academicScore +
      lsrwAndLmsScore +
      resumeDepthScore;
    const fitScore = eligible ? Math.min(100, rawFit) : Math.max(0, Math.round(rawFit * 0.72));

    scored.push({
      rank: 0,
      userId: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      admissionNo: career.admission_no || user.register_number,
      branch: career.branch,
      batchYear: career.batch_year,
      cgpa: career.cgpa,
      tenthPct: career.tenth_pct,
      twelfthPct: career.twelfth_pct,
      activeBacklogs: career.active_backlogs,
      eligible,
      eligibilityGaps,
      fitScore,
      breakdown: {
        skillAndProjectScore,
        codingProfileScore,
        academicScore,
        lsrwAndLmsScore,
        resumeDepthScore,
      },
      matchedSkills,
      missingSkills,
      projectEvidenceTitles,
      codingSummary: {
        codolioHandle: career.codolio_handle,
        codolioUrl: career.codolio_url,
        codolioTotalSolved: career.codolio_total_solved,
        leetcodeHandle: career.leetcode_handle,
        leetcodeSolved: career.leetcode_solved,
        leetcodeRating: career.leetcode_rating,
        codeforcesRating: career.codeforces_rating,
        codechefRating: career.codechef_rating,
        githubHandle: career.github_handle,
        githubRepos: career.github_repos,
        platformDsaSolved: platformStats.dsaSolvedCount,
      },
      lsrwSummary: {
        bestVersantScore: platformStats.bestVersantScore,
        cefrLevel: platformStats.latestCefr,
        modulesCompleted: platformStats.modulesCompleted,
      },
      headline: career.headline,
      careerSummary: career.career_summary,
      projectsCount: career.projects.length,
      experiencesCount: career.experiences.length,
      resumeUrl: career.resume_url,
      linkedinUrl: career.linkedin_url,
    });
  }

  scored.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
    if (b.cgpa !== a.cgpa) return b.cgpa - a.cgpa;
    return b.codingSummary.codolioTotalSolved - a.codingSummary.codolioTotalSolved;
  });

  scored.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  return { parsedJd, candidates: scored };
}

// Neutralize Excel/CSV formula injection characters
export function sanitizeCsvCell(val: unknown): string {
  let s = String(val ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  if (/[",]/.test(s)) {
    s = `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function candidatesToSafeCsv(candidates: RankedCandidateResult[], companyName: string): string {
  const header = [
    "Rank",
    "Company Drive",
    "Eligible",
    "Fit Score (%)",
    "Full Name",
    "Admission No",
    "Email",
    "Phone",
    "Branch",
    "Batch",
    "CGPA",
    "Backlogs",
    "Matched Skills",
    "Top Projects",
    "Codolio Handle",
    "Codolio Solved",
    "LeetCode Solved",
    "LeetCode Rating",
    "GitHub Handle",
    "Versant LSRW Score",
    "CEFR",
    "Resume URL",
  ];

  const rows = candidates.map((c) =>
    [
      c.rank,
      companyName || "Campus Drive",
      c.eligible ? "Eligible" : "Ineligible",
      c.fitScore,
      c.fullName,
      c.admissionNo,
      c.email,
      c.phone,
      c.branch,
      c.batchYear,
      c.cgpa.toFixed(2),
      c.activeBacklogs,
      c.matchedSkills.join("; "),
      c.projectEvidenceTitles.join("; "),
      c.codingSummary.codolioHandle,
      c.codingSummary.codolioTotalSolved,
      c.codingSummary.leetcodeSolved,
      c.codingSummary.leetcodeRating,
      c.codingSummary.githubHandle,
      c.lsrwSummary.bestVersantScore ?? "N/A",
      c.lsrwSummary.cefrLevel ?? "N/A",
      c.resumeUrl || c.linkedinUrl || c.codingSummary.codolioUrl,
    ]
      .map(sanitizeCsvCell)
      .join(","),
  );

  return [header.map(sanitizeCsvCell).join(","), ...rows].join("\n");
}
