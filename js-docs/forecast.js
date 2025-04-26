const FORECAST_CONTAINER = document.getElementById("forecast");
const DAY_COLUMNS = [
    document.getElementById("day-col-1"),
    document.getElementById("day-col-2"),
    document.getElementById("day-col-3"),
    document.getElementById("day-col-4"),
    document.getElementById("day-col-5")
];

function updateForecast(city) {
    if (!city) {
        console.error("City is required to fetch forecast!");
        return;
    }

    const UNITS = "imperial";

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}`)
        .then(response => response.json())
        .then(data => {
            const FORECAST_DAYS = {};

            data.list.forEach(item => {
                const DATE = new Date(item.dt * 1000);
                const DATE_KEY = DATE.toDateString();

                if (!FORECAST_DAYS[DATE_KEY]) {
                    FORECAST_DAYS[DATE_KEY] = {
                        temperatures: [],
                        weatherIcons: []
                    };
                }
                FORECAST_DAYS[DATE_KEY].temperatures.push(item.main.temp_min);
                FORECAST_DAYS[DATE_KEY].temperatures.push(item.main.temp_max);
                FORECAST_DAYS[DATE_KEY].weatherIcons.push(item.weather[0].icon);
            });

            const NEXT_FIVE_DAYS_DATA = Object.keys(FORECAST_DAYS)
                .slice(0, 5)
                .map(dayKey => {
                    const DATE = new Date(dayKey);
                    const DAY_NAME = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(DATE);
                    const MONTH_SHORT = new Intl.DateTimeFormat("en-US", { month: "short" }).format(DATE);
                    const DAY_OF_MONTH = DATE.getDate();
                    const LOW_TEMP = Math.min(...FORECAST_DAYS[dayKey].temperatures);
                    const HIGH_TEMP = Math.max(...FORECAST_DAYS[dayKey].temperatures);
                    const MOST_FREQUENT_ICON = getMostFrequent(FORECAST_DAYS[dayKey].weatherIcons);

                    return {
                        dayName: DAY_NAME.substring(0, 3),
                        monthShort: MONTH_SHORT,
                        dayOfMonth: DAY_OF_MONTH,
                        minTemp: Math.round(LOW_TEMP),
                        maxTemp: Math.round(HIGH_TEMP),
                        iconCode: MOST_FREQUENT_ICON
                    };
                });

            NEXT_FIVE_DAYS_DATA.forEach((dayData, index) => {
                const COLUMN = DAY_COLUMNS[index];
                if (COLUMN) {
                    const DAY_NAME_ELEMENT = COLUMN.querySelector(".forecast-day");
                    const ICON_ELEMENT = COLUMN.querySelector(".forecast-icon");
                    const TEMP_ELEMENT = COLUMN.querySelector(".forecast-temp");

                    if (DAY_NAME_ELEMENT) {
                        DAY_NAME_ELEMENT.textContent = `${dayData.monthShort} - ${dayData.dayName} ${dayData.dayOfMonth}`;
                    }
                    if (ICON_ELEMENT) {
                        ICON_ELEMENT.src = `images/${dayData.iconCode}.png`;
                        ICON_ELEMENT.alt = "Weather Icon";
                    }
                    if (TEMP_ELEMENT) {
                        TEMP_ELEMENT.textContent = `${dayData.minTemp}° - ${dayData.maxTemp}°`;
                    }
                }
            });
        })
        .catch(error => {
            console.error(`Error fetching forecast data: ${error}`);
            if (FORECAST_CONTAINER) {
                FORECAST_CONTAINER.innerHTML = `<p style="color: white;">Could not fetch forecast!</p>`;
            }
        });
}

function getMostFrequent(arr) {
    const FREQUENCY_MAP = {};
    let mostFrequentElement = null;
    let maxFrequency = 0;

    for (const E of arr) {
        FREQUENCY_MAP[E] = (FREQUENCY_MAP[E] || 0) + 1;
        if (FREQUENCY_MAP[E] > maxFrequency) {
            maxFrequency = FREQUENCY_MAP[E];
            mostFrequentElement = E;
        }
    }
    return mostFrequentElement;
}

updateForecast("Madison");
