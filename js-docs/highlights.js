/* Fetch Air Quality Data */
const AIR_QUALITY_ELEMENT = document.querySelector("#air-quality");
const AIR_QUALITY_BAR = document.querySelector("#air-quality-bar");
const AQI_INDICATOR = document.querySelector("#aqi-indicator"); 

async function fetchAirQualityData(lat, lon) {
    const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
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
        let barWidthPercentage = 0; // Initialize to 0

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
                aqi_0_to_500 = Math.round(250 + (aqi_0_to_500 - 4) * 100); // 201-500+
                airQualityText = "Very Unhealthy";
                barWidthPercentage = Math.min((aqi_0_to_500 / 500) * 100, 100); // Cap at 100%
                break;
            default:
                aqi_0_to_500 = 0;
                airQualityText = "Unknown";
                barWidthPercentage = 0;
        }

        if (AIR_QUALITY_ELEMENT) {
            AIR_QUALITY_ELEMENT.textContent = `${airQualityText} (AQI: ${aqi_0_to_500})`;
        }

        // Update the position of the indicator
        if (AQI_INDICATOR && AIR_QUALITY_BAR) {
            const indicatorPosition = barWidthPercentage;
            AQI_INDICATOR.style.left = `${indicatorPosition}%`;
        }
    } else {
        if (AIR_QUALITY_ELEMENT) {
            AIR_QUALITY_ELEMENT.textContent = "No air quality data available!";
        }
        if (AQI_INDICATOR) {
            AQI_INDICATOR.style.left = `0%`; 
        }
    }
}

const SUNRISE_TIME_ELEMENT = document.querySelector("#rise-set-container .sub-rise-set-container:first-child .time");
const SUNSET_TIME_ELEMENT = document.querySelector("#rise-set-container .sub-rise-set-container:last-child .time");

function formatTime(timestamp, timezoneOffsetSeconds) {
    const DATE = new Date((timestamp + timezoneOffsetSeconds) * 1000);
    const HOURS = DATE.getUTCHours();
    const MINUTES = DATE.getUTCMinutes();
    const MERIDIEM = HOURS >= 12 ? "PM" : "AM";
    const FORMATTED_HOURS = HOURS % 12 === 0 ? 12 : HOURS % 12;
    const FORMATTED_MINUTES = MINUTES < 10 ? "0" + MINUTES : MINUTES;
    return `${FORMATTED_HOURS}:${FORMATTED_MINUTES} ${MERIDIEM}`;
}
