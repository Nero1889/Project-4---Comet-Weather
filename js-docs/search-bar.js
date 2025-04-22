document.addEventListener("DOMContentLoaded", () => {
    const SEARCH_ICON = document.getElementById("search-icon");
    const SEARCH_OVERLAY = document.getElementById("search-overlay");
    const BACK_BTN = document.getElementById("back-btn");

    SEARCH_ICON.addEventListener("click", () => SEARCH_OVERLAY.classList.add("open"));
    BACK_BTN.addEventListener("click", () => SEARCH_OVERLAY.classList.remove("open"));
});

const SEARCH_BTN = document.querySelector("#search-icon");
const LOCATION_BTN = document.querySelector("#location-icon");

SEARCH_BTN.onclick = () => console.log("Enter a city!");
LOCATION_BTN.onclick = () => console.log("Location Ready to go!");
