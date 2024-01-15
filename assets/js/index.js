var historyDiv = $("#history");
var searchInput = $("#search-input");
var ApiKey = "0dc2e4aef9c53ae1be98352041f29566";

var lat;
var lon;

// function to get weather data
function getWeatherData(cityName) {
	var cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${ApiKey}&limit=5`;
	fetch(cityUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log("get data");
			// Check whether the query was successful
			var code = data.cod;
			if (code === "200") {
				// if successfully continue to get the weather based on the coordinates

				lat = data.city.coord.lat;
				lon = data.city.coord.lon;
				var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

				fetch(queryURL)
					.then(function (response) {
						return response.json();
					})
					.then(function (data) {
						// create a button and add the city name to the the button
						var btn = $("<button>");
						btn.text(data.city.name);
						// add the button to the History div
						historyDiv.append(btn);
					});
			} else if (code === "404") {
				// if city was found tell user
				alert(data.message);
			}
		});
}
//Search button click event
$("#search-button").on("click", function (event) {
	event.preventDefault();
	console.log(searchInput.val());
	// check if the input is empty
	if (searchInput.val().length > 0) {
		cityName = searchInput.val();

		getWeatherData(cityName);
	} else {
		alert("Enter a city first!");
	}
});
