"use strict"

/* ===== GLOBAL VARIABLES ===== */
const apiKey = "4e523ff93c839ddd62ce26705bfd07a7";
const endpoint = "api.openweathermap.org";

const output = document.querySelector(".outputTest");


const refreshRemoteLoc = () => {
  let remoteLoc = document.body.querySelector("#remoteLoc").value;
  console.log(remoteLoc);
  fetchData(remoteLoc);
}


const fetchData = (location) => {
  let lat, lon, country;

  let fetchStrGeo = `http://${endpoint}/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

  fetch(fetchStrGeo)
    .then(response => {
      if(!response.ok) throw new Error("GEO response.ok FAILED");
      return response.json();
    })
    .then(geoData => {
      lat = geoData[0].lat;
      lon = geoData[0].lon;
      country = geoData[0].country;
    })
    .then(()=> {
      fetchWeatherData(lat, lon, country);
    })
}


const fetchWeatherData = (lat, lon, country) => {
  let fetchStrWeather = `https://${endpoint}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang="de"`;

  fetch(fetchStrWeather)
  .then(response => {
    if(!response.ok) throw new Error("WEATHER response.ok FAILED");
    return response.json();
  })
  .then(weatherData => {
    weatherData.country = country;
    displayData(weatherData);
  })
}


const displayData = (weatherData) => {
  console.log(weatherData);
  const coords = `[${weatherData.coord.lat}, ${weatherData.coord.lon}]`;
  const country = weatherData.country;

  const main = weatherData.weather[0].main;
  const descr = weatherData.weather[0].description;
  const icon = weatherData.weather[0].icon;

  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;

  const wind = weatherData.wind;  //
  const clouds = weatherData.clouds.all;  //

  const timestamp = new Date(Date.now()).toLocaleString("de");

  console.log(coords);
  console.log(country);

  console.log(main);
  console.log(descr);
  console.log(icon);

  console.log(temp);
  console.log(humidity);

  console.log(wind);
  console.log(clouds);

  console.log(timestamp);
  

  const weatherHTML = `
    <p>Coords: ${coords}</p>
    <p>Country: ${country}</p>
    <p>${main}</p>
    <p>${descr}</p>
    <div class="icon_container">
    <img class="icon" src="https://openweathermap.org/img/wn/${icon}.png">
  </div>
    <p>${temp} °C</p>
    <p>${humidity} %</p>
    <p>${wind}</p>
    <p>${clouds} %</p>
    <p>${timestamp}</p>
  `;
  output.innerHTML = weatherHTML;
  // output.insertAdjacentHTML("afterbegin", weatherHTML);
}


document.body.querySelector(".remote__footer button").addEventListener("click", refreshRemoteLoc);

/*

// let fetchStrWeather30 = `https://${endpoint}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude={minutely,hourly,daily,alerts}&appid=${apiKey}`;

// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=4e523ff93c839ddd62ce26705bfd07a7

// 

console.log(fetchStrGeo);
console.log(fetchStrWeather25);

fetch(fetchStrWeather25)
  .then(response => {
    console.log(response);
    if(!response.ok) throw new Error ("response.ok FAILED");
    return response.json();
  })
  .then(weather => {
    console.log(weather);
    const weatherInfo = weather.weather[0].main;
    console.log(weatherInfo);
    
    const weatherHtmlItem = `
    <h3>Weather-Information:</h3>
    <p>${weatherInfo}</p>
    `;

    output.insertAdjacentHTML("afterbegin", weatherHtmlItem);
  })



fetch(fetchStrGeo)
  .then(response => {
    console.log(response);
    if(!response.ok) {
      throw new Error ("response.ok FAILED");
    }
    return response.json();
  })
  .then(geo => {
    console.log(geo);
    const [{name}] = geo;
    const [{country}] = geo;
    const [{lat}] = geo;
    const [{lon}] = geo;
    console.log(lat);
    console.log(lon);
    const geoHtmlItem = `
    <h3>Geo-Information:</h3>
    <h4>${name}, (${country})</h4>
    <span>lat: ${lat}</span> <span>lon: ${lon}</span>
    `;

    // output.insertAdjacentHTML("afterbegin", geoHtmlItem);
  })

  */