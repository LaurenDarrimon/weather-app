let $searchButton = $("#search-button"); //DOM variables for city search panel
let $cityDisplayArea = $("#city-display")


let cityStateName;  //declare variables needed globally 
let currentLat; 
let currentLon; 
let weatherDate;
let forecastDate;

let currentWeatherInfo = {}; //empty object we will fill with key value pairs of weather data
let fiveDayInfo = new Array(); //new empty array to fill with objects for the five day forecast data


let cities = new Array(); //empty array that we'll fill with all the cities selected



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

    cityStateName = response[0].name + ", " + response[0].state
    currentLat = response[0].lat
    currentLon = response[0].lon

    displayCityButtons(); //call display buttons
    getCurrentConditions(); //call function for current conditions
    get5DayForecast(); // fxn for 5-day forecast
}

function displayCityButtons() {

    let newCityButton = $("<button>"); //create button element

    newCityButton.addClass("btn btn-primary w-100 my-2 city-button")   //set button classes for bootstrap

    newCityButton.text(cityStateName);    //fill button element
    newCityButton.addClass("new-city-button")

    $cityDisplayArea.append(newCityButton);    //append to city display
}

//FUNCTION to initiate getting weather info for the city on the button that was clicked 
function changeWeatherCity(event){

    cityStateName = event.target.innerText

    //concatenated URL string for API call
    let stringCityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityStateName + "&limit=5&appid=4a13086fc80aa69cd7cfdea0eb325b6a"
    
    //get city name from geocoding api
    $.ajax({
        url: stringCityURL,
        method: 'GET',
    }).then(function (response) {
        currentLat = response[0].lat
        currentLon = response[0].lon
    });

    getCurrentConditions(); //call function for current conditions
    get5DayForecast(); // fxn for 5-day forecast

}


//FUNCTION to get current conditions from city name in API endpoint
function getCurrentConditions(){

    currentWeatherInfo = {}; //empty out past city weather conditions
    $("#current-date").empty(); //clear out the old forecast
    $("#temp").empty();
    $("#humidity").empty();
    $("#wind").empty();
    $("#uv").empty();

   let currentWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&units=imperial&exclude=minutely,hourly,daily,alerts&appid=4a13086fc80aa69cd7cfdea0eb325b6a";

    $.ajax({     //get data for current weather
        url: currentWeatherURL,
        method: 'GET',
    }).then(function (response) {

        weatherDate = moment(response.current.dt, "X").format("MMM Do YY");

        currentWeatherInfo["city"] = cityStateName;   //fill up current weather info object with required data 
        currentWeatherInfo["date"] = weatherDate;
        currentWeatherInfo["icon"] = response.current.weather[0].icon;
        currentWeatherInfo["temp"] = response.current.temp
        currentWeatherInfo["humidity"] = response.current.humidity
        currentWeatherInfo["wind"] = response.current.wind_speed;
        currentWeatherInfo["uv"] = response.current.uvi;

        //call weather display functions 
        displayCurrentWeather();
    });
}

//FUNCTION to display current conditions
function displayCurrentWeather(){

    $("#current-conditions-city").text(cityStateName);
    $("#current-date").text(weatherDate);

    $("#temp").text("Temperature: " + currentWeatherInfo["temp"] + "\xB0 F");
    $("#humidity").text("Humidity: " + currentWeatherInfo["humidity"] + "%");
    $("#wind").text("Wind Speed: " + currentWeatherInfo["wind"]) + "mph";
    $("#uv").text("UV Index: " + currentWeatherInfo["uv"]);

    let iconPath = "http://openweathermap.org/img/wn/" + currentWeatherInfo["icon"] + ".png";
    $("#current-icon").attr("src", iconPath);
}


//FUNCTION to get 5-day forecast from city name in API endpoint, store in array objects
function get5DayForecast(){

    fiveDayInfo = []; //empty out past array 

   let string5DayURL =  "https://api.openweathermap.org/data/2.5/forecast?q=" + cityStateName + "&units=imperial&appid=4a13086fc80aa69cd7cfdea0eb325b6a";

    $.ajax({  //get data for 5 day weather forecast
        url: string5DayURL,
        method: 'GET',
    }).then(function (response) {

        //loop through 5 days and build a forecast object for each day
        for (i=0; i<40; i+=8){ 
            //the response data increments every 3 hours, so we set the step to 8, so that each loop will be 24 hours

            //get date & time from Unix time using moment.js
            let forecastDate = moment(response.list[i].dt, "X").format("MMM Do YY");

            let futureForecastObj = {
                ["city"]: cityStateName,
                ["date"]: forecastDate,
                ["icon"]: response.list[i].weather[0].icon,
                ["temp"]: response.list[i].main.temp,
                ["humidity"]: response.list[i].main.humidity,
                ["wind"]: response.list[i].wind.speed,
            }
            fiveDayInfo.push(futureForecastObj) //push each day's object to array 
        }
        displayFiveDay();
    });
}

//FUNCTION to display 5-day forecast 
function displayFiveDay(){

    $("#five-day-forecast").empty(); //clear out the old forecast

    //loop through five day array and append div for eeach day
    for (i=0; i < fiveDayInfo.length; i++){

        let dayForecastBlock = $("<div>"); //create parent div for each day in 5-day forecast

        //CREATE elements
        let forecastDateArea = $("<h3>");  //create h3s for date & icon
        let iconArea = $("<img>");

        let tempArea = $("<p>");
        let humidityArea = $("<p>");
        let windArea = $("<p>");

        //FILL with data from 5 day info array 
        forecastDateArea.text(fiveDayInfo[i].date);

        let iconPath = "http://openweathermap.org/img/wn/" + fiveDayInfo[i].icon + ".png";
        iconArea.attr("src", iconPath);

        tempArea.text("Temperature: " + fiveDayInfo[i].temp + "\xB0 F");
        humidityArea.text("Humidity: " + fiveDayInfo[i].humidity + "%");
        windArea.text("Wind Speed: " + fiveDayInfo[i].wind + "mph");

        //APPEND to parent div
        $("#five-day-forecast").append(dayForecastBlock);
        dayForecastBlock.append(forecastDateArea);
        dayForecastBlock.append(iconArea);
        dayForecastBlock.append(tempArea);
        dayForecastBlock.append(humidityArea);
        dayForecastBlock.append(windArea);

        dayForecastBlock.addClass("col-12 col-md2");//add bootstrap classes 
    }

}


//declare FUNCTION to store cities array in local storage

//declare FUNCTION to get cities array from local storage and feed that array to the display city buttons function

//when the city serch button clicks, then run a city search function. 
$searchButton.on("click", citySearch);

//add event listener to anything with class city button 
$(document).on("click", ".city-button", changeWeatherCity);

//call function to check local storage for the cities array

