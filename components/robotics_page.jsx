/* global React, Icon, Footer */

const { useState: useStateRobo } = React;

const ROBO_VERSIONS = {
  1: {
    n: "V1", year: "2024", dof: "3 DOF", pillLabel: "BLDC",
    label: "BLDC · CUSTOM GEARBOX · 3 DOF",
    title: "Brushless, direct ambition.",
    body: "First attempt at the arm. BLDC motors driving a self-designed reduction gearbox. The motors were efficient and fast, the gearbox geometry worked — but even with the reduction, peak torque wasn't enough to hold the arm extended under load.",
    actuator: "BLDC",
    reduction: "Custom gearbox",
    verdictLabel: "KILLED BY",
    verdictValue: "Insufficient torque",
    verdictColor: "var(--amber)",
    lesson: "Direct-drive BLDCs don't beat physics. A small motor with a small gearbox is still a small motor.",
    trackPct: 16.67,
    image: "assets/arm-v1.png",
    imageNote: "Topology-optimised structure. Generative geometry hiding a fundamentally undersized actuator.",
  },
  2: {
    n: "V2", year: "2024", dof: "3 DOF", pillLabel: "Cycloidal",
    label: "NEMA 17 · CUSTOM CYCLOIDAL · 3 DOF",
    title: "Designed and printed my own reducers.",
    body: "Switched to NEMA 17 steppers — the torque problem was solved. The reduction came from cycloidal drives I designed and 3D-printed in-house. The math worked, the geometry was right. But the parts had too much backlash: FDM tolerances couldn't hold the precision the cycloidal profile demands.",
    actuator: "NEMA 17",
    reduction: "Custom cycloidal",
    verdictLabel: "KILLED BY",
    verdictValue: "FDM backlash",
    verdictColor: "var(--amber)",
    lesson: "A correctly designed mechanism is worthless if you can't manufacture it to tolerance.",
    trackPct: 50,
    image: "assets/arm-v2.png",
    imageNote: "Cleaner volumes, printed cycloidal reducers inside. Geometry promised more than FDM could deliver.",
  },
  3: {
    n: "V3", year: "2025", dof: "5 DOF", pillLabel: "Planetary",
    label: "NEMA 17 · COTS PLANETARY · 5 DOF",
    title: "Bought the gearboxes. Built the rest.",
    body: "Replaced the printed cycloidals with off-the-shelf planetary gearboxes and finally pushed past 3 DOF — V3 has all five joints I originally wanted. Same NEMA 17 motors, but now with sub-arcmin backlash and predictable torque curves. AS5600 absolute encoders went on each joint for closed-loop position feedback. The structure got simpler too: truss base, exposed transmission, no more decorative geometry.",
    actuator: "NEMA 17",
    reduction: "Planetary (COTS)",
    verdictLabel: "STATUS",
    verdictValue: "Build target",
    verdictColor: "#6FBA8A",
    lesson: "Sometimes the right engineering decision is to stop engineering and buy the part.",
    trackPct: 83.33,
    image: "assets/arm-v3.png",
    imageNote: "Truss base, exposed transmission, off-the-shelf gearboxes. Honest, simple, moves.",
  },
};

