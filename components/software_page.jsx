/* global React, Icon, Footer */
// Software — live arm-tracking demo (MediaPipe Pose) as the case study.

const { useState: useSoftState, useEffect: useSoftEffect, useRef: useSoftRef } = React;

// Arm landmark indices (MediaPipe Pose)
const LM = {
  L_SHOULDER: 11, R_SHOULDER: 12,
  L_ELBOW: 13,    R_ELBOW: 14,
  L_WRIST: 15,    R_WRIST: 16,
};

// Compute angle (deg) at point B given points A, B, C
function angleAt(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m1 = Math.hypot(v1.x, v1.y);
  const m2 = Math.hypot(v2.x, v2.y);
  if (m1 === 0 || m2 === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)));
  return Math.acos(cos) * 180 / Math.PI;
}

// Shoulder elevation = angle of (shoulder → elbow) vector from vertical (downward)
function elevationFromVertical(shoulder, elbow) {
  const dx = elbow.x - shoulder.x;
  const dy = elbow.y - shoulder.y;
  const ang = Math.atan2(dx, dy) * 180 / Math.PI; // 0 when straight down
  return ang;
}

function PoseTracker() {
  const videoRef = useSoftRef(null);
  const canvasRef = useSoftRef(null);
  const landmarkerRef = useSoftRef(null);
  const rafRef = useSoftRef(0);
  const lastTRef = useSoftRef(0);
  const [status, setStatus] = useSoftState("idle"); // idle | loading | ready | running | error
  const [errMsg, setErrMsg] = useSoftState("");
  const [fps, setFps] = useSoftState(0);
  const [angles, setAngles] = useSoftState({
    rShoulder: null, rElbow: null,
    lShoulder: null, lElbow: null,
  });

  async function start() {
    if (status === "loading" || status === "running") return;
    setStatus("loading");
    setErrMsg("");
    try {
      // 1. Get camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      const video = videoRef.current;
      video.srcObject = stream;
      await new Promise((res) => { video.onloadedmetadata = res; });
      await video.play();

      // 2. Load MediaPipe (it was preloaded into window.__mpVision by the module shim in index.html)
      const mp = window.__mpVision;
      if (!mp) throw new Error("MediaPipe failed to load. Refresh and try again.");
      if (!landmarkerRef.current) {
        const vision = await mp.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        landmarkerRef.current = await mp.PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });
      }

      setStatus("running");
      lastTRef.current = performance.now();
      loop();
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrMsg(e?.message || "Couldn't start the camera.");
    }
  }

  function stop() {
    cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
    if (v && v.srcObject) {
      v.srcObject.getTracks().forEach(t => t.stop());
      v.srcObject = null;
    }
    setStatus("idle");
    setFps(0);
  }

  function loop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const lm = landmarkerRef.current;
    if (!video || !canvas || !lm) return;

    const now = performance.now();
    const result = lm.detectForVideo(video, now);
    const ctx = canvas.getContext("2d");

    // Match canvas to video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (result.landmarks && result.landmarks.length > 0) {
      const pts = result.landmarks[0]; // first detected person
      const get = (i) => ({ x: pts[i].x * canvas.width, y: pts[i].y * canvas.height });

      const rS = get(LM.R_SHOULDER), rE = get(LM.R_ELBOW), rW = get(LM.R_WRIST);
      const lS = get(LM.L_SHOULDER), lE = get(LM.L_ELBOW), lW = get(LM.L_WRIST);

      // Shoulder bar
      drawLine(ctx, rS, lS, "rgba(168,100,44,0.7)", 2);

      // Right arm (warm)
      drawSeg(ctx, rS, rE, "#A8642C");
      drawSeg(ctx, rE, rW, "#A8642C");
      drawJoint(ctx, rS, "#A8642C", "R·S");
      drawJoint(ctx, rE, "#A8642C", "R·E");
      drawJoint(ctx, rW, "#A8642C", "R·W");

      // Left arm (cool)
      drawSeg(ctx, lS, lE, "#08423A");
      drawSeg(ctx, lE, lW, "#08423A");
      drawJoint(ctx, lS, "#08423A", "L·S");
      drawJoint(ctx, lE, "#08423A", "L·E");
      drawJoint(ctx, lW, "#08423A", "L·W");

      // Compute angles — these are what would drive the arm
      setAngles({
        rShoulder: Math.round(elevationFromVertical(rS, rE)),
        rElbow: Math.round(angleAt(rS, rE, rW)),
        lShoulder: Math.round(elevationFromVertical(lS, lE)),
        lElbow: Math.round(angleAt(lS, lE, lW)),
      });
    } else {
      setAngles({ rShoulder: null, rElbow: null, lShoulder: null, lElbow: null });
    }

    // FPS
    const dt = now - lastTRef.current;
    lastTRef.current = now;
    if (dt > 0) setFps(Math.round(1000 / dt));

    rafRef.current = requestAnimationFrame(loop);
  }

  useSoftEffect(() => () => stop(), []); // cleanup on unmount

  const showOverlay = status !== "running";

  return (
    <div style={{
      background: "#FFFFFF", border: "0.5px solid rgba(28,27,23,0.1)",
      borderRadius: "var(--border-radius-lg)", overflow: "hidden",
      display: "grid", gridTemplateColumns: "1.4fr 1fr",
    }}>
      {/* LEFT — video + canvas */}
      <div style={{ position: "relative", background: "#0E0D0A", aspectRatio: "16 / 10", overflow: "hidden" }}>
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: "scaleX(-1)", // mirror for natural feel
            display: status === "running" ? "block" : "none",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            transform: "scaleX(-1)", pointerEvents: "none",
            display: status === "running" ? "block" : "none",
          }}
        />

        {/* Overlay: idle / loading / error */}
        {showOverlay && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 24,
            background: "linear-gradient(180deg, #1B1A16 0%, #0E0D0A 100%)",
            color: "var(--cream)",
          }}>
            {/* Stylised silhouette */}
            <svg viewBox="0 0 200 160" style={{ width: "55%", maxWidth: 280, opacity: 0.5, marginBottom: 18 }}>
              {/* head */}
              <circle cx="100" cy="34" r="14" fill="none" stroke="#C9D8E8" strokeWidth="1.4"/>
              {/* torso */}
              <line x1="100" y1="48" x2="100" y2="118" stroke="#C9D8E8" strokeWidth="1.4"/>
              {/* shoulders */}
              <line x1="68" y1="60" x2="132" y2="60" stroke="#C9D8E8" strokeWidth="1.4"/>
              {/* arms */}
              <line x1="68" y1="60" x2="50" y2="98" stroke="#C9D8E8" strokeWidth="1.4"/>
              <line x1="50" y1="98" x2="40" y2="132" stroke="#C9D8E8" strokeWidth="1.4"/>
              <line x1="132" y1="60" x2="160" y2="86" stroke="#C9D8E8" strokeWidth="1.4"/>
              <line x1="160" y1="86" x2="170" y2="50" stroke="#C9D8E8" strokeWidth="1.4"/>
              {/* joints */}
              {[[68,60],[132,60],[50,98],[40,132],[160,86],[170,50]].map(([x,y],i) =>
                <circle key={i} cx={x} cy={y} r="3.2" fill="#A8642C"/>
              )}
            </svg>

            {status === "idle" && (
              <>
                <h4 className="serif" style={{ fontSize: 22, margin: "0 0 8px", textWrap: "balance", textAlign: "center" }}>
                  Live arm tracking, in your browser.
                </h4>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: "0 0 18px", textAlign: "center", maxWidth: 320, color: "rgba(244,241,234,0.7)" }}>
                  The same pipeline that drives the robotic arm. Enable your camera and the system will detect your arms in real time and compute the joint angles.
                </p>
                <button onClick={start} style={{
                  background: "var(--cream)", color: "var(--ink)",
                  border: "none", padding: "11px 22px", borderRadius: 999,
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em",
                  cursor: "pointer", textTransform: "uppercase",
                }}>
                  Enable camera →
                </button>
                <div className="mono" style={{ fontSize: 9, color: "rgba(244,241,234,0.4)", letterSpacing: "0.14em", marginTop: 14, textAlign: "center" }}>
                  RUNS LOCALLY · NOTHING UPLOADED
                </div>
              </>
            )}

            {status === "loading" && (
              <>
                <h4 className="serif" style={{ fontSize: 22, margin: "0 0 6px" }}>Loading model…</h4>
                <p style={{ fontSize: 13, color: "rgba(244,241,234,0.6)", margin: 0, textAlign: "center" }}>
                  Downloading MediaPipe Pose (~5 MB).
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <h4 className="serif" style={{ fontSize: 20, margin: "0 0 6px", color: "#E8C7A8" }}>Couldn't start.</h4>
                <p style={{ fontSize: 13, color: "rgba(244,241,234,0.7)", margin: "0 0 16px", textAlign: "center", maxWidth: 320 }}>
                  {errMsg || "Camera permission denied or unavailable."}
                </p>
                <button onClick={start} style={{
                  background: "transparent", color: "var(--cream)",
                  border: "1px solid rgba(244,241,234,0.4)", padding: "9px 18px", borderRadius: 999,
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", cursor: "pointer",
                }}>
                  Try again
                </button>
              </>
            )}
          </div>
        )}

        {/* Live HUD when running */}
        {status === "running" && (
          <>
            <div className="mono" style={{
              position: "absolute", top: 12, left: 12,
              background: "rgba(8,7,5,0.75)", color: "var(--cream)",
              padding: "5px 10px", borderRadius: 4,
              fontSize: 10, letterSpacing: "0.14em",
            }}>
              ● LIVE · {fps} FPS
            </div>
            <button onClick={stop} style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(8,7,5,0.75)", color: "var(--cream)",
              border: "none", padding: "5px 12px", borderRadius: 4,
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", cursor: "pointer",
            }}>
              STOP
            </button>
          </>
        )}
      </div>

      {/* RIGHT — angle readout */}
      <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--soft-ink)", letterSpacing: "0.14em", marginBottom: 14 }}>
          — JOINT ANGLES · DEG
        </div>

        <AngleBlock label="RIGHT SHOULDER" value={angles.rShoulder} color="var(--aero-accent)" range={[-90, 90]} />
        <AngleBlock label="RIGHT ELBOW" value={angles.rElbow} color="var(--aero-accent)" range={[0, 180]} />
        <div style={{ height: 14 }}/>
        <AngleBlock label="LEFT SHOULDER" value={angles.lShoulder} color="var(--robo-ink)" range={[-90, 90]} />
        <AngleBlock label="LEFT ELBOW" value={angles.lElbow} color="var(--robo-ink)" range={[0, 180]} />

        <div style={{ flex: 1 }}/>
        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: "0.5px solid rgba(28,27,23,0.1)",
        }}>
          <div className="mono" style={{ fontSize: 9, color: "rgba(28,27,23,0.5)", letterSpacing: "0.14em", marginBottom: 6 }}>
            — IN PRODUCTION
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "rgba(28,27,23,0.7)", margin: 0, textWrap: "pretty" }}>
            These four angles map to the four joints on the arm. The ESP32 reads them over serial and commands each stepper to match — closed loop via the AS5600 encoders.
          </p>
        </div>
      </div>
    </div>
  );
}

