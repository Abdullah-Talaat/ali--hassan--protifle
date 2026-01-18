window.onload = () => {

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent =
      document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });

  // --- Projects ---
  const photoS = document.getElementById("photoS");
  const photoIm = document.getElementById("photoIm");
  const portfolio = document.getElementById("protfolio");

  function openPhoto(id) {
    photoIm.src = `/${id}.jpg`;
    photoS.style.display = "flex";
    if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen(); // Safari
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen(); // IE
  }
  }

  let projectsPhotoE = "";

  for (let i = 1; i <= 13; i++) {
    projectsPhotoE += `
      <div class="portfolio-item" data-id="${i}">
        <img src="/${i}.jpg" alt="Project ${i}">
      </div>
    `;
  }

  portfolio.innerHTML = projectsPhotoE;

  // Attach click events properly
  document.querySelectorAll(".portfolio-item").forEach(item => {
    item.addEventListener("click", () => {
      openPhoto(item.dataset.id);
    });
  });

  // Close preview
  photoS.addEventListener("click", () => {
    photoS.style.display = "none";
    if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen(); // Safari
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen(); // IE
  }
  });
};

document.getElementById("year").textContent = new Date().getFullYear();
