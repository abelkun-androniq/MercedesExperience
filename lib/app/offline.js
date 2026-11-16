// Service-worker registration shared by the index and every stop. On localhost / LAN addresses the SW is skipped (and any
// earlier one removed) so dev edits are never served stale; add ?sw=1 to test offline locally against a build in _site/.
const LOCAL = /^(localhost|127\.|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)|\.local$/;

// onStatus(kind, info): kind = "ready" | "partial" | "dev" | "unsupported" | "error"; info = { version, total, cached }.
export function registerOffline(onStatus = () => {}) {
  if (!("serviceWorker" in navigator)) return onStatus("unsupported");
  const sw = navigator.serviceWorker;
  if (LOCAL.test(location.hostname) && !new URLSearchParams(location.search).has("sw")) {
    sw.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
    return onStatus("dev");
  }
  const root = new URL("../../", import.meta.url);   // site root, where sw.js lives
  sw.register(new URL("sw.js", root)).then(() => sw.ready).then(reg => new Promise(resolve => {
    const ch = new MessageChannel();
    ch.port1.onmessage = e => resolve(e.data);
    reg.active.postMessage({ type: "status" }, [ch.port2]);
  })).then(s => onStatus(s.total > 0 && s.cached === s.total ? "ready" : "partial", s)).catch(err => { console.warn(err); onStatus("error"); });
}
