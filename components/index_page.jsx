/* global React, Icon */
const { useState } = React;

function IndexPage({ onNav }) {
  const [hovered, setHovered] = useState(null);

  const projects = [
    {
      id: "aerospace",
      n: "01",
      label: "Aerospace",
      title: "A hobby that happens to fly.",
      desc: "RC planes, drone, 3D-printed mini plane.",
      photo: null,
    },
    {
      id: "robotics",
      n: "02",
      label: "Robotics",
      title: "One arm, three drivetrains.",
      desc: "5-DOF arm. Three iterations. Each killed a different way.",
      photo: "assets/arm-v2.png",
    },
    {
      id: "software",
      n: "03",
      label: "Software",
      title: "The camera moves the arm.",
      desc: "Live arm tracking. The robot mirrors me.",
      photo: "assets/arm-v3.png",
    },
  ];

  return (
    <div className="page">
      {/* Nav spacer */}
      <div style={{ height: 57 }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100dvh - 57px)",
      }}>
        {/* Left — photo */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src="assets/matura.png"
            alt="Lukas Gerster at the Matura ceremony, Kantonsschule Im Lee"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "25% 18%",
              filter: "grayscale(1) contrast(1.08) brightness(0.88)",
            }}
          />
          {/* Right fade into bg */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to right, rgba(13,13,11,0) 50%, rgba(13,13,11,0.55) 78%, rgba(13,13,11,1) 100%)",
          }} />
          {/* Bottom fade */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(13,13,11,0.35) 0%, transparent 25%, rgba(13,13,11,0.35) 88%, rgba(13,13,11,1) 100%)",
          }} />
          {/* Amber tint overlay — very subtle */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "rgba(234,169,78,0.04)",
          }} />
        </div>

        {/* Right — text */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 56px 60px 52px",
          background: "var(--bg)",
        }}>
          <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 28, letterSpacing: "0.2em" }}>
            Mechanical Engineering
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(38px, 4.6vw, 68px)",
            fontWeight: 500, lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "var(--text)", margin: "0 0 28px",
          }}>
            Building things<br />
            that fly, move,<br />
            <span style={{ color: "var(--amber)", fontWeight: 400 }}>and think.</span>
          </h1>

          <p style={{
            fontSize: 15, lineHeight: 1.68,
            color: "var(--text-2)", maxWidth: 360, marginBottom: 44,
          }}>
            Lukas Gerster — mechanical engineering at ETH Zürich. Three project tracks: aerospace, robotics, software.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => { const el = document.getElementById("work-list"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase",
                background: "var(--amber)", color: "#0D0D0B",
                border: "none", padding: "11px 24px", borderRadius: 999,
                fontWeight: 500, transition: "opacity 180ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.82"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              View Work
            </button>
            <button
              onClick={() => onNav("cv")}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase",
                background: "transparent", color: "var(--text-2)",
                border: "0.5px solid var(--rule-2)", padding: "11px 24px", borderRadius: 999,
                transition: "color 180ms, border-color 180ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text-3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderColor = "var(--rule-2)"; }}
            >
              Curriculum Vitæ
            </button>
          </div>

          <div className="mono" style={{
            fontSize: 10, color: "var(--text-4)",
            letterSpacing: "0.12em", marginTop: 52, lineHeight: 1.9,
          }}>
            B. 2006 · WINTERTHUR · ETH ZÜRICH '27
          </div>
        </div>
      </section>

      {/* ── WORK LIST ────────────────────────────────────────── */}
      <section id="work-list" style={{ padding: "80px 40px 64px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: 40, paddingBottom: 16,
          borderBottom: "0.5px solid var(--rule)",
        }}>
          <span className="eyebrow">Selected Work</span>
          <span className="eyebrow">3 projects</span>
        </div>

        <div style={{ position: "relative" }}>
          {/* Floating photo preview — fixed bottom-right on hover */}
          {hovered !== null && projects[hovered].photo && (
            <div style={{
              position: "fixed", right: 48, bottom: 80,
              width: 300, height: 210,
              borderRadius: "var(--r-lg)", overflow: "hidden",
              pointerEvents: "none", zIndex: 50,
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.88), 0 0 0 0.5px rgba(237,232,222,0.08)",
              animation: "photoIn 240ms var(--ease-out) both",
            }}>
              <img
                src={projects[hovered].photo}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {projects.map((p, i) => (
            <div
              key={p.id}
              className="work-row stagger-item"
              onClick={() => onNav(p.id)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ "--stagger-delay": `${i * 80}ms` }}
            >
              <span className="work-row-num">{p.n}</span>
              <div>
                <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 7 }}>
                  {p.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(20px, 2.2vw, 28px)",
                  fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1,
                  color: "var(--text)", marginBottom: 6,
                }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>
                  {p.desc}
                </div>
              </div>
              <span className="work-row-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div style={{
        borderTop: "0.5px solid var(--rule)",
        borderBottom: "0.5px solid var(--rule)",
        padding: "13px 0", overflow: "hidden",
        background: "var(--bg-1)",
      }}>
        <div className="marquee-track mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span><span className="pulse"/>OPEN TO PROJECTS</span>
              <span>EST. WINTERTHUR</span>
              <span>ETH ZÜRICH '27</span>
              <span>BUILT FROM CAD, COMPOSITES, AND CAFFEINE</span>
              <span>PFADI BUBENBERG / CHAPPER</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── SITE FOOTER ──────────────────────────────────────── */}
      <div style={{
        padding: "18px 40px", display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-mono)", fontSize: 10,
        color: "var(--text-4)", letterSpacing: "0.09em",
      }}>
        <span>© 2026 LUKAS GERSTER</span>
        <span>BUILT IN WINTERTHUR</span>
        <span
          style={{ cursor: "pointer", transition: "color 150ms" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--text-2)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-4)"; }}
          onClick={() => window.open("https://github.com/gersterl", "_blank")}
        >
          GITHUB ↗
        </span>
      </div>
    </div>
  );
}

window.IndexPage = IndexPage;
