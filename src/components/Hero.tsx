import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { HERO, HERO_BOARD, HERO_PIPELINE } from '../data/site';
import { ArrowUpRight, Check } from './Icons';
import './Hero.css';

type Card = { id: string; title: string; tag: string; who: string };
type Column = { id: string; title: string; cards: Card[] };

/* ── Rotating place name ────────────────────────────────────────────────── */
function Rotator() {
  const [i, setI] = useState(0);
  const longest = useMemo(
    () => HERO.places.reduce((a, b) => (b.length > a.length ? b : a), ''),
    []
  );

  useEffect(() => {
    const reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % HERO.places.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    /* The longest name is drawn as CSS generated content to reserve the width,
       so the line never jumps and the h1 text stays just one place name. */
    <span className="rotator" data-longest={longest}>
      <span key={i} className="rotator__word text-gradient">
        {HERO.places[i]}
      </span>
    </span>
  );
}

/* ── Kanban ─────────────────────────────────────────────────────────────── */
function BoardCard({ card, dragging }: { card: Card; dragging?: boolean }) {
  return (
    <div className={`kcard${dragging ? ' is-dragging' : ''}`}>
      <span className={`kcard__tag kcard__tag--${card.tag.toLowerCase()}`}>{card.tag}</span>
      <p className="kcard__title">{card.title}</p>
      <span className="kcard__who">{card.who}</span>
    </div>
  );
}

function DraggableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });

  return (
    <li
      ref={setNodeRef}
      className={`kitem${isDragging ? ' is-source' : ''}`}
      {...listeners}
      {...attributes}
    >
      <BoardCard card={card} />
    </li>
  );
}

function DroppableColumn({ col }: { col: Column }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <section ref={setNodeRef} className={`kcol${isOver ? ' is-over' : ''}`}>
      <header className="kcol__head">
        <span className={`kcol__dot kcol__dot--${col.id}`} />
        {col.title}
        <span className="kcol__count">{col.cards.length}</span>
      </header>
      <ul className="kcol__list">
        {col.cards.map((c) => (
          <DraggableCard key={c.id} card={c} />
        ))}
      </ul>
    </section>
  );
}

/* ── Deploy rail ────────────────────────────────────────────────────────── */
function DeployRail() {
  const [step, setStep] = useState(3);

  // Loop the last stage so the panel always looks like it is doing something.
  useEffect(() => {
    const reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setStep((s) => (s >= HERO_PIPELINE.steps.length ? 1 : s + 1));
    }, 1600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <aside className="rail">
      <div className="rail__card">
        <header className="rail__head">
          <span className="rail__live">
            <i />
            {HERO_PIPELINE.env}
          </span>
          <span className="rail__ver">{HERO_PIPELINE.version}</span>
        </header>

        <ol className="pipe">
          {HERO_PIPELINE.steps.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'run' : 'idle';
            return (
              <li key={s} className={`pipe__step is-${state}`}>
                <span className="pipe__mark">
                  {state === 'done' ? <Check width={11} height={11} /> : <i />}
                </span>
                {s}
              </li>
            );
          })}
        </ol>
      </div>

      <ul className="rail__metrics">
        {HERO_PIPELINE.metrics.map((m) => (
          <li key={m.label}>
            <span className="rail__value">{m.value}</span>
            <span className="rail__label">{m.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [cols, setCols] = useState<Column[]>(() => HERO_BOARD.map((c) => ({ ...c, cards: [...c.cards] })));
  const [active, setActive] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const onDragStart = (e: DragStartEvent) => {
    const card = cols.flatMap((c) => c.cards).find((c) => c.id === e.active.id);
    setActive(card ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);
    const to = e.over?.id;
    if (!to) return;

    setCols((prev) => {
      const from = prev.find((c) => c.cards.some((k) => k.id === e.active.id));
      if (!from || from.id === to) return prev;
      const card = from.cards.find((k) => k.id === e.active.id)!;

      return prev.map((c) => {
        if (c.id === from.id) return { ...c, cards: c.cards.filter((k) => k.id !== card.id) };
        if (c.id === to) return { ...c, cards: [card, ...c.cards] };
        return c;
      });
    });
  };

  return (
    <section className="hero" id="top">
      {/* Abstract line field */}
      <div className="hero__lines" aria-hidden="true">
        <svg viewBox="0 0 1440 620" preserveAspectRatio="none">
          {Array.from({ length: 9 }, (_, i) => {
            const d = `M -80 ${40 + i * 68} C 320 ${i * 62 - 30}, 760 ${180 + i * 52}, 1520 ${20 + i * 64}`;
            return (
              <g key={i}>
                {/* A faint constant line, with a brighter segment running along it. */}
                <path className="hero__line" d={d} />
                <path className="hero__spark" d={d} style={{ animationDelay: `${i * 0.55}s` }} />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__inner shell">
        <h1 className="hero__title">
          <span className="hero__lead">{HERO.titleLead}</span>
          <span className="hero__line2">
            {HERO.titlePrefix} <Rotator />
          </span>
        </h1>

        <div className="hero__actions">
          <a href="#contact" className="btn btn--primary btn--lg">
            {HERO.cta} <ArrowUpRight width={18} height={18} />
          </a>
          <p className="hero__note">{HERO.note}</p>
        </div>

        {/* Software-team workspace: board + deploy rail */}
        <div className="wsp">
          <div className="wsp__bar">
            <span className="wsp__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="wsp__name">sprint-42 · alikima/platform</span>
            <span className="wsp__hint">drag a card</span>
          </div>

          <div className="wsp__body">
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <div className="board">
                {cols.map((c) => (
                  <DroppableColumn key={c.id} col={c} />
                ))}
              </div>

              <DragOverlay dropAnimation={null}>
                {active ? <BoardCard card={active} dragging /> : null}
              </DragOverlay>
            </DndContext>

            <DeployRail />
          </div>
        </div>
      </div>
    </section>
  );
}
