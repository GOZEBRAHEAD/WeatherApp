// =========================== //// =========================== //

const API_URL = `https://api.openweathermap.org/data/2.5/weather`;
const API_KEY = "6efc1e0294b6452e69890860d9a7688d";

const WEEK_DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const searchInput = document.getElementById("search-input");
const btnSearch = document.getElementById("btn-search");
const cardContent = document.getElementById("weather-content");

let firstSearch = true;
let textFromInput;

// =========================== //// =========================== //

function changeCardBackground(type) {

    const cardBackground = document.getElementById("card__background");

    switch (type) {

        case "Clear":
        case "Sunny":
            cardBackground.style.background = "url(/src/img/beach.jpeg)";
            break;

       default:
            cardBackground.style.background = "url(/src/img/coffee.jpeg)";
            break;
    }

    cardBackground.style.backgroundRepeat = "no-repeat";
    cardBackground.style.backgroundSize = "cover";
}

const loadAPI = () => {

    textFromInput = searchInput.value.charAt(0).toUpperCase() + 
                            searchInput.value.slice(1).toLowerCase();

    searchInput.value = "";

    if (textFromInput.length === 0) {
        alert("Please, write a place to analyze.");
        return;
    }

    fetch(`${API_URL}?q=${textFromInput}&units=metric&appid=${API_KEY}`)
        .then(response => response.json())
        .then(createCard);
};

const createCard = (dataFromAPI) => {

    if (dataFromAPI.cod === "404") {
        alert("Only valid places.");
        return;
    }

    if (!firstSearch) {
        cardContent.innerHTML = "";
    }
    else {
        firstSearch = false;
    }

    const newCard = document.createElement("section");

    newCard.classList.add("index__layout__content__card");

    let actualDate = new Date();

    let iconCode = dataFromAPI.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

    newCard.innerHTML = `
        <div class="index__layout__content__card__primary" id="card__background">
        </div>

        <div class="index__layout__content__card__info">

            <div class="index__layout__content__card__info__top__actual-day">${WEEK_DAYS[actualDate.getDay()]}</div>

            <div class="index__layout__content__card__info__top__full-date">${actualDate.toLocaleDateString('es-AR')}</div>

            <div class="index__layout__content__card__info__bottom__location">${dataFromAPI.sys.country} - ${dataFromAPI.name}</div>

            <div class="index__layout__content__card__info__bottom__temperature">
                <p>${dataFromAPI.main.temp}° C</p>
            </div>
            
            <div class="index__layout__content__card__info__bottom__type">${dataFromAPI.weather[0].main}</div>

            <img src="${iconUrl}" alt="weather icon" class="index__layout__content__card__info__bottom__icon" />

        </div>

        <div class="index__layout__content__card__secondary">

            <div class="index__layout__content__card__secondary__description">
                <h4>DESCRIPTION</h4>
                <p>${dataFromAPI.weather[0].description}</p>
            </div>
            <div class="index__layout__content__card__secondary__humidity">
                <h4>HUMIDITY</h4>
                <p>${dataFromAPI.main.humidity} %</p>
            </div>
            <div class="index__layout__content__card__secondary__wind">
                <h4>WIND</h4>
                <p>${dataFromAPI.wind.speed} km/h</p>
            </div>

            <div class="index__layout__content__card__secondary__temps">

                <div class="index__layout__content__card__secondary__temps__min">
                    <h4>TEMP MIN</h4>
                    <p>${dataFromAPI.main.temp_min}° C</p>
                </div>

                <div class="index__layout__content__card__secondary__temps__max">
                    <h4>TEMP MAX</h4>
                    <p>${dataFromAPI.main.temp_max}° C</p>
                </div>

            </div>

        </div>
    `;

    cardContent.appendChild(newCard);

    changeCardBackground(dataFromAPI.weather[0].main);
};

// =========================== //// =========================== //

window.onload = () => {

    btnSearch.addEventListener("click", loadAPI);

    searchInput.addEventListener("keyup", (event) => {
        
        if (event.key === "Enter") {
            
            event.preventDefault();
            btnSearch.click();
        }
    });
};