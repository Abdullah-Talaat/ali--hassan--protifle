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
      el.textContent = currentLang === "en" ? el.dataset.langEn : el.dataset.langAr;
    });
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    const caaEl = document.querySelector(".caa");
    if (caaEl) caaEl.dir = "ltr";
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
    const text = currentLang === "en" ? el.dataset.textEn : el.dataset.textAr;
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
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach((b) =>
        b.classList.remove("active")
      );
      e.target.classList.add("active");
      const category = e.target.dataset.category;

      switch (category) {
        case "main":
          renderSection(mainProjects, "projects");
          break;
        case "logos":
          renderSection(logosA, "logos", 5, "image");
          break;
        case "posts":
          renderSection(postsA, "posts", 10, "image");
          break;
        case "photography":
          renderSection(photosA, "photos", 1, "image");
          break;
        case "videos":
          renderSection(videosA, "videos", 8, "video");
          break;
        case "ids":
          renderSection(idsA, "ids", 1, "image");
          break;
      }
    });
  });

  /* ===== SKILL SCROLL ===== */
  document.querySelectorAll(".skill-item").forEach((skill) => {
    skill.addEventListener("click", () => {
      const portfolioSection = document.getElementById("portfolio2");
      if (portfolioSection) portfolioSection.scrollIntoView({ behavior: "smooth" });
    });
  });
};

/* ===== MODAL ===== */
let currentArray = [];
let currentSlide = 0;

function openModal(path, title = "", brief = "", review = "", array = null) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";

  if (array && Array.isArray(array)) {
    currentArray = array;
    currentSlide = array.findIndex((item) => item.path === path);
  } else {
    currentArray = [];
  }

  renderSlide(path, title, brief, review);
}

function renderSlide(path, title = "", brief = "", review = "") {
  const mediaContainer = document.getElementById("modal-media");

  if (currentArray.length > 0) {
    const item = currentArray[currentSlide];
    path = item.path || path;
    title = item.title || title;
    brief = item.brief ? "الطلب: " + item.brief : brief;
    review = item.review ? "رد العميل: " + item.review : review;
  }

  if (!path) return;

  if (path.endsWith(".mp4") || path.endsWith(".webm")) {
    mediaContainer.innerHTML = `<video src="${path}" controls autoplay muted></video>`;
  } else {
    mediaContainer.innerHTML = `<img src="${path}" alt="${title}">`;
  }

  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-brief").textContent = brief;
  document.getElementById("modal-review").textContent = review;
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  currentArray = [];
}

const modal = document.getElementById("modal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ===== JSON DATA ===== */
let mainProjects = [],
  postsA = [],
  logosA = [],
  idsA = [],
  videosA = [],
  photosA = [];
let portfolio = document.getElementById("portfolio");

fetch("/projects.json")
  .then((res) => res.json())
  .then((data) => {
    mainProjects = data.projects || [];
    postsA = data.posts || [];
    logosA = data.logos || [];
    idsA = data.ids || [];
    videosA = data.videos || [];
    photosA = data.photos || [];
    renderSection(mainProjects, "projects");
  })
  .catch((err) => console.error(err));

/* ===== RENDER SECTION ===== */
function renderSection(arr, folder = "", count = 0, type = "image") {
  if (!portfolio) return;
  portfolio.innerHTML = "";

  if (arr && arr.length > 0) {
    arr.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("portfolio-item");

      // أي عنصر داخل div يفتح modal
      div.addEventListener("click", () =>
        openModal(item.path, item.title, item.brief, item.review, arr)
      );

      if (item.path.endsWith(".mp4") || item.path.endsWith(".webm")) {
        const video = document.createElement("video");
        video.src = item.path;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        div.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = item.path;
        img.alt = item.title || "";
        div.appendChild(img);
      }

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.textContent = "View";
      div.appendChild(overlay);

      portfolio.appendChild(div);
    });
  } else if (folder && count > 0) {
    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div");
      div.classList.add("portfolio-item");

      div.addEventListener("click", () => {
        const src = type === "video" ? `${folder}-${i}.mp4` : `${folder}-${i}.jpg`;
        openModal(src);
      });

      if (type === "video") {
        const video = document.createElement("video");
        video.src = `${folder}-${i}.mp4`;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        div.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = `${folder}-${i}.jpg`;
        img.alt = `${folder} ${i}`;
        div.appendChild(img);
      }

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.textContent = "View";
      div.appendChild(overlay);

      portfolio.appendChild(div);
    }
  }
}