let $searchButton = $("#search-button");


function citySearch(event){
    event.preventDefault(); 

    //store the input text value in a variable. 
    let cityNameInput = event.target.previousElementSibling.value;

    console.log(cityNameInput);

    //declare variable for concatenated URL string for API call
    let stringCityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityNameInput + "&limit=5&appid=4a13086fc80aa69cd7cfdea0eb325b6a"
    
    //(note for doing later - trim the string after a comma and make a new variable for the state & add modal to choose which city you meant, not needed for MVP)

    let currentCityLatLon;
    
    //get lat & lon from geocoding api
    $.ajax({
        url: stringCityURL,
        method: 'GET',
    }).then(function (response) {
        console.log(response);

        currentCityLatLon = [response[0].lat, response[0].lon]

    });

    console.log(currentCityLatLon);

    
    addCityToList();

}

function addCityToList() {
    console.log("add city to list");
}



//when the city serch button clicks, then run a city search function. 
$searchButton.on("click", citySearch);
