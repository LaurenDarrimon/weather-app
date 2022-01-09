let $searchButton = $("#search-button");
let $cityDisplayArea = $("city-display")

let currentCityLat;
let currentCityLon;
let cityStateName; 

let cities = [];

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

    console.log(cityStateName);

    displayCityButtons(cityStateName);

    getCurrentConditions(cityStateName);

    get5DayForecast(cityStateName);
}

function displayCityButtons(cityStateName) {
    console.log(cityStateName);

    let newCityButton = $("<button>"); //create button element

    newCityButton.addClass("btn btn-primary w-100 my-2 city-button")   //set button classes for bootstrap

    newCityButton.text(cityStateName);    //fill button element

   $("#city-display").append(newCityButton);    //append to city display

    //call up functions to change the weather displays
}

//FUNCTION to change weather display pull lat lon from data attribute or from local storage
function changeWeatherCity(event){
    
    console.log("CLICK");
    console.log(event);

    cityStateName = event.target.innerText

    console.log(cityStateName);

    getCurrentConditions(cityStateName);
    get5DayForecast(cityStateName);

}


//FUNCTION to get current conditions
function getCurrentConditions(cityStateName){

    let currentWeatherURL =  "https://api.openweathermap.org/data/2.5/weather?q=" + cityStateName + "&appid=4a13086fc80aa69cd7cfdea0eb325b6a";

    //get data for current weather
    $.ajax({
     url: currentWeatherURL,
     method: 'GET',
 }).then(function (response) {

    console.log("Current weather");
    console.log(response);
 });
  

}

//FUNCTION to display current conditions


//FUNCTION to get 5-day forecast 
function get5DayForecast(cityStateName){

   let string5DayURL =  "https://api.openweathermap.org/data/2.5/forecast?q=" + cityStateName + "&appid=4a13086fc80aa69cd7cfdea0eb325b6a";

       //get data for 5 day weather forecast
       $.ajax({
        url: string5DayURL,
        method: 'GET',
    }).then(function (response) {
        console.log("5day forecast");
        console.log(response);

    });
   
}

//FUNCTION to display 5-day forecast 



//when the city serch button clicks, then run a city search function. 
$searchButton.on("click", citySearch);

//add event listener to anything with class city button 
$(document).on("click", ".city-button", changeWeatherCity);

