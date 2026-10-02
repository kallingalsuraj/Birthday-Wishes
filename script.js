/* =========================================================
   ✏️  EDIT THIS PART TO PERSONALISE
   ========================================================= */
const CONFIG = {
  name: "Athira",              // her name
  nickname: "PsyDuck",         // shown on the card cover
  cardTo: "My Girl 💖",        // "Made with love for ..." on the card's left page
  from: "Tintumon",            // your name

  // Lock screen: the code is the date as DDMMYYYY (she may type it with or without - or /)
  lock: {
    code: "07052022",
    hint: "It's the date when it all started 💞",
  },

  // One entry = one line of the love letter (long lines wrap automatically)
  wish: [
    "Dear {name},",
    "First of all, Happy Birthday to you! 🎂",
    "Once again it's your birthday and I won't be right there beside you, but something tells me it won't be long before I'm celebrating it by your side 👀",
    "Congratulations on turning 25! Live the way you want, fulfil every single wish, and never change for anyone.",
    "And yes, I am so proud of my girl. 💖",
    "As I always say, I will always love you more 💕 and I'll always have your back.",
    "Yours,",
    "— {from}",
  ],

  // Put your photos in a folder (e.g. photos/1.jpg) and list them here.
  // Leave `src` empty to show a placeholder instead.
  photos: [
    { src: "photos/1.jpeg", caption: "Where it began", emoji: "🌅" },
    { src: "photos/2.jpeg", caption: "That smile 😊", emoji: "😊" },
    { src: "photos/3.jpeg", caption: "Our happy place", emoji: "🏖️" },
    { src: "photos/4.jpeg", caption: "Pure joy", emoji: "🎡" },
    { src: "photos/6.jpeg", caption: "Sweet moments", emoji: "☕" },
    { src: "photos/7.jpeg", caption: "My favourite view", emoji: "💛" },
    { src: "photos/8.jpeg", caption: "Making memories", emoji: "📸" },
    { src: "photos/9.jpeg", caption: "Just us", emoji: "💞" },
    { src: "photos/10.jpeg", caption: "Always you", emoji: "💖" },
  ],

  ask: {
    title: "{name}, will you go on a dinner date with me?",
    sub: "Choose wisely… 😏",
  },

  dinner: {
    "Date": "Thursday, 8 October 2026",
    "Time": "8:00 PM",
    "Table": "A cosy candle-lit table for two",
    "Dress code": "Just bring that beautiful smile",
    "Booked by": "{from}",
  },
  bookedNote: "Candlelight, good food and you — a night I'll remember forever. 💕",
};

/* =========================================================
   Helpers
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fill = (t) => t.replaceAll("{name}", CONFIG.name).replaceAll("{nickname}", CONFIG.nickname).replaceAll("{from}", CONFIG.from);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SVGNS = "http://www.w3.org/2000/svg";

/* ---------- Scene switching (single page, no reloads) ---------- */
let current = "lock";
const enterHooks = {};
function goTo(name) {
  $(`#scene-${current}`).classList.remove("active");
  current = name;
  const s = $(`#scene-${name}`);
  s.classList.add("active");
  s.scrollTop = 0;
  enterHooks[name]?.();
}

/* ---------- Background hearts & petals ---------- */
(function floaters() {
  const icons = ["💖", "🌹", "💕", "🌸", "✨", "💗", "🤍"];
  const box = $("#bgFloat");
  const n = innerWidth < 600 ? 14 : 24;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 14 + Math.random() * 26 + "px";
    s.style.animationDuration = 14 + Math.random() * 16 + "s";
    s.style.animationDelay = -Math.random() * 25 + "s";
    box.appendChild(s);
  }
})();

/* ---------- Confetti (hearts + paper) ---------- */
const cv = $("#confetti");
const ctx = cv.getContext("2d");
let pieces = [], raf = null;
function sizeCanvas() {
  const d = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * d; cv.height = innerHeight * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
}
addEventListener("resize", sizeCanvas); sizeCanvas();

