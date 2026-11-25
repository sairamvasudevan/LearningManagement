"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalSegmentError({
  error,
  retry,
  reset,
}: {
  error: unknown;
  retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    console.error("Application segment error:", error);
  }, [error]);

  const digest =
    error && typeof error === "object" && "digest" in error
      ? String((error as { digest?: unknown }).digest || "")
      : "";

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <main className="public-main" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
      <div
        className="surface-card"
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          textAlign: "center",
          padding: "40px 32px",
        }}
      >
        <span className="eyebrow" style={{ color: "#f87171" }}>
          UNEXPECTED APPLICATION ERROR
        </span>
        <h1 style={{ fontSize: "26px", margin: "10px 0 12px", color: "#f5f5f7" }}>
          Something paused while loading this view
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
          An unexpected error occurred. Your saved course progress and database records are safe.
        </p>
        {digest && (
          <p className="field-note" style={{ marginBottom: "20px", fontFamily: "monospace" }}>
            Reference ID: {digest}
          </p>
        )}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={handleRetry} className="button button-primary">
            Try again
          </button>
          <Link href="/portal" className="button button-quiet">
            Go to Student Portal
          </Link>
          <Link href="/" className="button button-quiet">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
