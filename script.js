// === CONFIG ===
// Sign up at https://home.openweathermap.org/users/sign_up to get a free API key
const OWM_API_KEY = "ENTER_YOUR_API_KEY_HERE"; 

// DOM
const btnGet = document.getElementById('btnGet');
const cityInput = document.getElementById('cityInput');

const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const aqiEl = document.getElementById('aqi');
const tempEl = document.getElementById('temp');
const tomorrowEl = document.getElementById('tomorrow');
const recommendEl = document.getElementById('recommend');
const catSprite = document.getElementById('catSprite');

btnGet.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) return alert('Please enter a city name');
  getWeatherForCity(city);
});

// helper: fetch current weather
async function fetchCurrentWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OWM_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found or API error');
  return res.json();
}

// helper: fetch forecast (5 day / 3 hour)
async function fetchForecastByCoords(lat, lon){
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast API error');
  return res.json();
}

// helper: fetch air pollution (gives AQI 1-5)
async function fetchAQI(lat, lon){
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Air pollution API error');
  return res.json();
}

function aqiToText(aqi){
  // OpenWeather returns 1 (Good) - 5 (Very Poor)
  switch(aqi){
    case 1: return 'Good (1)';
    case 2: return 'Fair (2)';
    case 3: return 'Moderate (3)';
    case 4: return 'Poor (4)';
    case 5: return 'Very Poor (5)';
    default: return 'Unknown';
  }
}

function recommendationFromWeather(main, tempC, aqi){
  const aqiNumber = aqi || 1;
  if (aqiNumber >= 4) return 'Avoid long outdoor stays';
  if (main.toLowerCase().includes('rain')) return 'Carry an umbrella';
  if (main.toLowerCase().includes('snow')) return 'Wear warm layers';
  if (main.toLowerCase().includes('cloud')) return 'A calm day — enjoy a walk';
  if (tempC >= 30) return 'Stay hydrated and avoid midday heat';
  if (tempC <= 5) return 'Wear warm clothes';
  return 'Enjoy the day';
}

function pickTomorrowForecast(forecastJson){
  if (!forecastJson || !forecastJson.list) return 'Unknown';
  const now = new Date();
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tYear = tomorrowDate.getFullYear();
  const tMonth = tomorrowDate.getMonth();
  const tDate = tomorrowDate.getDate();

  // Find forecast entry for tomorrow at around 12:00:00
  let best = null;
  for (const item of forecastJson.list){
    const dt = new Date(item.dt * 1000);
    if (dt.getFullYear() === tYear && dt.getMonth() === tMonth && dt.getDate() === tDate){
      const hour = dt.getHours();
      // prefer 12:00, otherwise pick first available
      if (hour === 12) { best = item; break; }
      if (!best) best = item;
    }
  }
  if (!best) return 'No data';
  return best.weather && best.weather[0] && best.weather[0].main ? best.weather[0].main : 'Unknown';
}

async function getWeatherForCity(city){
  try {
    descriptionEl.textContent = 'Loading...';
    tempEl.textContent = '--°C';
    humidityEl.textContent = '--%';
    aqiEl.textContent = '--';
    tomorrowEl.textContent = '--';
    recommendEl.textContent = '--';

    const current = await fetchCurrentWeather(city);
    const lat = current.coord.lat;
    const lon = current.coord.lon;

    // Update current
    const mainWeather = current.weather[0].main;
    const desc = current.weather[0].description;
    const temp = Math.round(current.main.temp);
    const humidity = Math.round(current.main.humidity);

    descriptionEl.textContent = `It's ${desc}...`;
    tempEl.textContent = `${temp}°C`;
    humidityEl.textContent = `${humidity}%`;

    // Fetch AQI
    let aqiData = null;
    try {
      aqiData = await fetchAQI(lat, lon);
      const owmAQI = aqiData.list && aqiData.list[0] && aqiData.list[0].main ? aqiData.list[0].main.aqi : null;
      aqiEl.textContent = aqiToText(owmAQI);
    } catch(err){
      aqiEl.textContent = 'Unavailable';
    }

    // Fetch forecast and get tomorrow
    try {
      const forecast = await fetchForecastByCoords(lat, lon);
      const tomorrowWeather = pickTomorrowForecast(forecast);
      tomorrowEl.textContent = tomorrowWeather;
    } catch(e){
      tomorrowEl.textContent = 'Unavailable';
    }

    // Recommendation
    const aqiNum = (aqiData && aqiData.list && aqiData.list[0] && aqiData.list[0].main)? aqiData.list[0].main.aqi : 1;
    recommendEl.textContent = recommendationFromWeather(mainWeather, temp, aqiNum);

    // Update pixel background / cat based on weather
    updateSpriteByWeather(mainWeather);
  } catch (err) {
    alert('Error: ' + err.message);
    descriptionEl.textContent = "Couldn't load";
  }
}

function updateSpriteByWeather(main){
  // small fun: change cat image brightness / mood using CSS filters
  const mood = main.toLowerCase();
  if (mood.includes('rain') || mood.includes('drizzle') || mood.includes('thunder')) {
    catSprite.style.filter = 'brightness(0.9) saturate(0.8)';
    // optionally you could swap to a rainy-cat sprite
  } else if (mood.includes('cloud') || mood.includes('mist') || mood.includes('fog')) {
    catSprite.style.filter = 'grayscale(0.05)';
  } else if (mood.includes('clear') || mood.includes('sun')) {
    catSprite.style.filter = 'brightness(1.05) saturate(1.1)';
  } else {
    catSprite.style.filter = 'none';
  }
}

// set a default city on load
document.addEventListener('DOMContentLoaded', () => {
  cityInput.value = 'New York';
  getWeatherForCity('New York');
});
