const navToggle = document.querySelector(".nav-toggle");
const globalNav = document.querySelector(".global-nav");
let navBackdrop = null;
let navScrollLockY = 0;

const mqNav = window.matchMedia("(max-width: 820px)");

const ensureNavBackdrop = () => {
  if (!navBackdrop) {
    navBackdrop = document.createElement("div");
    navBackdrop.className = "nav-backdrop";
    navBackdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(navBackdrop);
    navBackdrop.addEventListener("click", closeMobileNav);
  }
};

const lockBodyScroll = () => {
  navScrollLockY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add("nav-open");
  document.body.classList.add("nav-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${navScrollLockY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
};

const unlockBodyScroll = () => {
  document.documentElement.classList.remove("nav-open");
  document.body.classList.remove("nav-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, navScrollLockY);
};

const closeMobileNav = () => {
  if (!globalNav || !navToggle) return;
  globalNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  if (navBackdrop) navBackdrop.classList.remove("is-visible");
  unlockBodyScroll();
};

const openMobileNav = () => {
  if (!globalNav || !navToggle) return;
  ensureNavBackdrop();
  globalNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navBackdrop.classList.add("is-visible");
  lockBodyScroll();
};

if (navToggle && globalNav) {
  navToggle.addEventListener("click", () => {
    if (globalNav.classList.contains("is-open")) closeMobileNav();
    else openMobileNav();
  });

  globalNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (mqNav.matches) closeMobileNav();
    });
  });

  mqNav.addEventListener("change", (e) => {
    if (!e.matches) closeMobileNav();
  });
}

const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-item"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  let index = 0;
  let timer = null;

  const move = (next) => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => move(Number(dot.dataset.slide)));
  });

  if (prevBtn) prevBtn.addEventListener("click", () => move(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => move(index + 1));

  const start = () => {
    timer = window.setInterval(() => move(index + 1), 4500);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
  };

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  move(0);
  start();
}
