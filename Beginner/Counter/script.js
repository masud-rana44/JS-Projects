"use strict";

const countNumber = document.querySelector(".count");
const btnMinus = document.querySelector(".btn--minus");
const btnPlus = document.querySelector(".btn--plus");
let count = 0;

btnPlus.addEventListener("click", function () {
  ++count;
  countNumber.textContent = count;
});

btnMinus.addEventListener("click", function () {
  if (count > 0) --count;
  countNumber.textContent = count;
});
