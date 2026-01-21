# Weather.Cat — Pixel Weather Web App

**Weather.Cat** is a simple, interactive, and visually fun weather application built with **HTML, CSS, and JavaScript**.  
It displays **real-time weather data**, including temperature, humidity, air quality index (AQI), tomorrow’s forecast, and personalized recommendations — all enhanced with a playful **pixel cat sprite** that reacts to the weather.

## Features

- Search for weather by city name
- Real-time temperature, humidity, and AQI display
- Tomorrow's weather forecast
- Weather-based recommendations (e.g., “Carry an umbrella” or “Stay hydrated”)
- Pixel cat sprite adjusts appearance according to weather conditions
- Fully responsive and lightweight

## Technologies Used

- **HTML5** – Markup and structure
- **CSS3** – Styling and responsive design
- **JavaScript (Vanilla)** – Logic and API integration
- **OpenWeather API** – Weather, forecast, and air pollution data

## How It Works

1. Enter a **city name** and click the **Get Weather** button.  
2. The app fetches **current weather**, **forecast**, and **AQI** from OpenWeather API.  
3. The interface updates dynamically with **temperature, humidity, AQI, tomorrow’s forecast**, and **recommendations**.  
4. Pixel cat sprite changes appearance based on the weather (sunny, cloudy, rainy, etc.) to make the UI fun and interactive.

 **Important:** The API key is **not included** in this repository for security reasons. You will need to use your own OpenWeather API key to run the project locally.

## Setup / Running Locally

1. Sign up for a free OpenWeather API key:  
   [https://home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up)

2. Clone this repository.

3. Open script.js and replace with your own API KEY:
    const OWM_API_KEY = "ENTER_YOUR_API_KEY_HERE";

4. Open index.html in your browser.