const SEARCH_ICON = document.querySelector("#search-icon");
const BACK_BTN = document.querySelector("#back-btn");
const SEARCH_OVERLAY = document.getElementById("search-overlay");
const SUGGESTIONS_CONTAINER = document.querySelector("#suggestions-container"); 

SEARCH_ICON.addEventListener("click", () => SEARCH_OVERLAY.classList.add("open"));
BACK_BTN.addEventListener("click", () => SEARCH_OVERLAY.classList.remove("open"));

const MOBILE_SEARCH_INPUT = document.querySelector(".search-bar.expanded"); 
let updateForecastFunction;
document.addEventListener("DOMContentLoaded", () => {
    const FORECAST_SCRIPT = document.querySelector("script[src*='forecast.js']");
    if (FORECAST_SCRIPT && window.updateForecast) {
        updateForecastFunction = window.updateForecast;
    } else {
        console.warn("forecast.js script not found or updateForecast function not in global scope!");
    }
});

if (MOBILE_SEARCH_INPUT) {
    MOBILE_SEARCH_INPUT.addEventListener("input", async () => {
        const QUERY = MOBILE_SEARCH_INPUT.value.trim();

        if (QUERY.length >= 2) {
            try {
                const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${QUERY}&limit=5&appid=${API_KEY}`;
                const RESPONSE = await fetch(GEO_URL);
                if (RESPONSE.ok) {
                    const GEO_DATA = await RESPONSE.json();
                    displaySuggestions(GEO_DATA);
                } else {
                    SUGGESTIONS_CONTAINER.style.display = "none";
                }
            } catch (error) {
                console.error(`Error fetching suggestions: ${error}`);
                SUGGESTIONS_CONTAINER.style.display = "none";
            }
        } else {
            SUGGESTIONS_CONTAINER.style.display = "none";
        }
    });

    MOBILE_SEARCH_INPUT.addEventListener("blur", () => {
        setTimeout(() => {
            SUGGESTIONS_CONTAINER.style.display = "none";
        }, 200);
    });

    MOBILE_SEARCH_INPUT.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && MOBILE_SEARCH_INPUT.value.trim() !== "") {
            e.preventDefault();

            const SEARCHED_CITY = MOBILE_SEARCH_INPUT.value.trim();

            updateForecastFunction
                ? updateForecastFunction(SEARCHED_CITY)
                : console.warn("updateForecast function is not available!");

            document.dispatchEvent(new CustomEvent("citySelected", { detail: { cityName: SEARCHED_CITY } }));

            if (SEARCH_OVERLAY) SEARCH_OVERLAY.classList.remove("open");
        }
    });
}

function displaySuggestions(suggestions) {
    SUGGESTIONS_CONTAINER.innerHTML = "";
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const SUGGESTION_ITEM = document.createElement("div");
            SUGGESTION_ITEM.classList.add("suggestion-item");
            SUGGESTION_ITEM.style.display = "flex";
            SUGGESTION_ITEM.style.alignItems = "center";
            SUGGESTION_ITEM.style.padding = "10px";

            const LOCATION_ICON = document.createElement("img");
            LOCATION_ICON.src = "icons/locationIconGray.png";
            LOCATION_ICON.alt = "Mobile Location Icon";
            LOCATION_ICON.style.marginRight = "8px";

            const TEXT_CONTAINER = document.createElement("div");
            TEXT_CONTAINER.style.display = "flex";
            TEXT_CONTAINER.style.flexDirection = "column";
            TEXT_CONTAINER.style.marginLeft = "8px";

            const CITY_TEXT = document.createElement("span");
            CITY_TEXT.textContent = suggestion.name;
            CITY_TEXT.style.color = "white";
            CITY_TEXT.style.fontWeight = "normal";
            CITY_TEXT.style.fontSize = "var(--size-base)";

            const COUNTRY_TEXT = document.createElement("span");
            COUNTRY_TEXT.style.color = "#737373";
            COUNTRY_TEXT.style.fontSize = "0.8em";
            COUNTRY_TEXT.style.marginTop = ".25rem";

            let secondaryLocation = suggestion.country;
            if (suggestion.state) {
                secondaryLocation = `${suggestion.state}, ${suggestion.country}`;
            }
            COUNTRY_TEXT.textContent = secondaryLocation;

            TEXT_CONTAINER.appendChild(CITY_TEXT);
            TEXT_CONTAINER.appendChild(COUNTRY_TEXT);

            SUGGESTION_ITEM.appendChild(LOCATION_ICON);
            SUGGESTION_ITEM.appendChild(TEXT_CONTAINER);

            SUGGESTION_ITEM.addEventListener("click", () => {
                const SELECTED_CITY = suggestion.name;
                MOBILE_SEARCH_INPUT.value = `${SELECTED_CITY}, ${secondaryLocation}`;
                SUGGESTIONS_CONTAINER.style.display = "none";
                updateForecastFunction
                    ? updateForecastFunction(SELECTED_CITY)
                    : console.warn("updateForecast function is not available!");

                document.dispatchEvent(new CustomEvent("citySelected", { detail: { cityName: SELECTED_CITY } }));

                if (SEARCH_OVERLAY) SEARCH_OVERLAY.classList.remove("open");
            });

            SUGGESTIONS_CONTAINER.appendChild(SUGGESTION_ITEM);
        });
        SUGGESTIONS_CONTAINER.style.display = "block";
    } else {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }
}

const DESKTOP_SEARCH_BAR = document.querySelector(".desktop-search-bar");
const SUGGESTIONS_DROPDOWN = document.getElementById("suggestions-dropdown");
const CITY_SEARCH_API_URL = "https://api.openweathermap.org/geo/1.0/direct?q="; 
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather?q="; 

DESKTOP_SEARCH_BAR.addEventListener("input", async function() {
    const QUERY = this.value.toLowerCase();
    SUGGESTIONS_DROPDOWN.innerHTML = ""; 

    if (QUERY.length >= 2) {
        try {
            const RESPONSE = await fetch(`${CITY_SEARCH_API_URL}${QUERY}&limit=5&appid=${API_KEY}`);
            const DATA = await RESPONSE.json();

            if (DATA && DATA.length > 0) {
                DATA.forEach(city => {
                    const SUGGESTION_ITEM = document.createElement("div");
                    SUGGESTION_ITEM.classList.add("suggestion-item");

                    // Create location icon element
                    const LOCATION_ICON = document.createElement("span");
                    LOCATION_ICON.classList.add("location-icon");
                    const ICON_IMG = document.createElement("img");
                    ICON_IMG.src = "icons/locationIconGray.png"; 
                    ICON_IMG.alt = "Location Icon";
                    LOCATION_ICON.appendChild(ICON_IMG);
                    SUGGESTION_ITEM.appendChild(LOCATION_ICON);

                    // Create text container
                    const TEXT_CONTAINER = document.createElement("div");
                    TEXT_CONTAINER.classList.add("text-container");

                    // City name
                    const CITY_NAME = document.createElement("span");
                    CITY_NAME.classList.add("city-name");
                    CITY_NAME.textContent = city.name;
                    TEXT_CONTAINER.appendChild(CITY_NAME);

                    // Secondary location info
                    const LOCATION_SECONDARY = document.createElement("span");
                    LOCATION_SECONDARY.classList.add("location-secondary");
                    LOCATION_SECONDARY.textContent = `${city.state ? city.state + ', ' : ''}${city.country}`;
                    TEXT_CONTAINER.appendChild(LOCATION_SECONDARY);

                    SUGGESTION_ITEM.appendChild(TEXT_CONTAINER);

                    SUGGESTION_ITEM.addEventListener("click", function() {
                        handleCitySelection(`${city.name},${city.state ? ',' + city.state : ''},${city.country}`);
                        SUGGESTIONS_DROPDOWN.style.display = "none";
                        DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
                    });

                    SUGGESTIONS_DROPDOWN.appendChild(SUGGESTION_ITEM);
                });
                SUGGESTIONS_DROPDOWN.style.display = "block";
                DESKTOP_SEARCH_BAR.classList.add("suggestions-active");
            } else {
                SUGGESTIONS_DROPDOWN.style.display = "none";
                DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
            }
        } catch (error) {
            console.error(`Error fetching city suggestions: ${error}`);
            SUGGESTIONS_DROPDOWN.style.display = "none";
            DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
        }
    } else {
        SUGGESTIONS_DROPDOWN.style.display = "none";
        DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
    }
});

DESKTOP_SEARCH_BAR.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const SEARCH_TERM = this.value.trim();
        if (SEARCH_TERM) {
            handleCitySelection(SEARCH_TERM);
            SUGGESTIONS_DROPDOWN.style.display = "none";
            DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
        }
    }
});

function handleCitySelection(selectedCity) {
    const citySelectedEvent = new CustomEvent("citySelected", {
        detail: { cityName: selectedCity }
    });
    document.dispatchEvent(citySelectedEvent);

    const CITY_NAME = selectedCity.split(",")[0]; 
    if (CITY_NAME) {
        fetch(`${WEATHER_API_URL}${CITY_NAME}&appid=${API_KEY}&units=${UNITS}`)
            .then(response => response.json())
            .then(WEATHER_DATA => {
                WEATHER_DATA && WEATHER_DATA.main && WEATHER_DATA.main.temp
                    ? console.log(`Temperature in ${CITY_NAME}: ${WEATHER_DATA.main.temp}°F (on Enter/Click)`)
                    : console.log(`Could not retrieve temperature for ${CITY_NAME} (on Enter/Click)`);
            })
            .catch(error => {
                console.error(`Error fetching weather data (on Enter/Click): ${error}`);
            });
    }
}

document.addEventListener("click", function(e) {
    if (!DESKTOP_SEARCH_BAR.contains(e.target) && !SUGGESTIONS_DROPDOWN.contains(e.target)) {
        SUGGESTIONS_DROPDOWN.style.display = "none";
        DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
    }
});

DESKTOP_SEARCH_BAR.addEventListener("blur", function() {
    setTimeout(() => {
        if (!SUGGESTIONS_DROPDOWN.matches(":hover") && SUGGESTIONS_DROPDOWN.style.display === "block") {
            SUGGESTIONS_DROPDOWN.style.display = "none";
            DESKTOP_SEARCH_BAR.classList.remove("suggestions-active");
        }
    }, 100);
});
