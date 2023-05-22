var APIKey = "e4731681e49ece0d32bbfc8cf6ba5672"
// console.log(fetch(`http://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=${APIKey}`))

// this is the main function for searching cities that has both API's in it
var cityArr = JSON.parse(localStorage.getItem('city')) || [];

function searchCity(cityName) {
  var apiUrlCurrent =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    cityName +
    `&units=imperial&appid=${APIKey}`;
  var apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=` + cityName + `&units=imperial&appid=${APIKey}`;

  console.log(apiUrlCurrent);
  console.log(apiUrlForecast);

   // This is a function to fetch url that returns json response for current
  fetch(apiUrlCurrent)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log("Fetch Response \n---------");
      console.log(data);

      // to display the current weather
      var temp = data.main.temp;
      var wind = data.wind.speed;
      var humidity = data.main.humidity;
     
      $("#current-city-name").text(data.name);
      $("#current-temp").text("Temp: " + temp + "°F");
      $("#current-wind").text("MPH: " + wind + "mph");
      $("#current-humidity").text("Humidity: " + humidity + "%");

      // This is a function to fetch url that returns json response for extended
      fetch(apiUrlForecast)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log("Fetch Response \n----------");
          console.log(data);
          var a = 0;
          // for loop to add the forecast to the cards
          for (var i = 0; i <= data.list.length; i+=7) {
            console.log(data.list[i]);
            var date = new Date(data.list[i].dt_txt.replace(" ", "T"));
            var dayOfWeek = date.toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});
            var iconCode = data.list[i].weather[0].icon;
            var temp = data.list[i].main.temp;
            var wind = data.list[i].wind.speed;
            var humidity = data.list[i].main.humidity;

            $("#card" + a + " .card-date").text(dayOfWeek);
            $("#card" + a + " .card-icon").attr(
              "src",
              "https://openweathermap.org/img/w/" + iconCode + ".png"
            );
            $("#card" + a + " .card-temp").text('temp: ' + temp + "°F");
            $("#card" + a + " .card-wind").text('wind: ' + wind + "mph");
            $("#card" + a + " .card-humidity").text('humidity: ' + humidity + "%");
            a++
          }
        })
        // will tell me if there are errors
        .catch(function (error) {
          console.log("Error fetching forecast data:", error);
        });
    })
    .catch(function (error) {
      console.log("Error fetching forecast data:", error);
    });
}
// function for getting weather by city input
// addevent listener for the search button
var btn = document.querySelector(".btn");
$(".btn").on("click", function (event) {
  event.preventDefault();
  var cityName = $(".city").val();
  
// saving city search name to local sotrage
  searchCity(cityName);
  cityArr.push(cityName);
  localStorage.setItem('city', JSON.stringify(cityArr));

// Last serch should be on load
});
function renderBtn(){
  if (cityArr.length > 0) {
    searchCity(cityArr[0])
    for (let i = 0; i < cityArr.length; i++) {
      $(".city-list").append(`<li><button class='listItem'>${cityArr[i]}</button></li>`);
      
    }
  }
  $('.listItem').on('click', function (event){
    var clickCity = $(event.target).text();
    searchCity(clickCity);
    console.log(clickCity);
  });
}

renderBtn();