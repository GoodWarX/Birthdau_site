const imageFiles = [
  "photo-01.png",
  "photo-02.png",
  "photo-03.png",
  "photo-04.png",
  "photo-05.png",
  "photo-06.png",
  "photo-07.png",
  "photo-08.jpg",
  "photo-09.jpg",
  "photo-10.jpg",
  "photo-11.jpg",
  "photo-12.jpg",
  "photo-13.jpg",
  "photo-14.jpg",
  "photo-15.jpg",
  "photo-16.jpg",
  "photo-17.jpg",
  "photo-18.jpg",
  "photo-19.jpg",
  "photo-20.png",
  "photo-21.jpg",
  "photo-22.jpg",
];

const song = document.getElementById("birthdaySong");
const startButton = document.getElementById("startButton");
const intro = document.getElementById("intro");
const crawlText = document.getElementById("crawlText");
const gallery = document.getElementById("gallery");
const final = document.getElementById("final");
const photo = document.getElementById("slidePhoto");
const counter = document.getElementById("photoCounter");
const starsCanvas = document.getElementById("starsCanvas");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const starsCtx = starsCanvas.getContext("2d");
const fireworksCtx = fireworksCanvas.getContext("2d");
const previewMode = new URLSearchParams(window.location.search).has("preview");
const slideDuration = previewMode ? 280 : 3600;
const slideFadeDelay = previewMode ? 60 : 340;

let slideIndex = 0;
let started = false;
let stars = [];
let fireworks = [];

if (previewMode) {
  document.documentElement.style.setProperty("--crawl-duration", "3s");
}

function fitCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function makeStars() {
  stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.25,
    s: Math.random() * 0.6 + 0.15,
    a: Math.random() * 0.75 + 0.25,
  }));
}

function drawStars() {
  starsCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    star.y += star.s;
    if (star.y > window.innerHeight + 4) {
      star.y = -4;
      star.x = Math.random() * window.innerWidth;
    }
    starsCtx.beginPath();
    starsCtx.fillStyle = `rgba(255, 248, 210, ${star.a})`;
    starsCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    starsCtx.fill();
  }
  requestAnimationFrame(drawStars);
}

function playMusic() {
  song.volume = 0.78;
  return song.play();
}

function startGreeting() {
  if (started) return;
  started = true;
  startButton.classList.add("playing");
  document.body.classList.remove("waiting");
  playMusic().catch(() => {});
}

function showGallery() {
  intro.classList.add("hidden");
  gallery.classList.remove("hidden");
  showSlide();
}

function showSlide() {
  if (slideIndex >= imageFiles.length) {
    showFinal();
    return;
  }

  photo.classList.remove("show");
  window.setTimeout(() => {
    photo.src = `assets/${imageFiles[slideIndex]}`;
    counter.textContent = `${slideIndex + 1} / ${imageFiles.length}`;
    photo.onload = () => photo.classList.add("show");
    slideIndex += 1;
    window.setTimeout(showSlide, slideDuration);
  }, slideFadeDelay);
}

function showFinal() {
  gallery.classList.add("hidden");
  final.classList.remove("hidden");
  fireworksCanvas.classList.add("active");
  window.setInterval(spawnFirework, 420);
}

window.birthdayPreview = {
  showGallery,
  showFinal,
};

function spawnFirework() {
  const colors = ["#ffd45a", "#ff4fb8", "#49e4ff", "#ffffff", "#78ff9f"];
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight * 0.56 + 40;
  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 72; i += 1) {
    const angle = (Math.PI * 2 * i) / 72;
    const speed = Math.random() * 4 + 1.7;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 72,
      color,
    });
  }
}

function drawFireworks() {
  fireworksCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  fireworks = fireworks.filter((spark) => spark.life > 0);

  for (const spark of fireworks) {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.035;
    spark.life -= 1;
    fireworksCtx.beginPath();
    fireworksCtx.fillStyle = spark.color;
    fireworksCtx.globalAlpha = Math.max(spark.life / 72, 0);
    fireworksCtx.arc(spark.x, spark.y, 2.3, 0, Math.PI * 2);
    fireworksCtx.fill();
  }

  fireworksCtx.globalAlpha = 1;
  requestAnimationFrame(drawFireworks);
}

window.addEventListener("resize", () => {
  fitCanvas(starsCanvas);
  fitCanvas(fireworksCanvas);
  makeStars();
});

startButton.addEventListener("click", startGreeting);
crawlText.addEventListener("animationend", showGallery);

fitCanvas(starsCanvas);
fitCanvas(fireworksCanvas);
makeStars();
drawStars();
drawFireworks();
playMusic()
  .then(() => {
    started = true;
    document.body.classList.remove("waiting");
    startButton.classList.add("playing");
  })
  .catch(() => startButton.classList.remove("playing"));
