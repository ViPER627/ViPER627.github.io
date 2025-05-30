const tabs = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".portfolio-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    contents.forEach(c => {
      c.style.display = c.id === target ? "block" : "none";
    });
  });
});
