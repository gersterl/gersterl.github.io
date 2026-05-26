/* global React, Icon, Footer */

function CVPage({ onNav }) {
  const ed = [
    { yrs: "2024 — present", inst: "ETH Zürich", role: "BSc Mechanical Engineering", note: "Maschinenbau · expected 2027" },
    { yrs: "2018 — 2024", inst: "Kantonsschule Im Lee", role: "Matura · chemistry & biology focus", note: "Maturarbeit on the efficiency of different electrode materials for hydrogen electrolysis." },
  ];
  const work = [
    { yrs: "2023 — present", inst: "Home workshop · Winterthur", role: "Hands-on building", note: "Three iterations of the robotic arm, RC airframes, the live arm-tracking pipeline." },
  ];
  const leadership = [
    {
      yrs: "2012 — present",
      inst: "Pfadi Bubenberg",
      role: "Member → Leitungsteam",
      note: "Pfadiname Chapper. Joined as a kid in 2012, now in the leadership team — weekly sessions, camps, responsible for the group in the woods. Where I learned to lead without a job title.",
      href: "https://pfadibubenberg.ch/leitungsteam/",
    },
  ];
  const skills = [
    { head: "CAD & manufacturing", items: ["Fusion 360", "FDM (Bambu Lab X1E, Ender 3 V3 SE)", "Hand layup composites", "Manual machining"] },
    { head: "Programming",         items: ["Python (numpy, scipy)", "C / C++ on ESP32", "MATLAB", "Git, the basics"] },
    { head: "Languages",           items: ["German — native", "English — fluent", "French — conversational"] },
    { head: "Software systems",    items: ["MediaPipe / pose tracking", "Serial protocols (UART)", "Closed-loop control (AS5600)"] },
  ];

  return (
    <div className="page" style={{ color: "var(--text)" }}>
      <div style={{ height: 57 }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{
        borderBottom: "0.5px solid var(--rule)", padding: "60px 40px 44px",
        display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
        background: "var(--bg-1)",
      }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 20 }}>
            04 / Curriculum Vitæ
          </div>
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(44px, 6vw, 84px)",
            fontWeight: 500, lineHeight: 0.96,
            letterSpacing: "-0.03em", margin: "0 0 24px",
          }}>
            One page,<br />
            <span style={{ color: "var(--amber)", fontWeight: 400 }}>honest weight.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-2)", maxWidth: 500 }}>
            A short résumé. I'd rather show the work — but here are the dates, the languages, the tools.
          </p>
        </div>

        {/* Portrait */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 160, height: 160, borderRadius: "50%", overflow: "hidden",
            border: "0.5px solid var(--rule-2)",
            boxShadow: "0 20px 48px -18px rgba(0,0,0,0.7)",
          }}>
            <img
              src="assets/portrait.png"
              alt="Portrait of Lukas Gerster"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", textAlign: "center", lineHeight: 1.8 }}>
            DE / EN / FR<br />
            B. 2006 · WINTERTHUR<br />
            ETH ZÜRICH · '27
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN: timeline + skills ──────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr" }}>
        {/* Left — timeline */}
        <div style={{ padding: "36px 40px 36px", borderRight: "0.5px solid var(--rule)" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Education</div>
          {ed.map((r, i) => <CVRow key={i} {...r} accentColor="var(--amber)" />)}

          <div className="eyebrow" style={{ margin: "32px 0 16px" }}>Work / Projects</div>
          {work.map((r, i) => <CVRow key={i} {...r} accentColor="#6FBA8A" />)}

          <div className="eyebrow" style={{ margin: "32px 0 16px" }}>Leadership</div>
          {leadership.map((r, i) => <CVRow key={i} {...r} accentColor="#9BB8C8" />)}
        </div>

        {/* Right — skills */}
        <div style={{ padding: "36px 32px 36px", background: "var(--bg-1)" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Stack</div>
          {skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.005em", marginBottom: 8 }}>
                {s.head}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {s.items.map((it, j) => (
                  <li key={j} className="mono" style={{
                    fontSize: 12, color: "var(--text-2)",
                    padding: "3px 0", letterSpacing: "0.02em",
                  }}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Footer
        left="← Software"
        center="04 / CV"
        right="Contact →"
        onLeft={() => onNav("software")}
        onRight={() => onNav("contact")}
      />
    </div>
  );
}

function CVRow({ yrs, inst, role, note, accentColor, href }) {
  const inner = (
    <>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.08em", paddingTop: 3 }}>
        {yrs}
      </div>
      <div>
        <div style={{ fontSize: 17, letterSpacing: "-0.01em", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span>{inst}</span>
          <span style={{ color: "var(--text-3)" }}>·</span>
          <span style={{ fontStyle: "italic", color: accentColor }}>{role}</span>
          {href && <Icon name="external" size={11} color="var(--text-3)" />}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 4, lineHeight: 1.55 }}>{note}</div>
      </div>
    </>
  );
  const style = {
    display: "grid", gridTemplateColumns: "130px 1fr", gap: 20,
    padding: "14px 0", borderTop: "0.5px solid var(--rule)",
    color: "inherit",
  };
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{inner}</a>
    : <div style={style}>{inner}</div>;
}

window.CVPage = CVPage;
