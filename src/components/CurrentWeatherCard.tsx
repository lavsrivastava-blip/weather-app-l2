import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { RecommendationCard } from './RecommendationCard';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { Wind, Droplets, ArrowUp, MapPin, Gauge, Eye, SunDim } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: 'C' | 'F';
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const current = weather.current;
  const weatherInfo = getWeatherCodeInfo(current.weathercode);
  const todayForecast = weather.daily[0];

  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      const f = (celsius * 9) / 5 + 32;
      return `${Math.round(f)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  const unitLetter = unit === 'F' ? 'F' : 'C';

  return (
    <div id="current-weather-section" className="flex flex-col gap-5">
      {/* Primary Current Weather Hero Card */}
      <div className="relative bg-gradient-to-br from-blue-600/20 via-[#0a1226]/80 to-indigo-950/40 border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Immersive glow background */}
        <div className="absolute top-[-50px] right-[-50px] w-72 h-72 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 w-2 h-2 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                Current Conditions
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>{weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°</span>
            </div>
          </div>

          <h2 id="location-name-heading" className="text-3xl sm:text-5xl font-light text-white tracking-tight mb-1">
            {weather.locationName}
          </h2>

          <p className="text-slate-400 mb-6 italic text-sm sm:text-base">
            {weatherInfo.label} • {weatherInfo.description}
          </p>

          <div className="flex items-baseline gap-2 mb-6">
            <span id="main-temperature-val" className="text-6xl sm:text-8xl leading-none font-thin text-white tracking-tighter">
              {formatTemp(current.temperature)}
            </span>
            <span className="text-3xl sm:text-4xl font-light text-slate-400">
              {unitLetter}
            </span>
            {current.apparent_temperature !== undefined && (
              <span className="ml-4 text-xs sm:text-sm text-slate-400 font-medium">
                (Feels like {formatTemp(current.apparent_temperature)}{unitLetter})
              </span>
            )}
          </div>

          {/* Intelligence Recommendation Box */}
          <RecommendationCard recommendation={weather.recommendation} />
        </div>
      </div>

      {/* Grid of Key Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">
            <span>Day Range</span>
            <ArrowUp className="w-3 h-3 text-rose-400" />
          </div>
          <div className="text-lg font-medium text-white">
            {todayForecast ? `${formatTemp(todayForecast.maxTemp)} / ${formatTemp(todayForecast.minTemp)}` : 'N/A'}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">
            <span>Wind Speed</span>
            <Wind className="w-3 h-3 text-sky-400" />
          </div>
          <div className="text-lg font-medium text-white">
            {current.windspeed} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">
            <span>Humidity</span>
            <Droplets className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-lg font-medium text-white">
            {current.relative_humidity_2m ?? 60}%
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">
            <span>Precipitation</span>
            <Gauge className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="text-lg font-medium text-white">
            {todayForecast?.precipitation ?? 0} <span className="text-xs text-slate-400 font-normal">mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

