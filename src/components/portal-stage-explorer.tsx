"use client";

import { useState } from "react";
import Link from "next/link";

export type StageInfo = {
  id: number;
  title: string;
  description: string;
};

export type ModuleInfo = {
  id: number;
  stage: number;
  title: string;
  objective: string;
  focus: string;
  evidence: string;
  tier: string;
  practiceCount: number;
  activityStyle: string;
  published: boolean;
};

export type ProgressItem = {
  module_number: number;
  status: "not_started" | "in_progress" | "completed";
  best_score: number;
  total_marks: number;
};

interface PortalStageExplorerProps {
  stages: StageInfo[];
  modules: ModuleInfo[];
  progressMap: Record<number, ProgressItem>;
  completedSet: number[];
  nextModule: number;
}

export function PortalStageExplorer({
  stages,
  modules,
  progressMap,
  completedSet,
  nextModule,
}: PortalStageExplorerProps) {
  const completedLookup = new Set(completedSet);

  // Default to the stage of the current next module
  const initialStageId = Math.min(10, Math.max(1, Math.ceil(nextModule / 10)));
  const [selectedStageId, setSelectedStageId] = useState<number>(initialStageId);

  const activeStage = stages.find((s) => s.id === selectedStageId) || stages[0];
  const activeModules = modules.filter((m) => m.stage === selectedStageId);

  const stageCompletedCount = activeModules.filter((m) => completedLookup.has(m.id)).length;
  const stagePct = Math.round((stageCompletedCount / activeModules.length) * 100);

  return (
    <section className="portal-curriculum-card">
      <div className="card-header-clean">
        <div>
          <h3>Full 100-Hour Flagship Curriculum (10 Stages · 100 Modules)</h3>
          <p>
            Zero-code problem-solving mastery. Complete each module with ≥ 80% to unlock subsequent
            checkpoints.
          </p>
        </div>
        <span className="catalog-count-pill">100 Published Modules Live</span>
      </div>

      {/* Stage Tabs Navigation */}
      <div className="portal-stage-tabs-scroll" style={{ overflowX: "auto", margin: "16px 0 20px" }}>
        <div style={{ display: "flex", gap: "8px", minWidth: "max-content", paddingBottom: "4px" }}>
          {stages.map((stg) => {
            const stgMods = modules.filter((m) => m.stage === stg.id);
            const done = stgMods.filter((m) => completedLookup.has(m.id)).length;
            const isSelected = stg.id === selectedStageId;
            const isAllDone = done === stgMods.length && done > 0;

            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => setSelectedStageId(stg.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: isSelected ? "1.5px solid var(--apple-blue)" : "1px solid var(--border-normal)",
                  background: isSelected ? "rgba(0, 113, 227, 0.16)" : "#1c1c1e",
                  color: isSelected ? "#60a5fa" : "#e5e5ea",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    background: isSelected ? "var(--apple-blue)" : isAllDone ? "var(--apple-green)" : "#2c2c2e",
                    color: "#ffffff",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  {isAllDone ? "✓" : String(stg.id).padStart(2, "0")}
                </span>
                <span>Stage {String(stg.id).padStart(2, "0")}</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: isAllDone ? "#30d158" : done > 0 ? "#60a5fa" : "#86868b",
                    fontWeight: 700,
                  }}
                >
                  ({done}/10)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Header Box */}
      <div
        style={{
          background: "linear-gradient(135deg, #161617 0%, #1c1c1e 100%)",
          border: "1px solid var(--border-normal)",
          borderRadius: "16px",
          padding: "18px 22px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--apple-blue-accent)",
            }}
          >
            STAGE {String(activeStage.id).padStart(2, "0")} OF 10 · 10 LESSONS
          </span>
          <h4 style={{ margin: "4px 0 2px", fontSize: "18px", color: "var(--text-primary)" }}>
            {activeStage.title}
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            {activeStage.description}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
            {stageCompletedCount} / {activeModules.length} Modules Mastered ({stagePct}%)
          </div>
          <div
            style={{
              width: "180px",
              height: "6px",
              background: "#242426",
              borderRadius: "99px",
              overflow: "hidden",
              marginTop: "6px",
            }}
          >
            <div
              style={{
                width: `${stagePct}%`,
                height: "100%",
                background: stagePct === 100 ? "var(--apple-green)" : "var(--apple-blue-accent)",
                borderRadius: "99px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Modules Stack for Active Stage */}
      <div className="curriculum-modules-stack">
        {activeModules.map((m) => {
          const mNum = m.id;
          const isCompleted = completedLookup.has(mNum);
          const isStageStart = mNum === 1 || mNum % 10 === 1;
          const isUnlocked = isStageStart || completedLookup.has(mNum - 1);
          const prog = progressMap[mNum];

          return (
            <div
              key={mNum}
              className={`module-item-clean ${!isUnlocked ? "module-item-locked" : ""}`}
            >
              <div className="module-item-left">
                <div
                  className={`module-num-badge ${
                    isCompleted
                      ? "badge-completed"
                      : isUnlocked
                        ? "badge-ready"
                        : "badge-locked"
                  }`}
                >
                  {isCompleted ? "✓" : String(mNum).padStart(2, "0")}
                </div>
                <div className="module-item-info">
                  <h4>
                    Module {String(mNum).padStart(2, "0")}: {m.title}
                  </h4>
                  <p>{m.objective}</p>
                  <div className="module-item-tags">
                    <span className="tag-pill">22 Mins</span>
                    <span className="tag-pill">2 Case Studies</span>
                    <span className="tag-pill">Hands-on Task</span>
                    <span className="tag-pill">{mNum === 1 ? "12 Questions (36 Marks)" : "6 Questions (18 Marks)"}</span>
                    <span className="tag-pill" style={{ color: "var(--apple-blue-accent)", background: "var(--apple-blue-subtle)" }}>
                      {m.focus.split(";")[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="module-item-right">
                <div className="module-score-status">
                  {isCompleted ? (
                    <span className="status-badge-completed">
                      Passed ✓ ({prog?.best_score}/{prog?.total_marks})
                    </span>
                  ) : isUnlocked ? (
                    <span className="status-badge-ready">
                      {prog?.status === "in_progress" ? "In Progress" : "Ready to Start"}
                    </span>
                  ) : (
                    <span className="status-badge-locked">
                      🔒 Complete Mod {String(mNum - 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                {isUnlocked ? (
                  <Link
                    href={`/learn/${mNum}`}
                    className={`button button-small ${
                      isCompleted ? "button-outline" : "button-cn-primary"
                    }`}
                  >
                    {isCompleted ? "Review Material" : "Start Lesson →"}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="button button-small button-disabled"
                    disabled
                  >
                    Locked
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
