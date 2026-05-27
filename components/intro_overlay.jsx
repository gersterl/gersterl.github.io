/* global React */
const { useState, useEffect } = React;

/*
 * Vault retraction: panels are grouped into 5 concentric shells by distance
 * from screen center. Each shell retracts as one ring, 520ms after the
 * previous — giving a deliberate mechanical vault-opening sequence.
 *
 *   Shell 0  (dist < 0.80):  4 center panels          → starts at   0ms
 *   Shell 1  (dist < 1.60):  8 inner-ring panels       → starts at 520ms
 *   Shell 2  (dist < 2.20):  4 mid-corner panels       → starts at 1040ms
 *   Shell 3  (dist < 2.70):  4 side-extreme panels     → starts at 1560ms
 *   Shell 4  (dist ≥ 2.70):  4 outer corner panels     → starts at 2080ms
 */

const ROWS = 4, COLS = 6;
const CX = (COLS - 1) / 2;    // 2.5
const CY = (ROWS - 1) / 2;    // 1.5

const SHELL_THRESHOLDS = [0.80, 1.60, 2.20, 2.70];
const SHELL_GAP  = 150;   // ms between each shell firing
const PANEL_DUR  = 440;   // ms each panel takes to retract
const PANEL_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"; // spring — fast, decisive

function getShell(dist) {
  for (let i = 0; i < SHELL_THRESHOLDS.length; i++) {
    if (dist < SHELL_THRESHOLDS[i]) return i;
  }
  return SHELL_THRESHOLDS.length; // shell 4
}

const PANEL_BG = [
  "linear-gradient(138deg,#0A1020 0%,#0E1628 50%,#070D1A 100%)",
  "linear-gradient(122deg,#0C1222 0%,#111926 50%,#080F1C 100%)",
  "linear-gradient(152deg,#0B1120 0%,#0D1524 50%,#070C18 100%)",
  "linear-gradient(112deg,#091020 0%,#0C1522 50%,#060C18 100%)",
];

