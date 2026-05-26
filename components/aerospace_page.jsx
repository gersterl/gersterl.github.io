/* global React, Icon, Footer */

function AerospacePage({ onNav }) {
  const things = [
    {
      n: "01", title: "RC planes",
      body: "Hobby-grade balsa and foam airframes. Flown at a local club field. Crashed often enough to learn from every one.",
      meta: "Years flying · 3+ · Hobby",
    },
    {
      n: "02", title: "FPV drone",
      body: "Standard 5-inch freestyle quad. I didn't design the frame — I tune, repair, and learn to fly it.",
      meta: "Pilot, not designer",
    },
    {
      n: "03", title: "3D-printed mini plane",
      body: "Small flying-wing printed on the Bambu X1E. Under 200 g. Built mostly to learn print orientation and seam placement on curved surfaces.",
      meta: "Bambu Lab X1E · LW-PLA",
    },
  ];

  return (
    <div className="page" style={{ color: "var(--text)" }}>
      <div style={{ height: 57 }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{
        padding: "60px 40px 52px",
        background: "var(--bg-1)",
        borderBottom: "0.5px solid var(--rule)",
      }}>
        <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 20 }}>
          01 / Aerospace
        </div>
        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(44px, 5.8vw, 76px)",
          fontWeight: 500, lineHeight: 1.02,
          letterSpacing: "-0.028em", margin: "0 0 28px",
        }}>
          A hobby that<br />
          <span style={{ color: "var(--amber)", fontWeight: 400 }}>happens to fly.</span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "end" }}>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--text-2)", maxWidth: 520 }}>
            Not a research project. Not a startup. A weekend habit. I fly RC planes, fly a drone, and print small models of both. The fascination is the same one that pulled me toward mechanical engineering in the first place.
          </p>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textAlign: "right", lineHeight: 1.9 }}>
            HOBBY · NOT PROFESSIONAL<br />
            BUILT AT HOME<br />
            FLOWN ON WEEKENDS
          </div>
        </div>
      </div>

      {/* ── PHOTO STRIP ──────────────────────────────────────── */}
      <div style={{ padding: "32px 40px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
          {[
            { id: "aero-drone",      label: "01 — Drone",           placeholder: "Drag a photo of your drone here" },
            { id: "aero-mini-plane", label: "02 — 3D-printed plane", placeholder: "Drag a photo of the 3D-printed mini plane" },
          ].map((slot) => (
            <div key={slot.id} style={{
              borderRadius: "var(--r-md)", overflow: "hidden",
              background: "var(--bg-2)", border: "0.5px solid var(--rule)",
              aspectRatio: "16 / 10", position: "relative",
            }}>
              <image-slot
                id={slot.id}
                shape="rect"
                placeholder={slot.placeholder}
                style={{ width: "100%", height: "100%", display: "block" }}
              ></image-slot>
              <div className="mono" style={{
                position: "absolute", left: 12, bottom: 12,
                fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase",
                background: "rgba(13,13,11,0.75)", padding: "4px 8px", borderRadius: 4,
              }}>
                {slot.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHAT I FLY ───────────────────────────────────────── */}
      <div style={{ padding: "48px 40px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <span className="eyebrow">What I fly</span>
          <span className="eyebrow">3 things · all hobby</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {things.map((c) => (
            <div key={c.n} style={{
              background: "var(--bg-2)", border: "0.5px solid var(--rule)",
              borderRadius: "var(--r-md)", padding: 22,
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 210,
            }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 12 }}>{c.n}</div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 10 }}>{c.title}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-2)" }}>{c.body}</p>
              </div>
              <div className="eyebrow" style={{ marginTop: 16, paddingTop: 12, borderTop: "0.5px solid var(--rule)" }}>{c.meta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY STRIP ────────────────────────────────────────── */}
      <div style={{ padding: "0 40px 36px" }}>
        <div style={{
          background: "var(--bg-2)", border: "0.5px solid var(--rule-2)",
          borderRadius: "var(--r-lg)", padding: "28px 32px",
        }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Why it's here</div>
          <p style={{
            fontSize: 20, lineHeight: 1.5, color: "var(--text)",
            fontStyle: "italic", fontWeight: 300, maxWidth: 780,
          }}>
            Flying RC was the first time I cared whether a CAD model would survive contact with the real world. It's still the cleanest feedback loop I know —{" "}
            <span style={{ color: "var(--amber)" }}>fly, crash, rebuild, fly again.</span>
          </p>
        </div>
      </div>

      <Footer
        left="← Index"
        center="01 / Aerospace"
        right="Robotics →"
        onLeft={() => onNav("index")}
        onRight={() => onNav("robotics")}
      />
    </div>
  );
}

window.AerospacePage = AerospacePage;
