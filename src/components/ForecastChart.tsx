import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DailyForecastItem } from '../types';
import { TrendingUp } from 'lucide-react';

interface ForecastChartProps {
  data: DailyForecastItem[];
  unit: 'C' | 'F';
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, unit }) => {
  const convertTemp = (c: number) => {
    if (unit === 'F') {
      return Math.round(((c * 9) / 5 + 32) * 10) / 10;
    }
    return c;
  };

  const chartData = data.map((item) => ({
    date: item.date.split(',')[0].toUpperCase(),
    fullDate: item.date,
    rawDate: item.rawDate,
    maxTemp: convertTemp(item.maxTemp),
    minTemp: convertTemp(item.minTemp),
    precipitation: item.precipitation,
  }));

  const unitLabel = unit === 'F' ? '°F' : '°C';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullDate = payload[0]?.payload?.fullDate || label;
      return (
        <div className="bg-[#070b16]/95 backdrop-blur-xl border border-white/15 text-white p-3.5 rounded-2xl shadow-2xl text-xs space-y-1.5 min-w-[150px]">
          <p className="font-semibold text-slate-300 border-b border-white/10 pb-1">{fullDate}</p>
          <div className="flex items-center justify-between gap-4 text-rose-400 font-medium">
            <span>High Temp:</span>
            <span className="font-bold">{payload[0]?.value} {unitLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-blue-400 font-medium">
            <span>Low Temp:</span>
            <span className="font-bold">{payload[1]?.value} {unitLabel}</span>
          </div>
          {payload[0]?.payload?.precipitation > 0 && (
            <div className="flex items-center justify-between gap-4 text-sky-300 pt-1 border-t border-white/10">
              <span>Rain/Precip:</span>
              <span className="font-bold">{payload[0].payload.precipitation} mm</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="forecast-chart-container" className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">
              7-Day Temperature Forecast ({unitLabel})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider">
            Continuous Thermal Trajectory
          </p>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 bg-rose-500 rounded-full inline-block shadow-sm shadow-rose-500/50"></span>
            <span className="text-slate-300">Max Temp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 bg-blue-500 rounded-full inline-block shadow-sm shadow-blue-500/50"></span>
            <span className="text-slate-300">Min Temp</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="gradMax" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradMin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#ffffff15' }}
            />
            <YAxis
              unit={unitLabel}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="maxTemp"
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#gradMax)"
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#070b16' }}
              activeDot={{ r: 6, fill: '#ef4444', stroke: '#fee2e2', strokeWidth: 3 }}
              name="Max Temp"
            />
            <Area
              type="monotone"
              dataKey="minTemp"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#gradMin)"
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#070b16' }}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#dbeafe', strokeWidth: 3 }}
              name="Min Temp"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

