"use strict"


/* ===== IMPORT & GLOBAL VARIABLES ===== */
import {apiKeyGeoApify, apiKeyOpenWeather, endpointGeoApify, endpointOpenWeather} from "./api.js";

// const summaryOutput = document.querySelector(".hero__summary");
// const detailsOutput = document.querySelector(".hero__details");

const background = document.querySelector("section");

const summaryIconOutput = document.querySelector(".icon");
const summaryDescriptionOutput = document.querySelector(".description");

const detailsRainOutput = document.querySelector(".rain");
const detailsWindOutput = document.querySelector(".wind");
const detailsHumidityOutput = document.querySelector(".humidity");
const detailsSunOutput = document.querySelector(".sun");

const footerOutput = document.querySelector(".footer");

let startUp = true;


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
    setBackground(weatherData.weather[0].id);
    displayData(weatherData);
  })
}


const setBackground = (id) => {
  let url;
  if(id <= 299) {
    url = "./assets/img/thunderstorm.jpg";
  } else if(id >= 300 && id <= 399) {
    url = "./assets/img/drizzle.jpg";
  } else if(id >= 500 && id <= 599) {
    url = "./assets/img/rain.jpg";
  } else if(id >= 600 && id <= 699) {
    url = "./assets/img/snow.jpg";
  } else if(id >= 700 && id <= 799) {
    url = "./assets/img/atmosphere.jpg";
  } else if(id === 800) {
    url = "./assets/img/clear.jpg";
  } else if(id >= 800 && id <= 899) {
    url = "./assets/img/clouds.jpg";
  }
  background.style.backgroundImage = `url(${url})`;

  // background.style.backgroundImage = "url('../img/clear.jpg')";
  
}


const displayData = (weatherData) => {
  const timestamp = new Date(Date.now()).toLocaleString("de");
  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("de", {minute: "2-digit", hour: "2-digit"});
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("de", {minute: "2-digit", hour: "2-digit"});
  
  let rain = "--";
  if(weatherData.rain){
    rain = weatherData.rain["1h"];
  }

  // const summaryHTML = `
  //   <table>
  //     <tr>
  //       <td>Coords:</td>
  //       <td>[${weatherData.coord.lat}, ${weatherData.coord.lon}]</td>
  //       <td>(${weatherData.sys.country})</td>
  //     </tr>
  //   </table>
  //   <div class="flexcontainer">
  //       <img class="icon" src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png">
  //     <p>${Math.round(weatherData.main.temp)} °C</p>
  //   </div>
  //   <p>${weatherData.weather[0].description}</p>    
  // `;

  // const detailsHTML = `
  //   <table>
  //     <tr>
  //       <td>Wind:</td>
  //       <td>${Math.round(weatherData.wind.speed)} m/s </td>
  //     </tr>
  //     <tr>
  //       <td>Rain (last h):</td>
  //       <td>${rain} mm</td>
  //     </tr>
  //     <tr>
  //       <td>Humidity:</td>
  //       <td>${weatherData.main.humidity} %</td>
  //     </tr>
  //     <tr>
  //       <td>Sun:</td>
  //       <td>${sunrise} / ${sunset}</td>
  //     </tr>
  //   </table>
  // `;
  
  // const timestampHTML = `<p class="align-right">${timestamp}</p>`;

  // summaryOutput.innerHTML = summaryHTML;
  // detailsOutput.innerHTML = detailsHTML;

  summaryIconOutput.innerHTML = `
    <div class="flexcontainer">
      <img class="icon" src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png">
      <p>${Math.round(weatherData.main.temp)} °C</p>
    </div>
  `;
  summaryDescriptionOutput.textContent = `${weatherData.weather[0].description}`;

  detailsRainOutput.textContent = `${rain} mm`;
  detailsWindOutput.textContent = `${Math.round(weatherData.wind.speed)} m/s `;
  detailsHumidityOutput.textContent = `${weatherData.main.humidity} %`;
  detailsSunOutput.textContent = `${sunrise} / ${sunset}`;

  footerOutput.innerHTML = `
    <div class="flexcontainer">
      <p>[${weatherData.coord.lat}, ${weatherData.coord.lon}] (${weatherData.sys.country})</p>
      <p>${timestamp}</p>
    </div>
  `;
}

fetchLocation();

document.body.querySelector(".header button").addEventListener("click", refreshLocation);