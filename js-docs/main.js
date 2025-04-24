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
    const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];
    const MONTHS = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November",
    "December"];

    const DAY_OF_WEEK = DAYS_OF_WEEK[NOW.getDay()];
    const DAY_OF_MONTH = NOW.getDate();
    const MONTH = MONTHS[NOW.getMonth()];

    const DATE_STRING = `${DAY_OF_WEEK} ${DAY_OF_MONTH} ${MONTH}`;
    DATE.textContent = DATE_STRING;
}

displayDateTime();

/* Weather */
const API_KEY = "13f4bea4ed2b2e865bd47a961b9335a0";
const UPPER_CONTAINER = document.querySelector(".upper-container");
const USER_INPUT = document.querySelector("#user-input");
const SEARCH_BAR = document.querySelector(".search-bar.expanded"); /* city input */
const CURRENT_WEATHER = document.querySelector("#current-weather"); /* card */
const TEMP = document.querySelector(".temperature");
const DESC = document.querySelector("#desc");
const CITY = document.querySelector("#city");

USER_INPUT.addEventListener("submit", async e => {
    e.preventDefault();

    const CITY = SEARCH_BAR.value;

    if (CITY) {
        try {
            const WEATHER_DATA = await getWeatherData(CITY);
            displayWeatherInfo(WEATHER_DATA);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city!");
    }
});

async function getWeatherData(CITY) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;
    const RESPONSE = await fetch(API_URL);

    if (!RESPONSE.ok) {
        throw new Error("Could not fetch weather data!");
    }

    return await RESPONSE.json();
}

async function displayWeatherInfo(data) {
    console.log(data); // City data for debugging and troubleshooting

    const {name: city, main: {temp},
    weather: [{description}], sys: {country}} = data;

    const TEMPERATURE_ELEMENT = CURRENT_WEATHER.querySelector(".temperature");
    const CITY_ELEMENT = CURRENT_WEATHER.querySelector("#city");
    const DESCRIPTION_ELEMENT = CURRENT_WEATHER.querySelector("#desc");

    if (TEMPERATURE_ELEMENT) {
        TEMPERATURE_ELEMENT.textContent = `${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F`;
    }

    if (DESCRIPTION_ELEMENT) {
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
}

function getWeatherImg(weatherID) {

}

function displayError(message) {
    const ERROR_DISPLAY = document.createElement("p");
    ERROR_DISPLAY.textContent = message;
    ERROR_DISPLAY.classList.add(".error-display"); // return to later!

    CURRENT_WEATHER.textContent = "";
    CURRENT_WEATHER.style.display = "flex";
    CURRENT_WEATHER.appendChild(ERROR_DISPLAY);
}
