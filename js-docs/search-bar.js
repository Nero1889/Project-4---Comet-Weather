document.addEventListener("DOMContentLoaded", () => {
    const SEARCH_ICON = document.getElementById("search-icon");
    const SEARCH_OVERLAY = document.getElementById("search-overlay");
    const BACK_BTN = document.getElementById("back-btn");

    SEARCH_ICON.addEventListener("click", () => SEARCH_OVERLAY.classList.add("open"));
    BACK_BTN.addEventListener("click", () => SEARCH_OVERLAY.classList.remove("open"));
});









const SEARCH_INPUT = document.querySelector(".search-bar.expanded");
const SUGGESTIONS_CONTAINER = document.querySelector("#suggestions-container");

SEARCH_INPUT.addEventListener("input", async () => {
    const QUERY = SEARCH_INPUT.value.trim();

    if (QUERY.length >= 2) { // Start fetching after a few characters
        try {
            const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${QUERY}&limit=5&appid=${API_KEY}`; // Limit to a few suggestions
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
    SUGGESTIONS_CONTAINER.innerHTML = ""; // Clear previous suggestions
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const SUGGESTION_ITEM = document.createElement("div");
            SUGGESTION_ITEM.classList.add("suggestion-item");

            // Create an image element for the location icon
            const locationIcon = document.createElement("img");
            locationIcon.src = "icons/location_on_24dp_737373_FILL0_wght400_GRAD0_opsz24.png"; 
            locationIcon.alt = "Mobile Location Icon";
            locationIcon.style.marginRight = "8px"; // Add some spacing

            const suggestionText = document.createElement("span");
            suggestionText.textContent = `${suggestion.name}, ${suggestion.country}`;
            if (suggestion.state) {
                suggestionText.textContent = `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`;
            }

            // Append the icon and text to the suggestion item
            SUGGESTION_ITEM.appendChild(locationIcon);
            SUGGESTION_ITEM.appendChild(suggestionText);

            SUGGESTION_ITEM.addEventListener("click", () => {
                SEARCH_INPUT.value = suggestionText.textContent;
                SUGGESTIONS_CONTAINER.style.display = "none";
                USER_INPUT.dispatchEvent(new Event("submit")); // Optionally submit the form
            });

            SUGGESTIONS_CONTAINER.appendChild(SUGGESTION_ITEM);
        });
        SUGGESTIONS_CONTAINER.style.display = "block";
    } else {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }
}

// Optionally, handle form submission when Enter is pressed
USER_INPUT.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = SEARCH_INPUT.value.split(',')[0].trim(); // Extract city name
    if (city) {
        try {
            const WEATHER_DATA = await getWeatherData(city);
            displayWeatherInfo(WEATHER_DATA);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city!");
    }
});

// Ensure the suggestions container is hidden when the search bar loses focus
SEARCH_INPUT.addEventListener("blur", () => {
    // Use a slight delay to allow click on suggestions to register
    setTimeout(() => {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }, 200);
});
