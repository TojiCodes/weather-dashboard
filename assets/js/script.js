// add your OpenWeatherMap API key here
const apiKey = 'b262aebeea43025e5881232561b53caf';

// Function to get coordinates for a city
async function getCoordinates(city) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);

    if (response.ok) {
        const data = await response.json();
        return data[0];
    } else {
        console.log('Error: ' + response.status);
    }
}

// Function to get weather data for a city
async function getWeatherData(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.log('Error: ' + response.status);
    }
}

// Function to display the current weather data
function displayCurrentWeather(data) {
    const currentWeather = document.querySelector('#current-weather');

    // create HTML for the current weather
    const html = `
        <h3>${data.city.name} (${new Date().toLocaleDateString()})</h3>
        <p>Temperature: ${data.list[0].main.temp} °C</p>
        <p>Humidity: ${data.list[0].main.humidity} %</p>
        <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
    `;

    // update the HTML of the current weather container
    currentWeather.innerHTML = html;
}

// Function to display the 5-day forecast
function displayForecast(data) {
    const forecast = document.querySelector('#forecast');
    forecast.innerHTML = '';  // clear any previous forecast

    // create HTML for each day in the forecast
    for (let i = 0; i < data.list.length; i += 8) {  // only take one reading per day
        const day = data.list[i];

        const html = `
            <div class="forecast-day">
                <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                <p>Temperature: ${day.main.temp} °C</p>
                <p>Humidity: ${day.main.humidity} %</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
            </div>
        `;

        // append the HTML to the forecast container
        forecast.innerHTML += html;
    }
}

// Function to save search history to localStorage
function saveSearchHistory(city) {
    // get current search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // add the new city to the start of the search history
    searchHistory.unshift(city);

    // only keep the last 5 searches
    searchHistory = searchHistory.slice(0, 5);

    // save the updated search history to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to load search history from localStorage
function loadSearchHistory() {
    // get search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // create a list item for each city in the search history
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        document.querySelector('#search-history').append(li);
    });
}

// Use the above functions when form is submitted
document.querySelector('#search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const cityInput = document.querySelector('#city-input');
    const city = cityInput.value;  // get the city name from the input field
    cityInput.value = '';  // clear the input field

    // save the city to the search history
    saveSearchHistory(city);

    const coordinates = await getCoordinates(city);
    const weatherData = await getWeatherData(coordinates.lat, coordinates.lon);

    // Use the weather data to update the UI
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
});

// Load the search history when the page loads
loadSearchHistory();
