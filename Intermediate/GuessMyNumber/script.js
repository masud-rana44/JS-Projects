"use strict";
const body = document.querySelector("body");
const hiddenNum = document.querySelector(".hiddenNum");
const stateUpdate = document.querySelector(".state-text");
const score = document.querySelector(".score");
const highscore = document.querySelector(".high-score");
const guessNumber = document.querySelector(".guessNumber");
const btnAgain = document.querySelector(".btn__again");
const btnCheck = document.querySelector(".btn__check");
let currentScore = 20;
let currentHighscore = 0;

const displayMessage = function (message) {
  stateUpdate.textContent = message;
};
let secretNum = Math.trunc(Math.random() * 20 + 1);

btnCheck.addEventListener("click", function () {
  const guess = Number(guessNumber.value);

  // When there is no input
  if (!guess) {
    displayMessage("⛔️ No number!");

    // when player wins
  } else if (guess === secretNum) {
    displayMessage("🎉 Correct Number!");
    hiddenNum.textContent = secretNum;

    hiddenNum.style.padding = "3rem 10rem";
    body.style.background = "#60b347";

    if (currentScore > currentHighscore) {
      currentHighscore = currentScore;
      highscore.textContent = currentHighscore;
    }

    // when guess is not correct
  } else if (guess !== secretNum) {
    if (currentScore > 1) {
      --currentScore;
      score.textContent = currentScore;
      displayMessage(guess < secretNum ? "📉 Too low!" : "📈 Too high!");
    } else {
      displayMessage("💥 You lost the game!");
      score.textContent = 0;
    }
  }
});

btnAgain.addEventListener("click", function () {
  secretNum = Math.trunc(Math.random() * 20 + 1);
  currentScore = 20;

  displayMessage("Start guessing...");
  hiddenNum.textContent = "?";
  score.textContent = currentScore;
  guessNumber.value = "";

  body.style.background = "#222";
  hiddenNum.style.padding = "3rem 4.5rem";
});
