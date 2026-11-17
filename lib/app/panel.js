// Declarative side-panel cards. A subsystem describes its cards; this builds the DOM (textContent only) and returns handles.
// Card: { label, badge?: { id, text }, only?: "model" | "photo", items: [widget] }. Widgets (one key each, plus optional `only`):
//   readouts: [{ id, label, unit, value }]          → ui.set(id, text)
//   trace: { id, series: [{ token, min, max }], span, top, bottom, aria }   → ui.trace(id).push(t, [v…]) / .draw(t)
//   buttons: [{ id, label, toggle?: [onLabel, offLabel], pressed?, onClick(pressed) }]   → ui.toggle(id).set(bool)
//   slider: { id, label, min, max, step, value, onInput(v) }   → ui.slider(id).set(v)
//   meter: { id }  → ui.meter(id).set(0..1, hot)        cells: { id, labels }  → ui.cells(id).set(i, text, on)
//   legend: [[token, name]]   key: [[token, text]]   svg: { id, viewBox, aria }  → ui.el(id)   text: "…"   list: ["…"]
// Text arrives already translated (subsystems use ctx.t); readout values are written with the local decimal mark.
import { num } from "./i18n.js";

const SVG = "http://www.w3.org/2000/svg";

function h(tag, attrs = {}, ...kids) {
  const el = tag.startsWith("svg:") ? document.createElementNS(SVG, tag.slice(4)) : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) el.setAttribute(k, v === true ? "" : v);
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
}

export function createPanel(container, compId) {
  const els = new Map(), api = {};
  const key = id => `${compId}-${id}`;

  const widgets = {
    readouts: items => h("div", { class: "readouts" }, items.map(r => {
      const o = h("output", { id: key(r.id) }, r.value ?? "–"); els.set(r.id, o);
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
      el.addEventListener("click", () => { if (b.toggle) handle.set(!handle.pressed); b.onClick?.(handle.pressed); });
      els.set(b.id, handle);
      return el;
    })),
    slider: s => {
      const input = h("input", { id: key(s.id), type: "range", min: s.min, max: s.max, step: s.step ?? 1, value: s.value });
      input.addEventListener("input", () => s.onInput?.(+input.value));
      els.set(s.id, { el: input, set(v) { input.value = v; } });
      return h("div", { class: "slider" }, h("label", { class: "label", for: key(s.id) }, s.label), input);
    },
    meter: m => { const bar = h("i"), el = h("div", { class: "meter" }, bar); els.set(m.id, { set(f, hot) { bar.style.width = `${(Math.max(0, Math.min(1, f)) * 100).toFixed(0)}%`; el.classList.toggle("hot", !!hot); } }); return el; },
    cells: c => {
      const cells = c.labels.map(l => h("div", { class: "cyl" }, h("b", {}, l), h("span", {}, "–")));
      els.set(c.id, { set(i, text, on) { const el = cells[i]; if (el.dataset.s !== text) { el.dataset.s = text; el.lastChild.textContent = text; } el.classList.toggle("power", !!on); } });
      return h("div", { class: "cyls", style: `--n:${Math.min(c.labels.length, 4)}` }, cells);
    },
    legend: items => h("ul", { class: "legend" }, items.map(([tok, name]) => h("li", {}, h("span", { class: "sw", style: `background:var(${tok})` }), name))),
    key: items => h("div", { class: "key" }, items.map(([tok, text]) => h("span", {}, h("i", { style: `background:var(${tok})` }), text))),
    svg: s => { const el = h("svg:svg", { viewBox: s.viewBox, role: "img", "aria-label": s.aria ?? "", class: "diagram" }); els.set(s.id, el); return el; },
    text: t => h("p", { class: "note" }, t),
    list: items => h("ul", { class: "talk" }, items.map(t => h("li", {}, t))),
  };

  // Append cards; returns the shared handle API (call again to add more cards for the same component).
  return function cards(list) {
    for (const card of list) {
      const label = h("div", { class: "label" }, card.label ?? "");
      if (card.badge) { const b = h("span", { class: "badge" }, card.badge.text); label.append(" · ", b); els.set(card.badge.id, { set(text, on) { b.textContent = text; b.classList.toggle("on", !!on); } }); }
      const el = h("div", { class: "panel", "data-comp": compId, "data-only": card.only }, label);
      for (const w of card.items ?? []) {
        const [type] = Object.keys(w).filter(k => k !== "only");
        const node = widgets[type](w[type]);
        if (w.only) node.dataset.only = w.only;
        el.append(node);
      }
      container.append(el);
    }
    return Object.assign(api, {
      set: (id, text) => { els.get(id).value = num(text); },
      el: id => els.get(id), trace: id => els.get(id), toggle: id => els.get(id), slider: id => els.get(id),
      meter: id => els.get(id), cells: id => els.get(id), badge: id => els.get(id),
    });
  };
}
