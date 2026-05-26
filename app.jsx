/* global React, ReactDOM, NavBar, IndexPage, AerospacePage, RoboticsPage, SoftwarePage, CVPage, ContactPage */

const { useState } = React;

function App() {
  const [page, setPage] = useState("index");

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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
