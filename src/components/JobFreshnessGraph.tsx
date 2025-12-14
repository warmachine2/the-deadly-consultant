import React, { useMemo } from 'react';
import { parse } from 'date-fns';

interface JobFreshnessGraphProps {
  dateStr: string;
}

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const formats = ['yyyy-MM-dd', 'yyyy-M-d', 'MM/dd/yyyy', 'M/d/yyyy', 'dd/MM/yyyy'];
  for (const fmt of formats) {
    try {
      const parsed = parse(dateStr, fmt, new Date());
      if (!isNaN(parsed.getTime())) return parsed;
    } catch {
      continue;
    }
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

const JobFreshnessGraph: React.FC<JobFreshnessGraphProps> = ({ dateStr }) => {
  const { hoursAgo, status, percentage, statusLabel, statusColor, glowColor } = useMemo(() => {
    const jobDate = parseDate(dateStr);
    if (!jobDate) {
      return {
        hoursAgo: 0,
        status: 'unknown',
        percentage: 0,
        statusLabel: 'Unknown',
        statusColor: 'rgba(255, 255, 255, 0.5)',
        glowColor: 'rgba(255, 255, 255, 0.2)'
      };
    }

    const now = new Date();
    const diffMs = now.getTime() - jobDate.getTime();
    const diffHours = Math.max(0, diffMs / (1000 * 60 * 60));

    // Timeline: 0-24h = ideal, 24-48h = warning, 48h+ = stale
    // Max display is 72h (3 days) for the graph
    const maxHours = 72;
    const idealHours = 24;
    const warningHours = 48;

    const pct = Math.min((diffHours / maxHours) * 100, 100);

    let stat: 'hot' | 'ideal' | 'warning' | 'stale' | 'unknown';
    let label: string;
    let color: string;
    let glow: string;

    if (diffHours <= 6) {
      stat = 'hot';
      label = '🔥 HOT - Apply NOW!';
      color = '#ff4444';
      glow = 'rgba(255, 68, 68, 0.6)';
    } else if (diffHours <= idealHours) {
      stat = 'ideal';
      label = '✅ Ideal Window';
      color = '#4ade80';
      glow = 'rgba(74, 222, 128, 0.5)';
    } else if (diffHours <= warningHours) {
      stat = 'warning';
      label = '⚠️ Apply Fast';
      color = '#FFDD40';
      glow = 'rgba(255, 221, 64, 0.5)';
    } else {
      stat = 'stale';
      label = '❌ Likely Filled';
      color = '#ef4444';
      glow = 'rgba(239, 68, 68, 0.4)';
    }

    return {
      hoursAgo: Math.round(diffHours),
      status: stat,
      percentage: pct,
      statusLabel: label,
      statusColor: color,
      glowColor: glow
    };
  }, [dateStr]);

  // Calculate marker positions
  const idealMarkerPos = (24 / 72) * 100; // 33.33%
  const warningMarkerPos = (48 / 72) * 100; // 66.67%

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      {/* Container for centered, shortened graph */}
      <div className="w-1/4 min-w-[180px]">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${statusColor}20`,
              color: statusColor,
              boxShadow: `0 0 8px ${glowColor}`
            }}
          >
            {statusLabel}
          </span>
          <span className="text-[10px] text-white/60">
            {hoursAgo}h ago
          </span>
        </div>

        {/* Timeline Graph */}
        <div className="relative h-6 rounded-md overflow-hidden" style={{
          background: 'linear-gradient(90deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.15) 33.33%, rgba(255, 221, 64, 0.15) 33.33%, rgba(255, 221, 64, 0.15) 66.67%, rgba(239, 68, 68, 0.15) 66.67%, rgba(239, 68, 68, 0.15) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Zone Labels */}
          <div className="absolute inset-0 flex text-[8px] font-medium">
            <div className="flex-1 flex items-center justify-center text-[#4ade80]/80">
              Ideal
            </div>
            <div className="flex-1 flex items-center justify-center text-[#FFDD40]/80">
              Hurry
            </div>
            <div className="flex-1 flex items-center justify-center text-[#ef4444]/80">
              Stale
            </div>
          </div>

          {/* Progress Fill */}
          <div 
            className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background: status === 'hot' 
                ? 'linear-gradient(90deg, rgba(255, 68, 68, 0.4), rgba(255, 68, 68, 0.6))'
                : status === 'ideal'
                ? 'linear-gradient(90deg, rgba(74, 222, 128, 0.3), rgba(74, 222, 128, 0.5))'
                : status === 'warning'
                ? 'linear-gradient(90deg, rgba(74, 222, 128, 0.3) 0%, rgba(255, 221, 64, 0.5) 100%)'
                : 'linear-gradient(90deg, rgba(74, 222, 128, 0.3) 0%, rgba(255, 221, 64, 0.4) 50%, rgba(239, 68, 68, 0.5) 100%)',
              borderRight: `2px solid ${statusColor}`,
              boxShadow: `0 0 8px ${glowColor}`
            }}
          />

          {/* Current Position Indicator */}
          <div 
            className="absolute top-0 h-full w-0.5 transition-all duration-500"
            style={{ 
              left: `${Math.min(percentage, 99)}%`,
              background: statusColor,
              boxShadow: `0 0 6px ${glowColor}, 0 0 12px ${glowColor}`
            }}
          >
            {/* Pulse dot */}
            <div 
              className="absolute -top-0.5 -left-1 w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${glowColor}`
              }}
            />
          </div>

          {/* 24h Marker */}
          <div 
            className="absolute top-0 h-full w-px"
            style={{ 
              left: `${idealMarkerPos}%`,
              background: 'rgba(255, 255, 255, 0.3)'
            }}
          />

          {/* 48h Marker */}
          <div 
            className="absolute top-0 h-full w-px"
            style={{ 
              left: `${warningMarkerPos}%`,
              background: 'rgba(255, 255, 255, 0.3)'
            }}
          />
        </div>

        {/* Time Labels */}
        <div className="flex justify-between mt-1 text-[8px] text-white/40">
          <span>0h</span>
          <span>24h</span>
          <span>48h</span>
          <span>72h+</span>
        </div>
      </div>
    </div>
  );
};

export default JobFreshnessGraph;
