
//DOM variables for city search panel
let $searchButton = $("#search-button");
let $cityDisplayArea = $("#city-display")

//DOM variables for Current weather display
let $currentConditionsCity = $("#current-conditions-city")
let $currentDate = $("#current-date")
let $currentIcon = $("#current-icon")


let cityStateName; 
let currentLat; 
let currentLon; 

let currentWeatherInfo = {};

let cities = [];

function citySearch(event){
    event.preventDefault(); //prevent page refresh

    let cityNameInput = event.target.previousElementSibling.value; //store the input text value in a variable. 

    //declare variable for concatenated URL string for API call
    let stringCityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityNameInput + "&limit=5&appid=4a13086fc80aa69cd7cfdea0eb325b6a"
    
    //get city name from geocoding api
    $.ajax({
        url: stringCityURL,
        method: 'GET',
    }).then(function (response) {

        getCityName(response) //pass city data object to the function to get the name of the city and the state
    });
}

function getCityName(response) { // get the city name from the data response
    console.log("add city to list");
    console.log(response);

    cityStateName = response[0].name + ", " + response[0].state
    currentLat = response[0].lat
    currentLon = response[0].lon

    displayCityButtons(cityStateName); //hand city name to display buttons
    getCurrentConditions(currentLat, currentLon); //hand city name to the function for current conditions
    get5DayForecast(cityStateName); //hand city name to fxn for 5-day forecast
}

function displayCityButtons(cityStateName) {

    let newCityButton = $("<button>"); //create button element

    newCityButton.addClass("btn btn-primary w-100 my-2 city-button")   //set button classes for bootstrap

    newCityButton.text(cityStateName);    //fill button element

    $cityDisplayArea.append(newCityButton);    //append to city display
}

//FUNCTION to initiate getting weather info for the city on the button that was clicked 
function changeWeatherCity(event){
    
    console.log("CLICK");
    console.log(event);

    cityStateName = event.target.innerText

    console.log(cityStateName);

    getCurrentConditions(cityStateName);
    get5DayForecast(cityStateName);
}


//FUNCTION to get current conditions from city name in API endpoint
function getCurrentConditions(currentLat, currentLon){

   let currentWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&exclude=minutely,hourly,daily,alerts&appid=4a13086fc80aa69cd7cfdea0eb325b6a";

    $.ajax({     //get data for current weather
        url: currentWeatherURL,
        method: 'GET',
    }).then(function (response) {
        console.log("Current weather ------- \n" );
        console.log(response);

        let weatherDate = moment(response.current.dt, "X").format("MMM Do YY");
        console.log(weatherDate);

        currentWeatherInfo["city"] = cityStateName;   //fill up current weather info object with required data 
        currentWeatherInfo["date"] = weatherDate;
        currentWeatherInfo["icon"] = response.current.weather[0].icon;
        currentWeatherInfo["temp"] = response.current.temp
        currentWeatherInfo["humidity"] = response.current.humidity
        currentWeatherInfo["wind"] = response.current.wind_speed;
        currentWeatherInfo["uv"] = response.current.uvi;

        //hand weather data object as argument to display function 
        displayCurrentWeather(currentWeatherInfo)
    });
}

//FUNCTION to display current conditions
function displayCurrentWeather(){
//make display visible .css

}



//FUNCTION to get 5-day forecast from city name in API endpoint
function get5DayForecast(cityStateName){

   let string5DayURL =  "https://api.openweathermap.org/data/2.5/forecast?q=" + cityStateName + "&appid=4a13086fc80aa69cd7cfdea0eb325b6a";

       $.ajax({  //get data for 5 day weather forecast
        url: string5DayURL,
        method: 'GET',
    }).then(function (response) {
        console.log("5day forecast");
        console.log(response);

        //hand weather data arguments to display function 
    });
   
}

//FUNCTION to display 5-day forecast 
//make display visible .css
//for loop through response object for each day w/ response[i]



//declare FUNCTION to store cities array in local storage

//declare FUNCTION to get cities array from local storage and feed that array to the display city buttons function

//when the city serch button clicks, then run a city search function. 
$searchButton.on("click", citySearch);

//add event listener to anything with class city button 
$(document).on("click", ".city-button", changeWeatherCity);

//call function to check local storage for the cities array

