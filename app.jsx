/* global React, ReactDOM, NavBar, IndexPage, AerospacePage, RoboticsPage, SoftwarePage, CVPage, TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle, useTweaks */

const { useState, useEffect } = React;

// Tweakable defaults — host rewrites this block in place when user changes values.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#A8642C",
  "serif": "Instrument Serif",
  "background": "#E8E3D8",
  "showMarquee": true
}/*EDITMODE-END*/;

const SERIF_OPTIONS = {
  "Instrument Serif": '"Instrument Serif", Georgia, serif',
  "Cormorant Garamond": '"Cormorant Garamond", Georgia, serif',
  "DM Serif Display": '"DM Serif Display", Georgia, serif',
  "Newsreader": '"Newsreader", Georgia, serif',
};

const ACCENT_OPTIONS = ["#A8642C", "#08423A", "#0A3563", "#7B3F4A", "#1C1B17"];
const BG_OPTIONS = ["#E8E3D8", "#1C1B17", "#D6CFC0", "#EDE6D3"];

function App() {
  const [page, setPage] = useState("index");
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks live as CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty("--aero-accent", t.accent);
    document.documentElement.style.setProperty("--font-serif", SERIF_OPTIONS[t.serif] || SERIF_OPTIONS["Instrument Serif"]);
    document.body.style.background = t.background;
    // dark mode pseudo-handling for ink-on-dark
    if (t.background === "#1C1B17") {
      document.documentElement.style.setProperty("--frame-shadow", "0 24px 60px -28px rgba(0,0,0,0.55)");
    }
  }, [t.accent, t.serif, t.background]);

  const nav = (p) => {
    setPage(p);
    // Scroll the frame container back to top for the new page
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  let body;
  switch (page) {
    case "aerospace": body = <AerospacePage onNav={nav} />; break;
    case "robotics":  body = <RoboticsPage onNav={nav} />; break;
    case "software":  body = <SoftwarePage onNav={nav} />; break;
    case "cv":        body = <CVPage onNav={nav} />; break;
    case "contact":   body = <ContactPage onNav={nav} />; break;
    default:          body = <IndexPage onNav={nav} />;
  }

  return (
    <div className="stage">
      <div className="frame">
        <NavBar current={page} onNav={nav} />
        {body}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent">
          <TweakColor
            label="Italic accent"
            value={t.accent}
            options={ACCENT_OPTIONS}
            onChange={(v) => setTweak("accent", v)}
          />
        </TweakSection>

        <TweakSection label="Type">
          <TweakRadio
            label="Display serif"
            value={t.serif}
            options={Object.keys(SERIF_OPTIONS)}
            onChange={(v) => setTweak("serif", v)}
          />
        </TweakSection>

        <TweakSection label="Stage">
          <TweakColor
            label="Page background"
            value={t.background}
            options={BG_OPTIONS}
            onChange={(v) => setTweak("background", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Load extra serif options on demand
const extraFonts = document.createElement("link");
extraFonts.rel = "stylesheet";
extraFonts.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@0;1&family=DM+Serif+Display:ital@0;1&family=Newsreader:ital@0;1&display=swap";
document.head.appendChild(extraFonts);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
