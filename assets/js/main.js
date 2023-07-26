"use strict"

const output = document.querySelector(".output");

const apiKey = "4e523ff93c839ddd62ce26705bfd07a7";
const endpoint = "api.openweathermap.org";

let lat, lon;

let fetchStrGeo = `http://${endpoint}/geo/1.0/direct?q=Berlin&limit=1&appid=4e523ff93c839ddd62ce26705bfd07a7`;

let fetchStrWeather25 = `https://${endpoint}/data/2.5/weather?lat=${52.5170365}&lon=${13.3888599}&appid=${apiKey}&units={metrics}&lang={de}`;

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

    // output.insertAdjacentHTML("afterbegin", weatherHtmlItem);
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