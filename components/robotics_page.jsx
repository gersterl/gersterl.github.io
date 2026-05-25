/* global React, Icon, Footer */
// Robotics — corrected. V1/V2 = 3 DOF, V3 = 5 DOF. No IK — ESP32 + AS5600 closed loop.

const { useState: useStateRobo } = React;

const ROBO_VERSIONS = {
  1: {
    n: "V1", year: "2024", dof: "3 DOF",
    pillLabel: "BLDC",
    label: "BLDC · CUSTOM GEARBOX · 3 DOF",
    title: "Brushless, direct ambition.",
    body: "First attempt at the arm. BLDC motors driving a self-designed reduction gearbox. The motors were efficient and fast, the gearbox geometry worked — but even with the reduction, peak torque wasn't enough to hold the arm extended under load.",
    actuator: "BLDC",
    reduction: "Custom gearbox",
    verdictLabel: "KILLED BY",
    verdictValue: "Insufficient torque",
    verdictColor: "var(--aero-accent)",
    lesson: "Direct-drive BLDCs don't beat physics. A small motor with a small gearbox is still a small motor.",
    trackPct: "16.67%",
    image: "assets/arm-v1.png",
    imageNote: "Topology-optimised structure. Generative geometry hiding a fundamentally undersized actuator.",
  },
  2: {
    n: "V2", year: "2024", dof: "3 DOF",
    pillLabel: "Cycloidal",
    label: "NEMA 17 · CUSTOM CYCLOIDAL · 3 DOF",
    title: "Designed and printed my own reducers.",
    body: "Switched to NEMA 17 steppers — the torque problem was solved. The reduction came from cycloidal drives I designed and 3D-printed in-house. The math worked, the geometry was right. But the parts had too much backlash: FDM tolerances couldn't hold the precision the cycloidal profile demands.",
    actuator: "NEMA 17",
    reduction: "Custom cycloidal",
    verdictLabel: "KILLED BY",
    verdictValue: "FDM backlash",
    verdictColor: "var(--aero-accent)",
    lesson: "A correctly designed mechanism is worthless if you can't manufacture it to tolerance.",
    trackPct: "50%",
    image: "assets/arm-v2.png",
    imageNote: "Cleaner volumes, printed cycloidal reducers inside. Geometry promised more than FDM could deliver.",
  },
  3: {
    n: "V3", year: "2025", dof: "5 DOF",
    pillLabel: "Planetary",
    label: "NEMA 17 · COTS PLANETARY · 5 DOF",
    title: "Bought the gearboxes. Built the rest.",
    body: "Replaced the printed cycloidals with off-the-shelf planetary gearboxes and finally pushed past 3 DOF — V3 has all five joints I originally wanted. Same NEMA 17 motors, but now with sub-arcmin backlash and predictable torque curves. AS5600 absolute encoders went on each joint for closed-loop position feedback. The structure got simpler too: truss base, exposed transmission, no more decorative geometry.",
    actuator: "NEMA 17",
    reduction: "Planetary (COTS)",
    verdictLabel: "STATUS",
    verdictValue: "→ Build target",
    verdictColor: "var(--robo-ink)",
    lesson: "Sometimes the right engineering decision is to stop engineering and buy the part.",
    trackPct: "83.33%",
    image: "assets/arm-v3.png",
    imageNote: "Truss base, exposed transmission, off-the-shelf gearboxes. Honest, simple, moves.",
  },
};

