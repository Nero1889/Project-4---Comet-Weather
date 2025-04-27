const AIR_QUALITY_ELEMENT = document.querySelector("#air-quality");
const AIR_QUALITY_BAR = document.querySelector("#air-quality-bar");

async function fetchAirQualityData(lat, lon) {
    const AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const RESPONSE = await fetch(AIR_POLLUTION_API_URL);

    if (!RESPONSE.ok) {
        console.error("Could not fetch air quality data!");
        return null;
    }

    return await RESPONSE.json();
}

function displayAirQuality(data) {
    if (data && data.list && data.list.length > 0) {
        const AQI_1_TO_5 = data.list[0].main.aqi; 

        let aqi_0_to_500;
        let airQualityText = "";
        let barColor = "";
        let barWidthPercentage;

        switch (AQI_1_TO_5) {
            case 1:
                aqi_0_to_500 = Math.round((0 + 50) / 2); // 0-50
                airQualityText = "Good";
                barWidthPercentage = (aqi_0_to_500 / 500) * 100;
                break;
            case 2:
                aqi_0_to_500 = Math.round((51 + 100) / 2); // 51-100
                airQualityText = "Moderate";
                barWidthPercentage = (aqi_0_to_500 / 500) * 100;
                break;
            case 3:
                aqi_0_to_500 = Math.round((101 + 150) / 2); // 101-150
                airQualityText = "Unhealthy for Sensitive Groups";
                barWidthPercentage = (aqi_0_to_500 / 500) * 100;
                break;
            case 4:
                aqi_0_to_500 = Math.round((151 + 200) / 2); // 151-200
                airQualityText = "Unhealthy";
                barWidthPercentage = (aqi_0_to_500 / 500) * 100;
                break;
            case 5:
                aqi_0_to_500 = Math.round(250 + (aqi_1_to_5 - 4) * 100); // 201-500+
                airQualityText = "Very Unhealthy";
                barWidthPercentage = Math.min((aqi_0_to_500 / 500) * 100, 100); // Cap at 100%
                break;
            default:
                aqi_0_to_500 = 0;
                airQualityText = "Unknown";
                barWidthPercentage = 100;
        }

        if (AIR_QUALITY_ELEMENT) {
            AIR_QUALITY_ELEMENT.textContent = `${airQualityText} (AQI: ${aqi_0_to_500})`;
        }
    } else {
        if (AIR_QUALITY_ELEMENT) {
            AIR_QUALITY_ELEMENT.textContent = "No air quality data available!";
        }
    }
}

document.addEventListener("citySelected", async (e) => {
    const SELECTED_CITY_NAME = e.detail.cityName;
    try {
        const WEATHER_DATA = await fetchWeatherData(SELECTED_CITY_NAME);
        displayWeatherInfo(WEATHER_DATA); 
    } catch (error) {
        console.error(`Error fetching current weather after city selection: ${error}`);
        displayError("Failed to update current weather!");
    }
});








const SUNRISE_TIME_ELEMENT = document.querySelector("#rise-set-container .sub-rise-set-container:first-child .time");
const SUNSET_TIME_ELEMENT = document.querySelector("#rise-set-container .sub-rise-set-container:last-child .time");

function formatTime(timestamp, timezoneOffsetSeconds) {
    const date = new Date((timestamp + timezoneOffsetSeconds) * 1000); // Apply timezone offset and convert to milliseconds
    const hours = date.getUTCHours(); // Use UTC hours and minutes after applying offset
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Handle 12 AM/PM
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}