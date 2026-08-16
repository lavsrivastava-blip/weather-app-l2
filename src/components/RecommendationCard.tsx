import React from 'react';
import { WeatherRecommendation } from '../types';
import { Shirt, Compass, AlertTriangle, Sparkles } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: WeatherRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div id="weather-recommendations-card" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
            Intelligence Recommendation
          </h3>
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
          Live Advice
        </span>
      </div>

      <p className="text-slate-300 text-sm mb-4 leading-relaxed font-normal">
        {recommendation.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {/* Clothing Recommendation */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg shrink-0 mt-0.5">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Recommended Attire
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">
              {recommendation.clothing}
            </p>
          </div>
        </div>

        {/* Activity Recommendation */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Outdoor Activities
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">
              {recommendation.activity}
            </p>
          </div>
        </div>
      </div>

      {recommendation.advisory && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl p-3 flex items-center gap-2.5 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{recommendation.advisory}</span>
        </div>
      )}
    </div>
  );
};