function AngleBlock({ label, value, color, range }) {
  const has = value !== null && value !== undefined;
  // Normalised position for the dial bar
  const pct = has ? Math.max(0, Math.min(1, (value - range[0]) / (range[1] - range[0]))) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 9.5, color: "rgba(28,27,23,0.55)", letterSpacing: "0.12em" }}>{label}</span>
        <span className="mono" style={{ fontSize: 16, color: has ? color : "rgba(28,27,23,0.25)", letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
          {has ? `${value}°` : "— °"}
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(28,27,23,0.08)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${pct * 100}%`, background: color, opacity: has ? 0.9 : 0,
          transition: "width 80ms linear",
        }}/>
      </div>
    </div>
  );
}

// Canvas helpers
function drawSeg(ctx, a, b, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}
function drawLine(ctx, a, b, color, w) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.setLineDash([]);
}
function drawJoint(ctx, p, color, label) {
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function SoftwarePage({ onNav }) {
  return (
    <div className="page" data-screen-label="04 Software" style={{ color: "var(--ink)" }}>

      {/* HERO BAND */}
      <div style={{ padding: "56px 28px 48px", background: "var(--soft)", borderBottom: "0.5px solid rgba(24,95,165,0.3)" }}>
        <div className="eyebrow" style={{ color: "var(--soft-ink)", marginBottom: 18 }}>— 03 / SOFTWARE</div>
        <h1 className="serif" style={{
          fontSize: 76, lineHeight: 0.94, letterSpacing: "-0.028em", margin: "0 0 24px", color: "var(--soft-deep)",
        }}>
          The camera<br /><span className="italic">moves the arm.</span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "end" }}>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--soft-ink)", maxWidth: 540, margin: 0 }}>
            One software project, but the one that ties everything together. A webcam watches my arm. MediaPipe Pose finds the joints. The angles are streamed to the ESP32 on the robotic arm — which then mirrors what I'm doing.
          </p>
          <div className="mono" style={{ fontSize: 11, color: "var(--soft-ink)", letterSpacing: "0.1em", textAlign: "right", lineHeight: 1.7 }}>
            CAMERA → ANGLES → ARM<br />
            RUNS IN BROWSER<br />
            ESP32 OVER SERIAL
          </div>
        </div>
      </div>

      {/* LIVE DEMO */}
      <div style={{ padding: "32px 28px 0" }}>
        <PoseTracker />
      </div>

      {/* PIPELINE */}
      <div style={{ padding: "40px 28px 28px" }}>
        <div className="eyebrow" style={{ color: "rgba(28,27,23,0.5)", marginBottom: 18 }}>— PIPELINE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "0.5px solid rgba(28,27,23,0.12)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "#FFFFFF" }}>
          {[
            { n: "01", t: "Capture", d: "Webcam feed at 30 FPS." },
            { n: "02", t: "Detect", d: "MediaPipe Pose Landmarker (lite). 33 landmarks." },
            { n: "03", t: "Reduce", d: "Keep shoulder/elbow/wrist. Compute 4 joint angles." },
            { n: "04", t: "Drive", d: "Stream over serial to ESP32. Steppers track in closed loop." },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 20,
              borderRight: i < 3 ? "0.5px solid rgba(28,27,23,0.12)" : "none",
            }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--soft-ink)", letterSpacing: "0.14em", marginBottom: 10 }}>
                — {s.n}
              </div>
              <div className="serif" style={{ fontSize: 18, marginBottom: 6, letterSpacing: "-0.005em" }}>{s.t}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "rgba(28,27,23,0.7)", margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRINCIPLES STRIP */}
      <div style={{ padding: "0 28px 36px" }}>
        <div style={{
          background: "var(--ink)", color: "var(--cream)", borderRadius: "var(--border-radius-lg)",
          padding: "28px 32px",
        }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(244,241,234,0.55)", letterSpacing: "0.14em", marginBottom: 14 }}>
            — RULES OF THUMB
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              "Write it twice before importing a library.",
              "If the loop runs at 30 FPS, the print statement is the bug.",
              "Hardware lies first; trust the scope, not the log.",
            ].map((t, i) => (
              <p key={i} className="serif italic" style={{ fontSize: 18, lineHeight: 1.35, margin: 0, textWrap: "balance" }}>
                <span className="mono" style={{ fontStyle: "normal", fontSize: 10, color: "var(--soft)", letterSpacing: "0.14em", display: "block", marginBottom: 6 }}>0{i+1}</span>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>

      <Footer
        left="← ROBOTICS"
        center="03 / SOFTWARE"
        right="CV →"
        onLeft={() => onNav("robotics")}
        onRight={() => onNav("cv")}
      />
    </div>
  );
}

window.SoftwarePage = SoftwarePage;