function confetti(count = 160, x = innerWidth / 2, y = innerHeight * 0.4) {
  const colors = ["#ff4d7d", "#ff8fab", "#ffd166", "#ffb3c7", "#fff", "#e0336d"];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 8;
    pieces.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6,
      w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, heart: Math.random() < .45,
      r: Math.random() * 6, vr: (Math.random() - .5) * .4,
      c: colors[(Math.random() * colors.length) | 0], life: 140 + Math.random() * 70,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces = pieces.filter((p) => p.life > 0 && p.y < innerHeight + 30);
  for (const p of pieces) {
    p.vy += .2; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r * (p.heart ? .15 : 1));
    ctx.globalAlpha = Math.min(1, p.life / 40); ctx.fillStyle = p.c;
    if (p.heart) { ctx.font = `${p.w * 2.2}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("♥", 0, 0); }
    else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  raf = pieces.length ? requestAnimationFrame(tick) : null;
  if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
}

/* =========================================================
   SCENE 0 — Lock screen
   ========================================================= */
(function lockScreen() {
  const form = $("#lockForm"), input = $("#lockInput"), msg = $("#lockMsg"), icon = $("#lockIcon");
  let tries = 0, unlocked = false;
  const showHint = () => { msg.textContent = "💡 " + CONFIG.lock.hint; };
  $("#hintBtn").addEventListener("click", showHint);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (unlocked) return;
    if (input.value.replace(/\D/g, "") === CONFIG.lock.code) {
      unlocked = true;
      icon.textContent = "🔓";
      msg.textContent = "Welcome, Athira 💖";
      confetti(90, innerWidth / 2, innerHeight * .4);
      setTimeout(() => goTo("cake"), 900);
      return;
    }
    tries++;
    msg.textContent = "Hmm, that's not it 🙈 Try again";
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
    input.select();
    if (tries >= 3) setTimeout(showHint, 1200);
  });
})();

/* =========================================================
   SCENE 1 — Cake & candles
   ========================================================= */
function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent?.appendChild(e);
  return e;
}
(function decorateCake() {
  // scalloped icing on every tier
  $$(".frost").forEach((p) => {
    const x = +p.dataset.x, y = +p.dataset.y, w = +p.dataset.w, n = Math.round(w / 20);
    p.setAttribute("d", `M${x} ${y} h${w} v12 ` + "a10 10 0 0 1 -20 0 ".repeat(n) + "z");
  });
  // pearls around the bottom tier
  for (let x = 56; x <= 284; x += 18) svgEl("circle", { cx: x, cy: 264, r: 4, fill: "#fff", opacity: .92 }, $("#pearls"));
  // little hearts on the middle tier
  for (let i = 0; i < 6; i++) {
    svgEl("use", { href: "#heart", x: 92 + i * 28, y: 172, width: 16, height: 16, fill: i % 2 ? "#ffd1e0" : "#fff" }, $("#hearts-mid"));
  }
  // sprinkles
  const cols = ["#ffd166", "#fff", "#7be0c3", "#b388ff", "#ff4d7d"];
  const sprinkle = (box, x0, y0, w, h, n) => {
    for (let i = 0; i < n; i++) {
      const x = x0 + Math.random() * w, y = y0 + Math.random() * h;
      svgEl("rect", { x, y, width: 7, height: 2.5, rx: 1.2, fill: cols[i % cols.length], transform: `rotate(${(Math.random() * 180) | 0} ${x} ${y})` }, box);
    }
  };
  sprinkle($("#sprinkles-top"), 110, 118, 120, 24, 16);
  sprinkle($("#sprinkles-bottom"), 50, 222, 240, 24, 22);
})();

const candles = $$(".candle");
let blown = false, micStream = null, micCtx = null;

function blowOut(candle) {
  if (candle.classList.contains("out")) return;
  candle.classList.add("out");
  const y = candle.querySelector(".flame-wrap").transform.baseVal.getItem(0).matrix.f;
  svgEl("circle", { class: "smoke", cx: 0, cy: y - 8, r: 4 }, candle);
  setTimeout(() => $$(".smoke", candle).forEach((s) => s.remove()), 1900);
  if (candles.every((c) => c.classList.contains("out"))) celebrate();
}
async function blowAll() {
  for (const c of candles) { blowOut(c); await sleep(220); }
}
function celebrate() {
  if (blown) return;
  blown = true;
  stopMic();
  $("#cake").classList.add("dark");
  $("#cakeTitle").textContent = "Happy Birthday, " + CONFIG.name + "! 🎉";
  $("#cakeSub").textContent = "I hope every wish you made comes true ✨";
  $("#cakeActions").classList.add("hidden");
  $("#cakeHint").classList.add("hidden");
  $("#cake").classList.add("party");
  confetti(200);
  setTimeout(() => confetti(110, innerWidth * .2, innerHeight * .5), 400);
  setTimeout(() => confetti(110, innerWidth * .8, innerHeight * .5), 700);
  setTimeout(() => $("#toCard").classList.remove("hidden"), 900);
}
candles.forEach((c) => c.addEventListener("click", () => blowOut(c)));
$("#blowBtn").addEventListener("click", blowAll);

async function startMic() {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micCtx = new (window.AudioContext || window.webkitAudioContext)();
    const an = micCtx.createAnalyser(); an.fftSize = 512;
    micCtx.createMediaStreamSource(micStream).connect(an);
    const buf = new Uint8Array(an.fftSize);
    $("#cakeHint").textContent = "🎤 Listening… blow into your microphone!";
    $("#micBtn").classList.add("hidden");
    (function listen() {
      if (!micStream) return;
      an.getByteTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
      if (Math.sqrt(sum / buf.length) > 0.22) blowAll();
      requestAnimationFrame(listen);
    })();
  } catch {
    $("#cakeHint").textContent = "Couldn't reach the mic — just tap the flames or the button 🙂";
  }
}
function stopMic() {
  micStream?.getTracks().forEach((t) => t.stop());
  micStream = null; micCtx?.close(); micCtx = null;
}
$("#micBtn").addEventListener("click", startMic);
$("#toCard").addEventListener("click", () => goTo("card"));

/* =========================================================
   SCENE 2 — Love-letter card
   ========================================================= */
const card = $("#card");
$("#coverName").textContent = CONFIG.nickname;
$("#cardTo").textContent = "Made with love for " + CONFIG.cardTo;
$("#cardToM").textContent = "Made with love for " + CONFIG.cardTo;
// every character gets its own span so the letter can be "handwritten" without the text reflowing
const wishBox = $("#wishText"), wishPage = $(".inside-right");
CONFIG.wish.forEach((l, i, a) => {
  const line = document.createElement("span");
  line.className = "line" + (i === a.length - 1 ? " sig" : "");
  for (const ch of fill(l)) {
    const s = document.createElement("span");
    s.className = "ch"; s.textContent = ch;
    line.appendChild(s);
  }
  wishBox.appendChild(line);
});
let writeRun = 0;

async function writeLetter() {
  const run = ++writeRun;
  let pen = null;
  for (const line of $$(".wish .line")) {
    for (const ch of $$(".ch", line)) {
      if (run !== writeRun) return;
      pen?.classList.remove("pen");
      ch.classList.add("on", "pen"); pen = ch;
      wishPage.scrollTop = Math.max(0, ch.offsetTop - wishPage.clientHeight + 70);
      await sleep(/[,.!?—]/.test(ch.textContent) ? 130 : 22);
    }
    await sleep(140);
  }
  pen?.classList.remove("pen");
  if (run === writeRun) $("#toPhotos").classList.remove("hidden");
}

async function openCard() {
  if (card.classList.contains("open")) return;
  card.classList.add("open");
  $("#cardHint").textContent = "Written just for you… 💞";
  confetti(50, innerWidth / 2, innerHeight * .55);
  await sleep(1100);
  writeLetter();
}
card.addEventListener("click", openCard);
card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(); } });
$("#toPhotos").addEventListener("click", () => goTo("photos"));

/* =========================================================
   SCENE 3 — Vertical memory route
   ========================================================= */
const photosScene = $("#scene-photos");
const track = $("#routeTrack"), stopsBox = $("#stops");
const routeBase = $("#routeBase"), routeProg = $("#routeProg"), traveler = $("#traveler");
const gradients = [
  "linear-gradient(135deg,#ffd1dc,#ffb3c7)", "linear-gradient(135deg,#ffe3c2,#ffb59e)",
  "linear-gradient(135deg,#e7c6ff,#ffb3d9)", "linear-gradient(135deg,#ffc9de,#f6a1c1)",
  "linear-gradient(135deg,#ffd9b3,#ff9eb5)", "linear-gradient(135deg,#f9c6ff,#b9b4ff)",
];
let photoCount = 0;
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { root: photosScene, threshold: 0.2 }
);

function addPolaroid(p) {
  const i = photoCount++;
  const el = document.createElement("div");
  el.className = "stop";
  el.style.setProperty("--px", (i % 2 ? 66 : 34) + "%");
  el.innerHTML = `
    <div class="pwrap">
      <div class="polaroid" style="--rot:${(Math.random() * 8 - 4).toFixed(1)}deg;--delay:${(-Math.random() * 4).toFixed(1)}s">
        <span class="badge">${i + 1}</span><span class="clip"></span>
        <div class="photo"></div><div class="cap"></div>
      </div>
    </div>`;
  const ph = $(".photo", el);
  const placeholder = () => { ph.style.background = gradients[i % gradients.length]; ph.textContent = p.emoji || "📷"; };
  if (p.src) {
    ph.style.backgroundImage = `url("${p.src}")`;
    const probe = new Image(); // missing/misspelled file -> fall back to the placeholder
    probe.onerror = () => { ph.style.backgroundImage = ""; placeholder(); };
    probe.src = p.src;
  } else placeholder();
  $(".cap", el).textContent = p.caption || "";
  stopsBox.appendChild(el);
  io.observe(el);
}
CONFIG.photos.forEach(addPolaroid);

let routeLen = 0, y0 = 0, y1 = 1;
function buildRoute() {
  const W = track.clientWidth, H = track.scrollHeight;
  const svg = $("#routeSvg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const start = $("#routeStart"), end = $("#routeEnd");
  const pts = [{ x: W / 2, y: start.offsetTop + start.offsetHeight - 40 }];
  $$(".stop", stopsBox).forEach((s, i) => pts.push({ x: W * (i % 2 ? .66 : .34), y: s.offsetTop + 26 }));
  pts.push({ x: W / 2, y: end.offsetTop + 28 });
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], m = (a.y + b.y) / 2;
    d += ` C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}`;
  }
  routeBase.setAttribute("d", d); routeProg.setAttribute("d", d);
  routeLen = routeProg.getTotalLength();
  routeProg.style.strokeDasharray = routeLen;
  y0 = pts[0].y; y1 = pts[pts.length - 1].y;
  updateRoute();
}
function updateRoute() {
  if (!routeLen) return;
  const view = photosScene.scrollTop + photosScene.clientHeight * 0.55 - track.offsetTop;
  const p = Math.min(1, Math.max(0, (view - y0) / (y1 - y0)));
  routeProg.style.strokeDashoffset = routeLen * (1 - p);
  const pt = routeProg.getPointAtLength(routeLen * p);
  traveler.style.left = pt.x + "px"; traveler.style.top = pt.y + "px";
}
photosScene.addEventListener("scroll", updateRoute, { passive: true });
addEventListener("resize", () => current === "photos" && buildRoute());
enterHooks.photos = () => requestAnimationFrame(buildRoute);

$("#photoInput").addEventListener("change", (e) => {
  for (const f of e.target.files) addPolaroid({ src: URL.createObjectURL(f), caption: "New memory 💞" });
  e.target.value = "";
  buildRoute();
});
$("#toAsk").addEventListener("click", () => goTo("ask"));

/* =========================================================
   SCENE 4 — The question (No runs away)
   ========================================================= */
const yesBtn = $("#yesBtn"), noBtn = $("#noBtn");
$("#askTitle").textContent = fill(CONFIG.ask.title);
$("#askSub").textContent = CONFIG.ask.sub;
const noLines = ["No", "Are you sure?", "Really? 🥺", "Think again!", "Pretty please?", "Not allowed 😤", "Too slow 😜", "Just say yes!", "Catch me 🏃"];
let dodges = 0;

function runAway(px, py) {
  const r = noBtn.getBoundingClientRect();
  const w = r.width, h = r.height, m = 12;
  if (!noBtn.classList.contains("run")) {
    noBtn.classList.add("run");
    noBtn.style.left = r.left + "px"; noBtn.style.top = r.top + "px";
  }
  let x, y, tries = 0;
  do { // pick a spot well away from the pointer
    x = m + Math.random() * Math.max(0, innerWidth - w - m * 2);
    y = m + Math.random() * Math.max(0, innerHeight - h - m * 2);
    tries++;
  } while (Math.hypot(x + w / 2 - px, y + h / 2 - py) < Math.min(220, innerWidth * .5) && tries < 30);
  noBtn.style.left = x + "px"; noBtn.style.top = y + "px";
  dodges++;
  noBtn.textContent = noLines[dodges % noLines.length];
  yesBtn.style.setProperty("--s", Math.min(1 + dodges * 0.07, 1.7));
  $("#askSub").textContent = dodges > 4 ? "The 'No' button has given up on you 😂" : CONFIG.ask.sub;
}
addEventListener("pointermove", (e) => {
  if (current !== "ask") return;
  const r = noBtn.getBoundingClientRect();
  const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
  if (d < 110) runAway(e.clientX, e.clientY);
});
// touch screens: dodge before the tap lands
noBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); runAway(e.clientX, e.clientY); });
noBtn.addEventListener("click", (e) => e.preventDefault());

yesBtn.addEventListener("click", () => {
  const r = yesBtn.getBoundingClientRect();
  confetti(240, r.left + r.width / 2, r.top);
  goTo("booked");
});

/* =========================================================
   SCENE 5 — Booked + restart
   ========================================================= */
enterHooks.booked = () => {
  const ticket = $("#ticket");
  ticket.textContent = "";
  for (const [k, v] of Object.entries(CONFIG.dinner)) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span class="k"></span><span class="v"></span>`;
    $(".k", row).textContent = k; $(".v", row).textContent = fill(v);
    ticket.appendChild(row);
  }
  $("#bookedNote").textContent = fill(CONFIG.bookedNote);
  setTimeout(() => confetti(180), 300);
  setTimeout(() => confetti(110, innerWidth * .25, innerHeight * .4), 900);
  setTimeout(() => confetti(110, innerWidth * .75, innerHeight * .4), 1300);
};

