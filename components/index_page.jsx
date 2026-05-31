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
    accent: "#FF6B35",
    accentRgb: "255,107,53",
    photo: null,
  },
  {
    id: "robotics",
    n: "02",
    label: "Robotics",
    title: "One arm, three drivetrains.",
    desc: "5-DOF robotic arm across three full rebuilds. Each iteration killed by a different failure.",
    tags: ["BLDC → Stepper", "Cycloidal → Planetary", "Closed-loop"],
    accent: "#00D4FF",
    accentRgb: "0,212,255",
    photo: "assets/arm-v2.png",
  },
  {
    id: "software",
    n: "03",
    label: "Software",
    title: "The camera moves the arm.",
    desc: "MediaPipe pose estimation → serial → ESP32 → joint angles. The robot mirrors me.",
    tags: ["MediaPipe", "ESP32", "Python"],
    accent: "#7EF542",
    accentRgb: "126,245,66",
    photo: "assets/arm-v3.png",
  },
];

function HudCorner({ pos }) {
  const styles = {
    position: "absolute", zIndex: 3, width: 22, height: 22,
    pointerEvents: "none",
  };
  const border = "1.5px solid rgba(0,212,255,0.55)";
  const map = {
    tl: { top: 18, left: 18, borderTop: border, borderLeft: border },
    tr: { top: 18, right: 18, borderTop: border, borderRight: border },
    bl: { bottom: 18, left: 18, borderBottom: border, borderLeft: border },
    br: { bottom: 18, right: 18, borderBottom: border, borderRight: border },
  };
  return <div className="hud-bracket" style={{ ...styles, ...map[pos] }} />;
}

