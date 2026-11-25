// Declarative side-panel cards. A subsystem describes its cards; this builds the DOM (textContent only) and returns handles.
// Card: { label, badge?: { id, text }, only?: "model" | "photo", detail?, items: [widget] }. Widgets (one key each, plus
// optional `only` and `detail`):
//   readouts: [{ id, label, unit, value }]          → ui.set(id, text)
//   trace: { id, series: [{ token, min, max }], span, top, bottom, aria }   → ui.trace(id).push(t, [v…]) / .draw(t)
//   buttons: [{ id, label, toggle?: [onLabel, offLabel], pressed?, onClick(pressed) }]   → ui.toggle(id).set(bool)
//   slider: { id, label, min, max, step, value, onInput(v) }   → ui.slider(id).set(v)
//   meter: { id }  → ui.meter(id).set(0..1, hot)        cells: { id, labels }  → ui.cells(id).set(i, text, on) / .label(i, text)
//   legend: [[token, name]]   key: [[token, text]]   svg: { id, viewBox, aria }  → ui.el(id)   text: "…" | { id, value } → ui.set(id, text)   list: ["…"]
// Text arrives already translated (subsystems use ctx.t); readout values are written with the local decimal mark.
// ui.state() lists the settings the visitor chose (toggles, radio buttons, sliders; in the order last used) and
// ui.restore(state) replays them through the same handlers, so a reloaded page (the language switch) shows the same
// experiment. Buttons with neither toggle nor pressed are momentary and not kept.
// Element ids are `${scope}-${id}`: scope defaults to the component id; pages with several cars pass one per car.
// Depth: a widget or card marked `detail` (readings, legends, secondary controls) goes to detailContainer, the story's named
// disclosure under the mechanism's key experiment; the rest of its card stays in container. Without a separate
// detailContainer every card stays whole, in order. A split card keeps its label (and badge) on the part in container;
// its part in detailContainer repeats the label's text.
import { num } from "./i18n.js";
import { h } from "./dom.js";

