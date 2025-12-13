const weatherList = [
  { code: 0,  icon: "☀️", description: "Clear Sky" },
  { code: 1,  icon: "🌤️", description: "Mostly Sunny" },
  { code: 2,  icon: "⛅", description: "Partly Cloudy" },
  { code: 3,  icon: "☁️", description: "Cloudy" },
  { code: 45, icon: "🌫️", description: "Fog" },
  { code: 48, icon: "🌫️❄️", description: "Freezing Fog" },
  { code: 51, icon: "🌦️", description: "Light Drizzle" },
  { code: 53, icon: "🌧️", description: "Moderate Drizzle" },
  { code: 55, icon: "🌧️🌧️", description: "Heavy Drizzle" },
  { code: 56, icon: "🌧️❄️", description: "Light Freezing Drizzle" },
  { code: 57, icon: "🌧️❄️❄️", description: "Heavy Freezing Drizzle" },
  { code: 61, icon: "🌦️", description: "Light Rain" },
  { code: 63, icon: "🌧️", description: "Moderate Rain" },
  { code: 65, icon: "🌧️🌧️", description: "Heavy Rain" },
  { code: 66, icon: "🌧️❄️", description: "Light Freezing Rain" },
  { code: 67, icon: "🌧️❄️❄️", description: "Heavy Freezing Rain" },
  { code: 71, icon: "🌨️", description: "Light Snowfall" },
  { code: 73, icon: "❄️", description: "Moderate Snowfall" },
  { code: 75, icon: "❄️❄️", description: "Heavy Snowfall" },
  { code: 77, icon: "❄️✨", description: "Snow Grains" },
  { code: 80, icon: "🌦️🌦️", description: "Light Rain Showers" },
  { code: 81, icon: "🌦️🌧️", description: "Moderate Rain Showers" },
  { code: 82, icon: "🌧️🌧️🌧️", description: "Heavy Showers" },
  { code: 85, icon: "🌨️🌨️", description: "Light Snow Showers" },
  { code: 86, icon: "🌨️❄️❄️", description: "Heavy Snow Showers" },
  { code: 95, icon: "⛈️", description: "Light Storm" },
  { code: 96, icon: "⛈️🌨️", description: "Storm With Light Hail" },
  { code: 99, icon: "⛈️❄️🌩️", description: "Storm With Heavy Hail" }
];
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;


fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&forecast_days=16&timezone=auto`)
  .then(response => response.json())
  .then(data => {
    const day = data.daily;
    let html = "<h2>Wheatere Forecast</h2>";
    html += "<p>Remember that all this product will be delivered to you betew 1 to 3 days after the order, is you dont have a correct instalation or the clima is not correct to aply this products, wait to do your reques untill is a correct time.</p>"
    html += "<ul>"
    day.time.forEach((date, id) => {
      const weatherCode = day.weathercode[id]; 
      const weather = weatherList.find(w => w.code === weatherCode);
      html += `
        <li>
          <h3>${date} ${weather ? weather.icon : "❓"} - ${weather ? weather.description : "Unknown"}</h3>
          <p>Min Temperature: ${day.temperature_2m_min[id]}°C</p>
          <p>Max Temperature: ${day.temperature_2m_max[id]}°C</p>
          <p>Precipitation Sum: ${day.precipitation_sum[id]} mm</p>
        </li>
      `;
    });

    html += "</ul>";
    document.getElementById("forecast").innerHTML = html;
  });
  }, error => {
    console.error("Error getting location:", error.message);
  });
} else {
  console.error("Geolocation is not supported by this browser.");
}
