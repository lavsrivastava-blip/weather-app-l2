import { WeatherRecommendation } from '../types';

export interface WeatherCodeInfo {
  label: string;
  description: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'cloud-snow' | 'cloud-lightning' | 'cloud-fog' | 'cloud-drizzle';
}

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  switch (code) {
    case 0:
      return { label: 'Clear sky', description: 'Sunny and completely clear', icon: 'sun' };
    case 1:
      return { label: 'Mainly clear', description: 'Mostly clear skies with brief clouds', icon: 'sun' };
    case 2:
      return { label: 'Partly cloudy', description: 'Scattered clouds throughout the day', icon: 'cloud' };
    case 3:
      return { label: 'Overcast', description: 'Full cloud cover', icon: 'cloud' };
    case 45:
    case 48:
      return { label: 'Foggy', description: 'Fog and depositing rime fog', icon: 'cloud-fog' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', description: 'Light to dense intermittent drizzle', icon: 'cloud-drizzle' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', description: 'Freezing drizzle conditions', icon: 'cloud-drizzle' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', description: 'Slight to heavy steady rainfall', icon: 'cloud-rain' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', description: 'Freezing rain, potential icy ground', icon: 'cloud-rain' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snowfall', description: 'Slight to heavy snowfall', icon: 'cloud-snow' };
    case 77:
      return { label: 'Snow grains', description: 'Fine snow grains falling', icon: 'cloud-snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain showers', description: 'Passing moderate to violent rain showers', icon: 'cloud-rain' };
    case 85:
    case 86:
      return { label: 'Snow showers', description: 'Light to heavy snow showers', icon: 'cloud-snow' };
    case 95:
      return { label: 'Thunderstorm', description: 'Thunderstorm with possible hail', icon: 'cloud-lightning' };
    case 96:
    case 99:
      return { label: 'Severe Thunderstorm', description: 'Heavy thunderstorm with hail', icon: 'cloud-lightning' };
    default:
      return { label: 'Variable conditions', description: 'Typical regional conditions', icon: 'cloud' };
  }
}

export function generateRecommendation(
  temp: number,
  weatherCode: number,
  windSpeed: number,
  precipitationSum: number
): WeatherRecommendation {
  let summary = '';
  let clothing = '';
  let activity = '';
  let advisory: string | undefined = undefined;

  // Temperature logic
  if (temp < 0) {
    summary = "Sub-zero freezing temperatures. Extreme winter conditions.";
    clothing = "Heavy insulated winter parka, thermal inner layers, wool hat, scarf, and insulated gloves.";
    activity = "Limit extended outdoor exposure. Ensure heating is adequate and roads are clear.";
  } else if (temp < 10) {
    summary = "It's quite cold outside. Layering is essential.";
    clothing = "Wear a heavy coat, sweater, warm trousers, and closed footwear.";
    activity = "Brisk walks and indoor activities are best. Bundle up well if heading out.";
  } else if (temp >= 10 && temp < 20) {
    summary = "Mild and comfortable weather.";
    clothing = "A light jacket, hoodie, or cozy sweater paired with comfortable pants.";
    activity = "Great for sightseeing, cycling, running, and light outdoor gatherings.";
  } else if (temp >= 20 && temp < 30) {
    summary = "Warm, pleasant, and optimal for outdoor plans.";
    clothing = "Lightweight breathable cottons, t-shirts, sunglasses, and comfortable shoes.";
    activity = "Perfect for parks, outdoor sports, walking tours, and patio dining. Stay hydrated.";
  } else {
    summary = "Hot weather alert! High thermal load.";
    clothing = "Breathable loose fabrics, wide-brim hat, UV sunglasses, and sunscreen.";
    activity = "Avoid direct sun exposure during peak hours (11am - 4pm). Keep a water bottle handy.";
  }

  // Weather code and precipitation modifiers
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode) || precipitationSum > 1.0) {
    advisory = "Precipitation expected: Carry a sturdy umbrella or waterproof hooded raincoat.";
  } else if ([71, 73, 75, 85, 86].includes(weatherCode)) {
    advisory = "Snow alert: Wear non-slip boots and check local transit updates.";
  } else if ([95, 96, 99].includes(weatherCode)) {
    advisory = "Thunderstorm warning: Seek safe indoor shelter and avoid open fields or trees.";
  } else if (windSpeed > 35) {
    advisory = `High winds (${windSpeed} km/h): Secure loose outdoor objects and watch for crosswinds.`;
  }

  return { summary, clothing, activity, advisory };
}
