var historyDiv = $("#history");
var searchInput = $("#search-input");
var weatherSection = $("#forecast");
var ApiKey = "0dc2e4aef9c53ae1be98352041f29566";

var lat;
var lon;
weatherSection.text("5 Day Weather Forecast: ");
// function to get weather data
function getWeatherData(cityName) {
	var cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${ApiKey}&cnt=1`;
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
						var weatherList = data.list;
						var iconCode;
						var iconURL;
						var ptag;
						var cardDiv;
						var cardHeaderDiv;
						var cardbodyDiv;
						var imgtag;

						weatherSection.empty();
						$("#today").empty();
						console.log(data);
						weatherSection.append($("<div>").text("5 day weather Forecast"));
						console.log(weatherList.length);
						// add today's temperature here
						iconCode = weatherList[0].weather[0].icon;
						iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";

						cardDiv = $("<div>");
						cardDiv.addClass("card mt-5");
						imgtag = $("<img>");
						imgtag.attr("src", iconURL);
						cardbodyDiv = $("<div>");
						cardbodyDiv.addClass("card-body");
						cardbodyDiv.append(
							$("<div>")
								.addClass("card-title")
								.append(
									$("<h1>")
										.text(dayjs(weatherList[0].dt_txt).format("DD/MM/YYYY"))
										.append(imgtag)
								)
						);

						//cardbodyDiv.append(imgtag);
						cardbodyDiv.append(
							$("<p>").text("Temp: " + weatherList[0].main.temp + " °C")
						);
						cardbodyDiv.append(
							$("<p>").text("Wind: " + weatherList[0].wind.speed + " KPH")
						);
						ptag = $("<p>");
						ptag.text("Humidity: " + weatherList[0].main.humidity + " %");
						cardbodyDiv.append(ptag); //.text("Max: "+ el.main.temp_max)
						cardDiv.append(cardHeaderDiv);

						cardDiv.append(cardbodyDiv);

						$("#today").append(cardDiv);

						for (var i = 0; i < weatherList.length; i += 7) {
							const el = weatherList[i];

							console.log(el);
							iconCode = el.weather[0].icon;
							iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
							cardDiv = $("<div>");
							cardDiv.addClass("card col-md-2");
							cardHeaderDiv = $("<h5>");
							cardHeaderDiv.text(dayjs(el.dt_txt).format("DD/MM/YYYY"));

							cardbodyDiv = $("<div>");
							cardbodyDiv.addClass("card-body");
							imgtag = $("<img>");
							imgtag.attr("src", iconURL);
							cardbodyDiv.append(imgtag);
							cardbodyDiv.append(
								$("<p>").text("Temp: " + el.main.temp + " °C")
							);
							cardbodyDiv.append(
								$("<p>").text("Wind: " + el.wind.speed + " KPH")
							);
							var ptag = $("<p>");
							ptag.text("Humidity: " + el.main.humidity + " %");
							cardbodyDiv.append(ptag); //.text("Max: "+ el.main.temp_max)
							cardDiv.append(cardHeaderDiv);

							cardDiv.append(cardbodyDiv);
							if (i === 0) {
								//$('#today').append(cardDiv)
							} else {
								weatherSection.append(cardDiv);
							}
						}

						// create a button and add the city name to the the button
						saveCity(data.city.name);
					});
			} else if (code === "404") {
				// if city was found tell user
				alert(data.message);
			}
		});
}

function saveCity(cityName) {
	var cityHistory = JSON.parse(localStorage.getItem("savedHistory"));
	console.log("add this to array" + cityName);

	if (!cityHistory.find((item) => item === cityName)) {
		cityHistory.push(cityName);
		localStorage.setItem("savedHistory", JSON.stringify(cityHistory));
	}
	loadSearchHistory(cityHistory);
}
function loadSearchHistory(arrOfCities) {
	historyDiv.empty();
	arrOfCities.forEach(function (item) {
		var btn = $("<button>");
		btn.attr("data-city", item);
		btn.text(item);
		// add the button to the History div
		historyDiv.append(btn);
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
var cityHistory = JSON.parse(localStorage.getItem("savedHistory"));
if (!cityHistory) {
	localStorage.setItem("savedHistory", JSON.stringify([]));
}
loadSearchHistory(cityHistory);
