"use script";

const todoItem = document.querySelector(".to-do-item");
const btnInput = document.querySelector(".input-btn");
const inputText = document.querySelector(".input-text");

const isEventHapping = function () {
  const content = inputText.value;
  inputText.value = "";

  const html = `
      <div class="item to-do-item">
        <input type="text" value="${content}" name="" class="text input-text" />
        <input type="button" value="Remove" class="remove-btn input-btn" />
      </div>
  `;
  if (content !== "") todoItem.insertAdjacentHTML("afterend", html);

  const btnRemove = document.querySelectorAll(".remove-btn");
  const items = document.querySelectorAll(".item");

  // btnRemove.forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     btn.classList.add("hidden");
  //   });
  // });

  for (let i = 0; i < items.length; i++) {
    btnRemove[i].addEventListener("click", () => {
      items[i].classList.add("hidden");
    });
  }
};

btnInput.addEventListener("click", isEventHapping);
inputText.addEventListener("keypress", function (e) {
  if (e.key === "Enter") isEventHapping();
});