function IntroOverlay({ onComplete }) {
  const [surging,    setSurging]    = useState(false);
  const [retracting, setRetracting] = useState(false);
  const [dots,       setDots]       = useState(0);

  useEffect(() => {
    let fired = false;

    function startRetract() {
      if (fired) return;
      fired = true;
      clearInterval(dotTimer);
      setSurging(true);                        // reactor power surge
      setTimeout(() => setRetracting(true), 150); // 150ms surge before panels move
    }

    const dotTimer = setInterval(() => setDots(d => (d + 1) % 4), 380);
    const autoTimer = setTimeout(startRetract, 900);
    document.addEventListener("click", startRetract, { once: true });

    return () => {
      clearInterval(dotTimer);
      clearTimeout(autoTimer);
      document.removeEventListener("click", startRetract);
    };
  }, []);

  // Call onComplete after the last panel finishes
  useEffect(() => {
    if (!retracting) return;
    const lastShell   = SHELL_THRESHOLDS.length;           // 4
    const totalDelay  = lastShell * SHELL_GAP + PANEL_DUR + 250;
    const t = setTimeout(onComplete, totalDelay);
    return () => clearTimeout(t);
  }, [retracting, onComplete]);

  const reactorGlow = surging
    ? "drop-shadow(0 0 32px rgba(0,212,255,1.0)) drop-shadow(0 0 8px #fff)"
    : "drop-shadow(0 0 14px rgba(0,212,255,0.75))";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: retracting ? "transparent" : "#040810",
      transition: retracting ? "background 200ms ease 80ms" : "none",
      overflow: "hidden",
      cursor: retracting ? "default" : "pointer",
      pointerEvents: retracting ? "none" : "auto",
    }}>

      {/* Persistent HUD grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: [
          "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "80px 80px",
      }} />

      {/* ── Armor panels ─────────────────────────────────────── */}
      {Array.from({ length: ROWS * COLS }, (_, idx) => {
        const r   = Math.floor(idx / COLS);
        const c   = idx % COLS;
        const dx  = c - CX;
        const dy  = r - CY;
        const dist  = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const shell = getShell(dist);
        const delay = shell * SHELL_GAP;

        // Retraction: fly outward from center
        const tx  = retracting ? (Math.cos(angle) * 168).toFixed(1) : 0;
        const ty  = retracting ? (Math.sin(angle) * 168).toFixed(1) : 0;
        // Rotation based on horizontal quadrant
        const rot = retracting ? ((dx >= 0 ? 1 : -1) * 7) : 0;

        // Seam glow brightens during surge
        const seam = surging && !retracting
          ? "inset 0 0 10px rgba(0,212,255,0.32), 0 0 6px rgba(0,212,255,0.20)"
          : "inset 0 0 4px rgba(0,212,255,0.10)";

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left:   `${(c / COLS) * 100}%`,
              top:    `${(r / ROWS) * 100}%`,
              width:  `${100 / COLS + 0.2}%`,
              height: `${100 / ROWS + 0.2}%`,
              background: PANEL_BG[(r * COLS + c) % PANEL_BG.length],
              borderRight:  "0.5px solid rgba(0,212,255,0.22)",
              borderBottom: "0.5px solid rgba(0,212,255,0.22)",
              boxShadow: seam,
              zIndex: 5,
              willChange: "transform, opacity",
              transform: retracting
                ? `translate(${tx}vw, ${ty}vh) rotate(${rot}deg) scale(0.86)`
                : "translate(0,0) rotate(0) scale(1)",
              opacity: retracting ? 0 : 1,
              transition: retracting
                ? `transform ${PANEL_DUR}ms ${PANEL_EASE} ${delay}ms, opacity 340ms ease ${delay + 140}ms`
                : surging
                  ? "box-shadow 280ms ease-out"
                  : "none",
            }}
          >
            {/* Diagonal stripe texture */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(-45deg,rgba(0,212,255,0.025) 0,rgba(0,212,255,0.025) 1px,transparent 1px,transparent 14px)",
            }} />

            {/* Corner brackets */}
            <div style={{
              position: "absolute", top: 5, left: 5,
              width: 11, height: 11, pointerEvents: "none",
              borderTop:  `1px solid rgba(0,212,255,${surging ? 0.8 : 0.45})`,
              borderLeft: `1px solid rgba(0,212,255,${surging ? 0.8 : 0.45})`,
              transition: "border-color 280ms",
            }} />
            <div style={{
              position: "absolute", bottom: 5, right: 5,
              width: 11, height: 11, pointerEvents: "none",
              borderBottom: `1px solid rgba(0,212,255,${surging ? 0.8 : 0.45})`,
              borderRight:  `1px solid rgba(0,212,255,${surging ? 0.8 : 0.45})`,
              transition: "border-color 280ms",
            }} />

            {/* Shell label (very faint) */}
            <div style={{
              position: "absolute", bottom: 8, left: 8,
              fontFamily: "var(--font-mono)", fontSize: 6.5,
              color: "rgba(0,212,255,0.20)", letterSpacing: "0.08em",
              pointerEvents: "none", lineHeight: 1,
            }}>
              S{shell}·{String(r).padStart(2,"0")}{String(c).padStart(2,"0")}
            </div>
          </div>
        );
      })}

      {/* ── Central HUD ──────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 20,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 28, pointerEvents: "none",
        opacity: retracting ? 0 : 1,
        transition: "opacity 300ms ease",
      }}>

        {/* Arc reactor */}
        <svg
          viewBox="0 0 140 140"
          width="140" height="140"
          style={{
            filter: reactorGlow,
            transition: "filter 400ms ease-out",
            overflow: "visible",
          }}
        >
          {/* Static outer rings */}
          <circle cx="70" cy="70" r="65" fill="none" stroke="rgba(0,212,255,0.10)" strokeWidth="1" />
          <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(0,212,255,0.18)" strokeWidth="1" />

          {/* Rotating dashed ring — CW */}
          <g style={{ transformOrigin: "70px 70px", animation: "introCW 10s linear infinite" }}>
            <circle cx="70" cy="70" r="45" fill="none"
              stroke={surging ? "rgba(0,212,255,0.70)" : "rgba(0,212,255,0.38)"}
              strokeWidth="1.5" strokeDasharray="6 10"
              style={{ transition: "stroke 300ms" }} />
          </g>

          {/* Rotating dashed ring — CCW */}
          <g style={{ transformOrigin: "70px 70px", animation: "introCCW 6s linear infinite" }}>
            <circle cx="70" cy="70" r="34" fill="none"
              stroke={surging ? "rgba(0,212,255,0.90)" : "rgba(0,212,255,0.58)"}
              strokeWidth="1.5" strokeDasharray="3 6"
              style={{ transition: "stroke 300ms" }} />
          </g>

          {/* Solid inner ring */}
          <circle cx="70" cy="70" r="24" fill="none"
            stroke={surging ? "rgba(0,212,255,1.0)" : "rgba(0,212,255,0.80)"}
            strokeWidth="2" style={{ transition: "stroke 300ms" }} />

          {/* Core plate */}
          <circle cx="70" cy="70" r="17"
            fill={surging ? "rgba(0,212,255,0.20)" : "rgba(0,212,255,0.10)"}
            stroke={surging ? "#fff" : "rgba(0,212,255,0.95)"}
            strokeWidth="2.5" style={{ transition: "fill 300ms, stroke 300ms" }} />

          {/* Energy fill */}
          <circle cx="70" cy="70" r="10"
            fill={surging ? "rgba(0,212,255,0.85)" : "rgba(0,212,255,0.40)"}
            style={{ transition: "fill 300ms" }} />

          {/* Hot core */}
          <circle cx="70" cy="70" r="5" fill={surging ? "#fff" : "#00D4FF"}
            style={{ transition: "fill 300ms" }} />

          {/* Cardinal chevrons */}
          <polygon points="70,25 74.5,37 65.5,37"
            fill={surging ? "rgba(255,255,255,0.9)" : "rgba(0,212,255,0.75)"}
            style={{ transition: "fill 300ms" }} />
          <polygon points="70,115 74.5,103 65.5,103"
            fill={surging ? "rgba(255,255,255,0.9)" : "rgba(0,212,255,0.75)"}
            style={{ transition: "fill 300ms" }} />
          <polygon points="25,70 37,65.5 37,74.5"
            fill={surging ? "rgba(255,255,255,0.9)" : "rgba(0,212,255,0.75)"}
            style={{ transition: "fill 300ms" }} />
          <polygon points="115,70 103,65.5 103,74.5"
            fill={surging ? "rgba(255,255,255,0.9)" : "rgba(0,212,255,0.75)"}
            style={{ transition: "fill 300ms" }} />
        </svg>

        {/* Identity */}
        <div style={{ textAlign: "center" }}>
          <div className="mono" style={{
            fontSize: 22, letterSpacing: "0.40em", marginBottom: 10,
            fontWeight: 500,
            color: surging ? "#ffffff" : "#E4F0FF",
            textShadow: surging ? "0 0 20px rgba(0,212,255,0.9)" : "none",
            transition: "color 300ms, text-shadow 300ms",
          }}>
            LUKAS GERSTER
          </div>
          <div className="mono" style={{
            fontSize: 9, letterSpacing: "0.28em",
            color: surging ? "#00D4FF" : "rgba(0,212,255,0.75)",
            transition: "color 300ms",
          }}>
            MECHANICAL ENGINEERING · ETH ZÜRICH
          </div>
        </div>

        {/* System status bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 268 }}>
          {[
            { label: "SYSTEMS",      delay: 0   },
            { label: "MOTION STACK", delay: 260 },
            { label: "CAD PIPELINE", delay: 520 },
          ].map(({ label, delay }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="mono" style={{
                fontSize: 8, letterSpacing: "0.14em", width: 88, flexShrink: 0,
                color: "rgba(228,240,255,0.38)",
              }}>
                {label}
              </span>
              <div style={{ flex: 1, height: 2, background: "rgba(0,212,255,0.10)", borderRadius: 1, overflow: "hidden" }}>
                <div className="intro-bar" style={{ animationDelay: `${delay}ms` }} />
              </div>
              <span className="mono" style={{ fontSize: 8, color: "#00D4FF", letterSpacing: "0.1em" }}>OK</span>
            </div>
          ))}
        </div>

        {/* Shell countdown (changes when surging) */}
        <div className="mono" style={{
          fontSize: 9, letterSpacing: "0.24em",
          color: surging ? "rgba(0,212,255,0.9)" : "rgba(228,240,255,0.30)",
          transition: "color 200ms",
        }}>
          {surging ? "DEACTIVATING ARMOR ▸" : ("INITIALIZING" + ".".repeat(dots))}
        </div>

        {/* Skip hint */}
        <div className="mono" style={{
          position: "absolute", bottom: 32,
          fontSize: 8, color: "rgba(228,240,255,0.20)", letterSpacing: "0.20em",
        }}>
          CLICK ANYWHERE TO SKIP
        </div>
      </div>
    </div>
  );
}

window.IntroOverlay = IntroOverlay;
