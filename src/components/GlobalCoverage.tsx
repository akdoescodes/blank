import { useEffect, useRef, useState } from 'react';
import createGlobe, { type COBEOptions } from 'cobe';
import { GLOBAL } from '../data/site';
import { useReveal } from './useReveal';
import './GlobalCoverage.css';

/* Palette converted to cobe's 0-1 RGB triples. */
const PRIMARY: [number, number, number] = [0.01, 0.52, 0.77]; // hsl(200 98% 39%)
const GREEN: [number, number, number] = [0.13, 0.71, 0.37]; // hsl(145 70% 42%)
const TEAL: [number, number, number] = [0.14, 0.56, 0.53]; // hsl(175 60% 35%)

const home = GLOBAL.countries.find((c) => c.home)!;

const markers = GLOBAL.countries.map((c) => ({
  location: [c.lat, c.lon] as [number, number],
  size: c.home ? 0.075 : 0.045,
  color: c.home ? GREEN : PRIMARY,
}));

const arcs = GLOBAL.countries
  .filter((c) => !c.home)
  .map((c) => ({
    from: [home.lat, home.lon] as [number, number],
    to: [c.lat, c.lon] as [number, number],
    color: TEAL,
  }));

/* cobe draws the sphere at 0.8 of clip space and rotates by phi (yaw) then
   theta (pitch); mirroring that here keeps the chips glued to their country. */
const R = 0.8;
const THETA_BASE = 0.2;
const THETA_SWING = 0.13;

function project(lat: number, lon: number, phi: number, theta: number) {
  const rad = (lat * Math.PI) / 180;
  const ang = (lon * Math.PI) / 180 - Math.PI;

  const x0 = -Math.cos(rad) * Math.cos(ang) * R;
  const y0 = Math.sin(rad) * R;
  const z0 = Math.cos(rad) * Math.sin(ang) * R;

  const cf = Math.cos(phi);
  const sf = Math.sin(phi);
  const ct = Math.cos(theta);
  const st = Math.sin(theta);

  return {
    x: cf * x0 + sf * z0,
    y: sf * st * x0 + ct * y0 - cf * st * z0,
    z: -sf * ct * x0 + st * y0 + cf * ct * z0,
  };
}

export default function GlobalCoverage() {
  const ref = useReveal<HTMLDivElement>();
  const holderRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chipRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const holder = holderRef.current;
    if (!canvas || !holder) return;

    // Fall back to the plain country list where WebGL is unavailable.
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl') && !probe.getContext('experimental-webgl')) {
      setSupported(false);
      return;
    }

    let globe: { update: (s: Partial<COBEOptions>) => void; destroy: () => void } | undefined;
    let frame = 0;
    let size = 0;

    // Start with India facing the viewer, then drift slowly.
    let phi = Math.PI / 2 + Math.PI - (home.lon * Math.PI) / 180;
    let theta = THETA_BASE;
    let swing = 0; // drives the slow tilt so the earth turns on both axes
    let tiltOffset = 0; // added by vertical dragging
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartPhi = 0;
    let dragStartTilt = 0;
    let dragging = false;

    const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

    const build = () => {
      const next = Math.round(holder.clientWidth);
      if (!next || next === size) return;
      size = next;
      globe?.destroy();

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: size,
        height: size,
        phi,
        theta,
        dark: 0,
        diffuse: 0.55,
        mapSamples: 16000,
        mapBrightness: 5.4,
        baseColor: [1, 1, 1],
        markerColor: PRIMARY,
        glowColor: [0.93, 0.96, 0.99],
        markers,
        arcs,
        arcColor: TEAL,
        arcWidth: 0.55,
        arcHeight: 0.22,
      } as COBEOptions);
    };

    /* Place the chips, dropping any that would collide with one already shown
       (nearest-to-centre wins) so the European cluster stays readable. */
    const placeChips = () => {
      const placed: Array<{ x: number; y: number }> = [];
      const ranked = GLOBAL.countries
        .map((c, i) => ({ i, c, p: project(c.lat, c.lon, phi, theta) }))
        .sort((a, b) => (b.c.home ? 1 : 0) - (a.c.home ? 1 : 0) || b.p.z - a.p.z);

      for (const { i, p } of ranked) {
        const el = chipRefs.current[i];
        if (!el) continue;

        const x = (p.x * 0.5 + 0.5) * size;
        const y = (0.5 - p.y * 0.5) * size;
        const front = p.z > 0.06;
        const clash = placed.some((q) => Math.abs(q.x - x) < 104 && Math.abs(q.y - y) < 34);

        if (front && !clash) {
          placed.push({ x, y });
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -230%)`;
          el.style.opacity = String(Math.min((p.z - 0.06) / 0.22, 1));
        } else {
          el.style.opacity = '0';
        }
      }
    };

    const tick = () => {
      if (!dragging) {
        phi += 0.0018; // spin about the vertical axis
        swing += 0.0045; // and tilt slowly about the horizontal one
      }
      theta = clamp(THETA_BASE + Math.sin(swing) * THETA_SWING + tiltOffset, -0.6, 0.65);

      globe?.update({ phi, theta });
      placeChips();
      frame = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartPhi = phi;
      dragStartTilt = tiltOffset;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      phi = dragStartPhi + (e.clientX - dragStartX) / 180;
      tiltOffset = clamp(dragStartTilt + (e.clientY - dragStartY) / 280, -0.6, 0.6);
    };
    const onUp = () => {
      dragging = false;
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(holder);

    /* Spin only while the globe is on screen, so it still shows India when the
       section is first scrolled to — and costs nothing when it is not. */
    const vis = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!frame) frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.05 }
    );
    vis.observe(holder);

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    globe?.update({ phi, theta }); // paint once so it is not blank before it scrolls in
    placeChips();

    return () => {
      cancelAnimationFrame(frame);
      vis.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      globe?.destroy();
    };
  }, []);

  return (
    <section className="section global">
      <div className="bg-dots" />
      <div className="glow global__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head sec-head--center">
          <div>
            <span className="eyebrow">{GLOBAL.eyebrow}</span>
            <h2 className="display-2">{GLOBAL.title}</h2>
          </div>
          <p className="sec-head__lede">{GLOBAL.lede}</p>
        </header>

        {supported ? (
          <div className="globe" ref={holderRef}>
            <canvas
              ref={canvasRef}
              className="globe__canvas"
              role="img"
              aria-label={`Countries we serve: ${GLOBAL.countries.map((c) => c.name).join(', ')}`}
            />

            <div className="globe__chips" aria-hidden="true">
              {GLOBAL.countries.map((c, i) => (
                <span
                  key={c.name}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  className={`globe__chip${c.home ? ' is-home' : ''}`}
                >
                  <i />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* No WebGL: fall back to a plain list of the same countries. */
          <ul className="global__list">
            {GLOBAL.countries.map((c) => (
              <li key={c.name} className={c.home ? 'is-home' : ''}>
                <span className="global__dot" />
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
