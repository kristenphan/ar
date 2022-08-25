// OpenWeatherMap API key
const api = "1e5664d4684fd1be5667d4ec7583c068";

// Accessing DOM elements
const loc = document.getElementById('location');
const tempC = document.getElementById('tempC');

// Using an event listener to fetch current weather data every time the page is loaded
window.addEventListener('load', () => {
    let long;
    let lat;
    // Accesing Geolocation of User
    if (navigator.geolocation) { // Checking if browser supports Geolocation Web API
        navigator.geolocation.getCurrentPosition((position) => {
            // Storing Longitude and Latitude in variables
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

            // Using Fetch Web API to get data
            // Current Weather Data API doc: https://openweathermap.org/current
            fetch(base)
                .then((response) => {
                    return response.json(); // Translating the response into a JSON object
                })
                .then((data) => {
                    const place = data.name;
                    const { temp } = data.main; // Storing temperature data by matching data field "temp" from data.main
     
                    // Converting Epoch(Unix) time to GMT
                    loc.textContent = `${place}`;
                    tempC.textContent = `${temp.toFixed(0)}\xB0`;
                });
        });
    }
});