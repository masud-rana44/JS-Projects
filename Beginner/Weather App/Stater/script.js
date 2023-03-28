const apiKey = `e3a7f97dfb0a2924c43c80117fac0cfb`;
const formInput = document.querySelector(".form-input");
const form = document.querySelector(".form");
const btn = document.querySelector(".btn");
const wrapper = document.querySelector(".wrapper");

const renderWeather = function (data) {
  console.log(data);
  const markup = `
    <div class="details">
        <div class="top">
          <img class="icon" src="icons/${data.weather[0].main.toLowerCase()}.svg" alt="icon-clear" />
          <p class="temp">${Math.round(data.main.temp - 273)}&deg; C</p>
          <p class="weather-message">${data.weather[0].description}</p>
          <p class="location">Dhaka, Bangladesh</p>
        </div>
        <div class="bottom">
          <div class="fills">
            <div class="icons">
              <i class="fa-solid fa-temperature-list"></i>
            </div>
            <div class="info">
              <p class="number">${
                Math.round(data.main.feels_like) - 273
              }&deg; C</p>
              <p class="message">Feels like</p>
            </div>
          </div>
          <div class="humidity">
            <div class="icons"></div>
            <div class="info">
              <p class="number">${data.main.humidity}%</p>
              <p class="message">Humidity</p>
            </div>
          </div>
        </div>
      </div>
  `;
  form.classList.add("hidden");
  wrapper.insertAdjacentHTML("beforeend", markup);
};

const getWeatherByCityName = async function (e) {
  try {
    e.preventDefault();
    const city = formInput.value;
    if (!city) return;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    const data = await res.json();

    renderWeather(data);
    console.log(data);
  } catch (err) {
    console.log(err.message);
  }
};

const getWeatherData = async function (lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    return res.json();
  } catch (err) {
    console.error(err);
  }
};

const showWeather = async function (position) {
  const { latitude, longitude } = position.coords;
  const data = await getWeatherData(latitude, longitude);
  renderWeather(data);
  console.log(data);
};

const getAlert = function () {
  alert("Please give access to get weather data!");
};

const showPosition = function () {
  if (navigator.geolocation.getCurrentPosition(showWeather, getAlert));
  else "Browser has not supported geolocation!";
};

btn.addEventListener("click", showPosition);
form.addEventListener("submit", getWeatherByCityName);
