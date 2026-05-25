/* global React, Icon, Footer */
// CV page — only the CV. Contact lives on its own page.

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
    { head: "Programming", items: ["Python (numpy, scipy)", "C / C++ on ESP32", "MATLAB", "Git, the basics"] },
    { head: "Languages", items: ["German — native", "English — fluent", "French — conversational"] },
    { head: "Software systems", items: ["MediaPipe / pose tracking", "Serial protocols (UART)", "Closed-loop control (AS5600)"] },
  ];

  return (
    <div className="page" data-screen-label="05 CV" style={{ color: "var(--ink)" }}>

      {/* HERO — title left, round portrait right */}
      <div style={{
        borderBottom: "0.5px solid var(--rule)", padding: "56px 28px 40px",
        display: "grid", gridTemplateColumns: "1fr auto", gap: 36, alignItems: "center",
      }}>
        <div>
          <div className="eyebrow" style={{ color: "rgba(28,27,23,0.5)", marginBottom: 18 }}>— 04 / CURRICULUM VITÆ</div>
          <h1 className="serif" style={{
            fontSize: 88, lineHeight: 0.92, letterSpacing: "-0.032em", margin: 0, color: "var(--ink)",
          }}>
            One page,<br /><span className="italic" style={{ color: "var(--aero-accent)" }}>honest weight.</span>
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "rgba(28,27,23,0.78)", maxWidth: 520, margin: "22px 0 0", textWrap: "pretty" }}>
            A short résumé. I'd rather show the work — but here are the dates, the languages, the tools.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 168, height: 168, borderRadius: "50%", overflow: "hidden",
            border: "0.5px solid rgba(28,27,23,0.15)",
            boxShadow: "0 16px 36px -18px rgba(28,27,23,0.35)",
          }}>
            <img
              src="assets/portrait.png"
              alt="Portrait of Lukas Gerster"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div className="mono" style={{ fontSize: 10, color: "rgba(28,27,23,0.55)", letterSpacing: "0.14em", textAlign: "center", lineHeight: 1.7 }}>
            DE / EN / FR<br />
            B. 2006 · WINTERTHUR<br />
            ETH ZÜRICH · '27
          </div>
        </div>
      </div>

      {/* TWO COLUMN: timeline + skills */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 0 }}>
        {/* Left — timeline */}
        <div style={{ padding: "36px 28px 28px", borderRight: "0.5px solid var(--rule)" }}>
          <div className="eyebrow" style={{ marginBottom: 14, color: "rgba(28,27,23,0.5)" }}>— EDUCATION</div>
          {ed.map((r, i) => <CVRow key={i} {...r} accent="var(--aero-accent)" />)}

          <div className="eyebrow" style={{ margin: "32px 0 14px", color: "rgba(28,27,23,0.5)" }}>— WORK / PROJECTS</div>
          {work.map((r, i) => <CVRow key={i} {...r} accent="var(--robo-ink)" />)}

          <div className="eyebrow" style={{ margin: "32px 0 14px", color: "rgba(28,27,23,0.5)" }}>— LEADERSHIP</div>
          {leadership.map((r, i) => <CVRow key={i} {...r} accent="var(--soft-ink)" />)}
        </div>

        {/* Right — skills */}
        <div style={{ padding: "36px 28px 28px", background: "var(--cream-2)" }}>
          <div className="eyebrow" style={{ marginBottom: 14, color: "rgba(28,27,23,0.5)" }}>— STACK</div>
          {skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              <div className="serif" style={{ fontSize: 17, letterSpacing: "-0.005em", marginBottom: 8 }}>{s.head}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {s.items.map((it, j) => (
                  <li key={j} className="mono" style={{ fontSize: 12, color: "rgba(28,27,23,0.7)", padding: "3px 0", letterSpacing: "0.02em" }}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Footer
        left="← SOFTWARE"
        center="04 / CV"
        right="CONTACT →"
        onLeft={() => onNav("software")}
        onRight={() => onNav("contact")}
      />
    </div>
  );
}

function CVRow({ yrs, inst, role, note, accent, href }) {
  const inner = (
    <>
      <div className="mono" style={{ fontSize: 11, color: "rgba(28,27,23,0.5)", letterSpacing: "0.1em", paddingTop: 4 }}>
        {yrs}
      </div>
      <div>
        <div className="serif" style={{ fontSize: 19, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          {inst} <span style={{ color: "rgba(28,27,23,0.5)" }}>— </span><span className="italic" style={{ color: accent }}>{role}</span>
          {href && <Icon name="external" size={12} color="rgba(28,27,23,0.4)" style={{ marginLeft: 8, verticalAlign: "baseline" }}/>}
        </div>
        <div style={{ fontSize: 13.5, color: "rgba(28,27,23,0.7)", marginTop: 4, lineHeight: 1.55, textWrap: "pretty" }}>{note}</div>
      </div>
    </>
  );
  const baseStyle = {
    display: "grid", gridTemplateColumns: "140px 1fr", gap: 20,
    padding: "14px 0", borderTop: "0.5px solid rgba(28,27,23,0.1)",
    color: "inherit", textDecoration: "none",
  };
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={baseStyle}>{inner}</a>
  ) : (
    <div style={baseStyle}>{inner}</div>
  );
}

window.CVPage = CVPage;
