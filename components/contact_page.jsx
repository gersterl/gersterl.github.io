/* global React, Icon, Footer */

function ContactPage({ onNav }) {
  const links = [
    { label: "Email",  value: "gersterl@student.ethz.ch", icon: "external", href: "mailto:gersterl@student.ethz.ch" },
    { label: "GitHub", value: "github.com/gersterl",       icon: "github",   href: "https://github.com/gersterl" },
    { label: "Pfadi",  value: "pfadibubenberg.ch",         icon: "external", href: "https://pfadibubenberg.ch/leitungsteam/" },
  ];

  return (
    <div className="page" style={{ color: "var(--text)", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 57 }} />

      <div style={{ flex: 1, padding: "72px 40px 40px", display: "flex", alignItems: "center" }}>
        <div style={{
          background: "var(--bg-1)", border: "0.5px solid var(--rule-2)",
          borderRadius: "var(--r-lg)", padding: "48px 48px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center",
          width: "100%", maxWidth: 880, margin: "0 auto",
        }}>
          {/* Left — intro */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                flexShrink: 0, border: "0.5px solid var(--rule-2)",
                boxShadow: "0 12px 32px -10px rgba(0,0,0,0.7)",
              }}>
                <img src="assets/portrait.png" alt="Portrait of Lukas Gerster" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>Lukas Gerster</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", marginTop: 4 }}>
                  WINTERTHUR · ETH ZÜRICH
                </div>
              </div>
            </div>

            <div className="eyebrow" style={{ marginBottom: 14 }}>Reach out</div>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 500,
              letterSpacing: "-0.018em", lineHeight: 1.1,
            }}>
              Open to internships,{" "}
              <span style={{ color: "var(--amber)", fontWeight: 400 }}>workshop time</span>,
              and unusual problems.
            </h2>
          </div>

          {/* Right — links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {links.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 18px",
                  border: "0.5px solid var(--rule)",
                  borderRadius: "var(--r-md)",
                  color: "inherit",
                  transition: "background 180ms, border-color 180ms, transform 100ms",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--amber-2)";
                  e.currentTarget.style.borderColor = "rgba(234,169,78,0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--rule)";
                  e.currentTarget.style.transform = "none";
                }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.985)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "none"; }}
              >
                <div className="mono" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  {c.label}
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--text)", display: "flex", alignItems: "center", gap: 10 }}>
                  {c.value}
                  <Icon name={c.icon} size={13} color="var(--text-3)" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer
        left="← CV"
        center="05 / Contact"
        right="Index →"
        onLeft={() => onNav("cv")}
        onRight={() => onNav("index")}
      />
    </div>
  );
}

window.ContactPage = ContactPage;
