const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const btnWork = document.querySelector(".btn-work");
const sectionWork = document.getElementById("section-work");
const sectionAbout = document.getElementById("section-about");

// Sticy Naviation
window.addEventListener("scroll", function () {
  // if (window.scrollY > 0) nav.classList.add("sticky");
  // else nav.classList.remove("sticky");
  nav.classList.toggle("sticky", this.window.scrollY > 0);
});

// Btn Scroll
btnWork.addEventListener("click", function () {
  const swCoords = sectionWork.getBoundingClientRect();
  // console.log(swCoords);

  // sectionWork.scrollIntoView({ behavior: "smooth" });

  // Current scroll
  // console.log("Current Scroll: (X/Y)", window.pageXOffset, window.pageYOffset);

  window.scrollTo({
    left: swCoords.x + window.pageXOffset,
    top: swCoords.y + window.pageYOffset,
    behavior: "smooth",
  });
});

// Navigation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching stategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    const coords = document.querySelector(id).getBoundingClientRect();

    window.scrollTo({
      left: coords.x + window.pageXOffset,
      top: coords.y + window.pageYOffset,
      behavior: "smooth",
    });

    // document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Scrolling
const topScroll = document.createElement("div");
topScroll.classList.add("scrollToTop");
topScroll.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
</svg>
`;
document.querySelector("body").append(topScroll);

const scrollToTop = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    topScroll.style.transform = "translateX(0)";
    topScroll.style.opacity = 1;
  } else {
    topScroll.style.transform = "translateX(70px)";
    topScroll.style.opacity = 0;
  }
};

const observer = new IntersectionObserver(scrollToTop, {
  root: null,
  threshold: 0.1,
  rootMargin: `-60px`,
});
observer.observe(header);

topScroll.addEventListener("click", function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
});

// Revel section
const allSections = document.querySelectorAll(".section");

const revelSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revelSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((sec) => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});
