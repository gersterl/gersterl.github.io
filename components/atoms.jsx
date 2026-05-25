/* global React */
// Shared atoms — exposed on window for sibling babel scripts.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Tabler-ish inline icons (kept light; only the few we actually need).
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
      return <svg {...props}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3M15 21v-3.5a3 3 0 0 0-1-2.3c3.1-.3 6-1.5 6-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.3-3.9 1.5a13.4 13.4 0 0 0-7 0C4.8 .6 3.6.9 3.6.9a5 5 0 0 0-.1 3.8A5.4 5.4 0 0 0 2 8.5c0 5.5 2.9 6.7 6 7a3 3 0 0 0-1 2.3V21"/></svg>;
    case "external":
      return <svg {...props}><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5M15 3h6v6M10 14L20 4"/></svg>;
    case "dot":
      return <svg {...props}><circle cx="12" cy="12" r="3" fill={color} stroke="none"/></svg>;
    default:
      return null;
  }
}

// Nav bar — pure presentational, navigation handled by parent.
function NavBar({ current, onNav, accent = "var(--ink)" }) {
  const items = [
    { id: "index", label: "Index" },
    { id: "work", label: "Work" },
    { id: "cv", label: "CV" },
    { id: "contact", label: "Contact" },
  ];
  // "Work" is a meta — clicking it goes back to index for now.
  const handle = (id) => () => onNav(id === "work" ? "index" : id);
  const isActive = (id) => {
    if (id === "index") return current === "index";
    if (id === "cv") return current === "cv";
    if (id === "contact") return current === "contact";
    if (id === "work") return ["aerospace","robotics","software"].includes(current);
    return false;
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 28px", borderBottom: "0.5px solid rgba(28,27,23,0.15)",
    }}>
      <div
        className="serif"
        onClick={() => onNav("index")}
        style={{ fontSize: 20, fontStyle: "italic", letterSpacing: "-0.01em", color: "var(--ink)", cursor: "pointer" }}
      >
        Lukas Gerster
      </div>
      <div style={{ display: "flex", gap: 28, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(28,27,23,0.55)", fontFamily: "var(--font-mono)" }}>
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
      <div className="mono" style={{ fontSize: 11, color: "rgba(28,27,23,0.45)" }}>47.5°N / 8.7°E</div>
    </div>
  );
}

// Footer — shared across pages
function Footer({ left = "← INDEX", center = "", right = "" , onLeft, onRight }) {
  return (
    <div style={{
      padding: "18px 28px", display: "flex", justifyContent: "space-between",
      fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(28,27,23,0.55)",
      letterSpacing: "0.08em", borderTop: "0.5px solid rgba(28,27,23,0.15)",
    }}>
      <span style={{ cursor: onLeft ? "pointer" : "default" }} onClick={onLeft}>{left}</span>
      <span>{center}</span>
      <span style={{ cursor: onRight ? "pointer" : "default" }} onClick={onRight}>{right}</span>
    </div>
  );
}

// Striped placeholder block — for unfilled imagery slots.
function PlaceholderArt({ label, height = 220, tint = "rgba(28,27,23,0.5)", bg = "#EBE6DB", children }) {
  return (
    <div className="placeholder-stripe" style={{
      background: bg,
      borderRadius: "var(--border-radius-lg)",
      height,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      border: "0.5px solid rgba(28,27,23,0.08)",
    }}>
      {children}
      {label && (
        <div className="mono" style={{
          position: "absolute", bottom: 12, left: 14,
          fontSize: 10, color: tint, letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// Page section header — eyebrow + serif title
function SectionHead({ eyebrow, title, italic, color = "var(--ink)" }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="eyebrow" style={{ marginBottom: 12, color: "rgba(28,27,23,0.5)" }}>{eyebrow}</div>
      <h2 className="serif" style={{
        fontSize: 36, lineHeight: 1, letterSpacing: "-0.02em", margin: 0, color,
      }}>
        {title}{italic ? <> <span className="italic">{italic}</span></> : null}
      </h2>
    </div>
  );
}

Object.assign(window, { Icon, NavBar, Footer, PlaceholderArt, SectionHead });
