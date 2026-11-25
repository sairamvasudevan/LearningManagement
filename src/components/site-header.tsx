"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PLATFORM_NAME, COURSE_PACKAGES } from "@/lib/courses";
import catalog from "@/lib/course-catalog.json";

export function SiteHeader({
  signedIn = false,
  admin = false,
}: {
  signedIn?: boolean;
  admin?: boolean;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  async function handleSignOut(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault();
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signout" }),
      });
    } catch {}
    try {
      await fetch("/auth/signout", { method: "POST" });
    } catch {}
    window.location.href = "/login";
  }

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setModulesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (modulesRef.current && !modulesRef.current.contains(event.target as Node)) {
        setModulesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search results calculation
  const searchResults =
    searchQuery.trim().length > 1
      ? [
          ...COURSE_PACKAGES.filter(
            (c) =>
              c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
          ).map((c) => ({
            title: c.title,
            sub: `${c.totalHours} hrs · ${c.category}`,
            href: `/courses/${c.slug}`,
            badge: c.priceLabel,
          })),
          ...catalog.modules
            .filter(
              (m) =>
                m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.objective.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .slice(0, 6)
            .map((m) => ({
              title: `Module ${String(m.id).padStart(2, "0")}: ${m.title}`,
              sub: m.objective,
              href: m.published ? `/learn/${m.id}` : `/courses/problem-solving-lab`,
              badge: m.published ? "Live Now" : "Planned",
            })),
        ]
      : [];

  return (
    <header className="futuristic-header">
      <div className="futuristic-header-inner">
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <Link href="/" className="nexus-brand" aria-label="Nexus Academy Home">
            <div className="nexus-logo-orb">
              <span className="nexus-logo-bolt">⚡</span>
            </div>
            <div className="nexus-brand-text">
              <span className="nexus-brand-name">{PLATFORM_NAME}</span>
              <span className="nexus-version-pill">ENGINEERING ACADEMY</span>
            </div>
          </Link>

          {/* Training Modules Dropdown */}
          <div className="modules-dropdown-wrapper" ref={modulesRef}>
            <button
              type="button"
              className={`modules-trigger-btn ${modulesDropdownOpen ? "active" : ""}`}
              onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
            >
              <span>Training Modules</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  transform: modulesDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {modulesDropdownOpen && (
              <div className="futuristic-modules-flyout">
                <div className="flyout-header">
                  <span className="flyout-kicker">Core System Architecture</span>
                  <span className="flyout-count">4 Precision Modules</span>
                </div>

                <div className="flyout-grid">
                  <Link
                    href="/courses/problem-solving-lab"
                    className="flyout-item featured"
                    onClick={() => setModulesDropdownOpen(false)}
                  >
                    <div className="flyout-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                      📐
                    </div>
                    <div>
                      <div className="flyout-title">
                        <b>Problem Solving Lab</b>
                        <span className="flyout-badge-flagship">Flagship · ₹0</span>
                      </div>
                      <div className="flyout-desc">100-Hour systematic algorithmic reasoning &amp; invariant proofs.</div>
                    </div>
                  </Link>

                  <Link
                    href="/dsa"
                    className="flyout-item"
                    onClick={() => setModulesDropdownOpen(false)}
                  >
                    <div className="flyout-icon" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}>
                      ⚔️
                    </div>
                    <div>
                      <div className="flyout-title">
                        <b>Placement DSA Arena</b>
                        <span className="flyout-badge-cyan">Live Compiler</span>
                      </div>
                      <div className="flyout-desc">C++, Java, Python, C multi-language placement practice suite.</div>
                    </div>
                  </Link>

                  <Link
                    href="/web-dev"
                    className="flyout-item"
                    onClick={() => setModulesDropdownOpen(false)}
                  >
                    <div className="flyout-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                      🌐
                    </div>
                    <div>
                      <div className="flyout-title">
                        <b>Full-Stack &amp; MERN Studio</b>
                        <span className="flyout-badge-green">Interactive</span>
                      </div>
                      <div className="flyout-desc">Hands-on interactive HTML/CSS/JS sandbox with real-time DOM tester.</div>
                    </div>
                  </Link>

                  <Link
                    href="/ide"
                    className="flyout-item"
                    onClick={() => setModulesDropdownOpen(false)}
                  >
                    <div className="flyout-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                      💻
                    </div>
                    <div>
                      <div className="flyout-title">
                        <b>Cloud Scratchpad IDE</b>
                        <span className="flyout-badge-amber">Custom STDIN</span>
                      </div>
                      <div className="flyout-desc">Zero-setup multi-language online compiler for quick debugging.</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary Center Nav Links */}
        <nav className="futuristic-nav" aria-label="Main system navigation">
          <Link href="/courses/problem-solving-lab" className="futuristic-nav-link">
            100h Lab
          </Link>
          <Link href="/dsa" className="futuristic-nav-link accent-cyan">
            DSA Arena
          </Link>
          <Link href="/web-dev" className="futuristic-nav-link accent-green">
            Web Dev &amp; MERN
          </Link>
          <Link href="/ide" className="futuristic-nav-link accent-amber">
            Cloud IDE
          </Link>
          <Link href="/#curriculum" className="futuristic-nav-link">
            10 Stages
          </Link>
        </nav>

        {/* Right Side: Quick Search + Authentication */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Quick Search Trigger */}
          <div className="header-search-container" ref={searchRef}>
            <button
              type="button"
              className="quick-search-trigger"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search curriculum"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="search-placeholder-text">Quick search...</span>
              <kbd className="cyber-kbd">⌘K</kbd>
            </button>

            {searchOpen && (
              <div className="futuristic-search-palette">
                <div className="search-palette-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="search"
                    autoFocus
                    placeholder="Search topics, algorithms, Big-O, modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-palette-input"
                  />
                  <button
                    type="button"
                    className="search-palette-close"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    ESC
                  </button>
                </div>

                <div className="search-palette-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="palette-result-item"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div>
                          <b className="palette-item-title">{item.title}</b>
                          <small className="palette-item-sub">{item.sub}</small>
                        </div>
                        <span className="palette-item-badge">{item.badge}</span>
                      </Link>
                    ))
                  ) : searchQuery.trim().length > 1 ? (
                    <div className="palette-empty-state">No matching lessons found for &ldquo;{searchQuery}&rdquo;</div>
                  ) : (
                    <div className="palette-hints">
                      <span className="hint-label">Try searching:</span>
                      <button type="button" onClick={() => setSearchQuery("Big-O")}>Big-O</button>
                      <button type="button" onClick={() => setSearchQuery("Dynamic Programming")}>Dynamic Programming</button>
                      <button type="button" onClick={() => setSearchQuery("HTML5")}>HTML5</button>
                      <button type="button" onClick={() => setSearchQuery("Two Pointers")}>Two Pointers</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Action */}
          {signedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                href={admin ? "/admin" : "/portal"}
                className="portal-status-chip"
              >
                <span className="chip-live-dot" />
                <span>{admin ? "Admin Console" : "Student Hub"}</span>
              </Link>
              <form action="/auth/signout" method="post" onSubmit={handleSignOut} style={{ margin: 0 }}>
                <button
                  type="submit"
                  disabled={signingOut}
                  className="futuristic-signout-btn"
                  title="Sign out of system"
                >
                  {signingOut ? "..." : "Sign Out"}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/login" className="futuristic-signin-link">
                Sign In
              </Link>
              <Link
                href="/register?course=problem-solving-lab"
                className="futuristic-cta-btn"
              >
                <span>Start Free</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link
            href="/courses/problem-solving-lab"
            className="mobile-drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>📐 100-Hour Problem Solving Lab</span>
            <span className="drawer-badge">₹0 Free</span>
          </Link>
          <Link
            href="/dsa"
            className="mobile-drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>⚔️ Placement DSA Arena</span>
            <span className="drawer-badge">Live IDE</span>
          </Link>
          <Link
            href="/web-dev"
            className="mobile-drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>🌐 Web Dev &amp; MERN Studio</span>
            <span className="drawer-badge">DOM Sandbox</span>
          </Link>
          <Link
            href="/ide"
            className="mobile-drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>💻 Standalone Cloud IDE</span>
            <span className="drawer-badge">Compiler</span>
          </Link>
          <Link
            href="/#curriculum"
            className="mobile-drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>🗺️ 10-Stage Roadmap</span>
          </Link>
          <div className="mobile-drawer-footer">
            {signedIn ? (
              <Link
                href={admin ? "/admin" : "/portal"}
                className="futuristic-cta-btn"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to Portal →
              </Link>
            ) : (
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <Link
                  href="/login"
                  className="futuristic-signin-link"
                  style={{ flex: 1, textAlign: "center", padding: "10px" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register?course=problem-solving-lab"
                  className="futuristic-cta-btn"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Free →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
