/* global React, Icon, Footer */
// Aerospace — honest hobby framing. RC planes, a drone, a tiny 3D-printed plane.

function AerospacePage({ onNav }) {
  return (
    <div className="page" data-screen-label="02 Aerospace" style={{ color: "var(--ink)" }}>

      {/* HERO BAND */}
      <div style={{ padding: "56px 28px 48px", background: "var(--aero)", borderBottom: "0.5px solid rgba(168,100,44,0.3)" }}>
        <div className="eyebrow" style={{ color: "var(--aero-ink)", marginBottom: 18 }}>— 01 / AEROSPACE</div>
        <h1 className="serif" style={{
          fontSize: 76, lineHeight: 0.94, letterSpacing: "-0.028em", margin: "0 0 24px", color: "var(--aero-deep)",
        }}>
          A hobby that<br /><span className="italic">happens to fly.</span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "end" }}>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--aero-ink)", maxWidth: 540, margin: 0 }}>
            Not a research project. Not a startup. A weekend habit. I fly RC planes, fly a drone, and print small models of both. The fascination is the same one that pulled me toward mechanical engineering in the first place.
          </p>
          <div className="mono" style={{ fontSize: 11, color: "var(--aero-ink)", letterSpacing: "0.1em", textAlign: "right", lineHeight: 1.7 }}>
            HOBBY · NOT PROFESSIONAL<br />
            BUILT AT HOME<br />
            FLOWN ON WEEKENDS
          </div>
        </div>
      </div>

      {/* DRONE + PLANE PHOTO STRIP */}
      <div style={{ padding: "32px 28px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
          <div style={{ borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "#EFE9DB", border: "0.5px solid rgba(168,100,44,0.18)", aspectRatio: "16 / 10", position: "relative" }}>
            <image-slot
              id="aero-drone"
              shape="rect"
              placeholder="Drag a photo of your drone here"
              style={{ width: "100%", height: "100%", display: "block" }}
            ></image-slot>
            <div className="mono" style={{
              position: "absolute", left: 14, bottom: 14,
              fontSize: 9, color: "rgba(28,27,23,0.55)", letterSpacing: "0.14em", textTransform: "uppercase",
              background: "rgba(244,241,234,0.85)", padding: "4px 8px", borderRadius: 4,
            }}>
              01 — DRONE
            </div>
          </div>
          <div style={{ borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "#EFE9DB", border: "0.5px solid rgba(168,100,44,0.18)", aspectRatio: "16 / 10", position: "relative" }}>
            <image-slot
              id="aero-mini-plane"
              shape="rect"
              placeholder="Drag a photo of the 3D-printed mini plane"
              style={{ width: "100%", height: "100%", display: "block" }}
            ></image-slot>
            <div className="mono" style={{
              position: "absolute", left: 14, bottom: 14,
              fontSize: 9, color: "rgba(28,27,23,0.55)", letterSpacing: "0.14em", textTransform: "uppercase",
              background: "rgba(244,241,234,0.85)", padding: "4px 8px", borderRadius: 4,
            }}>
              02 — 3D-PRINTED PLANE
            </div>
          </div>
        </div>
      </div>

      {/* THREE THINGS */}
      <div style={{ padding: "44px 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 className="serif" style={{ fontSize: 28, margin: 0, letterSpacing: "-0.015em" }}>
            What I <span className="italic" style={{ color: "var(--aero-accent)" }}>fly</span>
          </h2>
          <div className="mono" style={{ fontSize: 10, color: "rgba(28,27,23,0.5)", letterSpacing: "0.12em" }}>3 THINGS · ALL HOBBY</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            {
              n: "01",
              title: "RC planes",
              body: "Hobby-grade balsa and foam airframes. Flown at a local club field. Crashed often enough to learn from every one.",
              meta: "Years flying · 3+ · Hobby",
            },
            {
              n: "02",
              title: "FPV drone",
              body: "Standard 5-inch freestyle quad. I didn't design the frame — I tune, repair, and learn to fly it.",
              meta: "Pilot, not designer",
            },
            {
              n: "03",
              title: "3D-printed mini plane",
              body: "Small flying-wing printed on the Bambu X1E. Less than 200g. Built mostly to learn print orientation and seam placement on curved surfaces.",
              meta: "Bambu Lab X1E · LW-PLA",
            },
          ].map((c, i) => (
            <div key={i} style={{
              background: "#FFFFFF", border: "0.5px solid rgba(168,100,44,0.2)",
              borderRadius: "var(--border-radius-lg)", padding: 22,
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220,
            }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "var(--aero-accent)", letterSpacing: "0.14em", marginBottom: 12 }}>
                  — {c.n}
                </div>
                <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 10, color: "var(--aero-deep)" }}>
                  {c.title}
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(28,27,23,0.72)", margin: 0, textWrap: "pretty" }}>
                  {c.body}
                </p>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "rgba(28,27,23,0.5)", letterSpacing: "0.1em", marginTop: 18, paddingTop: 12, borderTop: "0.5px solid rgba(28,27,23,0.1)" }}>
                {c.meta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY STRIP */}
      <div style={{ padding: "0 28px 36px" }}>
        <div style={{
          background: "var(--ink)", color: "var(--cream)", borderRadius: "var(--border-radius-lg)",
          padding: "28px 32px",
        }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.14em", marginBottom: 10 }}>
            — WHY IT'S HERE
          </div>
          <p className="serif italic" style={{ fontSize: 22, lineHeight: 1.35, margin: 0, textWrap: "balance", maxWidth: 760 }}>
            Flying RC was the first time I cared whether a CAD model would survive contact with the real world. It's still the cleanest feedback loop I know — <span style={{ color: "var(--aero)" }}>fly, crash, rebuild, fly again.</span>
          </p>
        </div>
      </div>

      <Footer
        left="← INDEX"
        center="01 / AEROSPACE"
        right="ROBOTICS →"
        onLeft={() => onNav("index")}
        onRight={() => onNav("robotics")}
      />
    </div>
  );
}

window.AerospacePage = AerospacePage;
