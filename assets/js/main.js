
document.addEventListener("DOMContentLoaded", () => {
  AOS.init();
  const tabs = document.querySelectorAll(".tab-button");
  const contentContainer = document.querySelector(".tab-content-container");

  const categories = ["design", "game", "ai", "3d", "photo"];

  function loadImages(tab) {
    fetch(`assets/images/${tab}/`)
      .then(() => {
        const html = Array.from({ length: 3 }, (_, i) => {
          const n = i + 1;
          return `<a href="assets/images/${tab}/${tab}${n}.jpg" data-lightbox="${tab}" data-title="${tab.toUpperCase()} ${n}">
            <img src="assets/images/${tab}/${tab}${n}.jpg" alt="${tab.toUpperCase()} ${n}">
          </a>`;
        }).join("");
        contentContainer.innerHTML = `<div class="portfolio-grid tab-content active" id="${tab}">${html}</div>`;
      });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadImages(tab.dataset.tab);
    });
  });

  loadImages("design");
});
