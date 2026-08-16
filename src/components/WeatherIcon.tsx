import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = 1, className = 'w-6 h-6' }) => {
  const info = getWeatherCodeInfo(code);

  switch (info.icon) {
    case 'sun':
      return isDay ? (
        <Sun className={`text-amber-500 ${className}`} />
      ) : (
        <CloudSun className={`text-indigo-400 ${className}`} />
      );
    case 'cloud-rain':
      return <CloudRain className={`text-blue-500 ${className}`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`text-sky-500 ${className}`} />;
    case 'cloud-snow':
      return <CloudSnow className={`text-sky-300 ${className}`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`text-purple-500 ${className}`} />;
    case 'cloud-fog':
      return <CloudFog className={`text-slate-400 ${className}`} />;
    case 'cloud':
    default:
      return <Cloud className={`text-slate-500 ${className}`} />;
  }
};
