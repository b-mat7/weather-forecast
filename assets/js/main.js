"use strict"

// wind Richung, Bgs

/* ===== IMPORT & GLOBAL VARIABLES ===== */
import {apiKeyGeoApify, apiKeyOpenWeather, endpointGeoApify, endpointOpenWeather} from "./api.js";

const background = document.querySelector("section");

const summaryIconOutput = document.querySelector(".icon-container");
const summaryDescriptionOutput = document.querySelector(".description");

const detailsRainOutput = document.querySelector(".rain");
const detailsWindOutput = document.querySelector(".wind");
const detailsHumidityOutput = document.querySelector(".humidity");
const detailsSunOutput = document.querySelector(".sun");

const footerOutput = document.querySelector(".footer");

let startUp = true;


/* ===== FETCH DATA FUNCTIONS ===== */
const fetchLocation = () => {
  if (!startUp) return;

  let lat, lon;
  if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        fetchWeatherData(lat, lon);
      },
      (error) => {
        console.log("Browser location FAILED");
      }
    );
  } else {
    console.error("Browser not supporting Geolocation... fetching via IP...");
  }

  if (!lat) {
    let fetchStrIP = `https://${endpointGeoApify}/v1/ipinfo?apiKey=${apiKeyGeoApify}`;

    fetch(fetchStrIP)
      .then(response => {
        if (!response.ok) throw new Error("IP response.ok FAILED");
        return response.json();
      })
      .then(ipData => {
        let location = ipData.city.name;
        document.body.querySelector("#location").value = ipData.city.name;
        fetchData(location)
      })
  } else {
    fetchWeatherData(lat, lon);
  }
  startUp = false;
}


const refreshLocation = () => {
  // document.body.querySelector("#location").value = "Wyhl";

  let location = document.body.querySelector("#location").value;
  fetchData(location);
}


const fetchData = (location) => {
  let lat, lon;

  let fetchStrGeo = `http://${endpointOpenWeather}/geo/1.0/direct?q=${location}&limit=1&appid=${apiKeyOpenWeather}`;

  fetch(fetchStrGeo)
    .then(response => {
      if(!response.ok) throw new Error("GEO response.ok FAILED");
      return response.json();
    })
    .then(geoData => {
      lat = geoData[0].lat;
      lon = geoData[0].lon;
    })
    .then(()=> {
      fetchWeatherData(lat, lon);
    })
}


const fetchWeatherData = (lat, lon) => {
  let fetchStrWeather = `https://${endpointOpenWeather}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyOpenWeather}&units=metric&lang="de"`;

  fetch(fetchStrWeather)
  .then(response => {
    if(!response.ok) throw new Error("WEATHER response.ok FAILED");
    return response.json();
  })
  .then(weatherData => {
    displayData(weatherData);
  })
}


/* ===== UPDATE UI FUNCTIONS ===== */
const setBackground = (id, remoteTime) => {
  console.log(remoteTime);

  if(remoteTime > "00:00" && remoteTime < "15:00") {
    console.log(true);
  } else {
    console.log(false);
  }

  let url;
  if (id <= 299) {
    if(remoteTime >= "07:00" && remoteTime <= "19:00"){
      url = "./assets/img/thunderstorm/thunderstorm_day.jpeg";
    } else {
      url = "./assets/img/thunderstorm/thunderstorm_night.jpeg";
    }
  } else if (id >= 300 && id <= 399) {
    if(remoteTime >= "07:00" && remoteTime <= "19:00"){
      url = "./assets/img/drizzle/drizzle_day.jpeg";
    } else {
      url = "./assets/img/drizzle/drizzle_night.jpeg";
    }
  } else if (id >= 500 && id <= 599) {
    if(remoteTime >= "07:00" && remoteTime <= "19:00"){
      url = "./assets/img/rain/rain_day.jpeg";
    } else {
      url = "./assets/img/rain/rain_night.jpeg";
    }
  } else if (id >= 600 && id <= 699) {
    if(remoteTime >= "07:00" && remoteTime <= "19:00"){
      url = "./assets/img/snow/snow_day.jpeg";
    } else {
      url = "./assets/img/snow/snow_night.jpeg";
    }
  } else if (id >= 700 && id <= 799) {
    url = "./assets/img/atmosphere/atmosphere.jpeg";
  } else if (id === 800) {
    if(remoteTime >= "06:00" && remoteTime <= "11:59"){
      url = "./assets/img/clear/clear_morning.jpeg";
    } else if (remoteTime >= "12:00" && remoteTime <= "17:59"){
      url = "./assets/img/clear/clear_day.jpeg";
    } else if (remoteTime >= "18:00" && remoteTime <= "20:59"){
      url = "./assets/img/clear/clear_evening.jpeg";
    } else {
      url = "./assets/img/clear/clear_night.jpeg";
    }
  } else if (id >= 800 && id <= 899) {
    if(remoteTime >= "06:00" && remoteTime <= "11:59"){
      url = "./assets/img/clouds/clouds_morning.jpeg";
    } else if (remoteTime >= "12:00" && remoteTime <= "17:59"){
      url = "./assets/img/clouds/clouds_day.jpeg";
    } else if (remoteTime >= "18:00" && remoteTime <= "20:59"){
      url = "./assets/img/clouds/clouds_evening.jpeg";
    } else {
      url = "./assets/img/clouds/clouds_night.jpeg";
    }
  }
  // if (id <= 299) {
  //   url = "./assets/img/thunderstorm.jpg";
  // } else if (id >= 300 && id <= 399) {
  //   url = "./assets/img/drizzle.jpg";
  // } else if (id >= 500 && id <= 599) {
  //   url = "./assets/img/rain.jpg";
  // } else if (id >= 600 && id <= 699) {
  //   url = "./assets/img/snow.jpg";
  // } else if (id >= 700 && id <= 799) {
  //   url = "./assets/img/atmosphere.jpg";
  // } else if (id === 800) {
  //   url = "./assets/img/clear.jpg";
  // } else if (id >= 800 && id <= 899) {
  //   url = "./assets/img/clouds.jpg";
  // }
  background.style.backgroundImage = `url(${url})`;
}


