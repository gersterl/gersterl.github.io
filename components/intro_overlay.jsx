/* global React */
const { useState, useEffect } = React;

const ROWS = 4;
const COLS = 6;
const CX = (COLS - 1) / 2;   // 2.5
const CY = (ROWS - 1) / 2;   // 1.5

const PANEL_GRADIENTS = [
  "linear-gradient(135deg,#0A1020 0%,#0E1628 50%,#070D1A 100%)",
  "linear-gradient(120deg,#0C1222 0%,#111926 50%,#080F1C 100%)",
  "linear-gradient(150deg,#0B1120 0%,#0D1524 50%,#070C18 100%)",
  "linear-gradient(110deg,#091020 0%,#0C1522 50%,#060C18 100%)",
];

function IntroOverlay({ onComplete }) {
  const [retracting, setRetracting] = useState(false);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    let didRetract = false;

    function startRetract() {
      if (didRetract) return;
      didRetract = true;
      setRetracting(true);
      setTimeout(onComplete, 1600);
    }

    const dotTimer = setInterval(() => setDots(d => (d + 1) % 4), 380);
    const autoTimer = setTimeout(startRetract, 2200);

    function handleClick() { startRetract(); }
    document.addEventListener("click", handleClick, { once: true });

    return () => {
      clearInterval(dotTimer);
      clearTimeout(autoTimer);
      document.removeEventListener("click", handleClick);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#040810", overflow: "hidden",
      cursor: retracting ? "default" : "pointer",
    }}>

      {/* HUD grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: [
          "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "80px 80px",
      }} />

      {/* Armor panels — 6×4 grid */}
      {Array.from({ length: ROWS * COLS }, (_, idx) => {
        const r = Math.floor(idx / COLS);
        const c = idx % COLS;
        const dx = c - CX;
        const dy = r - CY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const delay = retracting ? Math.round(dist * 52) : 0;
        const tx = retracting ? (Math.cos(angle) * 165).toFixed(1) : 0;
        const ty = retracting ? (Math.sin(angle) * 165).toFixed(1) : 0;
        const rot = retracting ? ((c < COLS / 2 ? -1 : 1) * 6) : 0;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${(c / COLS) * 100}%`,
              top: `${(r / ROWS) * 100}%`,
              width: `${100 / COLS + 0.2}%`,
              height: `${100 / ROWS + 0.2}%`,
              background: PANEL_GRADIENTS[(r * COLS + c) % PANEL_GRADIENTS.length],
              borderRight: "0.5px solid rgba(0,212,255,0.22)",
              borderBottom: "0.5px solid rgba(0,212,255,0.22)",
              zIndex: 5,
              willChange: "transform, opacity",
              transform: retracting
                ? `translate(${tx}vw, ${ty}vh) rotate(${rot}deg) scale(0.88)`
                : "translate(0,0) rotate(0) scale(1)",
              opacity: retracting ? 0 : 1,
              transition: retracting
                ? `transform 680ms cubic-bezier(0.55,0,1,0.45) ${delay}ms, opacity 360ms ease ${delay + 80}ms`
                : "none",
            }}
          >
            {/* Diagonal stripe texture */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(-45deg,rgba(0,212,255,0.025) 0,rgba(0,212,255,0.025) 1px,transparent 1px,transparent 14px)",
            }} />

            {/* Seam glow */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              boxShadow: "inset 0 0 4px rgba(0,212,255,0.10)",
            }} />

            {/* Corner bracket — top-left */}
            <div style={{
              position: "absolute", top: 6, left: 6,
              width: 12, height: 12, pointerEvents: "none",
              borderTop: "1px solid rgba(0,212,255,0.48)",
              borderLeft: "1px solid rgba(0,212,255,0.48)",
            }} />
            {/* Corner bracket — bottom-right */}
            <div style={{
              position: "absolute", bottom: 6, right: 6,
              width: 12, height: 12, pointerEvents: "none",
              borderBottom: "1px solid rgba(0,212,255,0.48)",
              borderRight: "1px solid rgba(0,212,255,0.48)",
            }} />

            {/* Panel ID mark */}
            <div style={{
              position: "absolute", bottom: 10, left: 10,
              fontFamily: "var(--font-mono)", fontSize: 7,
              color: "rgba(0,212,255,0.22)", letterSpacing: "0.1em",
              pointerEvents: "none",
            }}>
              {String(r).padStart(2,"0")}.{String(c).padStart(2,"0")}
            </div>
          </div>
        );
      })}

      {/* Central HUD — arc reactor + boot sequence */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 20,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 28, pointerEvents: "none",
        opacity: retracting ? 0 : 1,
        transition: "opacity 350ms ease",
      }}>

        {/* Arc reactor */}
        <svg
          viewBox="0 0 140 140"
          width="140" height="140"
          style={{ filter: "drop-shadow(0 0 16px rgba(0,212,255,0.8))", overflow: "visible" }}
        >
          {/* Outer rings (static) */}
          <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(0,212,255,0.10)" strokeWidth="1" />
          <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(0,212,255,0.18)" strokeWidth="1" />

          {/* Outer dashed ring — spins CW */}
          <g style={{ transformOrigin: "70px 70px", animation: "introCW 10s linear infinite" }}>
            <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(0,212,255,0.38)" strokeWidth="1.5" strokeDasharray="6 10" />
          </g>

          {/* Inner dashed ring — spins CCW */}
          <g style={{ transformOrigin: "70px 70px", animation: "introCCW 6s linear infinite" }}>
            <circle cx="70" cy="70" r="33" fill="none" stroke="rgba(0,212,255,0.62)" strokeWidth="1.5" strokeDasharray="3 6" />
          </g>

          {/* Solid inner ring */}
          <circle cx="70" cy="70" r="23" fill="none" stroke="rgba(0,212,255,0.82)" strokeWidth="2" />

          {/* Core plate */}
          <circle cx="70" cy="70" r="16" fill="rgba(0,212,255,0.10)" stroke="rgba(0,212,255,0.95)" strokeWidth="2.5" />

          {/* Energy fill */}
          <circle cx="70" cy="70" r="9" fill="rgba(0,212,255,0.45)" />

          {/* Hot core */}
          <circle cx="70" cy="70" r="5" fill="#00D4FF" />

          {/* Cardinal point chevrons */}
          <polygon points="70,26 74.5,38 65.5,38" fill="rgba(0,212,255,0.78)" />
          <polygon points="70,114 74.5,102 65.5,102" fill="rgba(0,212,255,0.78)" />
          <polygon points="26,70 38,65.5 38,74.5" fill="rgba(0,212,255,0.78)" />
          <polygon points="114,70 102,65.5 102,74.5" fill="rgba(0,212,255,0.78)" />
        </svg>

        {/* Identity */}
        <div style={{ textAlign: "center" }}>
          <div
            className="mono"
            style={{ fontSize: 22, letterSpacing: "0.40em", color: "#E4F0FF", marginBottom: 10, fontWeight: 500 }}
          >
            LUKAS GERSTER
          </div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.28em", color: "#00D4FF" }}>
            MECHANICAL ENGINEERING · ETH ZÜRICH
          </div>
        </div>

        {/* System checks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 268 }}>
          {[
            { label: "SYSTEMS",      delay: 0 },
            { label: "MOTION STACK", delay: 260 },
            { label: "CAD PIPELINE", delay: 520 },
          ].map(({ label, delay }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="mono" style={{ fontSize: 8, color: "rgba(228,240,255,0.38)", letterSpacing: "0.14em", width: 88, flexShrink: 0 }}>
                {label}
              </span>
              <div style={{ flex: 1, height: 2, background: "rgba(0,212,255,0.10)", borderRadius: 1, overflow: "hidden" }}>
                <div className="intro-bar" style={{ animationDelay: `${delay}ms` }} />
              </div>
              <span className="mono" style={{ fontSize: 8, color: "#00D4FF", letterSpacing: "0.1em" }}>OK</span>
            </div>
          ))}
        </div>

        {/* Boot status */}
        <div className="mono" style={{ fontSize: 9, color: "rgba(228,240,255,0.30)", letterSpacing: "0.24em" }}>
          {"INITIALIZING" + ".".repeat(dots)}
        </div>

        {/* Skip */}
        <div
          className="mono"
          style={{
            position: "absolute", bottom: 32,
            fontSize: 8, color: "rgba(228,240,255,0.20)",
            letterSpacing: "0.20em",
          }}
        >
          CLICK ANYWHERE TO SKIP
        </div>
      </div>
    </div>
  );
}

window.IntroOverlay = IntroOverlay;