function resetAll() {
  // scene 1
  blown = false; stopMic();
  candles.forEach((c) => c.classList.remove("out"));
  $("#cake").classList.remove("party", "dark");
  $("#cakeTitle").textContent = "Make a wish, " + CONFIG.name + "…";
  $("#cakeSub").textContent = "then blow out the candles 🕯️";
  $("#cakeActions").classList.remove("hidden");
  $("#micBtn").classList.remove("hidden");
  $("#cakeHint").classList.remove("hidden");
  $("#cakeHint").textContent = "Tip: you can also tap the flames";
  $("#toCard").classList.add("hidden");
  // scene 2
  card.classList.remove("open");
  writeRun++;
  $$(".wish .ch").forEach((c) => c.classList.remove("on", "pen"));
  wishPage.scrollTop = 0;
  $("#cardHint").textContent = "A little love letter for you… tap to open 💌";
  $("#toPhotos").classList.add("hidden");
  // scene 4
  dodges = 0;
  noBtn.classList.remove("run"); noBtn.style.left = noBtn.style.top = ""; noBtn.textContent = "No";
  yesBtn.style.setProperty("--s", 1);
  $("#askSub").textContent = CONFIG.ask.sub;
  goTo("cake");
}
$("#restartBtn").addEventListener("click", resetAll);
