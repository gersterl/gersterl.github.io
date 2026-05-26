/* global React, Icon */
const { useState } = React;

const PROJECTS = [
  {
    id: "aerospace",
    n: "01",
    label: "Aerospace",
    title: "A hobby that happens to fly.",
    desc: "RC planes, FPV drone, 3D-printed mini plane — each built and flown.",
    tags: ["RC Fixed-wing", "FPV Drone", "Composites"],
    accent: "#EAA94E",
    photo: null,
  },
  {
    id: "robotics",
    n: "02",
    label: "Robotics",
    title: "One arm, three drivetrains.",
    desc: "5-DOF robotic arm across three full rebuilds. Each iteration killed by a different failure.",
    tags: ["BLDC → Stepper", "Cycloidal → Planetary", "Closed-loop"],
    accent: "#6FBA8A",
    photo: "assets/arm-v2.png",
  },
  {
    id: "software",
    n: "03",
    label: "Software",
    title: "The camera moves the arm.",
    desc: "MediaPipe pose estimation → serial → ESP32 → joint angles. The robot mirrors me.",
    tags: ["MediaPipe", "ESP32", "Python"],
    accent: "#9BB8C8",
    photo: "assets/arm-v3.png",
  },
];

function IndexPage({ onNav }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="page">
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
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to right, rgba(13,13,11,0) 50%, rgba(13,13,11,0.55) 78%, rgba(13,13,11,1) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(13,13,11,0.35) 0%, transparent 25%, rgba(13,13,11,0.35) 88%, rgba(13,13,11,1) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "rgba(234,169,78,0.04)",
          }} />
        </div>

        {/* Right — text */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 56px 60px 52px",
          background: "var(--bg)", position: "relative",
        }}>
          {/* Warm amber glow behind text */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 40% 45%, rgba(234,169,78,0.07) 0%, transparent 65%)",
          }} />

          <div className="eyebrow stagger-item" style={{ color: "var(--amber)", marginBottom: 28, letterSpacing: "0.2em", "--stagger-delay": "0ms" }}>
            Mechanical Engineering
          </div>

          <h1 className="stagger-item" style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(38px, 4.6vw, 68px)",
            fontWeight: 500, lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "var(--text)", margin: "0 0 28px",
            "--stagger-delay": "60ms",
          }}>
            Building things<br />
            that fly, move,<br />
            <span style={{ color: "var(--amber)", fontWeight: 400 }}>and think.</span>
          </h1>

          <p className="stagger-item" style={{
            fontSize: 15, lineHeight: 1.68,
            color: "var(--text-2)", maxWidth: 360, marginBottom: 44,
            "--stagger-delay": "120ms",
          }}>
            Lukas Gerster — mechanical engineering at ETH Zürich. Three project tracks: aerospace, robotics, software.
          </p>

          <div className="stagger-item" style={{ display: "flex", gap: 12, flexWrap: "wrap", "--stagger-delay": "180ms" }}>
            <button
              className="btn-haptic"
              onClick={() => { const el = document.getElementById("work-list"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase",
                background: "var(--amber)", color: "#0D0D0B",
                border: "none", padding: "12px 26px", borderRadius: 999,
                fontWeight: 600,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              View Work ↓
            </button>
            <button
              className="btn-haptic"
              onClick={() => onNav("cv")}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase",
                background: "transparent", color: "var(--text-2)",
                border: "0.5px solid var(--rule-2)", padding: "12px 26px", borderRadius: 999,
                transition: "color 180ms, border-color 180ms, opacity 180ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text-3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderColor = "var(--rule-2)"; }}
            >
              Curriculum Vitæ
            </button>
          </div>

          <div className="mono stagger-item" style={{
            fontSize: 10, color: "var(--text-4)",
            letterSpacing: "0.12em", marginTop: 52, lineHeight: 1.9,
            "--stagger-delay": "240ms",
          }}>
            B. 2006 · WINTERTHUR · ETH ZÜRICH '27
          </div>
        </div>
      </section>

      {/* ── WORK LIST ────────────────────────────────────────── */}
      <section id="work-list" style={{ padding: "80px 0 0" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: 0, padding: "0 40px 20px",
          borderBottom: "0.5px solid var(--rule)",
        }}>
          <span className="eyebrow">Selected Work</span>
          <span className="eyebrow">3 Projects</span>
        </div>

        {PROJECTS.map((p, i) => (
          <WorkRow
            key={p.id}
            project={p}
            index={i}
            isHovered={hovered === i}
            onHover={() => setHovered(i)}
            onLeave={() => setHovered(null)}
            onClick={() => onNav(p.id)}
          />
        ))}
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div style={{
        borderTop: "0.5px solid var(--rule)",
        borderBottom: "0.5px solid var(--rule)",
        padding: "13px 0", overflow: "hidden",
        background: "var(--bg-1)",
        marginTop: 0,
      }}>
        <div className="marquee-track mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span><span className="pulse" />OPEN TO PROJECTS</span>
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

function WorkRow({ project: p, index: i, isHovered, onHover, onLeave, onClick }) {
  const COLLAPSED = 96;
  const EXPANDED  = 228;

  return (
    <div
      className="work-row"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        height: isHovered ? EXPANDED : COLLAPSED,
        borderLeftColor: isHovered ? p.accent : "transparent",
        paddingLeft: isHovered ? 44 : 40,
        paddingRight: 40,
        display: "flex", alignItems: "flex-start",
        gap: 28,
      }}
    >
      {/* Background photo on hover */}
      {p.photo && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          overflow: "hidden", zIndex: 0,
        }}>
          <img
            src={p.photo}
            alt=""
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              opacity: isHovered ? 0.11 : 0,
              filter: "grayscale(0.4)",
              transition: "opacity 500ms var(--ease-out)",
            }}
          />
          {/* Gradient so text stays readable */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to right, var(--bg) 0%, rgba(13,13,11,0.82) 60%, var(--bg) 100%)`,
          }} />
        </div>
      )}

      {/* Number */}
      <div style={{
        position: "relative", zIndex: 1,
        fontFamily: "var(--font-mono)",
        fontSize: 36, fontWeight: 700,
        lineHeight: 1, paddingTop: 26,
        color: isHovered ? p.accent : "var(--text-4)",
        transition: "color 300ms var(--ease-out)",
        letterSpacing: "-0.02em", flexShrink: 0, minWidth: 56,
      }}>
        {p.n}
      </div>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        paddingTop: 28, flex: 1,
        transform: isHovered ? "translateX(0)" : "translateX(-4px)",
        transition: "transform 300ms var(--ease-out)",
      }}>
        <div className="mono" style={{
          fontSize: 9, letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: isHovered ? p.accent : "var(--text-3)",
          transition: "color 300ms var(--ease-out)",
          marginBottom: 7,
        }}>
          {p.label}
        </div>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(20px, 2.2vw, 27px)",
          fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1,
          color: "var(--text)", marginBottom: 10,
        }}>
          {p.title}
        </div>

        {/* Desc + tags — only visible when expanded */}
        <div style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 320ms var(--ease-out) ${isHovered ? "80ms" : "0ms"}, transform 320ms var(--ease-out) ${isHovered ? "80ms" : "0ms"}`,
          pointerEvents: isHovered ? "auto" : "none",
        }}>
          <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 }}>
            {p.desc}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.tags.map((tag, j) => (
              <span key={j} className="mono" style={{
                fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "4px 10px",
                background: isHovered ? `${p.accent}18` : "var(--bg-2)",
                color: isHovered ? p.accent : "var(--text-3)",
                borderRadius: 999,
                border: `0.5px solid ${isHovered ? p.accent + "40" : "var(--rule)"}`,
                transition: "all 280ms var(--ease-out)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        position: "relative", zIndex: 1,
        paddingTop: 30, flexShrink: 0,
        fontFamily: "var(--font-mono)", fontSize: 18,
        color: isHovered ? p.accent : "var(--text-4)",
        transform: isHovered ? "translateX(4px)" : "translateX(0)",
        transition: "color 300ms var(--ease-out), transform 300ms var(--ease-out)",
      }}>
        →
      </div>
    </div>
  );
}

window.IndexPage = IndexPage;
