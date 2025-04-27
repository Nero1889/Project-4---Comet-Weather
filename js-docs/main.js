/* Background Images */
const BODY = document.body;
const BG_IMAGES = [
    // North America
    "images/sanFrancisco.png",
    "images/vancouver.png",
    "images/losAngeles.png",
    "images/lasVegas.png",
    "images/houston.png",
    "images/chicago.png",
    "images/newYork.png",
    "images/miami.png",
    "images/mexicoCity.png",

    // South America
    "images/bogota.png",
    "images/rioDeJaneiro.png",
    "images/buenosAires.jpg",
    "images/santiago.png",

    // Europe
    "images/madrid.jpg",
    "images/london.jpg",
    "images/stockholm.jpg",
    "images/berlin.jpg",
    "images/paris.jpeg",
    "images/rome.png",
    "images/moscow.jpg",
    "images/istanbul.png",

    // Africa
    "images/cairo.jpg",
    "images/lagos.jpg",
    "images/kinshasa.jpg",
    "images/johannesburg.jpg",
    "images/darEsSalaam.jpg",

    // Asia
    "images/riyadh.jpg",
    "images/dubai.jpg",
    "images/tehran.jpg",
    "images/newDelhi.jpg",
    "images/thailand.jpg",
    "images/beijing.jpg",
    "images/seoul.jpg",
    "images/tokyo.jpg",
    "images/Japan.jpg",
    "images/hongKong.jpg",
    "images/hoChiMinhCity.jpeg",
    "images/manila.jpg",

    // Australia
    "images/sydney.jpg",

    // Antarctica
    "images/antarctica.jpg",

    // Earth
    "images/milkyWay.jpg",
    "images/jungle.jpeg",
    "images/waterfall.jpg",
    "images/desert.jpg",
    "images/coralReef.jpg",
    "images/mountains.jpg",
];

const BG_CONTAINER = document.createElement("div");
BG_CONTAINER.style.position = "fixed";
BG_CONTAINER.style.top = "0";
BG_CONTAINER.style.left = "0";
BG_CONTAINER.style.width = "100%";
BG_CONTAINER.style.height = "100%";
BG_CONTAINER.style.zIndex = "-100";
BODY.insertBefore(BG_CONTAINER, BODY.firstChild);

function chooseRandomBgImg() {
    const RANDOM_INDEX = Math.floor(Math.random() * BG_IMAGES.length);
    const RANDOM_IMG_SRC = BG_IMAGES[RANDOM_INDEX];

    const IMG = new Image();
    IMG.src = RANDOM_IMG_SRC;
    IMG.style.position = "absolute";
    IMG.style.top = "0";
    IMG.style.left = "0";
    IMG.style.width = "100%";
    IMG.style.height = "100%";
    IMG.style.objectFit = "cover";
    IMG.style.opacity = "34%";

    while (BG_CONTAINER.firstChild) {
        BG_CONTAINER.removeChild(BG_CONTAINER.firstChild);
    }
    BG_CONTAINER.appendChild(IMG);
}

chooseRandomBgImg();

/* Date and Time */
const DATE = document.querySelector("#date");

function displayDateTime() {
    const NOW = new Date();
    const DAYS_OF_WEEK = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const DAY_OF_WEEK = DAYS_OF_WEEK[NOW.getDay()];
    const DAY_OF_MONTH = NOW.getDate();
    const MONTH = MONTHS[NOW.getMonth()];

    const DATE_STRING = `${DAY_OF_WEEK} ${DAY_OF_MONTH} ${MONTH}`;
    DATE.textContent = DATE_STRING;
}

displayDateTime();

/* Fetch Weather */
const API_KEY = "13f4bea4ed2b2e865bd47a961b9335a0";
const UPPER_CONTAINER = document.querySelector(".upper-container");
const USER_INPUT = document.querySelector("#user-input");
const SEARCH_BAR = document.querySelector(".search-bar.expanded");
const BOX = document.querySelector(".box");
const TEMP = document.querySelector(".temperature");
const DESC = document.querySelector("#desc");
const CITY_ELEMENT_MAIN = document.querySelector("#city"); 

async function fetchWeatherData(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const RESPONSE = await fetch(API_URL);

    if (!RESPONSE.ok) throw new Error("Could not fetch weather data!");

    return await RESPONSE.json();
}

