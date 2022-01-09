let $searchButton = $("#search-button");

let currentCityLat;
let currentCityLon;

function citySearch(event){
    event.preventDefault(); //prevent page refresh

    let cityNameInput = event.target.previousElementSibling.value; //store the input text value in a variable. 

    //declare variable for concatenated URL string for API call
    let stringCityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityNameInput + "&limit=5&appid=4a13086fc80aa69cd7cfdea0eb325b6a"
    
    //get lat & lon from geocoding api
    $.ajax({
        url: stringCityURL,
        method: 'GET',
    }).then(function (response) {
        console.log(response);

        getLatLon(response) //pass city data object to function to store lat & Longitude. 

    });
}

function getLatLon(response) {
    console.log("add city to list");

    currentCityLat = response[0].lat, 

    currentCityLon = response[0].lon;

    cityStateName = response[0].name + ", " + response[0].state

    console.log(currentCityLat);
    console.log(currentCityLon);
    console.log(cityStateName);

    addCityToList(cityStateName);

    getCurrentConditions(currentCityLat, currentCityLon);

    get5DayForecast(currentCityLat, currentCityLon);
}

function addCityToList() {
    console.log(cityStateName);
    
}

//FUNCTION to get current conditions
function getCurrentConditions(currentCityLat, currentCityLon){
    console.log(currentCityLat);
    console.log(currentCityLon);
}

//FUNCTION to display current conditions

//FUNCTION to get 5-day forecast 
function get5DayForecast(currentCityLat, currentCityLon){
    console.log(currentCityLat);
    console.log(currentCityLon);
}

//FUNCTION to display 5-day forecast 



//when the city serch button clicks, then run a city search function. 
$searchButton.on("click", citySearch);
