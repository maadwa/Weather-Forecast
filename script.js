const apiKey = "2c07cf45b00b37c0398f6839b8813495";
const searchBtn = document.getElementById("search-btn");
const currentLocationBtn = document.getElementById("current-location-btn");
const cityInput = document.getElementById("city-input");
const temperatureElem = document.getElementById("temperature");
const weatherStatusElem = document.getElementById("weather-status");
const locationElem = document.getElementById("location"); 
const humidityElem = document.getElementById("humidity");
const pressureElem = document.getElementById("pressure");
const visibilityElem = document.getElementById("visibility");
const forecastContainer = document.getElementById("forecast-container");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchCurrentWeather(city);
    fetchForecastWeather(city);
  }
});

currentLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeatherByCoords(latitude, longitude);
      fetchForecastWeatherByCoords(latitude, longitude);
    });
  }
});

async function fetchCurrentWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  updateCurrentWeatherUI(data);
}

async function fetchForecastWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  updateForecastUI(data);
}

async function fetchCurrentWeatherByCoords(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  updateCurrentWeatherUI(data);
}

async function fetchForecastWeatherByCoords(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  updateForecastUI(data);
}

function updateCurrentWeatherUI(data) {
  temperatureElem.textContent = `${data.main.temp}°C`;
  weatherStatusElem.textContent = data.weather[0].description;
  locationElem.textContent = `${data.name}, ${data.sys.country}`;
  humidityElem.textContent = `${data.main.humidity}%`;
  pressureElem.textContent = `${data.main.pressure} hPa`;
  visibilityElem.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

function updateForecastUI(data) {
  forecastContainer.innerHTML = ""; // Clear previous forecast
  const dailyForecasts = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecasts.forEach((forecast) => {
    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");

    const date = new Date(forecast.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = date.toLocaleDateString("en-US");

    const temp = `${forecast.main.temp.toFixed(1)}°C`;
    const weather = forecast.weather[0].description;

    forecastCard.innerHTML = `
      <h3>${day}, ${fullDate}</h3>
      <p>${temp}</p>
      <p>${weather}</p>
    `;

    forecastContainer.appendChild(forecastCard);
  });
}
