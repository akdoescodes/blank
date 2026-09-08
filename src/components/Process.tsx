import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PROCESS } from '../data/site';
import { useReveal } from './useReveal';
import './Process.css';

/* Wave geometry: nodes evenly spaced across an inset track, alternating
   above / below the centreline. The inset keeps the outermost labels
   ("Discover", "Support / Maintenance") clear of the container edges. */
const VB_W = 1200;
const VB_H = 132;
const MID = VB_H / 2;
const AMP = 30;
const INSET = 92;
const N = PROCESS.stages.length;
const SPAN = (VB_W - INSET * 2) / (N - 1);

const nodeX = (i: number) => INSET + i * SPAN;
const nodeY = (i: number) => (i % 2 === 0 ? MID - AMP : MID + AMP);

/** Smooth cubic path threaded through every node, running just past both edges. */
function wavePath() {
  const pts: Array<[number, number]> = [[-30, MID + AMP * 0.75]];
  for (let i = 0; i < N; i++) pts.push([nodeX(i), nodeY(i)]);
  pts.push([VB_W + 30, MID + AMP * 0.75]);

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x1 - x0) / 2;
    d += ` C ${x0 + cx} ${y0}, ${x1 - cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const PATH = wavePath();

/** Time for the line to travel the whole track, so each step gets ~3.4s. */
const SWEEP_MS = 3400 * N;

export default function Process() {
  const [active, setActive] = useState(0);
  const [marks, setMarks] = useState<number[]>([]);

  const pathRef = useRef<SVGPathElement | null>(null);
  const progressRef = useRef<SVGPathElement | null>(null);
  const cometRef = useRef<SVGCircleElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);

  // Animation state lives in refs so the line can move every frame without
  // re-rendering the whole section.
  const pos = useRef(0);
  const marksRef = useRef<number[]>([]);
  const inView = useRef(false);
  const paused = useRef(false);

  const ref = useReveal<HTMLDivElement>();
  const stage = PROCESS.stages[active];

  /* Measure how far along the curve each node sits, so a step lights up exactly
     as the line reaches its dot. */
  useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p || typeof p.getTotalLength !== 'function') return;

    const total = p.getTotalLength();
    if (!total) return;

    const fracAt = (targetX: number) => {
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (p.getPointAtLength(mid).x < targetX) lo = mid;
        else hi = mid;
      }
      return (((lo + hi) / 2) / total) * 100;
    };

    const next = PROCESS.stages.map((_, i) => fracAt(nodeX(i)));
    marksRef.current = next;
    setMarks(next);
  }, []);

  /* One continuous sweep: the line is always travelling, and each stage flips
     over the moment the head passes its dot. */
  useEffect(() => {
    const el = waveRef.current;
    const line = pathRef.current;
    if (!el || !line) return;

    const reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([e]) => {
              if (e.isIntersecting && !inView.current) pos.current = 0; // restart on arrival
              inView.current = e.isIntersecting;
            },
            { threshold: 0.2 }
          )
        : undefined;
    io?.observe(el);
    if (!io) inView.current = true;

    let frame = 0;
    let last = performance.now();
    const total = line.getTotalLength();

    const render = (now: number) => {
      const dt = Math.min(now - last, 64); // ignore long tab-away gaps
      last = now;

      if (inView.current && !paused.current && !reduced) {
        pos.current += (100 / SWEEP_MS) * dt;
        if (pos.current > 100) pos.current = 0;
      }

      const p = pos.current;
      if (progressRef.current) progressRef.current.style.strokeDashoffset = String(100 - p);

      if (cometRef.current && total) {
        const pt = line.getPointAtLength((p / 100) * total);
        cometRef.current.setAttribute('cx', pt.x.toFixed(1));
        cometRef.current.setAttribute('cy', pt.y.toFixed(1));
        cometRef.current.style.opacity = p > 0.5 && p < 99.5 ? '1' : '0';
      }

      // Light up the last dot the head has passed.
      const m = marksRef.current;
      if (m.length) {
        let i = 0;
        for (let k = 0; k < m.length; k++) if (p >= m[k]) i = k;
        setActive((prev) => (prev === i ? prev : i));
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, []);

  /** Clicking a step drops the head straight onto that dot and keeps flowing. */
  const jumpTo = (i: number) => {
    pos.current = marksRef.current[i] ?? 0;
    setActive(i);
  };

  return (
    <section className="section process" id="process">
      <div className="glow process__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{PROCESS.eyebrow}</span>
            <h2 className="display-2">{PROCESS.title}</h2>
          </div>
          <p className="sec-head__lede">{PROCESS.lede}</p>
        </header>

        {/* ── Wave timeline ────────────────────────────────────────────── */}
        <div className="wave" ref={waveRef}>
          <div className="wave__rail">
            <svg
              className="wave__svg"
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="wave__line" ref={pathRef} d={PATH} pathLength={100} />
              <path className="wave__progress" ref={progressRef} d={PATH} pathLength={100} />
              <circle className="wave__comet" ref={cometRef} r="5" />
            </svg>

            <ul className="wave__nodes">
              {PROCESS.stages.map((s, i) => {
                const above = i % 2 === 0;
                const reached = marks.length > 0 && i <= active;
                return (
                  <li
                    key={s.key}
                    className={`wave__node${above ? ' is-above' : ' is-below'}${
                      i === active ? ' is-active' : ''
                    }${reached && i < active ? ' is-done' : ''}`}
                    style={{
                      left: `${(nodeX(i) / VB_W) * 100}%`,
                      top: `${(nodeY(i) / VB_H) * 100}%`,
                      transitionDelay: `${i * 70}ms`,
                    }}
                  >
                    {/* Pausing is scoped to the step itself, so a cursor
                        resting anywhere else does not stall the timeline. */}
                    <button
                      className="wave__btn"
                      onClick={() => jumpTo(i)}
                      onMouseEnter={() => (paused.current = true)}
                      onMouseLeave={() => (paused.current = false)}
                      onFocus={() => (paused.current = true)}
                      onBlur={() => (paused.current = false)}
                      aria-pressed={i === active}
                    >
                      <span className="wave__label">
                        <span className="wave__name">{s.key}</span>
                        <span className="wave__sub">{s.sub}</span>
                      </span>
                      <span className="wave__dot" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ── Active stage detail ──────────────────────────────────────── */}
        <div className="stage" key={active}>
          <div className="stage__index">
            <span className="stage__index-label">Stage</span>
            <span className="stage__index-n">{String(active + 1).padStart(2, '0')}</span>
          </div>

          <div className="stage__main">
            <h3 className="stage__title display-3">{stage.title}</h3>
            <p className="stage__body">{stage.body}</p>
          </div>

          <div className="stage__gets">
            <p className="stage__gets-label">What You Get</p>
            <ul>
              {stage.gets.map((g, i) => (
                <li key={g} style={{ animationDelay: `${120 + i * 70}ms` }}>
                  <span className="stage__bullet" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
