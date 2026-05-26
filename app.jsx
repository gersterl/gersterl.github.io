/* global React, ReactDOM, NavBar, IntroOverlay, IndexPage, AerospacePage, RoboticsPage, SoftwarePage, CVPage, ContactPage */

const { useState } = React;

function App() {
  const [page, setPage] = useState("index");
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem("intro-done"));

  const nav = (p) => {
    setPage(p);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

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