function IndexPage({ onNav }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="page">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        height: "100dvh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Full-bleed photo, nearly black */}
        <img
          src="assets/matura.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "75% 18%",
            filter: "grayscale(1) contrast(1.05) brightness(0.82)",
            transform: "scaleX(-1)",
            zIndex: 0,
          }}
        />

        {/* Dark overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(140deg, rgba(11,19,34,0.68) 0%, rgba(11,19,34,0.34) 50%, rgba(11,19,34,0.74) 100%)",
        }} />

        {/* Cyan radial glow — left anchor */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse at 25% 52%, rgba(0,212,255,0.12) 0%, transparent 55%)",
        }} />

        {/* Scan line */}
        <div className="scan-line" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 5%, rgba(0,212,255,0.9) 30%, rgba(0,212,255,0.9) 70%, transparent 95%)",
          zIndex: 2, pointerEvents: "none",
        }} />

        {/* HUD corner brackets */}
        <HudCorner pos="tl" />
        <HudCorner pos="tr" />
        <HudCorner pos="bl" />
        <HudCorner pos="br" />

        {/* HUD data — top left (below nav) */}
        <div style={{
          position: "absolute", top: 72, left: 44, zIndex: 3,
          pointerEvents: "none",
          animation: "staggerIn 600ms var(--ease-out) 1.2s both",
        }}>
          <div className="mono" style={{ fontSize: 8.5, color: "rgba(0,212,255,0.45)", letterSpacing: "0.22em", lineHeight: 2.2 }}>
            <div>SYS <span style={{ color: "rgba(0,212,255,0.8)" }}>ONLINE</span></div>
            <div>47.4979° N / 8.7280° E</div>
            <div>ETH ZÜRICH · BSC-ME</div>
          </div>
        </div>

        {/* HUD data — top right */}
        <div style={{
          position: "absolute", top: 72, right: 44, zIndex: 3,
          textAlign: "right", pointerEvents: "none",
          animation: "staggerIn 600ms var(--ease-out) 1.3s both",
        }}>
          <div className="mono" style={{ fontSize: 8.5, color: "rgba(0,212,255,0.35)", letterSpacing: "0.22em", lineHeight: 2.2 }}>
            <div>TRACKS · 03</div>
            <div>PROJECTS · ACTIVE</div>
            <div>2026.05.26</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          position: "relative", zIndex: 4,
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 60px",
        }}>
          <div className="mono stagger-item" style={{
            fontSize: 10, color: "var(--cyan)", letterSpacing: "0.24em",
            textTransform: "uppercase", marginBottom: 26,
            "--stagger-delay": "100ms",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{
              display: "inline-block", width: 28, height: 1,
              background: "var(--cyan)",
              boxShadow: "0 0 8px var(--cyan)",
            }} />
            Mechanical Engineering · ETH Zürich
          </div>

          <h1 className="stagger-item" style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(52px, 6.5vw, 100px)",
            fontWeight: 600, lineHeight: 0.96,
            letterSpacing: "-0.032em",
            color: "var(--text)", margin: "0 0 32px",
            "--stagger-delay": "200ms",
          }}>
            Building things<br />
            that fly, move,<br />
            <span className="text-glow" style={{ color: "var(--cyan)", fontWeight: 400 }}>
              and think.
            </span>
          </h1>

          <p className="stagger-item" style={{
            fontSize: 16, lineHeight: 1.65,
            color: "var(--text-2)", maxWidth: 440, marginBottom: 44,
            "--stagger-delay": "300ms",
          }}>
            Lukas Gerster — mechanical engineering at ETH Zürich.
            Three project tracks: aerospace, robotics, software.
          </p>

          <div className="stagger-item" style={{ display: "flex", gap: 14, flexWrap: "wrap", "--stagger-delay": "400ms" }}>
            <button
              className="btn-haptic"
              onClick={() => { const el = document.getElementById("work-list"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.16em", textTransform: "uppercase",
                background: "var(--cyan)", color: "#040810",
                border: "none", padding: "13px 28px", borderRadius: 2,
                fontWeight: 700,
                boxShadow: "0 0 24px rgba(0,212,255,0.35)",
                transition: "box-shadow 200ms, opacity 180ms, transform 80ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,255,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 24px rgba(0,212,255,0.35)"; }}
            >
              View Work ↓
            </button>
            <button
              className="btn-haptic"
              onClick={() => onNav("cv")}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.16em", textTransform: "uppercase",
                background: "rgba(0,212,255,0.05)", color: "var(--cyan)",
                border: "1px solid rgba(0,212,255,0.35)", padding: "13px 28px", borderRadius: 2,
                transition: "border-color 180ms, box-shadow 180ms, background 180ms, transform 80ms",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.7)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(0,212,255,0.2)";
                e.currentTarget.style.background = "rgba(0,212,255,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "rgba(0,212,255,0.05)";
              }}
            >
              Curriculum Vitæ
            </button>
          </div>
        </div>

        {/* Bottom status bar */}
        <div style={{
          position: "relative", zIndex: 4,
          padding: "14px 60px",
          borderTop: "0.5px solid rgba(0,212,255,0.12)",
          background: "rgba(4,8,16,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          animation: "staggerIn 500ms var(--ease-out) 1.4s both",
        }}>
          <div style={{ display: "flex", gap: 40 }}>
            {[["TRACKS", "03"], ["DOF", "5"], ["PRINTERS", "2"]].map(([k, v]) => (
              <div key={k}>
                <div className="mono" style={{ fontSize: 8, color: "var(--text-4)", letterSpacing: "0.2em", marginBottom: 3 }}>{k}</div>
                <div className="mono" style={{ fontSize: 14, color: "var(--cyan)", letterSpacing: "0.05em", fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 9, color: "var(--text-4)", letterSpacing: "0.14em" }}>
            B. 2006 · WINTERTHUR
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="pulse" />
            <span className="mono" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>OPEN TO PROJECTS</span>
          </div>
        </div>
      </section>

      {/* ── WORK LIST ────────────────────────────────────────── */}
      <section id="work-list">
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "48px 44px 20px",
          borderBottom: "0.5px solid var(--rule)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              display: "inline-block", width: 16, height: 1,
              background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)",
            }} />
            <span className="eyebrow">Selected Work</span>
          </div>
          <span className="eyebrow">03 Projects</span>
        </div>

        {PROJECTS.map((p, i) => (
          <WorkRow
            key={p.id}
            project={p}
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
        padding: "12px 0", overflow: "hidden",
        background: "var(--bg-1)",
      }}>
        <div className="marquee-track mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span><span className="pulse" />OPEN TO PROJECTS</span>
              <span>47.4979° N / 8.7280° E</span>
              <span>ETH ZÜRICH '27</span>
              <span>CAD → PRINT → FLY → REBUILD</span>
              <span>PFADI BUBENBERG / CHAPPER</span>
              <span>5 DOF · CLOSED LOOP</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── SITE FOOTER ──────────────────────────────────────── */}
      <div style={{
        padding: "16px 44px", display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-mono)", fontSize: 9,
        color: "var(--text-4)", letterSpacing: "0.1em",
      }}>
        <span>© 2026 LUKAS GERSTER</span>
        <span>WINTERTHUR · ZÜRICH</span>
        <span
          style={{ cursor: "pointer", transition: "color 150ms" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--cyan)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-4)"; }}
          onClick={() => window.open("https://github.com/gersterl", "_blank")}
        >
          GITHUB ↗
        </span>
      </div>
    </div>
  );
}

