"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ApproveEnrollmentButton } from "@/components/auth-forms";

export type AdminStudentSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  registerNumber: string;
  department: string;
  degree: string;
  graduationYear: number | null;
  enrollmentStatus: string;
  completedCount: number;
  inProgressCount: number;
  totalAttempts: number;
  bestScoreSum: number;
  totalMarksSum: number;
  nextModuleLabel: string;
  lastActivityAt: string | null;
};

export function AdminStudentsTable({ students }: { students: AdminStudentSummary[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      if (statusFilter !== "all" && student.enrollmentStatus !== statusFilter) return false;
      if (!q) return true;
      return [
        student.fullName,
        student.email,
        student.college,
        student.registerNumber,
        student.department,
        student.degree,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, statusFilter, students]);

  return (
    <section className="surface-card table-card">
      <div className="table-heading table-heading-controls">
        <div>
          <h2>Registered students — Problem Solving Lab (Free)</h2>
          <p>
            Search students, filter by approval status, approve pending requests, and open any
            student&apos;s full progress record.
          </p>
        </div>
        <div className="table-filters">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, college, reg no…"
            aria-label="Search registered students"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by enrollment status"
          >
            <option value="all">All statuses ({students.length})</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending approval</option>
            <option value="rejected">Rejected</option>
            <option value="none">Not enrolled</option>
          </select>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>College / Reg no.</th>
              <th>Programme</th>
              <th>Access</th>
              <th>Course progress</th>
              <th>Assessment summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.fullName}</b>
                  <small>{s.email}</small>
                  <small>{s.phone}</small>
                </td>
                <td>
                  {s.college}
                  <small>{s.registerNumber}</small>
                </td>
                <td>
                  {s.degree}
                  <small>
                    {s.department}
                    {s.graduationYear ? ` · ${s.graduationYear}` : ""}
                  </small>
                </td>
                <td>
                  <span className={`table-status ${s.enrollmentStatus}`}>
                    {s.enrollmentStatus === "none" ? "Not enrolled" : s.enrollmentStatus}
                  </span>
                </td>
                <td>
                  <div className="mini-progress-wrap">
                    <b>
                      {s.completedCount}/100 ({s.completedCount}%)
                    </b>
                    <div className="mini-progress-bar">
                      <span style={{ width: `${s.completedCount}%` }} />
                    </div>
                    <small>
                      {s.inProgressCount > 0
                        ? `${s.inProgressCount} in progress · `
                        : ""}
                      Next: {s.nextModuleLabel}
                    </small>
                  </div>
                </td>
                <td>
                  <b>
                    {s.totalMarksSum > 0
                      ? `${s.bestScoreSum}/${s.totalMarksSum} marks`
                      : "No submissions yet"}
                  </b>
                  <small>
                    {s.totalAttempts} {s.totalAttempts === 1 ? "attempt" : "attempts"}
                    {s.lastActivityAt
                      ? ` · Updated ${new Date(s.lastActivityAt).toLocaleDateString("en-IN")}`
                      : ""}
                  </small>
                </td>
                <td>
                  <div className="table-action-group">
                    {s.enrollmentStatus === "pending" && (
                      <ApproveEnrollmentButton studentId={s.id} />
                    )}
                    <Link className="button button-small" href={`/admin/students/${s.id}`}>
                      Track progress →
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            {students.length === 0
              ? "No student accounts have registered yet."
              : "No students match the current search or status filter."}
          </div>
        )}
      </div>
    </section>
  );
}

