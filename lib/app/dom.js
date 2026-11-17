// DOM building shared by the pages: text only (textContent), never HTML strings.
const SVG = "http://www.w3.org/2000/svg";

// h("div", { class: "x" }, child, [children], "text"): attributes null/false are left out, true is set empty; "svg:tag" makes SVG.
export function h(tag, attrs = {}, ...kids) {
  const el = tag.startsWith("svg:") ? document.createElementNS(SVG, tag.slice(4)) : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) el.setAttribute(k, v === true ? "" : v);
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
}

// A link; one leaving the site opens in a new tab.
export const link = (href, text) => h("a", { href, target: href.startsWith("http") ? "_blank" : null, rel: href.startsWith("http") ? "noopener" : null }, text);
