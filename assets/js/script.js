// todo:
// make the buttons be removed after clicking the clear  history button
// clean up .append functions?

$(function () {
    buttonPrint();

    let lat;
    let lon;
    let state;
    let name;
    let badSearchQuery;

    // event listener for the submit button executing the clearEverything function which deletes all displayed data on the page, and then the funciton to utilize the api to pull weather data from openweather. preventDefault in place to prevent the default action from 'submit'
    $('#submit-button').on('click', function (event) {
        event.preventDefault();
        let cityName = $('#city-name').val();
        if (cityName) {
            clearEverything();
            grabInfo(cityName);
        }
    })

     // event listener for the submit button executing the clearEverything function which deletes all displayed data on the page, and then the funciton to utilize the api to pull weather data from openweather. the if statement is in place to ensure that a 'button' element was clicked and to ensure that cityName has a value
    $('#button-top').on('click', function (event) {
        let userClick = event.target.nodeName;
        let cityName = event.target.value;
        if (userClick === 'BUTTON') {
            if (cityName) {
                clearEverything();
                grabInfo(cityName);
            }
        }
    })

    // event listener for the 'clear history' button which clears local
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
                    badSearchQuery = true;
                    return Promise.reject('Query failed to return a result')
                } else {
                    if (data[0].country === 'US') {
                    state = data[0].state;
                    } else {
                        state = data[0].country;
                    };
                    name = data[0].name;
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
                    $('#forecast').append('<div class="card m-2 col-lg col-sm-12 bg-dark text-light" id="forecast-card"><div class="card-body"><h6 class="card-title" id="date">' + forecastArray[i][0] + '</h6><img src=http://openweathermap.org/img/wn/' + forecastArray[i][1] + '@2x.png><p class="card-subtitle mb-2 text-muted" id="temp">Temp(f):' + forecastArray[i][2] + '</p><p class="card-subtitle mb-2 text-muted" id="wind">Wind:' + forecastArray[i][3] + '</p><p class="card-subtitle mb-2 text-muted" id="humidity">Humidity:' + forecastArray[i][4] + '%</p></div></div>')
                }
                let forecastFetchUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=8608b342c629b737fa132244a51c05e7';
                return fetch(forecastFetchUrl);
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let date = dayjs(dayjs.unix(data.dt)).format('MMM-DD-YY');
                let icon = data.weather[0].icon;
                let temp = data.main.temp;
                let wind = data.wind.speed;
                let humidity = data.main.humidity;
                $('#current-forecast').append('<div class="card-body" id="weather-card"><h5 class="card-title" id="city-current">' + name + ', ' + state + ' ' + date + ' ' + '<img src=http://openweathermap.org/img/wn/' + icon + '@2x.png>' + '</h5><h6 class="card-subtitle mb-2 text-muted" id="temp-current">Temp: ' + temp + '</h6><h6 class="card-subtitle mb-2 text-muted" id="wind-current">Wind: ' + wind + '</h6><h6 class="card-subtitle mb-2 text-muted" id="humidity-current">Humidity: ' + humidity + '%</h6></div>');
                storeSearch(cityName);
                buttonPrint();
            })
    }

    function clearEverything() {
        $('#city-name').val('');
        for (let i = 0; i < 5; i++) {
            $('#forecast-card').remove();
        }
        $('#weather-card').remove();
        
    }

    function storeSearch(cityName) {
        if (badSearchQuery) {
            badSearchQuery = false;
            return
        }
        let searchHistory = JSON.parse(localStorage.getItem("search-history"));
        if (searchHistory === null) {
            searchHistory = [cityName];
        } else {
            let duplicateTest = true;
            for (let i = 0; i < searchHistory.length; i++) {
                if (cityName === searchHistory[i]) {
                    duplicateTest = false;
                }
            }
            if (duplicateTest) {
                searchHistory.unshift(cityName);
            }
        }
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
    }

    function buttonPrint() {
        let currentPrintArray = JSON.parse(localStorage.getItem("search-history"));
        if (currentPrintArray === null) {
            currentPrintArray = []
        }
        let printArrayLength = currentPrintArray.length;
        for (let i = 0; i < printArrayLength; i++) {
            $('#history-search-button').remove();
        }
        if (currentPrintArray.length >= 10) {
            printArrayLength = 10
        }
        for (let i = 0; i < printArrayLength; i++) {
            $('#button-top').append('<button type="button" class="btn btn-info col-12 my-1" id="history-search-button" value=' + currentPrintArray[i] + '>' + currentPrintArray[i] + '</button>')
        }
    }
})