async function displayWeatherInfo(data) {
    console.log(data); // City data for debugging and troubleshooting

    const {name: city, main: {temp}, weather, sys: {country}} = data;

    const TEMPERATURE_ELEMENT = BOX.querySelector(".temperature");
    const CITY_ELEMENT = BOX.querySelector("#city");
    const DESCRIPTION_ELEMENT = BOX.querySelector("#desc");
    const WEATHER_IMAGE = document.querySelector("#weather-img");

    if (TEMPERATURE_ELEMENT) {
        TEMPERATURE_ELEMENT.textContent = `${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F`;
    }

    if (DESCRIPTION_ELEMENT) {
        const description = weather[0].description;
        DESCRIPTION_ELEMENT.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    }

    if (CITY_ELEMENT) {
        let locationString = `${city}, ${country}`;

        // Try to fetch US state!
        if (country === "US") {
            try {
                const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=${API_KEY}`;
                const RESPONSE = await fetch(GEO_URL);
                if (RESPONSE.ok) {
                    const GEO_DATA = await RESPONSE.json();
                    GEO_DATA.length > 0 && GEO_DATA[0].state
                        ? locationString = `${city}, ${GEO_DATA[0].state}`
                        : locationString = `${city}, US`;
                }
            } catch (error) {
                console.error(`Geocoding Error: ${error}`);
            }
        }
        CITY_ELEMENT.textContent = locationString;
    }

    if (WEATHER_IMAGE && weather.length > 0) {
        const WEATHER_ID = weather[0].id;
        const ICON_CODE = weather[0].icon;
        const ICON_FILE_NAME = getWeatherImg(WEATHER_ID, ICON_CODE);
        if (ICON_FILE_NAME) {
            WEATHER_IMAGE.src = `images/${ICON_FILE_NAME}`;
            WEATHER_IMAGE.alt = weather[0].description;
        }
    }

    if (data && data.coord) {
        const { lat, lon } = data.coord;
        const airQualityData = await fetchAirQualityData(lat, lon);
        displayAirQuality(airQualityData);
    }

    /* Check for Sunrise and Sunset */
    if (data && data.sys && data.timezone !== undefined) {
        const sunriseTimestamp = data.sys.sunrise;
        const sunsetTimestamp = data.sys.sunset;
        const timezoneOffsetSeconds = data.timezone;

        const sunriseTimeFormatted = formatTime(sunriseTimestamp, timezoneOffsetSeconds);
        const sunsetTimeFormatted = formatTime(sunsetTimestamp, timezoneOffsetSeconds);

        if (SUNRISE_TIME_ELEMENT) {
            SUNRISE_TIME_ELEMENT.textContent = sunriseTimeFormatted;
        }
        if (SUNSET_TIME_ELEMENT) {
            SUNSET_TIME_ELEMENT.textContent = sunsetTimeFormatted;
        }
    }
}

function getWeatherImg(weatherID, iconCode) {
    if (iconCode) {
        return `${iconCode}.png`;
    }
    if (weatherID >= 200 && weatherID < 300)
        return "11d.png"; // Thunderstorm
    else if (weatherID >= 300 && weatherID < 400)
        return "09d.png"; // Drizzle
    else if (weatherID >= 500 && weatherID < 600)
        return "10d.png"; // Rain
    else if (weatherID >= 600 && weatherID < 700)
        return "13d.png"; // Snow
    else if (weatherID >= 700 && weatherID < 800)
        return "50d.png"; // Mist
    else if (weatherID === 800)
        return "01d.png"; // Clear sky
    else if (weatherID === 801)
        return "02d.png"; // Few clouds
    else if (weatherID === 802)
        return "03d.png"; // Scattered clouds
    else if (weatherID === 803 || weatherID === 804)
        return "04d.png"; // Broken or overcast clouds

    return "01d.png";
}

function displayError(message) {
    const ERROR_DISPLAY = document.createElement("p");
    ERROR_DISPLAY.textContent = message;
    ERROR_DISPLAY.classList.add(".error-display"); // return to later!

    BOX.textContent = "";
    BOX.style.display = "flex";
    BOX.appendChild(ERROR_DISPLAY);
}

document.addEventListener("citySelected", async (event) => {
    const SELECTED_CITY_NAME = event.detail.cityName;
    try {
        const WEATHER_DATA = await fetchWeatherData(SELECTED_CITY_NAME);
        displayWeatherInfo(WEATHER_DATA);
    } catch (error) {
        console.error(`Error fetching current weather after city selection: ${error}`);
        displayError("Failed to update current weather! ):");
    }
});


/* Default City (Madison, WI) */
fetchWeatherData("Madison, Wisconsin").then(displayWeatherInfo).catch(error => {
    console.error(`Error fetching initial weather data: ${error}`);
});

document.addEventListener('citySelected', async (e) => {
    const SELECTED_CITY_NAME = e.detail.cityName;
    try {
        const WEATHER_DATA = await fetchWeatherData(SELECTED_CITY_NAME);
        displayWeatherInfo(WEATHER_DATA);
    } catch (error) {
        console.error(`Error fetching current weather after city selection: ${error}`);
        displayError("Failed to update current weather!");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const SEARCH_INPUT = document.querySelector(".search-bar.expanded");
    if (SEARCH_INPUT) SEARCH_INPUT.value = "Madison, Wisconsin";
});
