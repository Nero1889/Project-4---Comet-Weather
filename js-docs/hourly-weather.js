const HOURLY_FORECAST_CONTAINER = document.querySelector("#todays-weather");
const HOURLY_WEATHER_TEMPLATE = HOURLY_FORECAST_CONTAINER.querySelector(".hourly-weather");

async function fetchHourlyForecast(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}`;
    const RESPONSE = await fetch(API_URL);
    if (!RESPONSE.ok) {
        throw new Error("Could not fetch hourly forecast data!");
    }
    return await RESPONSE.json();
}

function isDaytime(timestamp, sunrise, sunset, timezoneOffset) {
    const LOCAL_TIME = timestamp + timezoneOffset * 1000;
    return LOCAL_TIME >= (sunrise + timezoneOffset) * 1000 && LOCAL_TIME < (sunset + timezoneOffset) * 1000;
}

function displayHourlyForecast(forecastData, sunriseTimestamp, sunsetTimestamp, timezoneOffsetInSeconds) {
    const HOURLY_DIVS = HOURLY_FORECAST_CONTAINER.querySelectorAll(".hourly-weather");

    const CITY_NOW_UTC = Date.now() + (new Date().getTimezoneOffset() * 60000);
    const CITY_NOW_LOCAL_TIME = new Date(CITY_NOW_UTC + timezoneOffsetInSeconds * 1000);
    const CURRENT_CITY_TIMESTAMP = CITY_NOW_LOCAL_TIME.getTime();

    let displayedForecasts = 0;

    HOURLY_DIVS.forEach(div => div.style.display = "none");

    forecastData.list.forEach(item => {
        const FORECAST_UTC = item.dt * 1000;
        const FORECAST_LOCAL_TIMESTAMP = FORECAST_UTC + timezoneOffsetInSeconds * 1000;
        const FORECAST_LOCAL_TIME = new Date(FORECAST_LOCAL_TIMESTAMP);

        if (FORECAST_LOCAL_TIMESTAMP >= CURRENT_CITY_TIMESTAMP && displayedForecasts < HOURLY_DIVS.length) {
            const HOURLY_DIV = HOURLY_DIVS[displayedForecasts];
            const TIME_ELEMENT = HOURLY_DIV.querySelector(".hourly-time");
            const ICON_ELEMENT = HOURLY_DIV.querySelector(".hourly-icon");
            const TEMP_ELEMENT = HOURLY_DIV.querySelector(".hourly-temp");

            const HOURS = FORECAST_LOCAL_TIME.getHours();
            const MINUTES = FORECAST_LOCAL_TIME.getMinutes();
            const HOURS12 = HOURS % 12 === 0 ? 12 : HOURS % 12;
            const MERIDIEM = HOURS < 12 ? "AM" : "PM";
            const FORMATTED_TIME = `${HOURS12}:${MINUTES.toString().padStart(2, "0")} ${MERIDIEM}`;
            let iconCode = item.weather[0].icon.slice(0, 2);

            isDaytime(FORECAST_LOCAL_TIMESTAMP, sunriseTimestamp, sunsetTimestamp, timezoneOffsetInSeconds)
            ? iconCode += "d.png"
            : iconCode += "n.png";
            
            const TEMPERATURE = Math.round(item.main.temp);

            if (TIME_ELEMENT) TIME_ELEMENT.textContent = FORMATTED_TIME;
            if (ICON_ELEMENT) ICON_ELEMENT.src = `images/${iconCode}`;
            if (TEMP_ELEMENT) TEMP_ELEMENT.textContent = `${TEMPERATURE}°`;

            HOURLY_DIV.style.display = "";
            displayedForecasts++;
        }
    });
    console.log(forecastData);
}

async function updateHourlyForecastForCity(city) {
    try {
        const FORECAST_DATA = await fetchHourlyForecast(city);
    } catch (error) {
        console.error(`Error fetching hourly forecast: ${error}`);
        if (HOURLY_FORECAST_CONTAINER) {
            HOURLY_FORECAST_CONTAINER.innerHTML = `<p style="color: white;">Could not fetch hourly forecast!</p>`;
        }
    }
}

updateHourlyForecastForCity("Madison");
