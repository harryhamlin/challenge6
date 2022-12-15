// todo:
// write clearing funtions for everything (field clears on search)
// write an error message for a 400
// write a function that checks for duplicates in search history
// write a function that clears search button history
// annotate all weather outputs
// clean up .append functions?




$(function () {

    let lat;
    let lon;
    buttonPrint();
    let controller = new AbortController();
    let signal = controller.signal;

    // event listener for the submit button executing the funciton to utilize the api to pull weather data
    $('#submit-button').on('click', function (event) {
        let cityName = $('#city-name').val();
        if (cityName) {
            $('#city-name').val('');
            storeSearch(cityName);
            grabInfo(cityName);
            buttonPrint();
        }
    })

    $('#button-top').on('click', function (event) {
        let userClick = event.target.nodeName;
        let cityName = event.target.value;
        if (userClick === 'BUTTON') {
            if (cityName) {
                $('#city-name').val('');
                storeSearch(cityName);
                grabInfo(cityName);
                buttonPrint();
            }
        }
    })

    // this function executes multiple apis, first one to grab lat and lon of specified city, the next to pull the weather forecast. from within the second fetch, the dataParse function is executed
    function grabInfo(cityName) {
        let geoLocate = ('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=8608b342c629b737fa132244a51c05e7');
        fetch(geoLocate)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.length === 0) {
                } else {
                    lat = data[0].lat;
                    lon = data[0].lon;
                    forecastFetchUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=8608b342c629b737fa132244a51c05e7';
                    return fetch(forecastFetchUrl)
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let forecastArray = [];
                for (let i = 2; i < 35; i = i + 8) {
                    let date = dayjs(dayjs.unix(data.list[i].dt)).format('MMM-DD-YY');
                    let icon = data.list[i].weather[0].icon;
                    let temp = data.list[i].main.temp;
                    let wind = data.list[i].wind.speed;
                    let humidity = data.list[i].main.humidity;
                    let singleDayArray = [date, icon, temp, wind, humidity];
                    forecastArray.push(singleDayArray);
                }
                for (let i = 0; i < 5; i++) {
                    $('#forecast').append('<div class="card m-2 col bg-dark text-light"><div class="card-body"><h5 class="card-title" id="date">' + forecastArray[i][0] + '</h5><i id="icon">' + forecastArray[i][1] + '</i><h6 class="card-subtitle mb-2 text-muted" id="temp">' + forecastArray[i][2] + '</h6><h6 class="card-subtitle mb-2 text-muted" id="wind">' + forecastArray[i][3] + '</h6><h6 class="card-subtitle mb-2 text-muted" id="humidity">' + forecastArray[i][4] + '</h6></div></div>')
                }
                let forecastFetchUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=8608b342c629b737fa132244a51c05e7';
                return fetch(forecastFetchUrl);
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let name = data.name;
                let date = dayjs(dayjs.unix(data.dt)).format('MMM-DD-YY');
                let icon = data.weather[0].icon;
                let temp = data.main.temp;
                let wind = data.wind.speed;
                let humidity = data.main.humidity;
                $('#current-forecast').append('<div class="card-body"><h5 class="card-title" id="city-current">' + name + date + icon + '</h5><h6 class="card-subtitle mb-2 text-muted" id="temp-current">' + temp + '</h6><h6 class="card-subtitle mb-2 text-muted" id="wind-current">' + wind + '</h6><h6 class="card-subtitle mb-2 text-muted" id="humidity-current">' + humidity + '</h6></div>')
            })
    }

    function storeSearch(cityName) {
        let searchHistory = JSON.parse(localStorage.getItem("search-history"));
        if (searchHistory === null) {
            searchHisotry = [];
        }
        searchHistory.push(cityName);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
    }

    function buttonPrint() {
        let currentPrintArray = JSON.parse(localStorage.getItem("search-history"));
        let printArrayLength = currentPrintArray.length;
        if (currentPrintArray.length >= 10) {
            printArrayLength = 10
        }
        for (let i = 0; i < printArrayLength; i++) {
            $('#button-top').append('<button type="button" class="btn btn-info col-12 my-1" id="history-search-button" value=' + currentPrintArray[i] + '>' + currentPrintArray[i] + '</button>')
        }
    }
})