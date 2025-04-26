document.addEventListener("DOMContentLoaded", () => {
    const SEARCH_ICON = document.getElementById("search-icon");
    const SEARCH_OVERLAY = document.getElementById("search-overlay");
    const BACK_BTN = document.getElementById("back-btn");

    SEARCH_ICON.addEventListener("click", () => SEARCH_OVERLAY.classList.add("open"));
    BACK_BTN.addEventListener("click", () => SEARCH_OVERLAY.classList.remove("open"));
});








// js-docs/search-bar.js
const SEARCH_INPUT = document.querySelector(".search-bar.expanded");
const SUGGESTIONS_CONTAINER = document.querySelector("#suggestions-container");
const SEARCH_OVERLAY = document.getElementById("search-overlay"); // Get the overlay element

// Make sure the updateForecast function from forecast.js is accessible
let updateForecastFunction;
document.addEventListener('DOMContentLoaded', () => {
    const forecastScript = document.querySelector('script[src*="forecast.js"]');
    if (forecastScript && window.updateForecast) {
        updateForecastFunction = window.updateForecast;
    } else {
        console.warn('forecast.js script not found or updateForecast function not in global scope.');
    }
});

SEARCH_INPUT.addEventListener("input", async () => {
    const QUERY = SEARCH_INPUT.value.trim();

    if (QUERY.length >= 2) {
        try {
            const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${QUERY}&limit=5&appid=${API_KEY}`; // Ensure API_KEY is defined globally or in this file
            const RESPONSE = await fetch(GEO_URL);
            if (RESPONSE.ok) {
                const GEO_DATA = await RESPONSE.json();
                displaySuggestions(GEO_DATA);
            } else {
                SUGGESTIONS_CONTAINER.style.display = "none";
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            SUGGESTIONS_CONTAINER.style.display = "none";
        }
    } else {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }
});

function displaySuggestions(suggestions) {
    SUGGESTIONS_CONTAINER.innerHTML = "";
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const SUGGESTION_ITEM = document.createElement("div");
            SUGGESTION_ITEM.classList.add("suggestion-item");
            SUGGESTION_ITEM.style.display = "flex";
            SUGGESTION_ITEM.style.alignItems = "center";

            const LOCATION_ICON = document.createElement("img");
            LOCATION_ICON.src = "icons/location_on_24dp_737373_FILL0_wght400_GRAD0_opsz24.png";
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
                SEARCH_INPUT.value = `${selectedCity}, ${secondaryLocation}`;
                SUGGESTIONS_CONTAINER.style.display = "none";
                if (updateForecastFunction) {
                    updateForecastFunction(SELECTED_CITY); 
                } else {
                    console.warn("updateForecast function is not available!");
                }

                document.dispatchEvent(new CustomEvent("citySelected", {detail: {cityName: SELECTED_CITY}}));

                if (SEARCH_OVERLAY) {
                    SEARCH_OVERLAY.classList.remove("open");
                }
            });

            SUGGESTIONS_CONTAINER.appendChild(SUGGESTION_ITEM);
        });
        SUGGESTIONS_CONTAINER.style.display = "block";
    } else {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }
}

SEARCH_INPUT.addEventListener("blur", () => {
    setTimeout(() => {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }, 200);
});

SEARCH_INPUT.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && SEARCH_INPUT.value.trim() !== "") {
        event.preventDefault();

        const SEARCHED_CITY = SEARCH_INPUT.value.trim();

        if (updateForecastFunction) {
            updateForecastFunction(SEARCHED_CITY);
        } else {
            console.warn("updateForecast function is not available!");
        }

        document.dispatchEvent(new CustomEvent('citySelected', {detail: {cityName: SEARCHED_CITY}}));

        if (SEARCH_OVERLAY) {
            SEARCH_OVERLAY.classList.remove("open");
        }
    }
});
