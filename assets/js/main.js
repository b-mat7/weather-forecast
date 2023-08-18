"use strict"

/* ===== IMPORT & GLOBAL VARIABLES ===== */
// import {apiKeyGeoApify, apiKeyOpenWeather, endpointGeoApify, endpointOpenWeather} from "./api.js";
const apiKeyGeoApify = "95e307302fcf40699496737f98e9fd2d";
const apiKeyOpenWeather = "4e523ff93c839ddd62ce26705bfd07a7";

const endpointGeoApify = "https://api.geoapify.com";
const endpointOpenWeather = "https://api.openweathermap.org";



const background = document.querySelector("section");

const summaryIconOutput = document.querySelector(".icon-container");
const summaryDescriptionOutput = document.querySelector(".description");

const detailsRainOutput = document.querySelector(".rain");
const detailsWindOutput = document.querySelector(".wind");
const detailsHumidityOutput = document.querySelector(".humidity");
const detailsTimeOutput = document.querySelector(".time");
const detailsSunOutput = document.querySelector(".sun");

const forecast24hOutput = document.querySelector(".forecast24h");
const forecast3dOutput = document.querySelector(".forecast3d");

const footerOutput = document.querySelector(".footer");

let startUp = true;


/* ===== FETCH DATA FUNCTIONS ===== */
const startUpFetchLocation = () => {
  if (!startUp) return;

  let lat, lon;
  if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        fetchCurrentWeather(lat, lon);
      },
      (error) => {
        console.error(error.message);
      }
    );
  } else {
    console.error("Browser not supporting Geolocation... fetching via IP...");
  }

  if (!lat) {
    const fetchStrIP = `${endpointGeoApify}/v1/ipinfo?apiKey=${apiKeyGeoApify}`;

    fetch(fetchStrIP)
      .then(response => {
        if (!response.ok) throw new Error("IP response.ok FAILED");
        return response.json();
      })
      .then(ipData => {
        const location = ipData.city.name;
        document.body.querySelector("#location").value = ipData.city.name;
        fetchCoordinates(location)
      })
      .catch((error) => console.error(error.message))
  } else {
    fetchCurrentWeather(lat, lon);
  }
  startUp = false;
}


const fetchCoordinates = (location) => {
  let lat, lon;

  const fetchStrGeo = `${endpointOpenWeather}/geo/1.0/direct?q=${location}&limit=1&appid=${apiKeyOpenWeather}`;

  fetch(fetchStrGeo)
    .then(response => {
      if (!response.ok) throw new Error("GEO response.ok FAILED");
      return response.json();
    })
    .then(geoData => {
      lat = geoData[0].lat;
      lon = geoData[0].lon;
    })
    .then(() => {
      fetchCurrentWeather(lat, lon);
      fetch24hWeather(lat, lon);
      fetch3dWeather(lat, lon);
    })
    .catch((error) => console.error(error.message));
}


const fetchCurrentWeather = (lat, lon) => {
  const fetchStrCurrent = `${endpointOpenWeather}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyOpenWeather}&units=metric&lang=en`;

  fetch(fetchStrCurrent)
    .then(response => {
      if (!response.ok) throw new Error("WEATHER response.ok FAILED");
      return response.json();
    })
    .then(currentWeatherData => {
      displayCurrentWeather(currentWeatherData);
    })
    .catch((error) => console.error(error.message));
}


const fetch24hWeather = (lat, lon) => {
  const fetchStr24h = `${endpointOpenWeather}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKeyOpenWeather}&units=metric&lang=en&cnt=8`;

  fetch(fetchStr24h)
    .then(response => {
      if (!response.ok) throw new Error("FORECAST24h response.ok FAILED");
      return response.json();
    })
    .then(forecast24hData => {
      const timezoneOffset = forecast24hData.city.timezone;
      display24hWeather(forecast24hData, timezoneOffset);
    })
    .catch((error) => console.error(error.message));
}


