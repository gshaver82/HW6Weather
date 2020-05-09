var lat = 0;
var lon = 0;
var city = "";

$(document).ready(function () {
    var currentTime = moment().format('dddd MMMM Do ');
    $("#date").text(currentTime);
})

//these 2 on clicks take the city from either manual search
//or from the clicked city button, then start the API func

$('body').on("click", "#searchBtn", function () {
    city = $(this).parent().prev().val();
    // console.log("city is : " + city);
    api();
});

$('body').on("click", ".btncust", function () {
    city = $(this).text();
    // console.log("city is : " + city);
    api();
});


function api() {

    var APIKey = "69003e226a4b2b2dbea165a0de7fdebd";
    //this api calls current weather, and gets lat and long for next api
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response;
        console.log(results);
        lat = results.coord.lat;
        lon = results.coord.lon;
        // console.log("lat " + lat + "lon " + lon);

        var temp = results.main.temp;
        var humidity = results.main.humidity;
        var wind = results.wind.speed;
        $("#Temperature").text(temp);
        $("#Humidity").text(humidity);
        $("#Wind").text(wind);
        //pulling city name from the api just to verify to the user what city was selected
        var cityresult = results.name;
        $("#cityid").text(cityresult);
        // console.log(cityresult);

        //this pulls the icon, and constructs the img icon for display
        var icon = results.weather[0].icon;
        // src="http://openweathermap.org/img/wn/04n.png"
        var iconstring = 'http://openweathermap.org/img/wn/' + icon + '.png';
        $("#currentIcon").attr("src", iconstring);
        // console.log(iconstring);

        //this api calls the forcast for the next days excluding hourly and minutes
        // this ajax is inside the other one just to be able to use the lat and lon
        var ForecastqueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat +
            "&lon=" +
            lon +
            "&exclude=hourly,minutely&units=imperial&appid=" + APIKey;


        $.ajax({
            url: ForecastqueryURL,
            method: "GET"
        })
            .then(function (response) {
                var results = response;
                console.log(results);
                uvi = results.current.uvi;
                $("#UV").text(uvi);
                if(uvi > 8){
                    $("#UV").attr("style", "background-color: red;")
                }
                

                //using temp2 instead of temp just to avoid variable conflict

                for (var i = 1; i < 6; i++) {
                    var temp2 = results.daily[i].temp.max;
                    var humidity2 = results.daily[i].humidity;
                    //this pulls the icon, and constructs the img icon for display
                    var icon2 = results.daily[i].weather[0].icon;
                    var iconstring2 = 'http://openweathermap.org/img/wn/' + icon2 + '.png';
                    $("#" + i + "img").attr("src", iconstring2);
                    // $("#" + i + "Date").text("d" + i);
                    $("#" + i + "Temp").text(temp2);
                    $("#" + i + "Hum").text(humidity2);


                    //how to moment format this??
                    var TempTime = moment().add(i, 'days').calendar();
                    $("#" + i + "Date").text(TempTime);

                    // var TempTime = moment().add(i, 'days').calendar();


                    // moment(TempTime).format("ddd, hA");
                    // $("#" + i + "Date").text(TempTime);

                }
            });
    });
}

