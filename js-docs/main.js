/* Background Images */
const BODY = document.body;
const BG_IMAGES = [
    // North America
    "/images/sanFrancisco.png",
    "/images/vancouver.png",
    "/images/losAngeles.png",
    "/images/lasVegas.png",
    "/images/houston.png",
    "/images/chicago.png",
    "/images/newYork.png",
    "/images/miami.png",
    "/images/mexicoCity.png",

    // South America
    "/images/bogota.png",
    "/images/rioDeJaneiro.png",
    "/images/buenosAires.jpg",
    "/images/santiago.png",

    // Europe
    "/images/madrid.jpg",
    "/images/london.jpg",
    "/images/stockholm.jpg",
    "/images/berlin.jpg",
    "/images/paris.jpeg",
    "/images/rome.png",
    "/images/moscow.jpg",
    "/images/istanbul.png",

    // Africa
    "/images/cairo.jpg",
    "/images/lagos.jpg",
    "/images/kinshasa.jpg",
    "/images/johannesburg.jpg",
    "/images/darEsSalaam.jpg",

    // Asia
    "/images/riyadh.jpg",
    "/images/dubai.jpg",
    "/images/tehran.jpg",
    "/images/newDelhi.jpg",
    "/images/thailand.jpg",
    "/images/beijing.jpg",
    "/images/seoul.jpg",
    "/images/tokyo.jpg",
    "/images/japan.jpg",
    "/images/hongKong.jpg",
    "/images/hoChiMinhCity.jpeg",
    "/images/manila.jpg",
    
    // Australia
    "/images/sydney.jpg",

    // Antarctica
    "/images/antarctica.jpg",

    // Earth 
    "/images/milkyWay.jpg", 
    "/images/jungle.jpeg",
    "/images/waterfall.jpg",
    "/images/desert.jpg",
    "/images/coralReef.jpg",
    "/images/mountains.jpg",
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
    IMG.style.opacity = "70%";

    while (BG_CONTAINER.firstChild) {
        BG_CONTAINER.removeChild(BG_CONTAINER.firstChild);
    }
    BG_CONTAINER.appendChild(IMG);
}

chooseRandomBgImg();

/* Display Date and Time */
function updateTime() {
    const TIME = new Date();
    let hours = TIME.getHours();
    const MERIDIEM = hours >= 12? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);
    const MINUTES = TIME.getMinutes().toString().padStart(2, 0);
    const SECONDS = TIME.getSeconds().toString().padStart(2, 0);;
    const TIME_STRING =  `${hours}:${MINUTES}:${SECONDS} ${MERIDIEM}`;
    document.querySelector("#display-time").textContent = TIME_STRING;
}

updateTime();
setInterval(updateTime, 1000);

/* Weather Information */
const WEATHER_FORM = document.querySelector("#weather-form"); // City form
const SEARCH_BAR = document.querySelector("#search-bar"); // City input
const CITY_CLIMATE = document.querySelector("#city-climate"); // Card
const API = "13f4bea4ed2b2e865bd47a961b9335a0";

WEATHER_FORM.addEventListener("submit", async e => {
    e.preventDefault();
    const CITY = SEARCH_BAR.value;

    if (CITY) {
        try {
            const WEATHER_DATA = await weatherData(CITY);
            displayWeatherInfo(WEATHER_DATA);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function weatherData(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`;
    const RESPONSE = await fetch(API_URL);
    console.log(RESPONSE); // Check fetched city data!

    if (!RESPONSE.ok) {
        throw new Error("Could not fetch weather data!");
    } 

    return await RESPONSE.json();
}

function displayWeatherInfo(data) {
    console.log(data); // Also check fetched city data!
    const {name: city, main: {temp, humidity}, weather: [{description, id}]} = data;
    CITY_CLIMATE.textContent = "";
    CITY_CLIMATE.style.display = "flex";

    const CITY_DISPLAY = document.createElement("h1");
    const TEMP_DISPLAY = document.createElement("p");
    const HUMIDITY_DISPLAY = document.createElement("p");
    const DESC_DISPLAY = document.createElement("p");
    const WEATHER_EMOJI = document.createElement("p");

    CITY_DISPLAY.textContent = city;
    TEMP_DISPLAY.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`; 
    /* TEMP_DISPLAY.textContent = `${(temp - 273.15).toFixed(1)}°C`; 
    TEMP_DISPLAY.textContent = `${temp}°K`;  */

    CITY_DISPLAY.classList.add("city-climate-title");
    TEMP_DISPLAY.classList.add("display-temp");

    CITY_CLIMATE.appendChild(CITY_DISPLAY);
    CITY_CLIMATE.appendChild(TEMP_DISPLAY);
}

function weatherEmoji(weatherID) {

}

function displayError(message) {
    const ERROR_DISPLAY = document.createElement("p");
    ERROR_DISPLAY.textContent = message;
    ERROR_DISPLAY.classList.add("ERROR_DISPLAY");

    CITY_CLIMATE.textContent = "";
    CITY_CLIMATE.style.display = "flex";
    CITY.appendChild(ERROR_DISPLAY);
}
