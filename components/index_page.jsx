/* global React, Icon */
// Index / Home page

// ─── Sector motifs ──────────────────────────────────────────────
// Technical, draftsman-style. Thin lines, considered composition.
function Motif({ which, ink, deep }) {
  const COL = { aerospace: "#A8642C", robotics: "#08423A", software: "#0A3563" };
  const BG  = { aerospace: "rgba(255,255,255,0.45)", robotics: "rgba(255,255,255,0.45)", software: "rgba(255,255,255,0.45)" };
  // Resolve color from CSS var-ish input — easier: hardcode by ink token
  const c = ink === "var(--aero-ink)" ? COL.aerospace
          : ink === "var(--robo-ink)" ? COL.robotics
          : COL.software;
  const bg = ink === "var(--aero-ink)" ? BG.aerospace
          :  ink === "var(--robo-ink)" ? BG.robotics
          :  BG.software;

  if (which === "airfoil") {
    // Wing planform (top-down view) — swept, ribs, control surface. Reads as drafting.
    return (
      <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <pattern id="grid-aero" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke={c} strokeWidth="0.3" opacity="0.18"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="200" height="150" fill={bg}/>
        <rect x="0" y="0" width="200" height="150" fill="url(#grid-aero)"/>

        {/* Centerline / fuselage axis */}
        <line x1="100" y1="22" x2="100" y2="128" stroke={c} strokeWidth="0.4" strokeDasharray="4 3" opacity="0.45"/>

        {/* Left half-wing — swept leading edge, straight trailing edge */}
        <path
          d="M 100 68 L 28 88 L 26 96 L 100 96 Z"
          fill="none" stroke={c} strokeWidth="0.9" opacity="0.95"
        />
        {/* Right half-wing (mirrored) */}
        <path
          d="M 100 68 L 172 88 L 174 96 L 100 96 Z"
          fill="none" stroke={c} strokeWidth="0.9" opacity="0.95"
        />

        {/* Spanwise ribs — stations along each half-wing */}
        {[0.22, 0.42, 0.62, 0.82].map((t, i) => {
          const xL = 100 - 72 * t;
          const yLE_L = 68 + (88 - 68) * t;
          const xR = 100 + 72 * t;
          const yLE_R = yLE_L;
          return (
            <g key={i} opacity="0.55">
              <line x1={xL} y1={yLE_L} x2={xL} y2={96} stroke={c} strokeWidth="0.4"/>
              <line x1={xR} y1={yLE_R} x2={xR} y2={96} stroke={c} strokeWidth="0.4"/>
            </g>
          );
        })}

        {/* Tail / horizontal stabilizer */}
        <path d="M 100 116 L 82 126 L 80 130 L 100 130 Z" fill="none" stroke={c} strokeWidth="0.7" opacity="0.85"/>
        <path d="M 100 116 L 118 126 L 120 130 L 100 130 Z" fill="none" stroke={c} strokeWidth="0.7" opacity="0.85"/>

        {/* Nose */}
        <path d="M 96 24 Q 100 18, 104 24 L 102 30 L 98 30 Z" fill={c} opacity="0.85"/>

        {/* Span measurement */}
        <line x1="26" y1="108" x2="174" y2="108" stroke={c} strokeWidth="0.35" opacity="0.5"/>
        <line x1="26" y1="104" x2="26" y2="112" stroke={c} strokeWidth="0.35" opacity="0.5"/>
        <line x1="174" y1="104" x2="174" y2="112" stroke={c} strokeWidth="0.35" opacity="0.5"/>
        <text x="94" y="107" fontFamily="JetBrains Mono" fontSize="5.5" fill={c} opacity="0.6" letterSpacing="0.05em">b</text>

        <text x="12" y="142" fontFamily="JetBrains Mono" fontSize="6.5" fill={c} opacity="0.55" letterSpacing="0.1em">WING · PLANFORM</text>
      </svg>
    );
  }

  if (which === "cycloid") {
    // Cycloidal-drive cross-section — outer pin ring, two offset lobed disks
    const cx = 100, cy = 75, R = 56;
    const pins = 14;
    const lobeR = 44;
    return (
      <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <pattern id="grid-robo" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke={c} strokeWidth="0.3" opacity="0.18"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="200" height="150" fill={bg}/>
        <rect x="0" y="0" width="200" height="150" fill="url(#grid-robo)"/>
        {/* outer ring */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={c} strokeWidth="0.7" opacity="0.85"/>
        {/* pins */}
        {Array.from({ length: pins }).map((_, i) => {
          const a = (i / pins) * Math.PI * 2;
          const px = cx + Math.cos(a) * (R - 2);
          const py = cy + Math.sin(a) * (R - 2);
          return <circle key={i} cx={px} cy={py} r="2.4" fill={c} opacity="0.85"/>;
        })}
        {/* primary cycloid disk (epitrochoid-ish path) */}
        <path
          d={generateCycloid(cx, cy, lobeR, 11, 0)}
          fill="none" stroke={c} strokeWidth="0.6" opacity="0.95"
        />
        {/* secondary disk, 180° out of phase */}
        <path
          d={generateCycloid(cx + 1.4, cy, lobeR, 11, Math.PI / 11)}
          fill="none" stroke={c} strokeWidth="0.5" opacity="0.4" strokeDasharray="2 2"
        />
        {/* center shaft + crosshair */}
        <circle cx={cx} cy={cy} r="3.6" fill={c}/>
        <circle cx={cx} cy={cy} r="9" fill="none" stroke={c} strokeWidth="0.4" opacity="0.5"/>
        <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} stroke={c} strokeWidth="0.3" opacity="0.45"/>
        <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 14} stroke={c} strokeWidth="0.3" opacity="0.45"/>
        <text x="12" y="142" fontFamily="JetBrains Mono" fontSize="6.5" fill={c} opacity="0.55" letterSpacing="0.1em">CYCLOIDAL · 1:20</text>
      </svg>
    );
  }

  if (which === "signals") {
    // Pose skeleton — the actual visual of the live tracker. Shoulders, elbows, wrists.
    return (
      <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <pattern id="grid-soft" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke={c} strokeWidth="0.3" opacity="0.18"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="200" height="150" fill={bg}/>
        <rect x="0" y="0" width="200" height="150" fill="url(#grid-soft)"/>

        {/* head */}
        <circle cx="100" cy="34" r="10" fill="none" stroke={c} strokeWidth="0.7" opacity="0.85"/>
        {/* torso line */}
        <line x1="100" y1="44" x2="100" y2="112" stroke={c} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.55"/>
        {/* shoulder bar */}
        <line x1="72" y1="56" x2="128" y2="56" stroke={c} strokeWidth="1" opacity="0.9"/>

        {/* Right arm: shoulder → elbow (down-out) → wrist (up) — a wave gesture */}
        <line x1="72" y1="56" x2="50" y2="86" stroke={c} strokeWidth="1.4"/>
        <line x1="50" y1="86" x2="58" y2="122" stroke={c} strokeWidth="1.4"/>

        {/* Left arm: shoulder → elbow (up-out) → wrist (out) */}
        <line x1="128" y1="56" x2="158" y2="42" stroke={c} strokeWidth="1.4"/>
        <line x1="158" y1="42" x2="180" y2="32" stroke={c} strokeWidth="1.4"/>

        {/* joint dots — hollow circles like the live overlay */}
        {[
          [72, 56, "R·S"], [50, 86, "R·E"], [58, 122, "R·W"],
          [128, 56, "L·S"], [158, 42, "L·E"], [180, 32, "L·W"],
        ].map(([x, y, lbl], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.6" fill={bg.replace("rgba(255,255,255,0.45)", "#F4F1EA")} stroke={c} strokeWidth="1.1"/>
            <circle cx={x} cy={y} r="1.4" fill={c}/>
          </g>
        ))}

        {/* Angle arc at right elbow */}
        <path d="M 56 84 A 8 8 0 0 1 54 92" fill="none" stroke={c} strokeWidth="0.5" opacity="0.7"/>
        <text x="60" y="94" fontFamily="JetBrains Mono" fontSize="6" fill={c} opacity="0.7">62°</text>

        {/* Angle arc at left shoulder */}
        <path d="M 134 53 A 8 8 0 0 1 138 60" fill="none" stroke={c} strokeWidth="0.5" opacity="0.7"/>
        <text x="140" y="62" fontFamily="JetBrains Mono" fontSize="6" fill={c} opacity="0.7">28°</text>

        <text x="12" y="142" fontFamily="JetBrains Mono" fontSize="6.5" fill={c} opacity="0.55" letterSpacing="0.1em">POSE · 6 OF 33 LANDMARKS</text>
      </svg>
    );
  }

  return null;
}

