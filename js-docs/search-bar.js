const SEARCH_ICON = document.querySelector("#search-icon");
const BACK_BTN = document.querySelector("#back-btn");
const SEARCH_OVERLAY = document.querySelector(".search-overlay");

SEARCH_ICON.addEventListener("click", () => SEARCH_OVERLAY.classList.add("open"));
BACK_BTN.addEventListener("click", () => SEARCH_OVERLAY.classList.remove("open"));

const DESKTOP_SEARCH_INPUT = document.querySelector(".desktop-search-bar");
const MOBILE_SEARCH_INPUT = document.querySelector(".search-bar.expanded");
const SUGGESTIONS_DROPDOWN = document.getElementById("suggestions-dropdown");
const SUGGESTIONS_CONTAINER = document.querySelector("#suggestions-container");

function displaySuggestions(suggestions, container, inputElement) {
    container.innerHTML = "";
    if (suggestions && suggestions.length > 0) {
        container.style.display = "block";
        suggestions.forEach(suggestion => {
            const SUGGESTION_ITEM = document.createElement("div");
            SUGGESTION_ITEM.classList.add("suggestion-item");
            SUGGESTION_ITEM.style.display = "flex";
            SUGGESTION_ITEM.style.alignItems = "center";

            const LOCATION_ICON = document.createElement("img");
            LOCATION_ICON.src = "icons/locationIconGray.png";
            LOCATION_ICON.alt = "Location Icon";
            LOCATION_ICON.classList.add("location-icon");

            const TEXT_CONTAINER = document.createElement("div");
            TEXT_CONTAINER.style.display = "flex";
            TEXT_CONTAINER.style.flexDirection = "column";
            TEXT_CONTAINER.style.marginLeft = "8px";

            const CITY_TEXT = document.createElement("span");
            CITY_TEXT.textContent = suggestion.name;
            CITY_TEXT.style.color = "white";
            CITY_TEXT.style.fontSize = "var(--size-base)";

            const COUNTRY_TEXT = document.createElement("span");
            COUNTRY_TEXT.style.color = "#737373";
            COUNTRY_TEXT.style.fontSize = "0.8em";
            COUNTRY_TEXT.style.marginTop = ".25rem";

            const SECONDARY_LOCATION = suggestion.state
            ? `${suggestion.state}, ${suggestion.country}`
            : suggestion.country;
            COUNTRY_TEXT.textContent = SECONDARY_LOCATION;

            TEXT_CONTAINER.appendChild(CITY_TEXT);
            TEXT_CONTAINER.appendChild(COUNTRY_TEXT);

            SUGGESTION_ITEM.appendChild(LOCATION_ICON);
            SUGGESTION_ITEM.appendChild(TEXT_CONTAINER);

            SUGGESTION_ITEM.addEventListener("click", () => {
                handleSuggestionSelection(suggestion, container, `${suggestion.name}, ${SECONDARY_LOCATION}`);
            });

            container.appendChild(SUGGESTION_ITEM);
        });
        inputElement.classList.add("suggestions-active");
    } else {
        container.style.display = "none";
        inputElement.classList.remove("suggestions-active");
    }
}

function handleSuggestionSelection(suggestion, container, displayText) {
    if (container === SUGGESTIONS_CONTAINER) {
        document.querySelector(".search-overlay").classList.remove("open");
    }
    container.style.display = "none";

    const CITY_SELECTED_EVENT = new CustomEvent("citySelected", {
        detail: suggestion
    });
    document.dispatchEvent(CITY_SELECTED_EVENT);

    if (DESKTOP_SEARCH_INPUT && container === SUGGESTIONS_DROPDOWN) {
        DESKTOP_SEARCH_INPUT.value = displayText;
        DESKTOP_SEARCH_INPUT.classList.remove("suggestions-active");
    } else if (MOBILE_SEARCH_INPUT && container === SUGGESTIONS_CONTAINER) {
        MOBILE_SEARCH_INPUT.value = displayText;
        MOBILE_SEARCH_INPUT.classList.remove("suggestions-active");
    }
}

function fetchSuggestions(query, container, inputElement) {
    if (!query.trim()) {
        container.innerHTML = "";
        container.style.display = "none";
        inputElement.classList.remove("suggestions-active");
        return;
    }

    const SUGGESTION_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

    fetch(SUGGESTION_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const SUGGESTIONS = data.map(item => ({
                name: item.name,
                state: item.state,
                country: item.country,
                lat: item.lat,
                lon: item.lon
            }));
            displaySuggestions(SUGGESTIONS, container, inputElement);
        })
        .catch(error => {
            console.error(`Error fetching suggestions: ${error}`);
            container.innerHTML = `<div class="suggestion-item">Error loading suggestions!</div>`;
            container.style.display = "block";
            inputElement.classList.add("suggestions-active");
        });
}

function handleSearchInputEnter(inputElement, suggestionContainer) {
    if (inputElement && suggestionContainer) {
        inputElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const FIRST_SUGGESTION = suggestionContainer.querySelector(".suggestion-item");
                if (FIRST_SUGGESTION) {
                    FIRST_SUGGESTION.click();
                } else if (inputElement.value.trim()) {
                    const MANUAL_SUGGESTION = {name: inputElement.value.trim(), country: ""};
                    const CITY_SELECTED_EVENT = new CustomEvent("citySelected", {
                        detail: MANUAL_SUGGESTION
                    });
                    document.dispatchEvent(CITY_SELECTED_EVENT);
                    if (suggestionContainer === SUGGESTIONS_CONTAINER) {
                        document.querySelector(".search-overlay").classList.remove("open");
                    }
                    inputElement.classList.remove("suggestions-active");
                }
                inputElement.blur();
            }
        });
    }
}

if (DESKTOP_SEARCH_INPUT && SUGGESTIONS_DROPDOWN) {
    DESKTOP_SEARCH_INPUT.addEventListener("input", (e) => {
        fetchSuggestions(e.target.value, SUGGESTIONS_DROPDOWN, DESKTOP_SEARCH_INPUT);
    });

    DESKTOP_SEARCH_INPUT.addEventListener("focus", (e) => {
        if (e.target.value.trim()) {
            fetchSuggestions(e.target.value, SUGGESTIONS_DROPDOWN, DESKTOP_SEARCH_INPUT);
        }
    });

    DESKTOP_SEARCH_INPUT.addEventListener("blur", () => {
        setTimeout(() => {
            SUGGESTIONS_DROPDOWN.style.display = "none";
            DESKTOP_SEARCH_INPUT.classList.remove("suggestions-active");
        }, 200);
    });

    handleSearchInputEnter(DESKTOP_SEARCH_INPUT, SUGGESTIONS_DROPDOWN);
}

if (MOBILE_SEARCH_INPUT && SUGGESTIONS_CONTAINER) {
    MOBILE_SEARCH_INPUT.addEventListener("input", (e) => {
        fetchSuggestions(e.target.value, SUGGESTIONS_CONTAINER, MOBILE_SEARCH_INPUT);
    });

    MOBILE_SEARCH_INPUT.addEventListener("focus", (e) => {
        if (e.target.value.trim()) {
            fetchSuggestions(e.target.value, SUGGESTIONS_CONTAINER, MOBILE_SEARCH_INPUT);
        }
    });

    handleSearchInputEnter(MOBILE_SEARCH_INPUT, SUGGESTIONS_CONTAINER);
}
