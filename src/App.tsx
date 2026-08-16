import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastChart } from './components/ForecastChart';
import { DailyForecastList } from './components/DailyForecastList';
import { GeoLocation, WeatherData } from './types';
import { searchCities, fetchWeatherData } from './services/weatherService';
import { AlertCircle, RefreshCw, CloudSun, Radio, Clock } from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load default city (San Francisco) on mount
  useEffect(() => {
    const initDefaultCity = async () => {
      const defaultLoc: GeoLocation = {
        id: 1,
        name: 'San Francisco',
        country: 'United States',
        latitude: 37.7749,
        longitude: -122.4194,
      };
      await handleCitySelect(defaultLoc);
    };

    initDefaultCity();
  }, []);

  const handleCitySelect = async (location: GeoLocation) => {
    setLoading(true);
    setError('');
    setCurrentLocation(location);

    try {
      let targetLoc = location;

      if (!targetLoc.latitude && !targetLoc.longitude) {
        const found = await searchCities(targetLoc.name);
        if (!found || found.length === 0) {
          throw new Error(`Location "${targetLoc.name}" not found. Please try a valid city name.`);
        }
        targetLoc = found[0];
        setCurrentLocation(targetLoc);
      }

      const data = await fetchWeatherData(targetLoc);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError(err.message || 'An error occurred while fetching weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (currentLocation) {
      handleCitySelect(currentLocation);
    }
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#e0e6ed] flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Immersive ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 relative z-10">
        {/* Top Header */}
        <Header unit={unit} onToggleUnit={toggleUnit} />

        {/* Search Bar with Autocomplete & Popular Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar onSelectCity={handleCitySelect} isLoading={loading} />
          </div>

          <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md shrink-0">
            <Clock className="w-4 h-4 text-blue-400" />
            <div className="text-right">
              <div className="text-xs font-mono text-blue-400 tracking-wider font-semibold">
                {currentTime || '12:00:00 PM'}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-slate-500">
                SYSTEM CLOCK
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            id="error-alert-banner"
            className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-2xl flex items-start justify-between gap-3 text-sm backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-white">Observation Stream Interrupted</span>
                <p className="mt-0.5 text-rose-300 text-xs">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && !weatherData && (
          <div id="loading-skeleton" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <div className="lg:col-span-5 space-y-4">
              <div className="h-80 bg-white/5 border border-white/10 rounded-3xl" />
              <div className="grid grid-cols-2 gap-3.5">
                <div className="h-20 bg-white/5 border border-white/10 rounded-2xl" />
                <div className="h-20 bg-white/5 border border-white/10 rounded-2xl" />
                <div className="h-20 bg-white/5 border border-white/10 rounded-2xl" />
                <div className="h-20 bg-white/5 border border-white/10 rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="h-72 bg-white/5 border border-white/10 rounded-3xl" />
              <div className="h-44 bg-white/5 border border-white/10 rounded-3xl" />
            </div>
          </div>
        )}

        {/* Active Weather Dashboard in Immersive 2-Column Structure */}
        {weatherData && (
          <main id="weather-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Current Conditions, Live Metrics, & Intelligence Recommendation */}
            <section className="lg:col-span-5 flex flex-col gap-6">
              <CurrentWeatherCard weather={weatherData} unit={unit} />
            </section>

            {/* Right Column: 7-Day Temperature Area Trend & Detailed Daily Grid */}
            <section className="lg:col-span-7 flex flex-col gap-6">
              <ForecastChart data={weatherData.daily} unit={unit} />
              <DailyForecastList daily={weatherData.daily} unit={unit} />
            </section>
          </main>
        )}
      </div>

      {/* Futuristic Telemetry Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md py-4 text-xs text-slate-500 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase font-mono">
              AI DRIVEN WEATHER INTELLIGENCE • OPEN-METEO TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-mono">
            <span className="text-blue-400 font-bold">SYSTEM NOMINAL</span>
            <span className="text-slate-500">API LATENCY: ~85ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

