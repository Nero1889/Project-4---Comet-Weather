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

function displaySuggestions(sugguestions) {
    SUGGESTIONS_CONTAINER.innerHTML = "";
    if (sugguestions.length > 0) {
        sugguestions.forEach(sugguestion => {
            const SUGGESTION_ITEM = document.createElement("div");
            SUGGESTION_ITEM.classList.add("suggestion-item");

            SUGGESTION_ITEM.style.display = "flex";
            SUGGESTION_ITEM.style.alignItems = "center";

            const LOCATION_ICON = document.createElement("img");
            LOCATION_ICON.src = "icons/location_on_24dp_737373_FILL0_wght400_GRAD0_opsz24.png";
            LOCATION_ICON.alt = "Mobile Location Icon";
            LOCATION_ICON.style.marginRight = "8px";

            const SUGGUESTION_TEXT = document.createElement("span");
            SUGGUESTION_TEXT.textContent = `${sugguestion.name}, ${sugguestion.country}`;
            if (sugguestion.state) {
                SUGGUESTION_TEXT.textContent = `${sugguestion.name}, ${sugguestion.state}, ${sugguestion.country}`;
            }

            SUGGESTION_ITEM.appendChild(LOCATION_ICON);
            SUGGESTION_ITEM.appendChild(SUGGUESTION_TEXT);

            SUGGESTION_ITEM.addEventListener("click", () => {
                SEARCH_INPUT.value = SUGGESTION_ITEM.textContent;
                SUGGESTIONS_CONTAINER.style.display = "none";
                USER_INPUT.dispatchEvent(new Event("submit"));
            });

            SUGGESTIONS_CONTAINER.appendChild(SUGGESTION_ITEM);
        });
        SUGGESTIONS_CONTAINER.style.display = "block";
    } else {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }
}

// Ensure the suggestions container is hidden when the search bar loses focus
SEARCH_INPUT.addEventListener("blur", () => {
    setTimeout(() => {
        SUGGESTIONS_CONTAINER.style.display = "none";
    }, 200);
});
