"use strict";

const btns = document.querySelectorAll(".btn");
const btnClose = document.querySelector(".close-icon");
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");

const openModeal = function () {
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  popup.classList.add("hidden");
  overlay.classList.add("hidden");
};

btns.forEach((btn) => {
  btn.addEventListener("click", openModeal);
});

btnClose.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !popup.classList.contains("hidden")) closeModal();
});
