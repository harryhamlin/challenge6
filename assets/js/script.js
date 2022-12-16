// todo:
// write a function that checks for duplicates in search history
// annotate all weather outputs
// clean up .append functions?




$(function () {

    let lat;
    let lon;
    let currentPrintArray;
    let printArrayLength;
    buttonPrint();

    // event listener for the submit button executing the funciton to utilize the api to pull weather data
    $('#submit-button').on('click', function (event) {
        let cityName = $('#city-name').val();
        if (cityName) {
            $('#city-name').val('');
            clearEverything();
            storeSearch(cityName);
            grabInfo(cityName);
        }
    })

    $('#button-top').on('click', function (event) {
        let userClick = event.target.nodeName;
        let cityName = event.target.value;
        if (userClick === 'BUTTON') {
            if (cityName) {
                $('#city-name').val('');
                clearEverything();
                storeSearch(cityName);
                grabInfo(cityName);
            }
        }
    })

    $('#clear-button').on('click', function (event) {
        window.localStorage.clear('search-history');
        clearEverything();
    })

    // this function executes multiple apis, first one to grab lat and lon of specified city, the next to pull the weather forecast. from within the second fetch, the dataParse function is executed
    function grabInfo(cityName) {
        let geoLocate = ('https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=8608b342c629b737fa132244a51c05e7');
        fetch(geoLocate)
            .then(function (response) {
                if (response.status !== 200) {
                    window.alert('Query returned status: ' + response.status)
                } else {
                    return response.json();
                }
            })
            .then(function (data) {
                if (data.length === 0) {
                    window.alert('Query failed to return a result')
                    return Promise.reject('Query failed to return a result')
                } else {
                    lat = data[0].lat;
                    lon = data[0].lon;
                    forecastFetchUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=8608b342c629b737fa132244a51c05e7';
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
                    $('#forecast').append('<div class="card m-2 col-lg col-sm-12 bg-dark text-light" id="forecast-card"><div class="card-body"><h5 class="card-title" id="date">' + forecastArray[i][0] + '</h5><i id="icon">' + forecastArray[i][1] + '</i><h6 class="card-subtitle mb-2 text-muted" id="temp">' + forecastArray[i][2] + '</h6><h6 class="card-subtitle mb-2 text-muted" id="wind">' + forecastArray[i][3] + '</h6><h6 class="card-subtitle mb-2 text-muted" id="humidity">' + forecastArray[i][4] + '</h6></div></div>')
                }
                let forecastFetchUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=8608b342c629b737fa132244a51c05e7';
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
                $('#current-forecast').append('<div class="card-body" id="weather-card"><h5 class="card-title" id="city-current">' + name + date + icon + '</h5><h6 class="card-subtitle mb-2 text-muted" id="temp-current">' + temp + '</h6><h6 class="card-subtitle mb-2 text-muted" id="wind-current">' + wind + '</h6><h6 class="card-subtitle mb-2 text-muted" id="humidity-current">' + humidity + '</h6></div>');
                buttonPrint();
            })
    }

    function clearEverything() {
        for (let i = 0; i < 5; i++) {
            $('#forecast-card').remove();
        }
        $('#weather-card').remove();
        for (let i = 0; i < printArrayLength; i++) {
            $('#history-search-button').remove();
        }
    }

    function storeSearch(cityName) {
        let searchHistory = JSON.parse(localStorage.getItem("search-history"));
        if (searchHistory === null) {
            searchHistory = [cityName];
            console.log(searchHistory);
        } else {
            searchHistory.unshift(cityName);

        }
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
    }

    function buttonPrint() {
        currentPrintArray = JSON.parse(localStorage.getItem("search-history"));
        if (currentPrintArray === null) {
            currentPrintArray = [];
        }
        printArrayLength = currentPrintArray.length;
        if (currentPrintArray.length >= 10) {
            printArrayLength = 10
        }
        for (let i = 0; i < printArrayLength; i++) {
            $('#button-top').append('<button type="button" class="btn btn-info col-12 my-1" id="history-search-button" value=' + currentPrintArray[i] + '>' + currentPrintArray[i] + '</button>')
        }
    }
})