import Link from "next/link";

export default function NotFound() {
  return (
    <main className="public-main" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <div
        className="surface-card"
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          textAlign: "center",
          padding: "44px 32px",
        }}
      >
        <span className="eyebrow">404 · PAGE NOT FOUND</span>
        <h1 style={{ fontSize: "28px", margin: "10px 0 12px", color: "#f5f5f7" }}>
          This learning route could not be found
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
          The module, problem, or page URL you requested does not exist or may have moved.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="button button-primary">
            Return Home
          </Link>
          <Link href="/portal" className="button button-quiet">
            Student Portal
          </Link>
          <Link href="/dsa" className="button button-quiet">
            DSA CodeStudio
          </Link>
        </div>
      </div>
    </main>
  );
}
