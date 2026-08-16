import { GeoLocation, WeatherData } from '../types';
import { generateRecommendation } from '../utils/weatherCodes';

export async function searchCities(cityName: string): Promise<GeoLocation[]> {
  const query = cityName.trim();
  if (!query) return [];

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error(`Geocoding service error (${response.status})`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || '',
    country_code: item.country_code || '',
    admin1: item.admin1 || '',
    timezone: item.timezone || 'auto',
  }));
}

export async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast service error (${response.status})`);
  }

  const json = await response.json();

  if (!json.current_weather || !json.daily) {
    throw new Error('Incomplete weather information returned by provider.');
  }

  // Find corresponding hourly apparent_temperature and humidity if available
  let apparentTemp = json.current_weather.temperature;
  let humidity = 60;

  if (json.hourly && Array.isArray(json.hourly.time)) {
    const currentHourStr = json.current_weather.time.slice(0, 13); // e.g. "2026-08-16T11"
    const hourIndex = json.hourly.time.findIndex((t: string) => t.startsWith(currentHourStr));
    if (hourIndex !== -1) {
      if (json.hourly.apparent_temperature && json.hourly.apparent_temperature[hourIndex] !== undefined) {
        apparentTemp = json.hourly.apparent_temperature[hourIndex];
      }
      if (json.hourly.relative_humidity_2m && json.hourly.relative_humidity_2m[hourIndex] !== undefined) {
        humidity = json.hourly.relative_humidity_2m[hourIndex];
      }
    }
  }

  const dailyItems = json.daily.time.map((timeStr: string, idx: number) => {
    const dateObj = new Date(timeStr + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    return {
      date: formattedDate,
      rawDate: timeStr,
      maxTemp: Math.round((json.daily.temperature_2m_max[idx] ?? 0) * 10) / 10,
      minTemp: Math.round((json.daily.temperature_2m_min[idx] ?? 0) * 10) / 10,
      precipitation: Math.round((json.daily.precipitation_sum?.[idx] ?? 0) * 10) / 10,
      weatherCode: json.daily.weathercode?.[idx] ?? json.current_weather.weathercode,
    };
  });

  const todayPrecipitation = json.daily.precipitation_sum?.[0] ?? 0;
  const recommendation = generateRecommendation(
    json.current_weather.temperature,
    json.current_weather.weathercode,
    json.current_weather.windspeed,
    todayPrecipitation
  );

  const locParts = [location.name];
  if (location.admin1 && location.admin1 !== location.name) {
    locParts.push(location.admin1);
  }
  if (location.country) {
    locParts.push(location.country);
  }

  return {
    locationName: locParts.join(', '),
    country: location.country || '',
    admin1: location.admin1,
    latitude: location.latitude,
    longitude: location.longitude,
    elevation: json.elevation,
    current: {
      temperature: Math.round(json.current_weather.temperature * 10) / 10,
      windspeed: Math.round(json.current_weather.windspeed * 10) / 10,
      winddirection: json.current_weather.winddirection,
      weathercode: json.current_weather.weathercode,
      is_day: json.current_weather.is_day,
      time: json.current_weather.time,
      apparent_temperature: Math.round(apparentTemp * 10) / 10,
      relative_humidity_2m: Math.round(humidity),
    },
    daily: dailyItems,
    recommendation,
  };
}
