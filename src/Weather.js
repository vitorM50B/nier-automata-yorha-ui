
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [displayedText, setDisplayedText] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [loading, setLoading] = useState(false);

  const getFlagUrl = (countryCode) =>
    `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`;

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);
    setDisplayedText([]);
    setCurrentLine(0);

    try {
      const [weatherRes, countryRes] = await Promise.all([
        axios.get(`https://weatherapp-8jj4.onrender.com/weather/${city}`),
        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=b69bec2b622000d8c55417a830f7c68a`)
      ]);

      if (countryRes.data.length > 0) {
        weatherRes.data.country = countryRes.data[0].country;
      }

      setWeather(weatherRes.data);
    } catch (err) {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weather && currentLine < 5) {
      const lines = [
        `City: ${weather.city}`,
        `Temperature: ${weather.temperature}°C`,
        `Weather: ${weather.weather}`,
        `Humidity: ${weather.humidity}%`,
        `Wind Speed: ${weather.wind_speed} m/s`
      ];

      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => [...prev, lines[currentLine]]);
        setCurrentLine((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [weather, currentLine]);

  return (
    <div className="yorha-ui-container">
      <h1 className="yorha-title">WEATHER INTERFACE</h1>

      <div className="search-container">
        <input
          type="text"
          value={city}
          placeholder="Enter City"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>SEARCH</button>
      </div>

      {loading && (
        <div className="loading-container">
          <p className="loading">Fetching data<span className="dots">...</span></p>
        </div>
      )}

      {weather && (
        <div className="weather-info">
          <div className="weather-header">
            <div className="city-flag-container">
              <h2>
                <Typewriter
                  key={weather.city}
                  words={[weather.city]}
                  typeSpeed={50}
                  cursor={false}
                />
              </h2>
              {weather.country && (
                <img
                  className="flag"
                  src={getFlagUrl(weather.country)}
                  alt={`${weather.country} flag`}
                />
              )}
            </div>
          </div>

          <div className="weather-details">
            {displayedText.map((line, index) => (
              <div key={index}>
                <Typewriter
                  words={[line]}
                  typeSpeed={50}
                  cursor={index === displayedText.length - 1}
                  cursorStyle="_"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Weather;
