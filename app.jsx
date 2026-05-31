/* global React, ReactDOM, NavBar, IntroOverlay, IndexPage, AerospacePage, RoboticsPage, SoftwarePage, CVPage, ContactPage */

const { useState, useEffect, useRef } = React;

function App() {
  const [page, setPage] = useState("index");
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem("intro-done"));
  const pendingAnchor = useRef(null);

  // Scroll: to the requested section if one is pending, else to the top.
  // Runs in rAF so the freshly-committed page has been laid out first.
  const runScroll = () => {
    const anchor = pendingAnchor.current;
    pendingAnchor.current = null;
    requestAnimationFrame(() => {
      const el = anchor && document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const nav = (p, anchor) => {
    pendingAnchor.current = anchor || null;
    if (p === page) runScroll();   // same page: section already mounted
    else setPage(p);               // page change: scroll after commit (effect below)
  };

  // After a page change commits, the target section exists in the DOM.
  useEffect(() => { runScroll(); }, [page]);

  let body;
  switch (page) {
    case "aerospace": body = <AerospacePage onNav={nav} />; break;
    case "robotics":  body = <RoboticsPage  onNav={nav} />; break;
    case "software":  body = <SoftwarePage  onNav={nav} />; break;
    case "cv":        body = <CVPage        onNav={nav} />; break;
    case "contact":   body = <ContactPage   onNav={nav} />; break;
    default:          body = <IndexPage     onNav={nav} />;
  }

  return (
    <div className="page-root">
      <NavBar current={page} onNav={nav} />
      {body}
      {showIntro && (
        <IntroOverlay
          onComplete={() => {
            sessionStorage.setItem("intro-done", "1");
            setShowIntro(false);
          }}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
