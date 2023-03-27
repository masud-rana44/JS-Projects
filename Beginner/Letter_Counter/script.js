"use strict";

const input = document.querySelector(".input");
const letterCount = document.querySelector(".count");
let count = 0;

input.addEventListener("keypress", function (e) {
  console.log(e.charCode);
  if (e.charCode >= 65 && e.charCode <= 122) {
    ++count;
    letterCount.textContent = count;
  }
});