function RoboticsPage({ onNav }) {
  const [v, setV] = useStateRobo(1);
  const cur = ROBO_VERSIONS[v];

  return (
    <div className="page" style={{ color: "var(--text)" }}>
      <div style={{ height: 57 }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{
        padding: "60px 40px 48px",
        background: "var(--bg-1)",
        borderBottom: "0.5px solid var(--rule)",
      }}>
        <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 20 }}>
          02 / Robotics
        </div>
        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(44px, 5.8vw, 76px)",
          fontWeight: 500, lineHeight: 1.02,
          letterSpacing: "-0.028em", margin: "0 0 24px",
        }}>
          One arm,<br />
          <span style={{ color: "var(--amber)", fontWeight: 400 }}>three drivetrains.</span>
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--text-2)", maxWidth: 580 }}>
          Three iterations, each rebuilt around a different actuation strategy. V1 and V2 stuck at 3 DOF — each killed by a specific failure. V3 finally reached the 5 DOF I started out wanting.
        </p>
      </div>

      {/* ── VERSION SELECTOR ──────────────────────────────────── */}
      <div style={{ padding: "44px 40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <span className="eyebrow">Select iteration</span>
          <span className="eyebrow">2024 — 2025</span>
        </div>

        <div style={{ position: "relative", padding: "0 18px 32px" }}>
          {/* Track background */}
          <div style={{
            position: "absolute", left: 18, right: 18, top: 17,
            height: 1, background: "var(--rule-2)",
          }} />
          {/* Track fill */}
          <div style={{
            position: "absolute", left: 18, top: 17, height: 1,
            background: "var(--amber)",
            transition: "width 400ms var(--ease-out)",
            width: `calc((100% - 36px) * ${cur.trackPct} / 100)`,
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {[1, 2, 3].map(n => {
              const ver = ROBO_VERSIONS[n];
              const active = v === n;
              return (
                <button
                  key={n}
                  className="ver-tab"
                  onClick={() => setV(n)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
                >
                  <div className="ver-dot" style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: active ? "var(--amber)" : "var(--bg-2)",
                    border: `1.5px solid ${active ? "var(--amber)" : "var(--rule-2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 240ms var(--ease-out)",
                  }}>
                    <span className="mono" style={{
                      fontSize: 11, letterSpacing: "0.05em",
                      color: active ? "var(--bg)" : "var(--text-3)",
                    }}>{ver.n}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div className="mono" style={{
                      fontSize: 10, letterSpacing: "0.1em",
                      color: active ? "var(--amber)" : "var(--text-3)",
                    }}>{ver.year} · {ver.dof}</div>
                    <div style={{
                      fontSize: 13, fontStyle: "italic", marginTop: 2,
                      color: active ? "var(--text-2)" : "var(--text-4)",
                    }}>{ver.pillLabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DETAIL PANEL ─────────────────────────────────────── */}
      <div style={{ padding: "0 40px 32px" }}>
        <div key={v} style={{
          background: "var(--bg-2)", border: "0.5px solid var(--rule)",
          borderRadius: "var(--r-lg)", padding: 32,
          animation: "pageIn 320ms var(--ease-out)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 36, alignItems: "start" }}>
            {/* Photo */}
            <div style={{
              borderRadius: "var(--r-md)", aspectRatio: "1",
              overflow: "hidden", position: "relative",
              background: "var(--bg-3)", border: "0.5px solid var(--rule)",
            }}>
              <img
                src={cur.image}
                alt={`Render of ${cur.n} of the robotic arm`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="mono" style={{
                position: "absolute", left: 12, bottom: 12, right: 12,
                fontSize: 9, color: "rgba(237,232,222,0.6)", letterSpacing: "0.1em",
                textTransform: "uppercase", lineHeight: 1.4,
              }}>
                Fusion 360 render · {cur.n}
              </div>
            </div>

            {/* Content */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                <span className="mono" style={{
                  fontSize: 11, color: "var(--bg)", letterSpacing: "0.14em",
                  background: "var(--amber)", padding: "4px 10px", borderRadius: 999,
                  fontWeight: 500,
                }}>{cur.n}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.08em" }}>{cur.label}</span>
              </div>

              <h3 style={{
                fontSize: 30, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.1,
                margin: "0 0 14px",
              }}>
                {cur.title}
              </h3>

              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--text-2)", marginBottom: 24 }}>
                {cur.body}
              </p>

              <div className="spec-grid" style={{ marginBottom: 24 }}>
                <div>
                  <div className="spec-label">Actuator</div>
                  <div className="spec-value">{cur.actuator}</div>
                </div>
                <div>
                  <div className="spec-label">Reduction</div>
                  <div className="spec-value">{cur.reduction}</div>
                </div>
                <div>
                  <div className="spec-label">{cur.verdictLabel}</div>
                  <div className="spec-value" style={{ color: cur.verdictColor }}>{cur.verdictValue}</div>
                </div>
              </div>

              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Lesson</div>
                <p style={{ fontSize: 17, lineHeight: 1.5, fontStyle: "italic", fontWeight: 300, color: "var(--text)" }}>
                  {cur.lesson}
                </p>
              </div>
            </div>
          </div>

          {/* V2 gearbox cross-section */}
          {v === 2 && (
            <div style={{
              marginTop: 28, paddingTop: 24, borderTop: "0.5px solid var(--rule)",
              display: "grid", gridTemplateColumns: "260px 1fr", gap: 36, alignItems: "center",
            }}>
              <div style={{
                background: "var(--bg-3)", borderRadius: "var(--r-md)", overflow: "hidden",
                border: "0.5px solid var(--rule)", padding: 8,
              }}>
                <img src="assets/gearbox-section.png" alt="Cross-section of the custom cycloidal gearbox" style={{ width: "100%" }} />
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Gearbox cross-section</div>
                <h4 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.2, margin: "0 0 10px" }}>
                  Cycloidal disks, eccentric input, ring of pins.
                </h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>
                  Two cycloidal disks 180° out of phase, eccentric on the input shaft. Output rolls off pins in the housing. The geometry is correct — the failure mode was the printer, not the design.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SHARED STACK BAR ─────────────────────────────────── */}
      <div style={{ padding: "0 40px 32px" }}>
        <div style={{
          background: "var(--bg-2)", border: "0.5px solid var(--rule-2)",
          borderRadius: "var(--r-lg)", padding: "24px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Shared across versions</div>
            <p style={{ fontSize: 18, lineHeight: 1.35, fontStyle: "italic", fontWeight: 300 }}>
              <span style={{ color: "var(--amber)" }}>Fusion 360</span> for CAD. ESP32 for control.
              Closed-loop position sense added on V3.
            </p>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>
            V1 → V2 → V3
          </div>
        </div>
      </div>

      {/* ── PROCESS LOG ──────────────────────────────────────── */}
      <div style={{ padding: "0 40px 36px" }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Process log</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { t: "CAD",         d: "Fusion 360. Parametric. Every dimension drives off a sketch driver." },
            { t: "Print farm",  d: "Bambu Lab X1E for structural parts, Ender 3 V3 SE for prototypes and fixtures." },
            { t: "Control",     d: "ESP32. Per-joint step/dir for steppers, PWM for BLDCs. Streams from a host script." },
            { t: "Position sense", d: "V1/V2 ran open-loop on stepper counts. V3 added AS5600 magnetic absolute encoders on every joint — closed loop, no homing dance on boot." },
          ].map((it, i) => (
            <div key={i} className="card-lift" style={{
              background: "var(--bg-2)", border: "0.5px solid var(--rule)",
              borderRadius: "var(--r-md)", padding: 18,
            }}>
              <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 10 }}>0{i+1}</div>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8, letterSpacing: "-0.01em" }}>{it.t}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--text-2)" }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer
        left="← Aerospace"
        center="02 / Robotics"
        right="Software →"
        onLeft={() => onNav("aerospace")}
        onRight={() => onNav("software")}
      />
    </div>
  );
}

window.RoboticsPage = RoboticsPage;