export function createPanel(container, compId, scope = compId, detailContainer = container) {
  const els = new Map(), api = {};
  const controls = new Map(), used = new Set();   // id → { get(), apply(value) }; ids the visitor set, last used last
  const use = id => { used.delete(id); used.add(id); };
  const key = id => `${scope}-${id}`;

  const widgets = {
    readouts: items => h("div", { class: "readouts" }, items.map(r => {
      const o = h("output", { id: key(r.id) }, r.value == null ? "–" : num(r.value)); els.set(r.id, o);
      return h("div", {}, h("small", {}, r.label), o, h("small", {}, r.unit ?? ""));
    })),
    trace: t => {
      const svg = h("svg:svg", { viewBox: "0 0 280 110", role: "img", "aria-label": t.aria ?? "" });
      const grid = [[55, null], [5, "2 3"], [105, "2 3"]].map(([y, dash]) => h("svg:line", { x1: 0, y1: y, x2: 280, y2: y, stroke: "var(--rule)", "stroke-dasharray": dash }));
      const lines = t.series.map(s => h("svg:polyline", { fill: "none", stroke: `var(${s.token})`, "stroke-width": 1.6 }));
      svg.append(...grid, ...lines, h("svg:text", { x: 278, y: 15, "text-anchor": "end" }, t.top ?? ""), h("svg:text", { x: 278, y: 101, "text-anchor": "end" }, t.bottom ?? ""));
      const buf = [], span = t.span ?? 6;
      els.set(t.id, {
        push(time, values) { buf.push({ time, values }); },
        draw(now) {
          while (buf.length && buf[0].time < now - span) buf.shift();
          const X = tt => ((tt - (now - span)) / span * 280).toFixed(1);
          t.series.forEach((s, i) => lines[i].setAttribute("points", buf.map(p => {
            const v = Math.max(s.min, Math.min(s.max, p.values[i]));
            return `${X(p.time)},${(105 - (v - s.min) / (s.max - s.min) * 100).toFixed(1)}`;
          }).join(" ")));
        },
      });
      return h("div", { class: "trace" }, svg);
    },
    buttons: items => h("div", { class: "row" }, items.map(b => {
      // toggle: [onLabel, offLabel] flips itself; pressed without toggle = radio-style button whose state the caller sets.
      const el = h("button", { type: "button", "aria-pressed": b.toggle || b.pressed != null ? String(!!b.pressed) : null }, b.toggle ? b.toggle[b.pressed ? 0 : 1] : b.label);
      const handle = { el, pressed: !!b.pressed, set(p) { handle.pressed = p; el.setAttribute("aria-pressed", String(p)); if (b.toggle) el.textContent = b.toggle[p ? 0 : 1]; } };
      const kept = b.toggle || b.pressed != null;
      el.addEventListener("click", () => { if (b.toggle) handle.set(!handle.pressed); if (kept) use(b.id); b.onClick?.(handle.pressed); });
      // A radio-style button is replayed only if it was the pressed one; a toggle only if it differs.
      if (kept) controls.set(b.id, { get: () => handle.pressed, apply: v => { if (b.toggle ? v !== handle.pressed : v) el.click(); } });
      els.set(b.id, handle);
      return el;
    })),
    slider: s => {
      const input = h("input", { id: key(s.id), type: "range", min: s.min, max: s.max, step: s.step ?? 1, value: s.value });
      const changed = () => { use(s.id); s.onInput?.(+input.value); };
      input.addEventListener("input", changed);
      controls.set(s.id, { get: () => +input.value, apply: v => { input.value = v; changed(); } });
      els.set(s.id, { el: input, set(v) { input.value = v; } });
      return h("div", { class: "slider" }, h("label", { class: "label", for: key(s.id) }, s.label), input);
    },
    meter: m => { const bar = h("i"), el = h("div", { class: "meter" }, bar); els.set(m.id, { set(f, hot) { bar.style.width = `${(Math.max(0, Math.min(1, f)) * 100).toFixed(0)}%`; el.classList.toggle("hot", !!hot); } }); return el; },
    cells: c => {
      const cells = c.labels.map(l => h("div", { class: "cyl" }, h("b", {}, l), h("span", {}, "–")));
      // Up to four in a row; half as many where a word in a cell would not fit (a long label on a phone), checked again
      // whenever the row's width or a label changes.
      const n = Math.min(c.labels.length, 4), row = h("div", { class: "cyls", style: `--n:${n}` }, cells);
      const fit = () => {
        row.style.setProperty("--n", n);
        if (n > 2 && cells.some(el => el.scrollWidth > el.clientWidth)) row.style.setProperty("--n", Math.ceil(n / 2));
      };
      let width = -1;   // refit on a change of width only, a frame later: refitting changes the row's height
      new ResizeObserver(([e]) => { if (e.contentRect.width !== width) { width = e.contentRect.width; requestAnimationFrame(fit); } }).observe(row);
      els.set(c.id, {
        set(i, text, on) { const el = cells[i]; if (el.dataset.s !== text) { el.dataset.s = text; el.lastChild.textContent = text; } el.classList.toggle("power", !!on); },
        label(i, text) { const b = cells[i].firstChild; if (b.textContent !== text) { b.textContent = text; fit(); } },
      });
      return row;
    },
    legend: items => h("ul", { class: "legend" }, items.map(([tok, name]) => h("li", {}, h("span", { class: "sw", style: `background:var(${tok})` }), name))),
    key: items => h("div", { class: "key" }, items.map(([tok, text]) => h("span", {}, h("i", { style: `background:var(${tok})` }), text))),
    svg: s => { const el = h("svg:svg", { viewBox: s.viewBox, role: "img", "aria-label": s.aria ?? "", class: "diagram" }); els.set(s.id, el); return el; },
    text: t => {   // "…", or { id, value } for a sentence the subsystem rewrites (ui.set(id, text); read out when it changes)
      if (typeof t === "string") return h("p", { class: "note" }, t);
      const el = h("p", { class: "note", "aria-live": "polite" }, t.value ?? ""); els.set(t.id, { set value(v) { el.textContent = v; } }); return el;
    },
    list: items => h("ul", { class: "talk" }, items.map(t => h("li", {}, t))),
  };

  // Append cards; returns the shared handle API (call again to add more cards for the same component).
  return function cards(list) {
    const split = detailContainer !== container;
    for (const card of list) {
      const label = h("div", { class: "label" }, card.label ?? "");
      if (card.badge) { const b = h("span", { class: "badge" }, card.badge.text); label.append(" · ", b); els.set(card.badge.id, { set(text, on) { b.textContent = text; b.classList.toggle("on", !!on); } }); }
      const items = card.items ?? [], deep = w => split && (card.detail || w.detail);
      const main = items.filter(w => !deep(w)), more = items.filter(deep);
      const box = (lab, ws, into) => {
        if (!ws.length && !lab) return;
        const el = h("div", { class: "panel", "data-comp": compId, "data-only": card.only }, lab);
        for (const w of ws) {
          const [type] = Object.keys(w).filter(k => k !== "only" && k !== "detail");
          const node = widgets[type](w[type]);
          if (w.only) node.dataset.only = w.only;
          el.append(node);
        }
        into.append(el);
      };
      const head = main.length > 0 || !more.length;   // the label goes where the card's experiment is
      box(head ? label : null, main, container);
      box(head ? (more.length && card.label ? h("div", { class: "label" }, card.label) : null) : label, more, detailContainer);
    }
    return Object.assign(api, {
      set: (id, text) => { els.get(id).value = num(text); },
      el: id => els.get(id), trace: id => els.get(id), toggle: id => els.get(id), slider: id => els.get(id),
      meter: id => els.get(id), cells: id => els.get(id), badge: id => els.get(id),
      state: () => [...used].map(id => [id, controls.get(id).get()]),
      restore: state => { for (const [id, v] of state ?? []) controls.get(id)?.apply(v); },
    });
  };
}
