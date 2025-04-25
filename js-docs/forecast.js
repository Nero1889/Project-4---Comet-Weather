const FORECAST_CONTAINER = document.getElementById("forecast");
const DAYS = [
    document.getElementById("day1"),
    document.getElementById("day2"),
    document.getElementById("day3"),
    document.getElementById("day4"),
    document.getElementById("day5")
];

function updateForecast(city) {
    if (!city) {
        console.error("City is required to fetch forecast!");
        return;
    }

    const UNITS = "imperial"; // F

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}`)
    .then(response => response.json())
    .then(data => {
    const FORECAST_DAYS = {};

    data.list.forEach(item => {
        const DATE = new Date(item.dt * 1000);
        const DAY_KEY = DATE.toDateString();

        if (!FORECAST_DAYS[DAY_KEY]) {
            FORECAST_DAYS[DAY_KEY] = {
                temperatures: [],
                weatherIcons: []
            };
        }
        FORECAST_DAYS[DAY_KEY].temperatures.push(item.main.temp_min);
        FORECAST_DAYS[DAY_KEY].temperatures.push(item.main.temp_max);
        FORECAST_DAYS[DAY_KEY].weatherIcons.push(item.weather[0].icon);
    });

    const NEXT_FIVE_DAYS_DATA = Object.keys(FORECAST_DAYS)
    .slice(0, 5)
    .map(dayKey => {
        const DATE = new Date(dayKey);
        const DAY_NAME = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(DATE);
        const DAY_OF_MONTH = DATE.getDate();
        const MONTH_SHORT = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(DATE);
        const LOW_TEMP = Math.min(...FORECAST_DAYS[dayKey].temperatures);
        const HIGH_TEMP = Math.max(...FORECAST_DAYS[dayKey].temperatures);
        const MOST_FREQUENT_ICON = getMostFrequent(FORECAST_DAYS[dayKey].weatherIcons);

        return {
            dayName: DAY_NAME,
            dateFormatted: `${DAY_OF_MONTH} ${MONTH_SHORT}`,
            minTemp: Math.round(LOW_TEMP),
            maxTemp: Math.round(HIGH_TEMP),
            iconCode: MOST_FREQUENT_ICON
        };
    });

    NEXT_FIVE_DAYS_DATA.forEach((dayData, index) => {
        if (DAYS[index]) {
            DAYS[index].innerHTML = ""; 
            DAYS[index].textContent = `${dayData.dayName} (${dayData.dateFormatted})`;

            const TEMP_ELEMENT = document.createElement("p");
            TEMP_ELEMENT.className = "temperature";
            TEMP_ELEMENT.textContent = `${dayData.maxTemp}°F/${dayData.minTemp}°F`; 

            const ICON_ELEMENT = document.createElement("img");
            ICON_ELEMENT.src = `images/${dayData.iconCode}.png`;
            ICON_ELEMENT.alt = "Weather Icon";
            ICON_ELEMENT.style.width = "32px";
            ICON_ELEMENT.style.height = "32px";

            DAYS[index].appendChild(document.createElement("br"));
            DAYS[index].appendChild(ICON_ELEMENT);
            DAYS[index].appendChild(TEMP_ELEMENT);
        }
        });
    })
    .catch(error => {
        console.error(`Error fetching forecast data: ${error}`);
        if (FORECAST_CONTAINER) {
            FORECAST_CONTAINER.innerHTML = `<p style="color: white;">Could not fetch forecast.</p>`;
        }
    });
}

function getMostFrequent(arr) {
    const FREQUENCY_MAP = {};
    let mostFrequentElement = null;
    let maxFrequency = 0;

    for (const element of arr) {
        FREQUENCY_MAP[element] = (FREQUENCY_MAP[element] || 0) + 1;
        if (FREQUENCY_MAP[element] > maxFrequency) {
            maxFrequency = FREQUENCY_MAP[element];
            mostFrequentElement = element;
        }
    }
    return mostFrequentElement;
}

// Initial forecast load (optional, based on a default city)
// updateForecast('Madison');