const fetch3dWeather = (lat, lon) => {
  const fetchStr3d = `${endpointOpenWeather}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKeyOpenWeather}&units=metric&lang=en&cnt=32`;

  fetch(fetchStr3d)
    .then(response => {
      if (!response.ok) throw new Error("FORECAST3d response.ok FAILED");
      return response.json();
    })
    .then(forecast3dData => {
      display3dWeather(forecast3dData);
    })
    .catch((error) => console.error(error.message));
}


/* ===== UTILITY FUNCTIONS ===== */
const refreshLocation = () => {
  const location = document.body.querySelector("#location").value;
  fetchCoordinates(location);
}


const calcDates = (currentWeatherData) => {

  /*
  - API liefert alle Zeiten in UTC (s) --*1000--> JS (ms)
  - Browser immer auto-umrechnung: UTC in vor Ort
  - im format{}: timezone: UTC --> Sage Browser deine vor Ort Zeit ist UTC, nicht umrechnen
  */

  // Umrechnung UTC (s) -> JS (ms) + API liefert timezone auch in s
  const secAsMs = 1000;
  const timezone = currentWeatherData.timezone * secAsMs;

  const dateFormatDateUser = { day: "2-digit", month: "short", year: "numeric" }    // Browser auto-umrechnung in vor Ort Zeit
  const dateFormatTimeUser = { hour12: false, hour: "2-digit", minute: "2-digit" }  // Browser auto-umrechnung in vor Ort Zeit
  const dateFormatDateUTC = { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" }    // timezone:UTC === Browser keine auto-umrechnung
  const dateFormatTimeUTC = { timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit" }  // timezone:UTC === Browser keine auto-umrechnung

  // Zeit des letzten Datensatzes (Date-Time in UTC)
  const dtUtc = new Date(currentWeatherData.dt * secAsMs);

  // User vor Ort Zeiten (aktuell + Datensatz) - vom Browser auto-umgerechnet
  const userDate = new Date(Date.now()).toLocaleString(undefined, dateFormatDateUser); // aktuelle Zeit - User vor Ort-Zeitzone
  const userTime = new Date(Date.now()).toLocaleString(undefined, dateFormatTimeUser); // aktuelle Zeit - User vor Ort-Zeitzone
  const dtUserDate = new Date(dtUtc).toLocaleString(undefined, dateFormatDateUser);    // datensatz Zeit - User vor Ort-Zeitzone
  const dtUserTime = new Date(dtUtc).toLocaleString(undefined, dateFormatTimeUser);    // datensatz Zeit - User vor Ort-Zeitzone

  // Remote Ort Zeiten (aktuell + Datensatz) - keine Browser auto-umrechnung
  const remoteDate = new Date(Date.now() + timezone).toLocaleString(undefined, dateFormatDateUTC); // aktuelle Zeit - remote Ort-Zeitzone (von uns gerechnet)
  const remoteTime = new Date(Date.now() + timezone).toLocaleString(undefined, dateFormatTimeUTC); // aktuelle Zeit - remote Ort-Zeitzone (von uns gerechnet)
  const dtRemoteDate = new Date(dtUtc + timezone).toLocaleString(undefined, dateFormatDateUTC);    // datensatz Zeit - remote Ort-Zeitzone (von uns gerechnet)
  const dtRemoteTime = new Date(dtUtc + timezone).toLocaleString(undefined, dateFormatTimeUTC);    // datensatz Zeit - remote Ort-Zeitzone (von uns gerechnet)

  // console.log(userDate);
  // console.log(userTime);
  // console.log(dtUserDate);
  // console.log(dtUserTime);

  // console.log(remoteDate);
  // console.log(remoteTime);
  // console.log(dtRemoteDate);
  // console.log(dtRemoteTime);

  const timestamp = new Date(Date.now()).toLocaleString("de");
  const sunrise = new Date((currentWeatherData.sys.sunrise * secAsMs) + timezone).toLocaleString(undefined, dateFormatTimeUTC);
  const sunset = new Date((currentWeatherData.sys.sunset * secAsMs) + timezone).toLocaleString(undefined, dateFormatTimeUTC);

  // short form for: valueVariable === keyName (sunrise:sunrise...)
  return { sunrise, sunset, remoteTime, timestamp };
}


/* ===== UPDATE UI FUNCTIONS ===== */
const setBackground = (id, remoteTime) => {
  let url;
  if (id <= 299) {
    if (remoteTime >= "07:00" && remoteTime <= "19:00") {
      url = "./assets/img/thunderstorm/thunderstorm_day.jpeg";
    } else {
      url = "./assets/img/thunderstorm/thunderstorm_night.jpeg";
    }
  } else if (id >= 300 && id <= 399) {
    if (remoteTime >= "07:00" && remoteTime <= "19:00") {
      url = "./assets/img/drizzle/drizzle_day.jpeg";
    } else {
      url = "./assets/img/drizzle/drizzle_night.jpeg";
    }
  } else if (id >= 500 && id <= 599) {
    if (remoteTime >= "07:00" && remoteTime <= "19:00") {
      url = "./assets/img/rain/rain_day.jpeg";
    } else {
      url = "./assets/img/rain/rain_night.jpeg";
    }
  } else if (id >= 600 && id <= 699) {
    if (remoteTime >= "07:00" && remoteTime <= "19:00") {
      url = "./assets/img/snow/snow_day.jpeg";
    } else {
      url = "./assets/img/snow/snow_night.jpeg";
    }
  } else if (id >= 700 && id <= 799) {
    url = "./assets/img/atmosphere/atmosphere.jpeg";
  } else if (id === 800) {
    if (remoteTime >= "06:00" && remoteTime <= "11:59") {
      url = "./assets/img/clear/clear_morning.jpeg";
    } else if (remoteTime >= "12:00" && remoteTime <= "17:59") {
      url = "./assets/img/clear/clear_day.jpeg";
    } else if (remoteTime >= "18:00" && remoteTime <= "20:59") {
      url = "./assets/img/clear/clear_evening.jpeg";
    } else {
      url = "./assets/img/clear/clear_night.jpeg";
    }
  } else if (id >= 800 && id <= 899) {
    if (remoteTime >= "06:00" && remoteTime <= "11:59") {
      url = "./assets/img/clouds/clouds_morning.jpeg";
    } else if (remoteTime >= "12:00" && remoteTime <= "17:59") {
      url = "./assets/img/clouds/clouds_day.jpeg";
    } else if (remoteTime >= "18:00" && remoteTime <= "20:59") {
      url = "./assets/img/clouds/clouds_evening.jpeg";
    } else {
      url = "./assets/img/clouds/clouds_night.jpeg";
    }
  }
  background.style.backgroundImage = `url(${url})`;
}


const displayCurrentWeather = (currentWeatherData) => {
  const dates = calcDates(currentWeatherData);

  setBackground(currentWeatherData.weather[0].id, dates.remoteTime);

  const degrees = currentWeatherData.wind.deg;
  let direction;
  if (degrees > 335 || degrees <= 20) direction = "N";
  else if (degrees > 20 || degrees <= 65) direction = "NE";
  else if (degrees > 65 || degrees <= 110) direction = "E";
  else if (degrees > 110 || degrees <= 155) direction = "SE";
  else if (degrees > 155 || degrees <= 200) direction = "S";
  else if (degrees > 200 || degrees <= 245) direction = "SW";
  else if (degrees > 245 || degrees <= 290) direction = "W";
  else if (degrees > 290 || degrees <= 335) direction = "NW";

  let rain = "--";
  if (currentWeatherData.rain) {
    rain = currentWeatherData.rain["1h"];
  }

  summaryIconOutput.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png">
    <p>${Math.round(currentWeatherData.main.temp)} °C</p>
  `;
  summaryDescriptionOutput.textContent = `${currentWeatherData.weather[0].description}`;

  detailsRainOutput.textContent = `${rain} mm`;
  detailsWindOutput.textContent = `(${direction}) ${Math.round(currentWeatherData.wind.speed)} m/s`;
  detailsHumidityOutput.textContent = `${currentWeatherData.main.humidity} %`;
  detailsTimeOutput.textContent = `${dates.remoteTime} (${currentWeatherData.sys.country})`;
  detailsSunOutput.textContent = `${dates.sunrise} / ${dates.sunset}`;

  footerOutput.innerHTML = `
    <p>${dates.timestamp}</p>
  `;
}


const display24hWeather = (forecast24hData, timezoneOffset) => {

  const dateFormatDateUser = { day: "2-digit", month: "short", year: "numeric" }    // Browser auto-umrechnung in vor Ort Zeit
  const dateFormatTimeUser = { hour12: false, hour: "2-digit", minute: "2-digit" }  // Browser auto-umrechnung in vor Ort Zeit
  const dateFormatDateUTC = { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" }    // timezone:UTC === Browser keine auto-umrechnung
  const dateFormatTimeUTC = { timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit" }  // timezone:UTC === Browser keine auto-umrechnung

  forecast24hOutput.innerHTML = ``;

  forecast24hData.list.forEach((item) => {

    const forecastTimeUTC = new Date(item.dt * 1000) // secAsMs
    const forecastTimeLocal = new Date(forecastTimeUTC.getTime() + timezoneOffset * 1000)

    const outputHTML = `
      <div class="forecast24h-item">
        <p>${forecastTimeLocal.toLocaleTimeString(undefined, dateFormatTimeUTC)}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <p>${item.weather[0].description}</p>
        <p>${Math.round(item.main.temp)} °C</p>
        <p>${Math.round(item.wind.speed)} m/s</p>
      </div>
    `;
    forecast24hOutput.insertAdjacentHTML("beforeend", outputHTML);
  })
}


const display3dWeather = (forecast3dData) => {

  forecast3dOutput.innerHTML = ``;
  const sliced3dData = forecast3dData.list.slice(8);
  
  let currentDay = null;
  let currentDayArray = [];
  const daysData = [];

  // Iterate through the forecast data and group data by day in daysData [{snapshot1}, ...]
  sliced3dData.forEach((item) => {
    const date = new Date(item.dt_txt);
    const day = date.getDate();

    if (currentDay !== day) {
      if (currentDay !== null) {
        daysData.push({
          day: currentDay,
          data: [...currentDayArray]
        });
      }

      currentDay = day;
      currentDayArray = []; // Reset currentDayArray for the new day
    }

    currentDayArray.push(item);
  });

  // Display each day's data
  daysData.forEach((dayData) => {
    const avgTemp = dayData.data.reduce((sum, item) => sum + item.main.temp, 0) / dayData.data.length;
    const avgWind = dayData.data.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.data.length;

    const outputHTML = `
      <div class="forecast3d-item">
        <p>${new Date(dayData.data[0].dt_txt).toLocaleDateString("en", { weekday: "long" })}</p>
        <p>${new Date(dayData.data[0].dt_txt).toLocaleDateString("de", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
        <img src="https://openweathermap.org/img/wn/${dayData.data[0].weather[0].icon}.png">
        <p>${dayData.data[0].weather[0].description}</p>
        <p>${Math.round(avgTemp)} °C</p>
        <p>${Math.round(avgWind)} m/s</p>
      </div>
    `;

    forecast3dOutput.insertAdjacentHTML("beforeend", outputHTML);
  });
};

/* ===== STARTUP ACTIONS ===== */
startUpFetchLocation();

document.body.querySelector(".header button").addEventListener("click", refreshLocation);