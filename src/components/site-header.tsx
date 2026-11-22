"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PLATFORM_NAME, PLATFORM_SUBTITLE, COURSE_PACKAGES } from "@/lib/courses";
import catalog from "@/lib/course-catalog.json";

export function SiteHeader({
  signedIn = false,
  admin = false,
}: {
  signedIn?: boolean;
  admin?: boolean;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter modules and courses for search
  const searchResults = searchQuery.trim().length > 1
    ? [
        ...COURSE_PACKAGES.filter(
          (c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
        ).map((c) => ({
          type: "course" as const,
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
          .slice(0, 5)
          .map((m) => ({
            type: "module" as const,
            title: `Module ${String(m.id).padStart(2, "0")}: ${m.title}`,
            sub: m.objective,
            href: m.published ? `/learn/${m.id}` : `/courses/problem-solving-lab`,
            badge: m.published ? "Live Now" : "Planned",
          })),
      ]
    : [];

  return (
    <>
      {/* Top Coursera/Udemy style announcement ribbon */}
      {!topBannerDismissed && (
        <div className="ed-top-banner" style={{ background: "linear-gradient(90deg, #111d2e 0%, #1e1308 50%, #111d2e 100%)" }}>
          <div className="ed-top-banner-inner">
            <span className="badge-flame" style={{ padding: "3px 8px", borderRadius: 99, marginRight: 4 }}>
              🔥 SCHOLARSHIP ENROLLMENT ACTIVE
            </span>
            <span className="ed-banner-text">
              Master 100 hours of systematic problem solving with zero tuition fee. Flagship course is{" "}
              <strong>100% Free (₹0)</strong> for verified students.
            </span>
            <Link href="/register?course=problem-solving-lab" className="ed-banner-cta" style={{ color: "#ff8a00" }}>
              Enroll Free →
            </Link>
            <button
              type="button"
              className="ed-banner-close"
              aria-label="Dismiss banner"
              onClick={() => setTopBannerDismissed(true)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main sticky header */}
      <header className="site-header site-header-sticky">
        <div className="header-left">
          <Link href="/" className="wordmark" aria-label="Nexus Academy home">
            <span className="mark" style={{ background: "linear-gradient(135deg, #ff5722, #ff9800)", color: "#fff" }}>
              ⚡
            </span>
            <span>
              <b>{PLATFORM_NAME}</b>
              <small>{PLATFORM_SUBTITLE}</small>
            </span>
          </Link>

          {/* Explore Dropdown */}
          <div className="header-dropdown-wrap" ref={exploreRef}>
            <button
              type="button"
              className={`header-explore-btn ${exploreOpen ? "open" : ""}`}
              onClick={() => setExploreOpen(!exploreOpen)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Explore</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {exploreOpen && (
              <div className="explore-menu-dropdown">
                <div className="explore-dropdown-section">
                  <span className="dropdown-label">Flagship Curriculum</span>
                  <Link
                    href="/courses/problem-solving-lab"
                    className="explore-menu-item highlight"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>Problem Solving Lab</b>
                      <small>100 Hours · 10 Progressive Paths · Free</small>
                    </div>
                    <span className="badge badge-live">Available</span>
                  </Link>
                  <Link
                    href="/dsa"
                    className="explore-menu-item highlight"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>DSA CodeStudio: Algorithmic Arena</b>
                      <small>C, C++, Java &amp; Python Compiler · 80 Hours · Free</small>
                    </div>
                    <span className="badge badge-live" style={{ background: "#ff6a00", color: "#fff" }}>Live IDE</span>
                  </Link>
                  <Link
                    href="/web-dev"
                    className="explore-menu-item highlight"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>Web Dev &amp; MERN Stack Sandbox</b>
                      <small>Live HTML, CSS, JS Editor &amp; DOM Tester · 75 Hours · Free</small>
                    </div>
                    <span className="badge badge-live" style={{ background: "#38bdf8", color: "#0f172a" }}>Live Editor</span>
                  </Link>
                  <Link
                    href="/ide"
                    className="explore-menu-item highlight"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>Standalone Online IDE &amp; Compiler</b>
                      <small>C, C++, Java, Python &amp; Web Sandbox Scratchpad · Free</small>
                    </div>
                    <span className="badge badge-live" style={{ background: "#10b981", color: "#fff" }}>Open IDE</span>
                  </Link>
                </div>

                <div className="explore-dropdown-section">
                  <span className="dropdown-label">Engineering Tracks (Upcoming)</span>
                  <Link
                    href="/#courses"
                    className="explore-menu-item"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>Distributed Systems &amp; Scalable Architecture</b>
                      <small>60 Hours · Raft, Caching, Event Microservices</small>
                    </div>
                    <span className="badge badge-soon">Roadmap</span>
                  </Link>
                  <Link
                    href="/#courses"
                    className="explore-menu-item"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>Generative AI Systems &amp; LLM Engineering</b>
                      <small>45 Hours · Hybrid Vector RAG, Agent Loops</small>
                    </div>
                    <span className="badge badge-soon">Roadmap</span>
                  </Link>
                  <Link
                    href="/#courses"
                    className="explore-menu-item"
                    onClick={() => setExploreOpen(false)}
                  >
                    <div>
                      <b>Competitive Programming &amp; Combinatorics</b>
                      <small>80 Hours · Trees, Network Flows, ICPC prep</small>
                    </div>
                    <span className="badge badge-soon">Roadmap</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar with instant preview */}
          <div className="header-search-wrap" ref={searchRef}>
            <div className="header-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="What do you want to learn? (e.g. Big-O, pointers, DP)..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
              />
              <kbd className="search-kbd">/</kbd>
            </div>

            {searchOpen && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                <div className="search-results-head">
                  <span>Matching Lessons &amp; Packages</span>
                  <small>{searchResults.length} results</small>
                </div>
                {searchResults.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="search-result-item"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div>
                      <b>{item.title}</b>
                      <small>{item.sub}</small>
                    </div>
                    <span className={`badge ${item.badge.includes("Free") || item.badge.includes("Live") ? "badge-live" : "badge-soon"}`}>
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Right */}
        <nav className="header-nav" aria-label="Primary navigation">
          {signedIn ? (
            <>
              {!admin && (
                <>
                  <Link href="/ide" style={{ color: "#10b981", fontWeight: 700 }}>
                    💻 Online IDE
                  </Link>
                  <Link href="/dsa" style={{ color: "#ff6a00", fontWeight: 700 }}>
                    ⚡ DSA Arena
                  </Link>
                  <Link href="/web-dev" style={{ color: "#38bdf8", fontWeight: 700 }}>
                    🌐 Web Dev &amp; MERN
                  </Link>
                  <Link href="/#courses">Courses</Link>
                  <Link href="/#curriculum">10-Path Roadmap</Link>
                </>
              )}
              <Link href={admin ? "/admin" : "/portal"} className="header-portal-chip">
                <span className="portal-chip-dot" />
                {admin ? "Admin Hub" : "My Learning"}
              </Link>
              {admin && <Link href="/admin/students">Students &amp; Progress</Link>}
              {admin && <Link href="/admin/access">Access Control</Link>}
              <form action="/auth/signout" method="post">
                <button className="button button-quiet button-small" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/ide" style={{ color: "#10b981", fontWeight: 700 }}>
                💻 Online IDE
              </Link>
              <Link href="/dsa" style={{ color: "#ff6a00", fontWeight: 700 }}>
                ⚡ DSA Arena
              </Link>
              <Link href="/web-dev" style={{ color: "#38bdf8", fontWeight: 700 }}>
                🌐 Web Dev &amp; MERN
              </Link>
              <Link href="/#courses">Courses</Link>
              <Link href="/#curriculum">Curriculum</Link>
              <Link href="/#pedagogy">Why It Works</Link>
              <Link href="/#platform">For Colleges</Link>
              <Link href="/#faq">FAQ</Link>
              <Link href="/login" className="header-signin-link">
                Sign In
              </Link>
              <Link
                className="button button-cn-primary header-enroll-btn"
                href="/register?course=problem-solving-lab"
              >
                Join Free (₹0)
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
}
