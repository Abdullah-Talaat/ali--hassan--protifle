window.onload = () => {
  
  /* ========== THEME TOGGLE ========== */
  const themeToggle = document.getElementById("theme-toggle");
  
  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle("dark-mode");
      themeToggle.textContent =
        document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    };
  }
  
  
  /* ========== YEAR ========== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  
  /* ========== PORTFOLIO / IMAGE VIEWER ========== */
  
  /* ========== LANGUAGE TOGGLE ========== */
  let currentLang = "ar";
  const langBtn = document.getElementById("lang-toggle");
  function applyLanguage() {
  document.querySelectorAll("[data-lang-en]").forEach(el => {
    el.textContent =
      currentLang === "en"
        ? el.dataset.langEn
        : el.dataset.langAr;
  });

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  const whatsappBtn = document.querySelector('.whatsapp-btn');
  if (whatsappBtn && !whatsappBtn.querySelector('i')) {
    whatsappBtn.insertAdjacentHTML("afterbegin", '<i class="fab fa-whatsapp"></i> ');
  }

  startTypingAbout();
}
  if (langBtn) {
    langBtn.onclick = () => {
      currentLang = currentLang === "en" ? "ar" : "en";
      langBtn.textContent = currentLang === "en" ? "AR" : "EN";
      applyLanguage();
    };
  }
  
  
  /* ========== TYPING EFFECT ========== */
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
      currentLang === "en" ?
      el.dataset.textEn :
      el.dataset.textAr;
    
    typeText(el, text);
  }
  
  applyLanguage();
  
  
  /* ========== BURGER MENU ========== */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  
  if (burger && nav) {
    burger.onclick = () => {
      nav.classList.toggle("show");
    };
  }
  
};

const portfolio = document.getElementById("portfolio");

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalBrief = document.getElementById("modalBrief");
const modalReview = document.getElementById("modalReview");
const modalClose = document.getElementById("modalClose");

let mainProjects = [];

/* ========= FETCH MAIN ========= */
fetch("/projects.json")
  .then(res => res.json())
  .then(data => {
    mainProjects = data.projects || [];
    showMain();
  });

/* ========= فتح المودال ========= */
function openModal(img, title = "", brief = "", review = "") {
  modalImg.src = img;
  modalTitle.textContent = title;
  modalBrief.textContent = brief;
  modalReview.textContent =review;
  
  modal.classList.add("show");
}

/* ========= غلق المودال ========= */
modalClose.onclick = () => modal.classList.remove("show");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("show");
};

/* ========= main ========= */
function showMain() {
  let html = "";
  
  // main من JSON
  mainProjects.forEach(project => {
    html += `
      <div class="portfolio-item"
        onclick="openModal(
          '${project.path}',
          '${project.title}',
          'الطلب: ${project.brief}',
          'رد العميل:${project.review}'
        )">
        <img src="${project.path}" alt="${project.title}">
        <div class="overlay">View</div>
      </div>
    `;
  });
  
  
  
  portfolio.innerHTML = html;
}

/* ========= صور ثابتة ========= */
function getStaticImages(folder, count) {
  let html = "";
  
  for (let i = 1; i <= count; i++) {
    const src = `/${folder}-${i}.jpg`;
    
    html += `
      <div class="portfolio-item"
        onclick="openModal('${src}')">
        <img src="${src}" alt="${folder} ${i}">
        <div class="overlay">View</div>
      </div>
    `;
  }
  
  return html;
}

/* ========= الفلاتر ========= */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.onclick = (e) => {
    
    document.querySelectorAll(".filter-btn")
      .forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    
    const category = e.target.dataset.category;
    
    if (category === "main") showMain();
    if (category === "logos") portfolio.innerHTML = getStaticImages("logos", 4);
    if (category === "ids") portfolio.innerHTML = getStaticImages("ids", 1);
    if (category === "posts") portfolio.innerHTML = getStaticImages("posts", 8);
  };
});