function WorkRow({ project: p, isHovered, onHover, onLeave, onClick }) {
  const COLLAPSED = 96;
  const EXPANDED  = 236;

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
        display: "flex", alignItems: "flex-start", gap: 28,
        boxShadow: isHovered
          ? `inset 0 0 80px -24px rgba(${p.accentRgb},0.12), inset 4px 0 32px -16px rgba(${p.accentRgb},0.2)`
          : "none",
        background: isHovered ? `rgba(${p.accentRgb},0.04)` : "transparent",
        "--row-accent": p.accent,
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
              opacity: isHovered ? 0.08 : 0,
              filter: "grayscale(0.6)",
              transition: "opacity 500ms var(--ease-out)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, var(--bg) 0%, rgba(4,8,16,0.7) 60%, var(--bg) 100%)",
          }} />
        </div>
      )}

      {/* Number */}
      <div style={{
        position: "relative", zIndex: 1,
        fontFamily: "var(--font-mono)",
        fontSize: 40, fontWeight: 700,
        lineHeight: 1, paddingTop: 22,
        color: isHovered ? p.accent : "var(--text-4)",
        textShadow: isHovered ? `0 0 24px rgba(${p.accentRgb},0.6)` : "none",
        transition: "color 300ms var(--ease-out), text-shadow 300ms",
        letterSpacing: "-0.03em", flexShrink: 0, minWidth: 58,
      }}>
        {p.n}
      </div>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        paddingTop: 26, flex: 1,
        transform: isHovered ? "translateX(0)" : "translateX(-4px)",
        transition: "transform 300ms var(--ease-out)",
      }}>
        <div className="mono" style={{
          fontSize: 9, letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: isHovered ? p.accent : "var(--text-3)",
          transition: "color 300ms var(--ease-out)",
          marginBottom: 7,
        }}>
          {p.label}
        </div>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(20px, 2vw, 26px)",
          fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1,
          color: isHovered ? "var(--text)" : "var(--text-2)",
          transition: "color 300ms",
          marginBottom: 10,
        }}>
          {p.title}
        </div>

        {/* Expanded content */}
        <div style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 320ms var(--ease-out) ${isHovered ? "80ms" : "0ms"}, transform 320ms var(--ease-out) ${isHovered ? "80ms" : "0ms"}`,
          pointerEvents: isHovered ? "auto" : "none",
        }}>
          <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 }}>
            {p.desc}
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {p.tags.map((tag, j) => (
              <span key={j} className="mono" style={{
                fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "4px 10px",
                background: `rgba(${p.accentRgb},0.08)`,
                color: p.accent,
                borderRadius: 2,
                border: `0.5px solid rgba(${p.accentRgb},0.3)`,
                boxShadow: `0 0 8px rgba(${p.accentRgb},0.15)`,
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
        paddingTop: 28, flexShrink: 0,
        fontFamily: "var(--font-mono)", fontSize: 20,
        color: isHovered ? p.accent : "var(--text-4)",
        textShadow: isHovered ? `0 0 12px rgba(${p.accentRgb},0.5)` : "none",
        transform: isHovered ? "translateX(6px)" : "translateX(0)",
        transition: "color 300ms var(--ease-out), transform 300ms var(--ease-out), text-shadow 300ms",
      }}>
        →
      </div>
    </div>
  );
}

window.IndexPage = IndexPage;
