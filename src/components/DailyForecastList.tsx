import React from 'react';
import { DailyForecastItem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { Calendar, Droplets } from 'lucide-react';

interface DailyForecastListProps {
  daily: DailyForecastItem[];
  unit: 'C' | 'F';
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ daily, unit }) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      const f = (celsius * 9) / 5 + 32;
      return `${Math.round(f)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  return (
    <div id="daily-forecast-container" className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
          7-Day Detailed Breakdown
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const info = getWeatherCodeInfo(day.weatherCode);
          const isToday = idx === 0;

          return (
            <div
              key={day.rawDate}
              id={`daily-card-${idx}`}
              className={`rounded-2xl p-3.5 flex flex-col items-center text-center transition-all border ${
                isToday
                  ? 'bg-blue-600/15 border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-xs font-semibold text-white">
                {isToday ? 'Today' : day.date.split(',')[0]}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mb-2.5">
                {day.date.split(',')[1]?.trim() || day.rawDate.slice(5)}
              </span>

              <div className="my-1.5 p-2 bg-black/40 border border-white/10 rounded-xl shadow-inner">
                <WeatherIcon code={day.weatherCode} className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-medium text-slate-300 truncate w-full px-1 mb-2.5">
                {info.label}
              </span>

              <div className="mt-auto flex items-center gap-1.5 text-xs font-bold font-mono">
                <span className="text-rose-400">{formatTemp(day.maxTemp)}</span>
                <span className="text-slate-600">/</span>
                <span className="text-blue-400">{formatTemp(day.minTemp)}</span>
              </div>

              {day.precipitation > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-sky-300 mt-2 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded-full">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{day.precipitation}mm</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

