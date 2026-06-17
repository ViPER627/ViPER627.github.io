function initTabs() {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".portfolio-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach((content) => {
        const isActive = content.id === target;
        content.style.display = isActive ? "grid" : "none";
        if (isActive) {
          content.animate(
            [
              { opacity: 0, transform: "translateY(18px) scale(0.985)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }
          );
        }
      });
    });
  });
}

function initRandomHeroGallery() {
  const featureCards = Array.from(document.querySelectorAll("[data-feature-slot]"));
  const portfolioLinks = Array.from(document.querySelectorAll(".portfolio-content .grid-item[href]"));
  if (!featureCards.length || !portfolioLinks.length) return;

  const labelMap = {
    design: "Brand / Layout",
    "3d": "3D Visual",
    ai: "AI Image",
    photo: "Photography",
  };

  const candidates = portfolioLinks
    .map((link) => {
      const section = link.closest(".portfolio-content");
      const image = link.querySelector("img");
      if (!section || !image) return null;

      return {
        href: link.getAttribute("href"),
        src: image.getAttribute("src"),
        title: image.getAttribute("alt") || link.dataset.title || "ViPER Portfolio",
        label: labelMap[section.id] || "Selected Work",
      };
    })
    .filter((item) => item && item.href && item.src);

  const randomValue = () => {
    if (window.crypto && window.crypto.getRandomValues) {
      return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
    }

    return Math.random();
  };

  const pickImages = () =>
    candidates
      .map((item) => ({ item, sort: randomValue() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);

  const renderImages = () => {
    const shuffled = pickImages();

    featureCards.forEach((card, index) => {
      const selected = shuffled[index % shuffled.length];
      const image = card.querySelector("img");
      const label = card.querySelector("span");

      card.classList.add("is-swapping");

      window.setTimeout(() => {
        card.href = selected.href;
        card.dataset.title = selected.title;
        card.setAttribute("aria-label", selected.title);

        if (image) {
          image.onload = () => {
            const ratio = image.naturalWidth / image.naturalHeight;
            card.classList.remove("is-landscape", "is-portrait", "is-square");
            card.style.setProperty("--feature-ratio", ratio.toFixed(3));

            if (ratio > 1.18) {
              card.classList.add("is-landscape");
            } else if (ratio < 0.86) {
              card.classList.add("is-portrait");
            } else {
              card.classList.add("is-square");
            }
          };
          image.src = selected.src;
          image.alt = selected.title;
        }

        if (label) {
          label.textContent = selected.label;
        }

        card.classList.remove("is-swapping");
      }, 220 + index * 80);
    });
  };

  renderImages();
  window.setInterval(renderImages, 3000);
}

function initHeroMotion() {
  const canvas = document.querySelector(".motion-canvas");
  const hero = document.querySelector(".cyber-hero");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let stars = [];

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(120, Math.min(240, Math.floor(width / 8)));
    stars = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: -0.08 - Math.random() * 0.28,
      vy: (Math.random() - 0.5) * 0.12,
      radius: index % 11 === 0 ? 1.8 : 0.75 + Math.random() * 0.9,
      alpha: 0.18 + Math.random() * 0.72,
      hue: index % 3,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const px = pointer.x * width;
    const py = pointer.y * height;

    const nebula = ctx.createRadialGradient(width * 0.74, height * 0.38, 0, width * 0.74, height * 0.38, width * 0.52);
    nebula.addColorStop(0, "rgba(53, 231, 255, 0.12)");
    nebula.addColorStop(0.42, "rgba(255, 79, 216, 0.055)");
    nebula.addColorStop(1, "rgba(5, 7, 13, 0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star, index) => {
      star.x += star.vx + (px - width / 2) * 0.00005;
      star.y += star.vy + (py - height / 2) * 0.00004;

      if (star.x < -20) star.x = width + 20;
      if (star.x > width + 20) star.x = -20;
      if (star.y < -20) star.y = height + 20;
      if (star.y > height + 20) star.y = -20;

      const palette = star.hue === 0 ? "53, 231, 255" : star.hue === 1 ? "182, 255, 74" : "255, 79, 216";
      ctx.beginPath();
      ctx.fillStyle = `rgba(${palette}, ${star.alpha})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      if (index % 17 === 0) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${palette}, 0.16)`;
        ctx.lineWidth = 1;
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x + 18, star.y - 3);
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    hero.style.setProperty("--orbit-x", pointer.x.toFixed(3));
    hero.style.setProperty("--orbit-y", pointer.y.toFixed(3));
  });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
}

function initTilt() {
  const tiltTargets = document.querySelectorAll(".capability-card");

  tiltTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const amount = target.classList.contains("grid-item") ? 4 : 8;
      target.style.transform = `perspective(900px) rotateX(${-y * amount}deg) rotateY(${x * amount}deg) translateY(-4px)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".capability-card, .section-heading");
  if (!("IntersectionObserver" in window)) return;

  items.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(18px)";
    item.style.transition = "opacity 0.55s ease, transform 0.55s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "";
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();

  return Promise.resolve();
}

function copyEmail() {
  const email = "viper_72527@yahoo.com.tw";
  return copyText(email).then(() => {
    document.querySelectorAll("#copy-tooltip").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateX(-50%) translateY(0)";
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateX(-50%) translateY(6px)";
      }, 1800);
    });
  });
}

function initContactPanel() {
  const panel = document.querySelector("#contact-panel");
  if (!panel) return;

  const note = panel.querySelector("#contact-panel-note");
  const email = panel.querySelector("#contact-email-text")?.textContent.trim() || "viper_72527@yahoo.com.tw";
  const phone = panel.querySelector("#contact-phone-text")?.textContent.trim() || "0931-343-551";
  const lineId = panel.querySelector("#contact-line-text")?.textContent.trim() || "viper72527";
  const openers = document.querySelectorAll("[data-contact-open]");
  const closers = panel.querySelectorAll("[data-contact-close]");
  const copyButtons = panel.querySelectorAll("[data-copy-email]");
  const copyPhoneButtons = panel.querySelectorAll("[data-copy-phone]");
  const copyLineButtons = panel.querySelectorAll("[data-copy-line]");

  const openPanel = () => {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closePanel = () => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openers.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      openPanel();
    });
  });

  closers.forEach((closer) => {
    closer.addEventListener("click", closePanel);
  });

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      copyText(email).then(() => {
        if (note) note.textContent = "信箱已複製，可以直接貼到 Gmail、LINE 或任何訊息工具。";
      });
    });
  });

  copyPhoneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      copyText(phone).then(() => {
        if (note) note.textContent = "手機號碼已複製。";
      });
    });
  });

  copyLineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      copyText(lineId).then(() => {
        if (note) note.textContent = "LINE ID 已複製，可以直接在 LINE 搜尋加入。";
      });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
      closePanel();
    }
  });
}

window.copyEmail = copyEmail;

document.addEventListener("DOMContentLoaded", () => {
  initRandomHeroGallery();
  initHeroMotion();
  initTabs();
  initTilt();
  initReveal();
  initContactPanel();
});
