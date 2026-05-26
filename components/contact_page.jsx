/* global React, Icon, Footer */
// Contact — minimal page. Just the contact box, with the round portrait.

function ContactPage({ onNav }) {
  const links = [
    { label: "EMAIL", value: "gersterl@student.ethz.ch", icon: "external", href: "mailto:gersterl@student.ethz.ch" },
    { label: "GITHUB", value: "github.com/gersterl", icon: "github", href: "https://github.com/gersterl" },
    { label: "PFADI", value: "pfadibubenberg.ch", icon: "external", href: "https://pfadibubenberg.ch/leitungsteam/" },
  ];

  return (
    <div className="page" data-screen-label="06 Contact" style={{ color: "var(--ink)", minHeight: 640, display: "flex", flexDirection: "column" }}>

      <div style={{ flex: 1, padding: "72px 28px 36px", display: "flex", alignItems: "center" }}>
        <div style={{
          background: "var(--ink)", color: "var(--cream)", borderRadius: "var(--border-radius-lg)",
          padding: "40px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center",
          width: "100%",
        }}>
          {/* Left — pitch + portrait */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
                flexShrink: 0, border: "0.5px solid rgba(244,241,234,0.2)",
                boxShadow: "0 8px 24px -10px rgba(0,0,0,0.6)",
              }}>
                <img src="assets/portrait.png" alt="Portrait of Lukas Gerster" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
              </div>
              <div>
                <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                  Lukas <span className="italic" style={{ color: "var(--robo)" }}>Gerster</span>
                </div>
                <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.14em", marginTop: 4 }}>
                  WINTERTHUR · ETH ZÜRICH
                </div>
              </div>
            </div>

            <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.14em", marginBottom: 14 }}>
              — REACH OUT
            </div>
            <h3 className="serif" style={{ fontSize: 36, margin: 0, letterSpacing: "-0.018em", lineHeight: 1.05, textWrap: "balance" }}>
              Open to internships, <span className="italic" style={{ color: "var(--robo)" }}>workshop time</span>, and unusual problems.
            </h3>
          </div>

          {/* Right — links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {links.map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 18px", border: "0.5px solid rgba(244,241,234,0.18)", borderRadius: 8,
                color: "inherit", textDecoration: "none",
                transition: "background 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 100ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,241,234,0.06)"; e.currentTarget.style.borderColor = "rgba(244,241,234,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(244,241,234,0.18)"; e.currentTarget.style.transform = "none"; }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.985)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "none"; }}
              >
                <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.14em" }}>{c.label}</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--cream)", display: "flex", alignItems: "center", gap: 10 }}>
                  {c.value}
                  <Icon name={c.icon} size={14} color="rgba(244,241,234,0.7)"/>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer
        left="← CV"
        center="05 / CONTACT"
        right="INDEX →"
        onLeft={() => onNav("cv")}
        onRight={() => onNav("index")}
      />
    </div>
  );
}

window.ContactPage = ContactPage;