// Approximation of a cycloidal-disk outline: small modulation on a circle.
function generateCycloid(cx, cy, R, lobes, phaseOffset) {
  const steps = 240;
  const amp = 2.6; // lobe depth
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = R - amp * (1 - Math.cos(lobes * a + phaseOffset));
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    d += (i === 0 ? "M " : "L ") + x.toFixed(2) + " " + y.toFixed(2) + " ";
  }
  return d + "Z";
}

function IndexPage({ onNav }) {
  const categories = [
    {
      id: "aerospace",
      n: "01",
      title: "Aerospace",
      sub: "RC planes, drone, 3D-printed mini plane.",
      bg: "var(--aero)",
      ink: "var(--aero-ink)",
      deep: "var(--aero-deep)",
      iconColor: "var(--aero-ink)",
      icon: "plane",
      thumb: { kind: "motif", which: "airfoil" },
    },
    {
      id: "robotics",
      n: "02",
      title: "Robotics",
      sub: "5-DOF arm, three drivetrains, lessons learned.",
      bg: "var(--robo)",
      ink: "var(--robo-ink)",
      deep: "var(--robo-deep)",
      iconColor: "var(--robo-ink)",
      icon: "robot",
      thumb: { kind: "motif", which: "cycloid" },
    },
    {
      id: "software",
      n: "03",
      title: "Software",
      sub: "Live arm tracking → the robot mirrors me.",
      bg: "var(--soft)",
      ink: "var(--soft-ink)",
      deep: "var(--soft-deep)",
      iconColor: "var(--soft-ink)",
      icon: "scan",
      thumb: { kind: "motif", which: "signals" },
    },
  ];

  return (
    <div className="page" data-screen-label="01 Index" style={{ color: "var(--ink)" }}>
      {/* HERO */}
      <div style={{
        position: "relative", padding: "0", overflow: "hidden",
        minHeight: 620, borderBottom: "0.5px solid var(--rule)",
      }}>
        {/* Background photo, bleeds further left past the frame edge */}
        <div style={{
          position: "absolute", left: -28, top: 0, bottom: 0,
          width: "66%", overflow: "hidden",
        }}>
          <img
            src="assets/matura.png"
            alt="Lukas at the Matura ceremony, Kantonsschule Im Lee"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: "22% 22%",
              display: "block",
              filter: "saturate(0.92)",
            }}
          />
          {/* Wider, softer fade so the headline transition reads clean */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(90deg, rgba(244,241,234,0) 0%, rgba(244,241,234,0) 40%, rgba(244,241,234,0.35) 65%, rgba(244,241,234,0.9) 88%, rgba(244,241,234,1) 100%)",
          }}/>
          {/* Bottom fade so the photo settles into the page rhythm instead of clipping abruptly */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(244,241,234,0) 70%, rgba(244,241,234,0.5) 92%, rgba(244,241,234,1) 100%)",
          }}/>
        </div>

        {/* Right-edge bleed continues the cream so headline reads cleanly */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "42%",
          background: "var(--cream)", pointerEvents: "none",
        }}/>

        {/* Eyebrow top-right */}
        <div className="eyebrow" style={{
          position: "absolute", top: 32, right: 28, zIndex: 3,
          color: "rgba(28,27,23,0.55)",
        }}>
          — 001 / Index
        </div>

        {/* Banner headline — sits high, extends left over the rector */}
        <div style={{
          position: "relative", zIndex: 2,
          padding: "96px 28px 32px",
          textAlign: "right",
        }}>
          <h1 className="serif" style={{
            fontSize: 144, lineHeight: 0.88, letterSpacing: "-0.04em",
            margin: 0, color: "var(--ink)", textWrap: "balance",
          }}>
            Engineering<br />
            <span className="italic" style={{ color: "var(--aero-accent)" }}>Portfolio.</span>
          </h1>
        </div>

        {/* Bio strip pinned bottom-right */}
        <div style={{
          position: "absolute", right: 28, bottom: 28, zIndex: 3,
          maxWidth: 440, textAlign: "right",
        }}>
          <p style={{
            fontSize: 15, lineHeight: 1.55, color: "rgba(28,27,23,0.82)",
            margin: 0, textWrap: "pretty",
          }}>
            <strong style={{ fontWeight: 500, color: "var(--ink)" }}>Lukas Gerster</strong> — mechanical engineering student at ETH Zurich. Building things that fly, move, and think. Often all three at once, badly, and then better.
          </p>
          <div className="mono" style={{
            fontSize: 10, color: "rgba(28,27,23,0.55)",
            letterSpacing: "0.14em", marginTop: 14,
          }}>
            B. 2006 · WINTERTHUR · ETH ZÜRICH '27
          </div>
        </div>
      </div>

      {/* CV ENTRY */}
      <div style={{ padding: "24px 28px 22px" }}>
        <a
          onClick={() => onNav("cv")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px", background: "#FFFFFF",
            border: "0.5px solid rgba(28,27,23,0.18)", borderRadius: "var(--border-radius-lg)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Icon name="file" size={22} stroke={1.4} />
            <div>
              <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>
                Curriculum <span className="italic" style={{ color: "var(--aero-accent)" }}>Vitæ</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: "rgba(28,27,23,0.55)", marginTop: 3 }}>
                ETH Zürich · Winterthur · DE / EN / FR
              </div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(28,27,23,0.7)", display: "flex", alignItems: "center", gap: 8 }}>
            READ <span className="door-arrow" style={{ fontSize: 14 }}>→</span>
          </div>
        </a>
      </div>

      {/* DIVIDER LABEL */}
      <div style={{ padding: "16px 28px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 className="serif" style={{ fontSize: 26, letterSpacing: "-0.01em", margin: 0, color: "var(--ink)" }}>
          Browse <span className="italic" style={{ color: "var(--aero-accent)" }}>the work</span>
        </h2>
        <div className="mono" style={{ fontSize: 10, color: "rgba(28,27,23,0.5)", letterSpacing: "0.12em" }}>3 PATHS</div>
      </div>

      {/* CATEGORY DOORS */}
      <div style={{
        padding: "0 28px 36px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14,
      }}>
        {categories.map(c => (
          <a
            key={c.id}
            className="door"
            onClick={() => onNav(c.id)}
            style={{
              background: c.bg, borderRadius: "var(--border-radius-lg)",
              padding: "22px 22px", minHeight: 320,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              position: "relative", overflow: "hidden", cursor: "pointer",
              border: `0.5px solid ${c.ink === "var(--aero-ink)" ? "rgba(168,100,44,0.25)" : c.ink === "var(--robo-ink)" ? "rgba(15,110,86,0.25)" : "rgba(24,95,165,0.25)"}`,
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <span className="mono" style={{ fontSize: 10, color: c.ink, letterSpacing: "0.14em" }}>— {c.n}</span>
            </div>

            {/* Thumbnail — real render where we have it, image-slot where the user can drop a photo */}
            <div style={{
              borderRadius: 8, overflow: "hidden",
              background: "rgba(255,255,255,0.4)",
              border: c.ink === "var(--aero-ink)" ? "0.5px solid rgba(168,100,44,0.2)" : c.ink === "var(--robo-ink)" ? "0.5px solid rgba(15,110,86,0.2)" : "0.5px solid rgba(24,95,165,0.2)",
              aspectRatio: "4 / 3", marginBottom: 16, position: "relative",
            }}>
              {c.thumb.kind === "image" ? (
                <img
                  src={c.thumb.src}
                  alt={`${c.title} preview`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.thumb.objectPosition || "center", display: "block" }}
                />
              ) : c.thumb.kind === "motif" ? (
                <Motif which={c.thumb.which} ink={c.ink} deep={c.deep} />
              ) : (
                <image-slot
                  id={c.thumb.id}
                  shape="rect"
                  placeholder={c.thumb.placeholder}
                  style={{ width: "100%", height: "100%", display: "block" }}
                ></image-slot>
              )}
            </div>

            <div>
              <h3 className="serif" style={{ fontSize: 30, margin: "0 0 6px", color: c.deep, letterSpacing: "-0.015em", lineHeight: 0.98 }}>
                {c.title}
              </h3>
              <p style={{ fontSize: 12.5, color: c.ink, margin: "0 0 14px", lineHeight: 1.45 }}>{c.sub}</p>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: c.deep, display: "flex", alignItems: "center", gap: 8 }}>
                ENTER <span className="door-arrow" style={{ fontSize: 13 }}>→</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* MARQUEE */}
      <div style={{
        borderTop: "0.5px solid rgba(28,27,23,0.15)",
        borderBottom: "0.5px solid rgba(28,27,23,0.15)",
        padding: "14px 0", overflow: "hidden", background: "var(--cream-2)",
      }}>
        <div className="marquee-track mono" style={{ fontSize: 11, color: "rgba(28,27,23,0.55)", letterSpacing: "0.08em" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span><span className="pulse"/>OPEN TO PROJECTS</span>
              <span>EST. WINTERTHUR</span>
              <span>ETH ZÜRICH '27</span>
              <span>BUILT FROM CAD, COMPOSITES, AND CAFFEINE</span>
              <span>PFADI BUBENBERG / CHAPPER</span>
              <span>v2026.1</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: "18px 28px", display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(28,27,23,0.5)", letterSpacing: "0.08em",
      }}>
        <span>© 2026 LUKAS GERSTER</span>
        <span>BUILT IN WINTERTHUR</span>
        <span>GITHUB ↗</span>
      </div>
    </div>
  );
}

window.IndexPage = IndexPage;