const displayData = (weatherData) => {
  
  // Browser rechnet auto immer UTC in local um
  // timezone: UTC --> Sage Browser deine vor Ort Zeit ist UTC, nicht umrechnen

  const secToMs = 1000; // Umrechnung UTC (s) to JavaScript (ms)
  const timezone = weatherData.timezone;
  const dateFormatDateUser = { day: "2-digit", month: "short", year: "numeric" }    // Browser rechnet automatisch in vor Ort Zeit
  const dateFormatTimeUser = { hour12: false, hour: "2-digit", minute: "2-digit" }  // Browser rechnet automatisch in vor Ort Zeit
  const dateFormatDateUTC = { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" }    // timezone:UTC === Browser soll nicht umrechnen
  const dateFormatTimeUTC = { timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit" }  // timezone:UTC === Browser soll nicht umrechnen

  // Zeit des letzten Datensatzes Date-Time (UTC = -2h)
  const dtUtc = new Date(weatherData.dt * secToMs); 
  console.log(dtUtc);

  // User vor Ort Zeiten (aktuell + Datensatz) - vom Browser umgerechnet
  const userDate = new Date(Date.now()).toLocaleString(undefined, dateFormatDateUser); // aktuelle Zeit - User vor Ort - Zeitzone (vom Browser umgerechnet)
  const userTime = new Date(Date.now()).toLocaleString(undefined, dateFormatTimeUser); // aktuelle Zeit - User vor Ort - Zeitzone (vom Browser umgerechnet)
  const dtUserDate = new Date(dtUtc).toLocaleString(undefined, dateFormatDateUser);    // datensatz Zeit - User vor Ort - Zeitzone (vom Browser umgerechnet)
  const dtUserTime = new Date(dtUtc).toLocaleString(undefined, dateFormatTimeUser);    // datensatz Zeit - User vor Ort - Zeitzone (vom Browser umgerechnet)

    // Remote Ort Zeiten (aktuell + Datensatz) - nicht vom Browser umgerechnet
  const remoteDate = new Date(Date.now() + timezone * secToMs).toLocaleString(undefined, dateFormatDateUTC); // aktuelle Zeit - remote Ort - Zeitzone (von uns gerechnet, no Browser auto umrechnung)
  const remoteTime = new Date(Date.now() + timezone * secToMs).toLocaleString(undefined, dateFormatTimeUTC); // aktuelle Zeit - remote Ort - Zeitzone (von uns gerechnet, no Browser auto umrechnung)
  const dtRemoteDate = new Date(dtUtc + timezone * secToMs).toLocaleString(undefined, dateFormatDateUTC);    // datensatz Zeit - remote Ort - Zeitzone (von uns gerechnet, no Browser auto umrechnung)
  const dtRemoteTime = new Date(dtUtc + timezone * secToMs).toLocaleString(undefined, dateFormatTimeUTC);    // datensatz Zeit - remote Ort - Zeitzone (von uns gerechnet, no Browser auto umrechnung)

  console.log(userDate);
  console.log(userTime);
  console.log(dtUserDate);
  console.log(dtUserTime);

  console.log(remoteDate);
  console.log(remoteTime);
  console.log(dtRemoteDate);
  console.log(dtRemoteTime);

  const timestamp = new Date(Date.now()).toLocaleString("de");
  const sunrise = new Date((weatherData.sys.sunrise * secToMs) + timezone * secToMs).toLocaleString(undefined, dateFormatTimeUTC);
  const sunset = new Date((weatherData.sys.sunset * secToMs) + timezone * secToMs).toLocaleString(undefined, dateFormatTimeUTC);

  setBackground(weatherData.weather[0].id, remoteTime);

  const degrees = weatherData.wind.deg;
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
  if(weatherData.rain){
    rain = weatherData.rain["1h"];
  }

  summaryIconOutput.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png">
    <p>${Math.round(weatherData.main.temp)} °C</p>
  `;
  summaryDescriptionOutput.textContent = `${weatherData.weather[0].description}`;

  detailsRainOutput.textContent = `${rain} mm`;
  detailsWindOutput.textContent = `(${direction}) ${Math.round(weatherData.wind.speed)} m/s`;
  detailsHumidityOutput.textContent = `${weatherData.main.humidity} %`;
  detailsSunOutput.textContent = `${sunrise} / ${sunset}`;

  footerOutput.innerHTML = `
    <p>Local: ${remoteTime} (${weatherData.sys.country})</p>
    <p>${timestamp}</p>
  `;
}


/* ===== STARTUP ACTIONS ===== */
fetchLocation();

document.body.querySelector(".header button").addEventListener("click", refreshLocation);