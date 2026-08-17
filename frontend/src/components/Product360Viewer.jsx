import { useRef, useState } from "react";

/**
 * Drag-to-rotate 360 viewer.
 *
 * Two modes:
 *  - Real photography: pass `frames` (array of image URLs, ideally 24-36 shots
 *    taken around the product on a turntable) and it cycles through them as
 *    the user drags — this is how most real e-commerce 360 viewers work.
 *  - Fallback: if no frames are supplied, it renders the shoe illustration and
 *    spins it in 3D with CSS as a stand-in until real product photography exists.
 */
export default function Product360Viewer({ frames = [], accent = "#C8FF00" }) {
  const [angle, setAngle] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const hasFrames = frames.length > 0;

  const handleDown = (clientX) => { dragging.current = true; lastX.current = clientX; };
  const handleMove = (clientX) => {
    if (!dragging.current) return;
    const delta = clientX - lastX.current;
    lastX.current = clientX;

    if (hasFrames) {
      const step = Math.round(delta / 8);
      if (step !== 0) {
        setFrameIndex((i) => (i - step + frames.length) % frames.length);
      }
    } else {
      setAngle((a) => a + delta * 0.6);
    }
  };
  const handleUp = () => { dragging.current = false; };

  return (
    <div
      className="relative select-none cursor-grab active:cursor-grabbing rounded-lg border border-steeldim bg-ink2 h-[320px] flex items-center justify-center overflow-hidden touch-none"
      onMouseDown={(e) => handleDown(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={(e) => handleDown(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleUp}
    >
      <span className="absolute top-3 left-3 font-mono text-[10px] bg-volt text-ink px-2.5 py-1 rounded-full font-bold z-10">
        360°
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] text-steel z-10">
        ↔ Drag to rotate
      </span>

      {hasFrames ? (
        <img src={frames[frameIndex]} alt={`Product view ${frameIndex + 1}`} className="max-h-full max-w-full object-contain" draggable={false} />
      ) : (
        <div style={{ perspective: "900px" }} className="w-4/5">
          <svg
            viewBox="0 0 800 400"
            style={{ transform: `rotateY(${angle}deg)`, transition: dragging.current ? "none" : "transform .3s ease" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M130,270 L690,270 C700,270 707,280 700,291 C650,312 300,317 158,309 C138,306 124,296 130,281 Z" fill="#1C2126" stroke="#4A4F58" strokeWidth="2"/>
            <path d="M132,271 L688,271 L688,286 C620,297 300,301 165,296 C148,294 133,286 132,278 Z" fill={accent}/>
            <path d="M120,262 C120,232 142,206 176,196 C212,186 232,150 272,140 C332,124 422,120 482,130 C562,142 632,166 676,206 C696,223 701,241 691,256 L691,271 L130,271 Z" fill="#EDEAE3" stroke="#4A4F58" strokeWidth="2"/>
            <path d="M162,232 C252,272 402,272 522,222 C562,207 602,197 652,207 C602,232 502,257 402,252 C302,250 202,247 162,232 Z" fill={accent} opacity="0.85"/>
          </svg>
        </div>
      )}
    </div>
  );
}
