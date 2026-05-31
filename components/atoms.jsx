/* global React */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Icon({ name, size = 20, stroke = 1.6, color = "currentColor", style }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "plane":
      return <svg {...props}><path d="M16 10h4a2 2 0 1 1 0 4h-4l-4 7h-3l2-7H7l-2 2H2l2-4l-2-4h3l2 2h4l-2-7h3z"/></svg>;
    case "robot":
      return <svg {...props}><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M9 4l1 4M15 4l-1 4"/><circle cx="9" cy="13" r="0.5" fill={color}/><circle cx="15" cy="13" r="0.5" fill={color}/><path d="M10 17h4"/></svg>;
    case "scan":
      return <svg {...props}><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><circle cx="12" cy="11" r="3"/><path d="M7 17c1-2 3-3 5-3s4 1 5 3"/></svg>;
    case "file":
      return <svg {...props}><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h4"/></svg>;
    case "arrow":
      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-left":
      return <svg {...props}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>;
    case "github":
      return <svg {...props}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3M15 21v-3.5a3 3 0 0 0-1-2.3c3.1-.3 6-1.5 6-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.3-3.9 1.5a13.4 13.4 0 0 0-7 0C4.8.6 3.6.9 3.6.9a5 5 0 0 0-.1 3.8A5.4 5.4 0 0 0 2 8.5c0 5.5 2.9 6.7 6 7a3 3 0 0 0-1 2.3V21"/></svg>;
    case "external":
      return <svg {...props}><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5M15 3h6v6M10 14L20 4"/></svg>;
    case "download":
      return <svg {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>;
    default:
      return null;
  }
}

function NavBar({ current, onNav }) {
  const items = [
    { id: "index", label: "Index" },
    { id: "work",  label: "Work" },
    { id: "cv",    label: "CV" },
    { id: "contact", label: "Contact" },
  ];
  const handle = (id) => () => {
    if (id === "work") return onNav("index", "work-list");
    onNav(id);
  };
  const isActive = (id) => {
    if (id === "index") return current === "index";
    if (id === "cv") return current === "cv";
    if (id === "contact") return current === "contact";
    if (id === "work") return ["aerospace","robotics","software"].includes(current);
    return false;
  };
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 44px",
      background: "rgba(4,8,16,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "0.5px solid rgba(0,212,255,0.12)",
    }}>
      <div
        onClick={() => onNav("index")}
        style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--text)", cursor: "pointer",
          transition: "color 180ms, text-shadow 180ms",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--cyan)"; e.currentTarget.style.textShadow = "0 0 16px rgba(0,212,255,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.textShadow = "none"; }}
      >
        Lukas Gerster
      </div>
      <div style={{ display: "flex", gap: 30, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {items.map(it => (
          <span
            key={it.id}
            className={"nav-link" + (isActive(it.id) ? " is-active" : "")}
            onClick={handle(it.id)}
          >
            {it.label}
          </span>
        ))}
      </div>
    </nav>
  );
}

function Footer({ left = "", center = "", right = "", onLeft, onRight }) {
  const linkStyle = (hasHandler) => ({
    cursor: hasHandler ? "pointer" : "default",
    transition: "color 150ms",
  });
  return (
    <div style={{
      padding: "18px 40px", display: "flex", justifyContent: "space-between",
      fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)",
      letterSpacing: "0.1em", borderTop: "0.5px solid var(--rule)",
    }}>
      <span
        style={linkStyle(!!onLeft)}
        onMouseEnter={e => onLeft && (e.currentTarget.style.color = "var(--text-2)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
        onClick={onLeft}
      >{left}</span>
      <span>{center}</span>
      <span
        style={linkStyle(!!onRight)}
        onMouseEnter={e => onRight && (e.currentTarget.style.color = "var(--text-2)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
        onClick={onRight}
      >{right}</span>
    </div>
  );
}

function PlaceholderArt({ label, height = 220, children }) {
  return (
    <div className="placeholder-stripe" style={{
      background: "var(--bg-2)", borderRadius: "var(--r-md)", height,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      border: "0.5px solid var(--rule)",
    }}>
      {children}
      {label && (
        <div className="eyebrow" style={{ position: "absolute", bottom: 12, left: 14 }}>
          {label}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Icon, NavBar, Footer, PlaceholderArt });
