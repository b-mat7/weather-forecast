<a name="readme-top"></a>
<!-- PROJECT HEADER -->
<br />
<div align="center">
  <h1 align="center">Weather forecast</h1>

  <p align="center">A website that displays current and predicted weather for any place in the world</p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Project Screen Shot][project-screenshot]

The website uses several APIs to retrieve your current and predicted local weather, as well as the weather in any other location.

At startup, the website tries to locate you using your browser's location information. If this is not possible or fails for other reasons, it uses the geoapify API to retrieve longitude and latitude coordinates based on your device's IP information.

Using the coordinates, it retrieves the appropriate information from openweathermap's current weather forecast and 5-day and 3-hour forecast APIs, adjusting the background based on weather conditions and local (remote) time.

The ability to query the weather in any city worldwide completes the feature set.

Project Link: [https://b-mat7.github.io/Weather-forecast/](https://b-mat7.github.io/Weather-forecast/)

<p align="right"><a href="#readme-top">[ Back to top ]</a></p>



### Built With

* [![Html5][Html]][Html-url]
* [![Sass][Sass]][Sass-url]
* [![JavaScript][JavaScript]][JavaScript-url]

<p align="right"><a href="#readme-top">[ Back to top ]</a></p>



<!-- GETTING STARTED -->
## Getting Started

Follow these steps to setup the project locally.

### Prerequisites

Updated state-of-the-art webbrowser, LiveServer VS-Code plugin.

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/b-mat7/Weather-forecast.git
   ```
2. Start the index.html with LiveServer to open the webpage in your default webbrowser.

<p align="right"><a href="#readme-top">[ Back to top ]</a></p>



<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right"><a href="#readme-top">[ Back to top ]</a></p>



<!-- CONTACT -->
## Contact

[![Linkedin][Linkedin.com]][Linkedin-url]
[![Codecademy][Codecademy.com]][Codecademy-url]

<p align="right"><a href="#readme-top">[ Back to top ]</a></p>



<!-- ACKNOWLEDGMENTS --> 
## Acknowledgments

* [Apprenticeship Patterns](https://walterteng.com/apprenticeship-patterns)

<p align="right"><a href="#readme-top">[ Back to top ]</a></p>



<!-- MARKDOWN LINKS & IMAGES -->
[project-screenshot]: ./assets/img/screenshot.png

[Html]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[Html-url]: https://www.w3.org/html/
[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://262.ecma-international.org/
[Sass]: https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white
[Sass-url]: https://sass-lang.com/

[Linkedin.com]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[Linkedin-url]: https://www.linkedin.com/in/matthias-b-80546469/
[Codecademy.com]: https://img.shields.io/badge/Codecademy-FFF0E5?style=for-the-badge&logo=codecademy&logoColor=303347
[Codecademy-url]: https://www.codecademy.com/profiles/b_mat