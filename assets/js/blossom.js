/* ─── PETALS ─── */
(function () {
  const canvas = document.getElementById("petals-canvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    petals = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#e8d5a3", "#c9a96e", "#f5e6c8", "#d4b896"];

  function Petal() {
    this.x = Math.random() * W;
    this.y = -20;
    this.size = Math.random() * 8 + 4;
    this.speed = Math.random() * 1.2 + 0.4;
    this.drift = (Math.random() - 0.5) * 0.8;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  Petal.prototype.update = function () {
    this.y += this.speed;
    this.x += this.drift;
    this.rot += this.rotSpeed;
    if (this.y > H + 20) {
      Object.assign(this, new Petal());
      this.y = -20;
    }
  };

  Petal.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  for (let i = 0; i < 55; i++) {
    const p = new Petal();
    p.y = Math.random() * H;
    petals.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─── COUNTDOWN ─── */
(function () {
  const target = new Date("2026-08-23T18:00:00+05:00").getTime();
  const ids = ["cd-days", "cd-hours", "cd-minutes", "cd-seconds"];

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      ids.forEach((id) => (document.getElementById(id).textContent = "00"));
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const vals = [d, h, m, s];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      const newVal = pad(vals[i]);
      if (el.textContent !== newVal) {
        el.style.animation = "numFlip 0.3s ease";
        setTimeout(() => (el.style.animation = ""), 300);
        el.textContent = newVal;
      }
    });
  }
  tick();
  setInterval(tick, 1000);
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
})();

/* ─── MUSIC ─── */
let musicPlaying = false;
function toggleMusic() {
  const audio = document.getElementById("bgMusic");
  if (!audio.src || audio.src === window.location.href) {
    alert(
      "Musiqa faylini qo'shish uchun: audio src='your-music.mp3' ga o'zgartiring",
    );
    return;
  }
  if (musicPlaying) {
    audio.pause();
    document.getElementById("music-icon").innerHTML = `
      <path d="M9 18V5l12-2v13" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke-linecap="round"/>
      <circle cx="18" cy="16" r="3" stroke-linecap="round"/>`;
  } else {
    audio.play().catch(() => {});
    document.getElementById("music-icon").innerHTML = `
      <rect x="6" y="4" width="4" height="16" rx="1"/>
      <rect x="14" y="4" width="4" height="16" rx="1"/>`;
  }
  musicPlaying = !musicPlaying;
}

/* ─── GALLERY LIGHTBOX ─── */
const galleryImgs = Array.from(document.querySelectorAll(".gallery-item img"));
let currentPhoto = 0;

galleryImgs.forEach((img, i) => {
  img.parentElement.addEventListener("click", () => openLightbox(i));
});

function openLightbox(i) {
  currentPhoto = i;
  document.getElementById("lb-img").src = galleryImgs[i].src;
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

function changePhoto(dir) {
  currentPhoto = (currentPhoto + dir + galleryImgs.length) % galleryImgs.length;
  const lb = document.getElementById("lb-img");
  lb.style.opacity = 0;
  setTimeout(() => {
    lb.src = galleryImgs[currentPhoto].src;
    lb.style.opacity = 1;
  }, 150);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") changePhoto(-1);
  if (e.key === "ArrowRight") changePhoto(1);
});

/* ─── VIDEO PLAY ─── */
function playVideo() {
  const video = document.getElementById("mainVideo");
  const placeholder = document.getElementById("videoPlaceholder");
  if (video.src && video.src !== window.location.href) {
    placeholder.style.display = "none";
    video.style.display = "block";
    video.play();
  }
}
