// Renderer, cameras, lights, theme tokens and the frame loop for one stop. Owns nothing car-specific.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mm } from "./helpers.js";

// el: the .stage element (keeps the photo's aspect). car: the car config (photo, orbit, sun).
export function createStage(el, car) {
  const photo = car.photo, aspect = photo ? photo.w / photo.h : 1200 / 803;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const img = el.querySelector("img");   // the transparent canvas sits on top of the museum photo
  if (img) img.after(renderer.domElement); else el.prepend(renderer.domElement);
  // iOS drops WebGL contexts of background tabs; preventDefault lets the browser restore it.
  renderer.domElement.addEventListener("webglcontextlost", e => e.preventDefault());

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, aspect, 0.05, 60);
  cam.up.set(0, 0, 1);
  const controls = new OrbitControls(cam, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = car.orbit?.min ?? 0.8; controls.maxDistance = car.orbit?.max ?? 16;

  // Camera fitted to the museum photo (tools/fit-photo-camera.mjs): position in mm, yaw/pitch/roll in rad, focal length in px.
  let photoCam = null;
  if (photo) {
    const { c, yaw, pitch, roll, f } = photo.cam;
    photoCam = new THREE.PerspectiveCamera(2 * Math.atan(photo.h / 2 / f) * 180 / Math.PI, aspect, 0.05, 60);
    const fw = new THREE.Vector3(Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch));
    const r = new THREE.Vector3().crossVectors(fw, new THREE.Vector3(0, 0, 1)).normalize();
    const u = new THREE.Vector3().crossVectors(r, fw);
    photoCam.position.copy(mm(c));
    photoCam.up.copy(u.clone().multiplyScalar(Math.cos(roll)).addScaledVector(r, -Math.sin(roll)));
    photoCam.lookAt(photoCam.position.clone().add(fw));
  }

  // Physically based light units since r155: intensities are the PoC's r128 values × π.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 0.95 * Math.PI));
  const sun = new THREE.DirectionalLight(0xffffff, 0.65 * Math.PI); sun.position.set(...(car.sun ?? [3, 4, 6])); scene.add(sun);

  // Theme: colours live in CSS custom properties; bind(color, token) re-applies them on theme change.
  const root = document.documentElement;
  const css = n => getComputedStyle(root).getPropertyValue(n).trim();
  const cache = new Map(), bindings = [], onTheme = [];
  const color = token => { if (!cache.has(token)) cache.set(token, new THREE.Color(css(token))); return cache.get(token); };
  const isDark = () => root.dataset.theme === "dark" || (root.dataset.theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  let onPhoto = false;
  function applyColors() {
    cache.clear();
    for (const [c, token] of bindings) c.copy(color(token));
    scene.background = onPhoto ? null : color("--stage").clone();
    for (const fn of onTheme) fn({ onPhoto, dark: isDark() });
  }
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyColors);
  new MutationObserver(applyColors).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(el);

  const stats = { frames: 0 };
  return {
    THREE, renderer, scene, cam, photoCam, controls, css, color, isDark, stats,
    bind(c, token) { bindings.push([c, token]); c.copy(color(token)); return c; },
    tokenMat(token, o) { const m = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.15, ...o }); this.bind(m.color, token); return m; },
    onTheme(fn) { onTheme.push(fn); },
    applyColors,
    setPhotoView(on) { onPhoto = on && !!photoCam; controls.enabled = !onPhoto; applyColors(); },
    setOrbit(v) { cam.position.set(...v.pos); controls.target.set(...v.target); controls.update(); },
    // onFrame(dt) runs before each render; dt in s, clamped so a paused tab or slow frame never jumps the simulation.
    start(onFrame) {
      resize();
      let last = performance.now();
      renderer.setAnimationLoop(now => {
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        onFrame(dt);
        if (!onPhoto) controls.update();
        renderer.render(scene, onPhoto ? photoCam : cam);
        stats.frames++;
      });
    },
  };
}
