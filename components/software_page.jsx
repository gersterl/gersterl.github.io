/* global React, Icon, Footer */

const { useState: useSoftState, useEffect: useSoftEffect, useRef: useSoftRef } = React;

const LM = {
  L_SHOULDER: 11, R_SHOULDER: 12,
  L_ELBOW: 13,    R_ELBOW: 14,
  L_WRIST: 15,    R_WRIST: 16,
};

function angleAt(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m1 = Math.hypot(v1.x, v1.y);
  const m2 = Math.hypot(v2.x, v2.y);
  if (m1 === 0 || m2 === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot / (m1 * m2)))) * 180 / Math.PI;
}

function elevationFromVertical(shoulder, elbow) {
  return Math.atan2(elbow.x - shoulder.x, elbow.y - shoulder.y) * 180 / Math.PI;
}

function PoseTracker() {
  const videoRef = useSoftRef(null);
  const canvasRef = useSoftRef(null);
  const landmarkerRef = useSoftRef(null);
  const rafRef = useSoftRef(0);
  const lastTRef = useSoftRef(0);
  const [status, setStatus] = useSoftState("idle");
  const [errMsg, setErrMsg] = useSoftState("");
  const [fps, setFps] = useSoftState(0);
  const [angles, setAngles] = useSoftState({ rShoulder: null, rElbow: null, lShoulder: null, lElbow: null });

  async function start() {
    if (status === "loading" || status === "running") return;
    setStatus("loading");
    setErrMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" }, audio: false });
      const video = videoRef.current;
      video.srcObject = stream;
      await new Promise((res) => { video.onloadedmetadata = res; });
      await video.play();

      const mp = window.__mpVision;
      if (!mp) throw new Error("MediaPipe failed to load. Refresh and try again.");
      if (!landmarkerRef.current) {
        const vision = await mp.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm");
        landmarkerRef.current = await mp.PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO", numPoses: 1,
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
    if (v && v.srcObject) { v.srcObject.getTracks().forEach(t => t.stop()); v.srcObject = null; }
    setStatus("idle"); setFps(0);
  }

  function loop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const lm = landmarkerRef.current;
    if (!video || !canvas || !lm) return;

    const now = performance.now();
    const result = lm.detectForVideo(video, now);
    const ctx = canvas.getContext("2d");

    if (canvas.width !== video.videoWidth) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (result.landmarks && result.landmarks.length > 0) {
      const pts = result.landmarks[0];
      const get = (i) => ({ x: pts[i].x * canvas.width, y: pts[i].y * canvas.height });
      const rS = get(LM.R_SHOULDER), rE = get(LM.R_ELBOW), rW = get(LM.R_WRIST);
      const lS = get(LM.L_SHOULDER), lE = get(LM.L_ELBOW), lW = get(LM.L_WRIST);

      drawLine(ctx, rS, lS, "rgba(234,169,78,0.5)", 1.5);
      drawSeg(ctx, rS, rE, "#EAA94E"); drawSeg(ctx, rE, rW, "#EAA94E");
      drawJoint(ctx, rS, "#EAA94E"); drawJoint(ctx, rE, "#EAA94E"); drawJoint(ctx, rW, "#EAA94E");
      drawSeg(ctx, lS, lE, "#9BB8C8"); drawSeg(ctx, lE, lW, "#9BB8C8");
      drawJoint(ctx, lS, "#9BB8C8"); drawJoint(ctx, lE, "#9BB8C8"); drawJoint(ctx, lW, "#9BB8C8");

      setAngles({
        rShoulder: Math.round(elevationFromVertical(rS, rE)),
        rElbow: Math.round(angleAt(rS, rE, rW)),
        lShoulder: Math.round(elevationFromVertical(lS, lE)),
        lElbow: Math.round(angleAt(lS, lE, lW)),
      });
    } else {
      setAngles({ rShoulder: null, rElbow: null, lShoulder: null, lElbow: null });
    }

    const dt = now - lastTRef.current;
    lastTRef.current = now;
    if (dt > 0) setFps(Math.round(1000 / dt));
    rafRef.current = requestAnimationFrame(loop);
  }

  useSoftEffect(() => () => stop(), []);

  return (
    <div style={{
      background: "var(--bg-2)", border: "0.5px solid var(--rule)",
      borderRadius: "var(--r-lg)", overflow: "hidden",
      display: "grid", gridTemplateColumns: "1.4fr 1fr",
    }}>
      {/* LEFT — video */}
      <div style={{ position: "relative", background: "#060604", aspectRatio: "16 / 10", overflow: "hidden" }}>
        <video
          ref={videoRef}
          playsInline muted
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: "scaleX(-1)",
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

        {status !== "running" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 24,
            background: "linear-gradient(180deg, #111008 0%, #060604 100%)",
          }}>
            {/* Pose silhouette */}
            <svg viewBox="0 0 200 160" style={{ width: "50%", maxWidth: 260, opacity: 0.35, marginBottom: 20 }}>
              <circle cx="100" cy="34" r="14" fill="none" stroke="#EAA94E" strokeWidth="1.2"/>
              <line x1="100" y1="48" x2="100" y2="118" stroke="#EAA94E" strokeWidth="1.2"/>
              <line x1="68" y1="60" x2="132" y2="60" stroke="#EAA94E" strokeWidth="1.2"/>
              <line x1="68" y1="60" x2="50" y2="98" stroke="#EAA94E" strokeWidth="1.4"/>
              <line x1="50" y1="98" x2="40" y2="132" stroke="#EAA94E" strokeWidth="1.4"/>
              <line x1="132" y1="60" x2="160" y2="86" stroke="#9BB8C8" strokeWidth="1.4"/>
              <line x1="160" y1="86" x2="170" y2="50" stroke="#9BB8C8" strokeWidth="1.4"/>
              {[[68,60,"#EAA94E"],[50,98,"#EAA94E"],[40,132,"#EAA94E"],[132,60,"#9BB8C8"],[160,86,"#9BB8C8"],[170,50,"#9BB8C8"]].map(([x,y,c],i) =>
                <circle key={i} cx={x} cy={y} r="3" fill={c}/>
              )}
            </svg>

            {status === "idle" && (
              <>
                <h4 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 8px", color: "var(--text)", textAlign: "center" }}>
                  Live arm tracking, in your browser.
                </h4>
                <p style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 20px", textAlign: "center", maxWidth: 300, color: "var(--text-2)" }}>
                  Enable your camera and the system detects your arms in real time, computing the joint angles.
                </p>
                <button onClick={start} style={{
                  background: "var(--amber)", color: "var(--bg)",
                  border: "none", padding: "11px 24px", borderRadius: 999,
                  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
                  fontWeight: 500, textTransform: "uppercase",
                  transition: "opacity 180ms",
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.82"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  Enable camera
                </button>
                <div className="mono" style={{ fontSize: 9, color: "var(--text-4)", letterSpacing: "0.14em", marginTop: 14, textAlign: "center" }}>
                  RUNS LOCALLY · NOTHING UPLOADED
                </div>
              </>
            )}

            {status === "loading" && (
              <>
                <h4 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 6px", color: "var(--text)" }}>Loading model…</h4>
                <p style={{ fontSize: 13, color: "var(--text-2)", textAlign: "center" }}>Downloading MediaPipe Pose (~5 MB).</p>
              </>
            )}

            {status === "error" && (
              <>
                <h4 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 6px", color: "var(--amber)" }}>Couldn't start.</h4>
                <p style={{ fontSize: 13, color: "var(--text-2)", margin: "0 0 16px", textAlign: "center", maxWidth: 300 }}>
                  {errMsg || "Camera permission denied or unavailable."}
                </p>
                <button onClick={start} style={{
                  background: "transparent", color: "var(--text)",
                  border: "0.5px solid var(--rule-2)", padding: "9px 20px", borderRadius: 999,
                  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
                  transition: "border-color 180ms",
                }}>Try again</button>
              </>
            )}
          </div>
        )}

        {status === "running" && (
          <>
            <div className="mono" style={{
              position: "absolute", top: 12, left: 12,
              background: "rgba(6,6,4,0.8)", color: "var(--amber)",
              padding: "5px 10px", borderRadius: 4,
              fontSize: 10, letterSpacing: "0.14em",
            }}>
              <span className="pulse" style={{ background: "var(--amber)" }}/>LIVE · {fps} FPS
            </div>
            <button onClick={stop} style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(6,6,4,0.8)", color: "var(--text-2)",
              border: "0.5px solid var(--rule)", padding: "5px 12px", borderRadius: 4,
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
            }}>
              STOP
            </button>
          </>
        )}
      </div>

      {/* RIGHT — angle readout */}
      <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Joint angles · deg</div>

        <AngleBlock label="RIGHT SHOULDER" value={angles.rShoulder} color="#EAA94E" range={[-90, 90]} />
        <AngleBlock label="RIGHT ELBOW"    value={angles.rElbow}    color="#EAA94E" range={[0, 180]} />
        <div style={{ height: 14 }} />
        <AngleBlock label="LEFT SHOULDER"  value={angles.lShoulder} color="#9BB8C8" range={[-90, 90]} />
        <AngleBlock label="LEFT ELBOW"     value={angles.lElbow}    color="#9BB8C8" range={[0, 180]} />

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "0.5px solid var(--rule)" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>In production</div>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-2)" }}>
            These four angles map to the four joints on the arm. The ESP32 reads them over serial and commands each stepper to match — closed loop via the AS5600 encoders.
          </p>
        </div>
      </div>
    </div>
  );
}

