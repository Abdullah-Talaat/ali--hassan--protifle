window.onload = () => {
  const portfolio = document.getElementById("portfolio");

  /* ===== THEME TOGGLE ===== */
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle("dark-mode");
      themeToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    };
  }

  /* ===== YEAR ===== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== LANGUAGE TOGGLE ===== */
  let currentLang = "ar";
  const langBtn = document.getElementById("lang-toggle");

  function applyLanguage() {
    document.querySelectorAll("[data-lang-en]").forEach((el) => {
      el.textContent =
        currentLang === "en" ? el.dataset.langEn : el.dataset.langAr;
    });
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    startTypingAbout();
  }

  if (langBtn) {
    langBtn.onclick = () => {
      currentLang = currentLang === "en" ? "ar" : "en";
      langBtn.textContent = currentLang === "en" ? "AR" : "EN";
      applyLanguage();
    };
  }

  /* ===== TYPING EFFECT ===== */
  let typingInterval;
  function typeText(el, text) {
    clearInterval(typingInterval);
    let i = 0;
    typingInterval = setInterval(() => {
      el.textContent = text.slice(0, i) + "|";
      i++;
      if (i > text.length) {
        clearInterval(typingInterval);
        el.textContent = text;
      }
    }, 45);
  }

  function startTypingAbout() {
    const el = document.getElementById("typing-about");
    if (!el) return;
    const text =
      currentLang === "en" ? el.dataset.textEn : el.dataset.textAr;
    typeText(el, text);
  }

  applyLanguage();

  /* ===== BURGER MENU ===== */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  let isOpen = false;

  if (burger && nav) {
    burger.onclick = () => {
      nav.classList.toggle("show");
      isOpen = !isOpen;
      burger.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    };
  }

  /* ===== FILTER BUTTONS ===== */
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.onclick = (e) => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const cat = e.target.dataset.category;

      if (cat === "main") renderSection(mainProjects);
      if (cat === "logos") renderSection(logosA);
      if (cat === "posts") renderSection(postsA);
      if (cat === "ids") renderSection(idsA);
      if (cat === "photography") renderSection(photosA);
      if (cat === "videos") renderSection(videosA);
    };
  });
};

/* ===== MODAL ===== */
let currentArray = [];
let currentSlide = 0;

function openModal(path, title = "", brief = "", review = "", array = []) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  currentArray = array;
  currentSlide = array.findIndex((i) => i.path === path);
  renderSlide();
}

function renderSlide() {
  const item = currentArray[currentSlide];
  if (!item) return;

  const media = document.getElementById("modal-media");
  media.innerHTML = item.path.endsWith(".mp4")
    ? `<video src="${item.path}" controls autoplay></video>`
    : `<img src="${item.path}" />`;

  document.getElementById("modal-title").textContent = item.title || "";
  document.getElementById("modal-brief").textContent = item.brief || "";
  document.getElementById("modal-review").textContent = item.review || "";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===== DATA ===== */
let mainProjects = [],
  postsA = [],
  logosA = [],
  idsA = [],
  videosA = [],
  photosA = [];

fetch("/projects.json")
  .then((res) => res.json())
  .then((data) => {
    mainProjects = data.projects || [];
    postsA = data.posts || [];
    logosA = data.logos || [];
    idsA = data.ids || [];
    videosA = data.videos || [];
    photosA = data.photos || [];

    renderSection(mainProjects);
  });

/* ===== RENDER ===== */
function renderSection(arr) {
  const portfolio = document.getElementById("portfolio");
  portfolio.innerHTML = "";

  arr.forEach((item) => {
    const div = document.createElement("div");
    div.className = "portfolio-item";

    div.onclick = () =>
      openModal(item.path, item.title, item.brief, item.review, arr);

    if (item.path.endsWith(".mp4")) {
      const video = document.createElement("video");
      video.src = item.path;
      video.muted = true;
      video.loop = true;
      div.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = item.path;
      div.appendChild(img);
    }

    portfolio.appendChild(div);
  });
}