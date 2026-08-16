import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchCities } from '../services/weatherService';

interface SearchBarProps {
  onSelectCity: (location: GeoLocation) => void;
  isLoading: boolean;
}

const POPULAR_CITIES = [
  { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707 },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced live suggestion search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchCities(query);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        onSelectCity({
          id: Date.now(),
          name: query.trim(),
          latitude: 0,
          longitude: 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (location: GeoLocation) => {
    setQuery(`${location.name}${location.country ? `, ${location.country}` : ''}`);
    setShowDropdown(false);
    onSelectCity(location);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsSearching(false);
        const userLoc: GeoLocation = {
          id: Date.now(),
          name: 'Current Location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: 'Local Device',
        };
        setQuery('Current Location');
        onSelectCity(userLoc);
      },
      (err) => {
        setIsSearching(false);
        console.warn('Geolocation denied or failed:', err);
      }
    );
  };

  return (
    <div id="search-section" className="space-y-3">
      <div className="relative" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1 bg-white/5 border border-white/10 rounded-2xl sm:rounded-full backdrop-blur-md focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>

            <input
              id="city-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Search for a city (e.g., San Francisco, London, Chennai)..."
              disabled={isLoading}
              className="w-full pl-11 pr-10 py-3 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            />

            {query && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="search-submit-btn"
            type="submit"
            disabled={isLoading || isSearching || !query.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium rounded-2xl sm:rounded-full text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 min-w-[100px] cursor-pointer"
          >
            {isLoading || isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>

          <button
            id="geolocate-btn"
            type="button"
            onClick={handleGeolocation}
            disabled={isLoading || isSearching}
            title="Use current GPS location"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-2xl sm:rounded-full transition backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </form>

        {/* Live Autocomplete Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            id="search-suggestions-dropdown"
            className="absolute z-30 top-full left-0 right-0 mt-2 bg-[#090d1a]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden py-1 max-h-60 overflow-y-auto"
          >
            {suggestions.map((loc) => (
              <button
                key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                type="button"
                onClick={() => handleSelect(loc)}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white flex items-center justify-between border-b border-white/5 last:border-0 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">{loc.name}</span>
                  {loc.admin1 && loc.admin1 !== loc.name && (
                    <span className="text-xs text-slate-400">({loc.admin1})</span>
                  )}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {loc.country}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular quick-select city chips */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Popular:</span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={c.name}
            id={`preset-city-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => {
              const loc: GeoLocation = {
                id: Date.now() + Math.random(),
                name: c.name,
                latitude: c.lat,
                longitude: c.lon,
                country: c.country,
              };
              setQuery(`${c.name}, ${c.country}`);
              onSelectCity(loc);
            }}
            className="px-3 py-1 text-xs font-medium bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/30 text-slate-300 rounded-full transition-all border border-white/10 cursor-pointer"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

