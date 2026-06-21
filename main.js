function optimizeCloudinaryUrl(url) {
    if (!url.includes('/image/upload/')) return url;

    return url.replace(
        '/image/upload/',
        '/image/upload/f_auto,q_auto,w_1200/'
    );
}
function optimizeCloudinaryVideoUrl(url) {
    if (!url.includes('/video/upload/')) return url;

    return url.replace(
        '/video/upload/',
        '/video/upload/q_auto,f_auto/'
    );
}
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

function openModal(url, title = "", brief = "", review = "", array = []) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  
  currentArray = array;
  currentSlide = array.findIndex((i) => i.url === url);
  
  if (currentSlide < 0) currentSlide = 0;
  
  renderSlide();
}
function formatText(text = "") {
  return text.length > 100
    ? text.slice(0, 100) + "..."
    : text;
}
function renderSlide() {
  const item = currentArray[currentSlide];
  if (!item) return;
  
  const media = document.getElementById("modal-media");
  
  media.innerHTML =
    item.type === "video" ?
    `<video src="${optimizeCloudinaryVideoUrl(item.url)}" controls autoplay></video>` :
    `<img src="${optimizeCloudinaryUrl(item.url)}" alt="${item.title || ""}"  loading="lazy">`;
  
  
  document.getElementById("modal-title").textContent =
  formatText(item.title || "");

document.getElementById("modal-brief").textContent =
  formatText(item.brief || "");

document.getElementById("modal-review").textContent =
  formatText(item.review || "");
  document.getElementById("id").textContent =
  item.id || "";
}

/* ================== DATA ================== */
let mainProjects = [];
let postsA = [];
let logosA = [];
let idsA = [];
let videosA = [];
let photosA = [];

/* ================== FIRESTORE ================== */

db.collection("projects")
  .get()
  .then((snapshot) => {
    const fProjects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    postsA = fProjects.filter(
      (item) => item.section === "posts"
    );
    
    logosA = fProjects.filter(
      (item) => item.section === "logos"
    );
    
    photosA = fProjects.filter(
      (item) => item.section === "photos"
    );
    
    videosA = fProjects.filter(
      (item) => item.section === "videos"
    );
    
    idsA = fProjects.filter(
      (item) => item.section === "ids"
    );
    
    mainProjects = fProjects.filter(
      (item) => item.isMain
    );
    
    renderSection(mainProjects);
  })
  .catch((err) => {
    console.error(err);
  });

/* ================== RENDER ================== */
function renderSection(arr) {
  const portfolio = document.getElementById("portfolio");
  portfolio.innerHTML = "";
  
  arr.forEach((item) => {
    const div = document.createElement("div");
    div.className = "portfolio-item";
    
    div.onclick = () =>
      openModal(
        item.url,
        item.title,
        item.brief,
        item.review,
        arr
      );
    
    if (item.type === "video") {
      const video = document.createElement("video");
      
      video.src = optimizeCloudinaryVideoUrl(item.url);
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      
      div.appendChild(video);
    } else {
      const img = document.createElement("img");
      
      img.src = optimizeCloudinaryUrl(item.url);
      img.alt = item.title || "";
      img.loading = 'lazy';
      div.appendChild(img);
    }
    
    portfolio.appendChild(div);
  });
}


}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}