function RoboticsPage({ onNav }) {
  const [v, setV] = useStateRobo(1);
  const cur = ROBO_VERSIONS[v];

  return (
    <div className="page" data-screen-label="03 Robotics" style={{ color: "var(--ink)" }}>

      {/* HERO BAND */}
      <div style={{ padding: "56px 28px 44px", background: "var(--robo)", borderBottom: "0.5px solid rgba(15,110,86,0.3)" }}>
        <div className="eyebrow" style={{ color: "var(--robo-ink)", marginBottom: 18 }}>— 02 / ROBOTICS</div>
        <h1 className="serif" style={{
          fontSize: 76, lineHeight: 0.94, letterSpacing: "-0.028em", margin: "0 0 24px", color: "var(--robo-deep)",
        }}>
          One arm,<br /><span className="italic">three drivetrains.</span>
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--robo-ink)", maxWidth: 580, margin: 0 }}>
          Three iterations, each rebuilt around a different actuation strategy. V1 and V2 stuck at 3 DOF — each killed by a specific failure. V3 finally reached the 5 DOF I started out wanting.
        </p>
      </div>

      {/* SLIDER */}
      <div style={{ padding: "40px 28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
          <div className="eyebrow" style={{ color: "rgba(28,27,23,0.5)" }}>— SELECT ITERATION</div>
          <div className="mono" style={{ fontSize: 10, color: "rgba(28,27,23,0.5)", letterSpacing: "0.1em" }}>2024 — 2025</div>
        </div>

        <div style={{ position: "relative", padding: "0 18px 28px" }}>
          <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 1, background: "rgba(28,27,23,0.2)" }}/>
          <div style={{
            position: "absolute", left: 18, top: 18, height: 1, background: "var(--robo-ink)",
            transition: "width 400ms cubic-bezier(.2,.6,.2,1)", width: `calc((100% - 36px) * ${cur.trackPct.replace("%","")} / 100)`,
          }}/>
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {[1,2,3].map(n => {
              const ver = ROBO_VERSIONS[n];
              const active = v === n;
              return (
                <button
                  key={n}
                  className="ver-tab"
                  onClick={() => setV(n)}
                  style={{
                    background: "transparent", border: "none", padding: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  }}
                >
                  <div className="ver-dot" style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: active ? "var(--robo-ink)" : "var(--cream)",
                    border: `2px solid ${active ? "var(--robo-ink)" : "rgba(8,66,58,0.4)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 250ms ease",
                  }}>
                    <span className="mono" style={{ fontSize: 11, color: active ? "var(--cream)" : "rgba(8,66,58,0.7)", letterSpacing: "0.05em" }}>{ver.n}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div className="mono" style={{ fontSize: 10, color: active ? "var(--robo-ink)" : "rgba(8,66,58,0.55)", letterSpacing: "0.1em" }}>{ver.year} · {ver.dof}</div>
                    <div className="serif italic" style={{ fontSize: 14, color: active ? "rgba(28,27,23,0.85)" : "rgba(28,27,23,0.5)", marginTop: 2 }}>{ver.pillLabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAIL PANEL */}
      <div style={{ padding: "0 28px 32px" }}>
        <div key={v} style={{
          background: "#FFFFFF", border: "0.5px solid rgba(28,27,23,0.15)",
          borderRadius: "var(--border-radius-lg)", padding: 32,
          animation: "pageIn 320ms cubic-bezier(.2,.6,.2,1)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 36, alignItems: "start" }}>
            <div style={{
              background: "#EFE9DB", borderRadius: 8, aspectRatio: "1",
              overflow: "hidden", position: "relative",
              border: "0.5px solid rgba(28,27,23,0.08)",
            }}>
              <img
                src={cur.image}
                alt={`Render of ${cur.n} of the robotic arm`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div className="mono" style={{
                position: "absolute", left: 12, bottom: 12, right: 12,
                fontSize: 9, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em",
                textTransform: "uppercase", textShadow: "0 1px 4px rgba(0,0,0,0.6)", lineHeight: 1.4,
              }}>
                Fusion 360 render · {cur.n}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <span className="mono" style={{
                  fontSize: 11, color: "var(--robo-ink)", letterSpacing: "0.15em",
                  background: "var(--robo)", padding: "4px 10px", borderRadius: 999,
                }}>{cur.n}</span>
                <span className="mono" style={{ fontSize: 11, color: "rgba(28,27,23,0.5)", letterSpacing: "0.08em" }}>{cur.label}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 32, margin: "0 0 14px", color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1.1 }}>
                {cur.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(28,27,23,0.78)", margin: "0 0 22px", textWrap: "pretty" }}>
                {cur.body}
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                padding: "16px 0", borderTop: "0.5px solid rgba(28,27,23,0.12)", borderBottom: "0.5px solid rgba(28,27,23,0.12)",
              }}>
                <div>
                  <div className="spec-label">ACTUATOR</div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink)" }}>{cur.actuator}</div>
                </div>
                <div>
                  <div className="spec-label">REDUCTION</div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink)" }}>{cur.reduction}</div>
                </div>
                <div>
                  <div className="spec-label">{cur.verdictLabel}</div>
                  <div className="mono" style={{ fontSize: 13, color: cur.verdictColor }}>{cur.verdictValue}</div>
                </div>
              </div>

              <div style={{ marginTop: 22 }}>
                <div className="eyebrow" style={{ color: "rgba(28,27,23,0.5)", marginBottom: 10 }}>— LESSON</div>
                <p className="serif italic" style={{ fontSize: 18, lineHeight: 1.45, color: "var(--ink)", margin: 0, textWrap: "balance" }}>
                  {cur.lesson}
                </p>
              </div>
            </div>
          </div>

          {/* V2-only: gearbox cross-section spotlight */}
          {v === 2 && (
            <div style={{
              marginTop: 28, paddingTop: 24, borderTop: "0.5px solid rgba(28,27,23,0.12)",
              display: "grid", gridTemplateColumns: "260px 1fr", gap: 36, alignItems: "center",
            }}>
              <div style={{
                background: "#FFFFFF", borderRadius: 8, overflow: "hidden",
                border: "0.5px solid rgba(28,27,23,0.1)", padding: 8,
              }}>
                <img src="assets/gearbox-section.png" alt="Cross-section of the custom cycloidal gearbox" style={{ width: "100%", display: "block" }}/>
              </div>
              <div>
                <div className="eyebrow" style={{ color: "rgba(28,27,23,0.5)", marginBottom: 10 }}>— GEARBOX CROSS-SECTION</div>
                <h4 className="serif" style={{ fontSize: 22, margin: "0 0 10px", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  Cycloidal disks, eccentric input, ring of pins.
                </h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(28,27,23,0.72)", margin: 0, textWrap: "pretty" }}>
                  Two cycloidal disks 180° out of phase, eccentric on the input shaft. Output rolls off pins in the housing. The geometry is correct — the failure mode was the printer, not the design.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SHARED-ACROSS-VERSIONS BAR — corrected: no IK, ESP32 + AS5600 closed-loop */}
      <div style={{ padding: "0 28px 32px" }}>
        <div style={{
          background: "var(--ink)", color: "var(--cream)", borderRadius: "var(--border-radius-lg)",
          padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.12em", marginBottom: 6 }}>— SHARED ACROSS VERSIONS</div>
            <div className="serif italic" style={{ fontSize: 22, lineHeight: 1.25 }}>
              <span style={{ color: "var(--robo)" }}>Fusion 360</span> for CAD. ESP32 for control.<br/>Closed-loop position sense added on V3.
            </div>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.14em" }}>
            01 → 02 → 03
          </div>
        </div>
      </div>

      {/* PROCESS SHEET — corrected stack */}
      <div style={{ padding: "0 28px 36px" }}>
        <div className="eyebrow" style={{ color: "rgba(28,27,23,0.5)", marginBottom: 14 }}>— PROCESS LOG</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { t: "CAD", d: "Fusion 360. Parametric. Every dimension drives off a sketch driver." },
            { t: "Print farm", d: "Bambu Lab X1E for structural parts, Ender 3 V3 SE for prototypes and fixtures." },
            { t: "Control", d: "ESP32. Per-joint step/dir for steppers, PWM for BLDCs. Streams from a host script." },
            { t: "Position sense", d: "V1/V2 ran open-loop on stepper counts. V3 added AS5600 magnetic absolute encoders on every joint — closed loop, no homing dance on boot." },
          ].map((it, i) => (
            <div key={i} style={{
              background: "#FFFFFF", border: "0.5px solid rgba(28,27,23,0.12)",
              borderRadius: "var(--border-radius-lg)", padding: 18,
            }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--robo-ink)", letterSpacing: "0.12em", marginBottom: 8 }}>
                — 0{i+1}
              </div>
              <div className="serif" style={{ fontSize: 18, marginBottom: 6, letterSpacing: "-0.01em" }}>{it.t}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "rgba(28,27,23,0.68)", margin: 0 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer
        left="← AEROSPACE"
        center="02 / ROBOTICS"
        right="SOFTWARE →"
        onLeft={() => onNav("aerospace")}
        onRight={() => onNav("software")}
      />
    </div>
  );
}

window.RoboticsPage = RoboticsPage;
