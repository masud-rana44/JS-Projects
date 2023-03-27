const header = document.querySelector(".header");
const menuBar = document.querySelector(".menu-bar");

menuBar.addEventListener("click", function () {
  header.classList.toggle("nav-open");
});
