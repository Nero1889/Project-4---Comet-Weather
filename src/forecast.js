const FORECAST_CONTAINER = document.querySelector("#forecast");
const MONTHS = document.querySelector("#current-month");
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

    const UNITS_PARAM = isOn ? "metric" : "imperial";
    const UNIT_SYMBOL = isOn ? "°C" : "°F";

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${UNITS_PARAM}`)
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
                FORECAST_DAYS[DATE_KEY].temperatures.push(item.main.temp);
                FORECAST_DAYS[DATE_KEY].weatherIcons.push(item.weather[0].icon);
            });

            const ALL_DAY_KEYS = Object.keys(FORECAST_DAYS);
            const NEXT_FIVE_DAYS_DATA = ALL_DAY_KEYS
                .slice(0, 5)
                .map(dayKey => {
                    const DATE = new Date(dayKey);
                    const DAY_NAME = new Intl.DateTimeFormat("en-US", {weekday: "short"}).format(DATE);
                    const MONTH_SHORT = new Intl.DateTimeFormat("en-US", {month: "short"}).format(DATE);
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

            if (NEXT_FIVE_DAYS_DATA.length > 0 && MONTHS) {
                const FIRST_DAY_MONTH = NEXT_FIVE_DAYS_DATA[0].monthShort;
                const LAST_DAY_DATA = NEXT_FIVE_DAYS_DATA[NEXT_FIVE_DAYS_DATA.length - 1];
                const LAST_DAY_MONTH = LAST_DAY_DATA.monthShort;

                FIRST_DAY_MONTH === LAST_DAY_MONTH
                ? MONTHS.textContent = FIRST_DAY_MONTH
                : MONTHS.textContent = `${FIRST_DAY_MONTH} - ${LAST_DAY_MONTH}`;
            }

            NEXT_FIVE_DAYS_DATA.forEach((dayData, i) => {
                const COLUMN = DAY_COLUMNS[i];
                if (COLUMN) {
                    const DAY_NAME_ELEMENT = COLUMN.querySelector(".forecast-day");
                    const ICON_ELEMENT = COLUMN.querySelector(".forecast-icon");
                    const TEMP_ELEMENT = COLUMN.querySelector(".forecast-temp");

                    if (DAY_NAME_ELEMENT) {
                        DAY_NAME_ELEMENT.textContent = `${dayData.dayName} - ${dayData.dayOfMonth}`;
                    }
                    if (ICON_ELEMENT) {
                        ICON_ELEMENT.src = `icons/${dayData.iconCode}.png`;
                        ICON_ELEMENT.alt = "Weather Icon";
                    }
                    if (TEMP_ELEMENT) {
                        TEMP_ELEMENT.textContent = `${dayData.minTemp}${UNIT_SYMBOL} - ${dayData.maxTemp}${UNIT_SYMBOL}`;
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

document.addEventListener("citySelected", (e) => {
    const SELECTED_CITY = e.detail;
    updateForecast(SELECTED_CITY.name); 
});

updateForecast("Madison");