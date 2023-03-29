const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

const apiKey = `e3a7f97dfb0a2924c43c80117fac0cfb`;
let api;

function onSuccess(position) {
  const { latitude: lat, longitude: lon } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerHTML = error.message;
  infoTxt.classList.add("error");
}

function setWeatherIcon(id) {
  if (id == 800) {
    wIcon.src = "icons/clear.svg";
  } else if (id >= 200 && id <= 232) {
    wIcon.src = "icons/storm.svg";
  } else if (id >= 600 && id <= 622) {
    wIcon.src = "icons/snow.svg";
  } else if (id >= 701 && id <= 781) {
    wIcon.src = "icons/haze.svg";
  } else if (id >= 801 && id <= 804) {
    wIcon.src = "icons/cloud.svg";
  } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
    wIcon.src = "icons/rain.svg";
  }
}

function weatherDetails(info) {
  if (info.cod === "404") {
    // if user entered invalid city name
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    // getting required information
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;

    setWeatherIcon(id);

    weatherPart.querySelector(".temp .numb").innerText = Math.round(temp - 273);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp-2 .numb-2").innerText = Math.round(
      feels_like - 273
    );
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    infoTxt.innerHTML = "";
    inputField.value = "";

    wrapper.classList.add("active");
  }
}

function fetchData() {
  infoTxt.innerHTML = "Getting weather details...";
  infoTxt.classList.add("pending");

  // Fetch data from the API
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerHTML = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetchData();
}

inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value !== "") {
    requestApi(inputField.value);
  }
});

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation API😢");
  }
});
