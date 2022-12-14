$(function () {
    let dataPull;

    // event listener for the submit button executing the funciton to utilize the api to pull weather data
    $('#submit-button').on('click', function (event) {
        let cityName = $('#city-name').val();
        if (cityName) {
            $('#city-name').val('');
            grabInfo(cityName);
            createElements();
        }
    })

    // this function executes multiple apis, first one to grab lat and lon of specified city, the next to pull the weather forecast. from within the second fetch, the dataParse function is executed
    function grabInfo(cityName) {
        let geoLocate = ('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=8608b342c629b737fa132244a51c05e7');
        let weatherFetchUrl;
        fetch(geoLocate)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                let lat = data[0].lat;
                let lon = data[0].lon;
                weatherFetchUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=8608b342c629b737fa132244a51c05e7';
                return fetch(weatherFetchUrl)
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                dataParse(data);
            })
    }

    // this function stores the forecast data into a an array
    function dataParse(data) {
        let forecastArray = [];
        for (let i = 2; i < 35; i = i + 8) {
            let date = dayjs(dayjs.unix(data.list[i].dt)).format('YYYY-MM-DD hh-mm-ss');
            let icon = data.list[i].weather[0].icon;
            let temp = data.list[i].main.temp;
            let wind = data.list[i].wind.speed;
            let humidity = data.list[i].main.humidity;
            let singleDayArray = [date, icon, temp, wind, humidity];
            forecastArray.push(singleDayArray);
        }
        console.log(forecastArray)
    }

    function createElements() {
        
    }

})