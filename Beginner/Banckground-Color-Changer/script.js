"use strict";

const container = document.querySelector(".container");
const btnChange = document.querySelector(".btn");

const randomNumber = function () {
  return Math.trunc(Math.random() * 255 + 1);
};

btnChange.addEventListener("click", function () {
  const color = `rgba(${randomNumber()},${randomNumber()},${randomNumber()},${Math.random()})`;
  console.log(color);

  container.style.backgroundColor = `${color}`;
});
