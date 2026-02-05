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

/* ================== FILTER BUTTONS ================== */
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.onclick = (e) => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    
    e.currentTarget.classList.add("active");
    const cat = e.currentTarget.dataset.category;
    
    switch (cat) {
      case "main":
        renderSection(mainProjects);
        break;
      case "logos":
        renderSection(logosA);
        break;
      case "posts":
        renderSection(postsA);
        break;
      case "ids":
        renderSection(idsA);
        break;
      case "photography":
        renderSection(photosA);
        break;
      case "videos":
        renderSection(videosA);
        break;
    }
  };
});

/* ================== MODAL ================== */
let currentArray = [];
let currentSlide = 0;

function openModal(path, title = "", brief = "", review = "", array = []) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  
  currentArray = array;
  currentSlide = array.findIndex((i) => i.path === path);
  if (currentSlide < 0) currentSlide = 0;
  
  renderSlide();
}


function renderSlide() {
  const item = currentArray[currentSlide];
  if (!item) return;
  
  const media = document.getElementById("modal-media");
  media.innerHTML = item.path.endsWith(".mp4") ?
    `<video src="${item.path}" controls autoplay></video>` :
    `<img src="${item.path}" alt="${item.title || ""}">`;
  
  document.getElementById("modal-title").textContent = item.title || "";
  document.getElementById("modal-brief").textContent = item.brief || "";
  document.getElementById("modal-review").textContent = item.review || "";
}


/* ================== DATA ================== */
let mainProjects = [],
  postsA = [],
  logosA = [],
  idsA = [],
  videosA = [],
  photosA = [];

/* ===== دالة ذكية: دمج JSON + الترقيم ===== */
function buildSection(type, total, ext, dbArray = []) {
  const result = [];
  
  for (let i = 1; i <= total; i++) {
    const path = `/${type}-${i}.${ext}`;
    
    const dbItem = dbArray.find((item) => item.path === path);
    
    result.push(
      dbItem || {
        path,
        title: `${type.toUpperCase()} ${i}`,
        brief: "",
        review: "",
        index:i
      }
    );
  }
  
  return result;
}

/* ================== FETCH JSON ================== */

let videosAa =[]
fetch("/projects.json")
  .then((res) => res.json())
  .then((data) => {
    videosAa = data.videos
    let sizes = data.sizes
    postsA = buildSection
    ("posts", sizes.posts, "jpg", data.posts || []);
    logosA = buildSection
    ("logos", sizes.logos, "jpg", data.logos || []);
    photosA = buildSection
    ("photos", sizes.photos, "jpg", data.photos || []);
    idsA = buildSection
    ("ids", sizes.ids, "jpg", data.ids || []);
    videosA = buildSection
  ("videos", sizes.videos, "mp4", data.ids || []);; // لا يوجد حالياً
    
    mainProjects = [
      ...postsA.slice(0, 4),
      ...logosA.slice(0, 2)
    ];
    
    renderSection(mainProjects);
  })
  .catch((err) => console.error("JSON Error:", err));

/* ================== RENDER ================== */
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
      video.src = videosAa[item.index-1];
      console.log(videosAa[item.index-1])
      
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      div.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = item.path;
      img.alt = item.title || "";
      div.appendChild(img);
    }
    
    portfolio.appendChild(div);
  });
}

}

function closeModal() {
  document.getElementById("modal").style.display ="none"
}