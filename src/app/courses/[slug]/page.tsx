import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getCoursePackageBySlug, PLATFORM_NAME } from "@/lib/courses";
import catalog from "@/lib/course-catalog.json";
import { CourseDetailAudioReader } from "@/components/audio-reader";

type PageProps = { params: Promise<{ slug: string }> };

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCoursePackageBySlug(slug);
  if (!course) notFound();

  const isFlagship = course.slug === "problem-solving-lab";

  return (
    <>
      <SiteHeader />
      <main className="public-main">
        <div className="breadcrumb-row">
          <Link href="/#courses">← All course packages</Link>
          <span>/</span>
          <span>{course.title}</span>
        </div>

        <section className="course-detail-hero">
          <div className="course-detail-copy">
            <div className="package-badges">
              <span className={`badge ${course.status === "available" ? "badge-live" : "badge-soon"}`}>
                {course.status === "available" ? "Available Now · Enroll Free" : "Roadmap Track"}
              </span>
              <span className="badge badge-category">{course.category}</span>
              {course.badge && <span className="badge badge-category">{course.badge}</span>}
            </div>

            <h1>{course.title}</h1>
            <p>{course.description}</p>

            <div className="ed-rating-row" style={{ marginTop: 14 }}>
              <span className="rating-score">{course.rating.toFixed(1)}</span>
              <span className="rating-stars">★★★★★</span>
              <span className="rating-count">({course.reviewCount.toLocaleString()} ratings)</span>
              <span className="rating-students">• {course.enrolledCount.toLocaleString()} students enrolled</span>
            </div>

            <div className="ed-instructor-row" style={{ margin: "14px 0" }}>
              <div className="instructor-avatar">
                {course.instructor.split(" ")[0][0]}
                {course.instructor.split(" ")[1] ? course.instructor.split(" ")[1][0] : ""}
              </div>
              <div>
                <b>Instructor: {course.instructor}</b>
                <small>{course.instructorTitle}</small>
              </div>
            </div>

            <div className="course-detail-metrics">
              <div>
                <b>{course.priceLabel}</b>
                <span>Tuition fee</span>
              </div>
              <div>
                <b>{course.totalHours} Hours</b>
                <span>Total curriculum</span>
              </div>
              <div>
                <b>{course.totalPaths} Paths</b>
                <span>Structured phases</span>
              </div>
              <div>
                <b>80%</b>
                <span>Mastery threshold</span>
              </div>
            </div>

            {/* Read Aloud Course Syllabus Narration */}
            <div style={{ marginTop: "20px" }}>
              <CourseDetailAudioReader
                title={course.title}
                category={course.category}
                description={course.description}
                highlights={course.highlights}
                skills={course.skills}
                totalHours={course.totalHours}
                totalPaths={course.totalPaths}
              />
            </div>
          </div>

          <aside className="course-enroll-card">
            <span className="eyebrow">COURSE REGISTRATION</span>
            <div className="enroll-price">
              <div className="price-tag-row">
                <strong style={{ color: course.isFree ? "var(--teal)" : "var(--navy)" }}>
                  {course.priceLabel}
                </strong>
                {course.originalPrice && <del className="price-struck">{course.originalPrice}</del>}
              </div>
              <span>
                {course.status === "available"
                  ? "₹0 · Full scholarship for verified students"
                  : "Registration opens with next cohort"}
              </span>
            </div>

            <ul className="package-highlights">
              {course.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {!isFlagship && (
              <div
                style={{
                  background: "#1e1b4b",
                  border: "1px solid #4338ca",
                  borderRadius: "8px",
                  padding: "14px",
                  marginBottom: "16px",
                  color: "#e0e7ff",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 800, color: "#f59e0b", marginBottom: "4px" }}>
                  🔒 Prerequisite Enforced
                </div>
                Full interactive sandboxes and verified submissions require mastering the 100-Hour Flagship <b>Problem Solving Lab</b>. You can preview Chapter 01 immediately.
              </div>
            )}

            {isFlagship ? (
              <>
                <Link
                  className="button button-cn-primary button-full"
                  href={`/register?course=${course.slug}`}
                >
                  Register Free Account (₹0) →
                </Link>
                <Link className="button button-full" href="/login" style={{ marginTop: 9 }}>
                  Already registered? Sign in
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="button button-cn-primary button-full"
                  href={
                    course.slug === "web-dev-mern-lab"
                      ? "/web-dev/html-intro"
                      : course.slug === "dsa-mastery-lab"
                      ? "/dsa/two-sum"
                      : `/courses/${course.slug}`
                  }
                >
                  👁️ Open Chapter 01 Preview →
                </Link>
                <Link
                  className="button button-quiet button-full"
                  href="/register?course=problem-solving-lab"
                  style={{ marginTop: 9, borderColor: "#4338ca", color: "#c7d2fe" }}
                >
                  👉 Enroll in 100-Hour Lab to Unlock
                </Link>
              </>
            )}

            <p className="field-note">
              {isFlagship
                ? "Module 01 is currently published and live. Modules 02–100 unlock sequentially upon passing each 80% checkpoint."
                : "Complete all 100 modules of Problem Solving Lab to unlock full interactive submissions and certifications for this track."}
            </p>
          </aside>
        </section>

        {isFlagship ? (
          <section className="public-section section-spaced">
            <div className="section-intro">
              <span className="eyebrow">10-PATH COMPLETE SYLLABUS</span>
              <h2>Sequential 100-Hour Curriculum Map</h2>
              <p>
                Each path contains 10 one-hour lessons. Students unlock lessons in strict sequential
                order after passing each mastery checkpoint (80%), while college administrators track
                progress at every stage.
              </p>
            </div>

            <div className="syllabus-grid">
              {catalog.stages.map((stage) => {
                const stageModules = catalog.modules.filter((m) => m.stage === stage.id);
                const publishedCount = stageModules.filter((m) => m.published).length;

                return (
                  <article className="syllabus-stage-card" key={stage.id}>
                    <div className="syllabus-stage-head">
                      <span className="syllabus-stage-num">
                        {String(stage.id).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{stage.title}</h3>
                        <p>{stage.description}</p>
                      </div>
                      <span className={`badge ${publishedCount > 0 ? "badge-live" : "badge-soon"}`}>
                        {publishedCount > 0 ? `${publishedCount}/10 live` : "Planned"}
                      </span>
                    </div>
                    <ol className="syllabus-module-list">
                      {stageModules.map((mod) => (
                        <li key={mod.id}>
                          <span className="syllabus-mod-no">{String(mod.id).padStart(2, "0")}</span>
                          <span className="syllabus-mod-title">{mod.title}</span>
                          <span
                            className={`syllabus-mod-state ${mod.published ? "live" : "planned"}`}
                          >
                            {mod.published ? "Live Now" : "Planned"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="public-section section-spaced">
            <div className="section-intro">
              <span className="eyebrow">ROADMAP TRACK CURRICULUM</span>
              <h2>Core Competencies &amp; Syllabus Overview</h2>
              <p>
                This advanced engineering specialization is currently in active syllabus authoring and
                will roll out to learners enrolled on this platform.
              </p>
            </div>

            <div className="surface-card" style={{ padding: 28 }}>
              <h3 style={{ font: "800 20px Manrope, sans-serif", color: "var(--navy)", margin: "0 0 12px" }}>
                Skills &amp; Learning Outcomes
              </h3>
              <div className="ed-skill-tags" style={{ marginBottom: 20 }}>
                {course.skills.map((s) => (
                  <span key={s} style={{ fontSize: 12, padding: "6px 12px" }}>
                    {s}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
                Students who complete the flagship <strong>Problem Solving Lab</strong> will have the
                mathematical and architectural foundations required for this track.
              </p>
              <Link className="button button-primary" href="/register?course=problem-solving-lab">
                Start with Flagship Problem Solving Lab Free →
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="public-footer">
        <span>{PLATFORM_NAME}</span>
        <span>{course.title} · {course.priceLabel}</span>
      </footer>
    </>
  );
}
