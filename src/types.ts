export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeatherInfo {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
  apparent_temperature?: number;
  relative_humidity_2m?: number;
}

export interface DailyForecastItem {
  date: string;
  rawDate: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
}

export interface WeatherRecommendation {
  summary: string;
  clothing: string;
  activity: string;
  advisory?: string;
}

export interface WeatherData {
  locationName: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  current: CurrentWeatherInfo;
  daily: DailyForecastItem[];
  recommendation: WeatherRecommendation;
}
