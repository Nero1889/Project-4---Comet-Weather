const SETTINGS_BTN = document.querySelector("#settings-btn");
const SETTINGS_ICON = "icons/settings.png";
const CLOSE_ICON = "icons/close.png";
const SETTINGS_OVERLAY = document.querySelector(".settings-overlay");

SETTINGS_BTN.addEventListener("click", () => {
    SETTINGS_OVERLAY.classList.toggle("opened");

    if (SETTINGS_OVERLAY.classList.contains("opened")) {
        SETTINGS_BTN.src = CLOSE_ICON;
        SETTINGS_BTN.alt = "Close Icon";
    } else {
        SETTINGS_BTN.src = SETTINGS_ICON;
        SETTINGS_BTN.alt = "Settings Icon";
    }
});





const DARK_TOGGLE_BTN = document.querySelector(".dark-toggle-btn");
const LIGHT_TOGGLE_BTN = document.querySelector(".light-toggle-btn");
const FLAT_TOGGLE_BTN = document.querySelector(".flat-toggle-btn");

function setTheme(theme) {
    BODY.classList.remove("light", "flat");

    if (theme === "light") BODY.classList.add("light");
    if (theme === "flat") BODY.classList.add("flat");

    localStorage.setItem("theme", theme);
}

DARK_TOGGLE_BTN.addEventListener("click", () => setTheme("dark"));
LIGHT_TOGGLE_BTN.addEventListener("click", () => setTheme("light"));
FLAT_TOGGLE_BTN.addEventListener("click", () => setTheme("flat"));

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    else setTheme("dark");
});





/* Temperature Toggle Setup */
const TOGGLE_BTN = document.querySelector("#toggle-btn");
TOGGLE_BTN.style.cursor = "pointer";
const TEMP_UNIT_DISPLAY = document.querySelector("#a");

let isOn = localStorage.getItem("tempUnitIsOn") === "1";

if (localStorage.getItem('tempUnitIsOn') === null) isOn = false;


function updateToggleText() {
    const TOGGLE_ICON = `<img id="toggle-btn" src="icons/${isOn ? "toggleOn.png" : "toggleOff.png"}" alt="Toggle Icon" draggable="false">`;

    if (TEMP_UNIT_DISPLAY) {
        TEMP_UNIT_DISPLAY.innerHTML = `Fahrenheit ${TOGGLE_ICON} Celcius`;
        
        const NEW_TOGGLE_BTN = document.querySelector("#toggle-btn");
        if (NEW_TOGGLE_BTN) {
            NEW_TOGGLE_BTN.style.cursor = "pointer";

            NEW_TOGGLE_BTN.removeEventListener("click", handleToggleClick);
            NEW_TOGGLE_BTN.addEventListener("click", handleToggleClick);
        }
    }
}

function handleToggleClick() {
    isOn = !isOn;
    
    localStorage.setItem('tempUnitIsOn', isOn ? "1" : "0");

    TOGGLE_BTN.src = isOn ? "icons/toggleOn.png" : "icons/toggleOff.png";
    updateToggleText();

    if (currentWeatherData) displayWeatherInfo(currentWeatherData);
    
    const CITY_QUERY = CITY_ELEMENT_MAIN.textContent.split(",")[0];
    
    updateForecast(CITY_QUERY);
    updateHourlyForecastForCity(CITY_QUERY); 
}

updateToggleText();
TOGGLE_BTN.addEventListener("click", handleToggleClick);