function AngleBlock({ label, value, color, range }) {
  const has = value !== null && value !== undefined;
  const pct = has ? Math.max(0, Math.min(1, (value - range[0]) / (range[1] - range[0]))) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-3)", letterSpacing: "0.12em" }}>{label}</span>
        <span className="mono" style={{
          fontSize: 16, color: has ? color : "var(--text-4)",
          letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums",
        }}>
          {has ? `${value}°` : "— °"}
        </span>
      </div>
      <div style={{ height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct * 100}%`, background: color,
          opacity: has ? 0.85 : 0, transition: "width 80ms linear",
        }} />
      </div>
    </div>
  );
}

function drawSeg(ctx, a, b, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
}
function drawLine(ctx, a, b, color, w) {
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.setLineDash([]);
}
function drawJoint(ctx, p, color) {
  ctx.fillStyle = "var(--bg)"; ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
}

function SoftwarePage({ onNav }) {
  return (
    <div className="page" style={{ color: "var(--text)" }}>
      <div style={{ height: 57 }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{
        padding: "60px 40px 52px",
        background: "var(--bg-1)",
        borderBottom: "0.5px solid var(--rule)",
      }}>
        <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 20 }}>
          03 / Software
        </div>
        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(44px, 5.8vw, 76px)",
          fontWeight: 500, lineHeight: 1.02,
          letterSpacing: "-0.028em", margin: "0 0 28px",
        }}>
          The camera<br />
          <span style={{ color: "var(--amber)", fontWeight: 400 }}>moves the arm.</span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "end" }}>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--text-2)", maxWidth: 520 }}>
            One software project, but the one that ties everything together. A webcam watches my arm. MediaPipe Pose finds the joints. The angles are streamed to the ESP32 on the robotic arm — which then mirrors what I'm doing.
          </p>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textAlign: "right", lineHeight: 1.9 }}>
            CAMERA → ANGLES → ARM<br />
            RUNS IN BROWSER<br />
            ESP32 OVER SERIAL
          </div>
        </div>
      </div>

      {/* ── LIVE DEMO ────────────────────────────────────────── */}
      <div style={{ padding: "36px 40px 0" }}>
        <PoseTracker />
      </div>

      {/* ── PIPELINE ─────────────────────────────────────────── */}
      <div style={{ padding: "44px 40px 28px" }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>Pipeline</div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          border: "0.5px solid var(--rule)", borderRadius: "var(--r-lg)",
          overflow: "hidden", background: "var(--bg-2)",
        }}>
          {[
            { n: "01", t: "Capture",  d: "Webcam feed at 30 FPS." },
            { n: "02", t: "Detect",   d: "MediaPipe Pose Landmarker (lite). 33 landmarks." },
            { n: "03", t: "Reduce",   d: "Keep shoulder/elbow/wrist. Compute 4 joint angles." },
            { n: "04", t: "Drive",    d: "Stream over serial to ESP32. Steppers track in closed loop." },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 20,
              borderRight: i < 3 ? "0.5px solid var(--rule)" : "none",
            }}>
              <div className="eyebrow" style={{ color: "var(--amber)", marginBottom: 10 }}>{s.n}</div>
              <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 8 }}>{s.t}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--text-2)" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RULES ────────────────────────────────────────────── */}
      <div style={{ padding: "0 40px 36px" }}>
        <div style={{
          background: "var(--bg-2)", border: "0.5px solid var(--rule-2)",
          borderRadius: "var(--r-lg)", padding: "28px 32px",
        }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>Rules of thumb</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              "Write it twice before importing a library.",
              "If the loop runs at 30 FPS, the print statement is the bug.",
              "Hardware lies first; trust the scope, not the log.",
            ].map((t, i) => (
              <p key={i} style={{ fontSize: 17, lineHeight: 1.4, margin: 0, fontStyle: "italic", fontWeight: 300 }}>
                <span className="mono" style={{ fontStyle: "normal", fontSize: 9, color: "var(--amber)", letterSpacing: "0.14em", display: "block", marginBottom: 8 }}>0{i+1}</span>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>

      <Footer
        left="← Robotics"
        center="03 / Software"
        right="CV →"
        onLeft={() => onNav("robotics")}
        onRight={() => onNav("cv")}
      />
    </div>
  );
}

window.SoftwarePage = SoftwarePage;
