import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/security";
import { getCurrentIdentity } from "@/lib/auth";
import {
  createPlacementDrive,
  getAllPlacementDrives,
  getAllStudentsCareerSnapshots,
} from "@/lib/db";
import {
  candidatesToSafeCsv,
  rankCandidatesForCompanyDrive,
} from "@/lib/placement-matcher";

const MAX_BODY_BYTES = 32_768;

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (identity.role !== "admin") {
      return NextResponse.json({ error: "T&P Administrator access required." }, { status: 403 });
    }

    const snapshots = getAllStudentsCareerSnapshots();
    const drives = getAllPlacementDrives();
    return NextResponse.json({ ok: true, snapshotsCount: snapshots.length, drives });
  } catch {
    return NextResponse.json({ error: "Could not load placement drive records." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (identity.role !== "admin") {
      return NextResponse.json({ error: "T&P Administrator access required." }, { status: 403 });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload exceeds limit." }, { status: 413 });
    }

    const body = JSON.parse(raw) as {
      action?: "rank" | "save_drive";
      companyName?: string;
      roleTitle?: string;
      ctcPackage?: string;
      jdText?: string;
      minCgpa?: number;
      maxBacklogs?: number;
      allowedBranches?: string[];
      batchYear?: number | null;
      requiredSkills?: string[];
      minCodingSolved?: number;
      minLsrwScore?: number;
      minModulesCompleted?: number;
      includeIneligible?: boolean;
      shortlistedUserIds?: string[];
    };

    const snapshots = getAllStudentsCareerSnapshots();
    const jdText = String(body.jdText || "");

    if (body.action === "save_drive") {
      const companyName = String(body.companyName || "").trim();
      const roleTitle = String(body.roleTitle || "").trim();
      if (!companyName || !roleTitle) {
        return NextResponse.json(
          { error: "Company name and role title are required to save a drive." },
          { status: 400 },
        );
      }

      const ranked = rankCandidatesForCompanyDrive(snapshots, {
        jdText,
        minCgpa: body.minCgpa,
        maxBacklogs: body.maxBacklogs,
        allowedBranches: body.allowedBranches,
        batchYear: body.batchYear,
        requiredSkills: body.requiredSkills,
        minCodingSolved: body.minCodingSolved,
        minLsrwScore: body.minLsrwScore,
        minModulesCompleted: body.minModulesCompleted,
        includeIneligible: true,
      });

      const shortlistSet = new Set(Array.isArray(body.shortlistedUserIds) ? body.shortlistedUserIds : []);
      const shortlistedCandidates =
        shortlistSet.size > 0
          ? ranked.candidates.filter((c) => shortlistSet.has(c.userId))
          : ranked.candidates.filter((c) => c.eligible);

      const drive = createPlacementDrive({
        companyName,
        roleTitle,
        ctcPackage: String(body.ctcPackage || ""),
        jdText,
        minCgpa: Number(body.minCgpa || ranked.parsedJd.detectedMinCgpa || 0),
        maxBacklogs: Number(body.maxBacklogs ?? ranked.parsedJd.detectedMaxBacklogs ?? 0),
        allowedBranches: Array.isArray(body.allowedBranches) ? body.allowedBranches : [],
        requiredSkills:
          Array.isArray(body.requiredSkills) && body.requiredSkills.length > 0
            ? body.requiredSkills
            : ranked.parsedJd.extractedSkills,
        minCodingSolved: Number(body.minCodingSolved || 0),
        minLsrwScore: Number(body.minLsrwScore || 0),
        shortlistedUserIds: shortlistedCandidates.map((c) => c.userId),
        createdBy: identity.email,
      });

      const csv = candidatesToSafeCsv(shortlistedCandidates, companyName);
      return NextResponse.json({ ok: true, drive, csv });
    }

    const { parsedJd, candidates } = rankCandidatesForCompanyDrive(snapshots, {
      jdText,
      minCgpa: typeof body.minCgpa === "number" ? body.minCgpa : undefined,
      maxBacklogs: typeof body.maxBacklogs === "number" ? body.maxBacklogs : undefined,
      allowedBranches: Array.isArray(body.allowedBranches) ? body.allowedBranches : undefined,
      batchYear: typeof body.batchYear === "number" ? body.batchYear : undefined,
      requiredSkills: Array.isArray(body.requiredSkills) ? body.requiredSkills : undefined,
      minCodingSolved: typeof body.minCodingSolved === "number" ? body.minCodingSolved : undefined,
      minLsrwScore: typeof body.minLsrwScore === "number" ? body.minLsrwScore : undefined,
      minModulesCompleted:
        typeof body.minModulesCompleted === "number" ? body.minModulesCompleted : undefined,
      includeIneligible: Boolean(body.includeIneligible),
    });

    const csv = candidatesToSafeCsv(candidates, body.companyName || "Galgotias Placement Drive");
    return NextResponse.json({ ok: true, parsedJd, candidates, csv });
  } catch {
    return NextResponse.json(
      { error: "Placement JD analysis request could not be processed." },
      { status: 400 },
    );
  }
}
