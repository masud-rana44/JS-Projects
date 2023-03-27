"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");
const btnCloseModal = document.querySelector(".btn--close-modal");

//////////////////////////////////////
// Modal Window

const openModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////////////////
// Navigation
// The old way
// const navLinks = document.querySelectorAll(".nav__link");
// navLinks.forEach((link) => {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();

//     const id = this.getAttribute("href");

//     if (id !== "#") {
//       document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//     }
//   });
// });

// Event deligation
// 1. Add event listener to the common parent element
// 2. Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

/////////////////////////////////////////////////////////
// Tabbed component

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabContents = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active class
  tabs.forEach((t) => {
    t.classList.remove("operations__tab--active");
  });
  tabContents.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );

  // Actived class
  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// for (let i = 0; i < tabs.length; i++) {
//   tabs[i].addEventListener("click", function () {
//     // Removed active classes
//     contents.forEach((c) => c.classList.remove("operations__content--active"));
//     tabs.forEach((t) => t.classList.remove("operations__tab--active"));

//     // Activate tab
//     tabs[i].classList.add("operations__tab--active");

//     // Activate content area
//     contents[i].classList.add("operations__content--active");
//   });
// }

////////////////////////////////////////////////////////
// Menu fade animation
const nav = document.querySelector(".nav");

const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(function (el) {
      if (el !== link) {
        el.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
    });
  }
};
nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

//////////////////////////////////////////////////////
// Cookie message
const message = document.createElement("div");
message.classList.add("cookie-message");

message.innerHTML =
  'This website uses cookie to ensure you get the best exprience on our website. <a href="#" class="cookie-link">learn more</a> <button class="btn btn--close-cookie">Got it!</button>';

// styles
// document.querySelector(".btn--close-cookie").style.padding = "1.25rem 4.5rem";

const header = document.querySelector(".header");

// Insert element
header.append(message);

// Delete element
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();

    // old way
    // message.parentElement.removeChild(message);
  });

////////////////////////////////////////////////////////
// Smooth scrolling

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section-1");

btnScrollTo.addEventListener("click", function () {
  // const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // Current scroll
  // console.log("Current Scroll: (X/Y)", window.pageXOffset, window.pageYOffset);

  // Scrolling
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // Newer way may not support lestest browsers
  section1.scrollIntoView({ behavior: "smooth" });
});

/////////////////////////////////////////////////////////////
// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// Sticky navigation---Intersection observer API
const section2 = document.querySelector("#section2");
const navHeight = nav.getBoundingClientRect().height;

const navSticky = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const observer = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
observer.observe(header);

// Revel sections
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

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 1,
  rootMargin: "200px",
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

////////////////////////////////////////////////////////
// Slider

const slide = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`button[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = e.target.dataset.slide;

      goToSlide(slide);
      activateDot(slide);
    }
  });

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);

    goToSlide(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });
};

slide();
