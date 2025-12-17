import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useMediaQuery } from '@mui/material';
import { format, parse } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface JobData {
  date: string;
  role: string;
  term: string;
  duties: string;
  requiredExperience: string;
  requiredSkills: string;
  additionalRequirements: string;
  comments: string;
  workType: string;
  company: string;
  recruiterEmail: string;
  recruiterPhone: string;
  strategy: string;
  earningEstimate: string;
  location: string;
}

interface JobAnalyticsChartsProps {
  data: JobData[];
  onRoleFilterClick: (role: string) => void;
  onCountryFilterClick: (country: string) => void;
  onDateRangeClick: (startDate: Date, endDate: Date) => void;
}

// Parse date helper
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const formats = ['yyyy-MM-dd', 'yyyy-M-d', 'MM/dd/yyyy', 'M/d/yyyy'];
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

// Auto-categorize role into PM, BI, FinTech, AI, or Other
const categorizeRole = (role: string): string => {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('fintech') || roleLower.includes('finance') || roleLower.includes('financial')) {
    return 'FinTech';
  }
  if (roleLower.includes('bi') || roleLower.includes('business intelligence') || roleLower.includes('data') || roleLower.includes('analytics')) {
    return 'BI/Data';
  }
  if (roleLower.includes('ai') || roleLower.includes('artificial') || roleLower.includes('machine learning') || roleLower.includes('ml')) {
    return 'AI/ML';
  }
  if (roleLower.includes('pm') || roleLower.includes('project manager') || roleLower.includes('product manager') || roleLower.includes('program')) {
    return 'PM';
  }
  return 'Other';
};

// Extract country from location
const extractCountry = (location: string): string => {
  if (!location) return 'Unknown';
  const loc = location.toUpperCase();
  if (loc.includes('CANADA') || loc.includes(', CA') || loc.endsWith(' CA')) {
    return 'Canada';
  }
  if (loc.includes('USA') || loc.includes('UNITED STATES') || loc.includes(', US') || loc.endsWith(' US')) {
    return 'USA';
  }
  return 'Other';
};

const chartColors = {
  pm: 'rgba(255, 221, 64, 0.8)',
  bi: 'rgba(0, 212, 255, 0.8)',
  fintech: 'rgba(139, 92, 246, 0.8)',
  ai: 'rgba(34, 197, 94, 0.8)',
  other: 'rgba(156, 163, 175, 0.8)',
  canada: 'rgba(220, 38, 38, 0.8)',
  usa: 'rgba(59, 130, 246, 0.8)',
};

const JobAnalyticsCharts: React.FC<JobAnalyticsChartsProps> = ({
  data,
  onRoleFilterClick,
  onCountryFilterClick,
  onDateRangeClick,
}) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  // Role Type distribution
  const roleData = useMemo(() => {
    const categories: Record<string, number> = { PM: 0, 'BI/Data': 0, FinTech: 0, 'AI/ML': 0, Other: 0 };
    data.forEach(job => {
      const category = categorizeRole(job.role);
      categories[category]++;
    });
    return categories;
  }, [data]);

  // Country distribution
  const countryData = useMemo(() => {
    const countries: Record<string, number> = { Canada: 0, USA: 0, Other: 0 };
    data.forEach(job => {
      const country = extractCountry(job.location);
      countries[country]++;
    });
    return countries;
  }, [data]);

  // Jobs over time (by month)
  const timelineData = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    data.forEach(job => {
      const date = parseDate(job.date);
      if (date) {
        const monthKey = format(date, 'MMM yyyy');
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });
    
    // Sort by date
    const sortedEntries = Object.entries(monthCounts).sort((a, b) => {
      const dateA = parse(a[0], 'MMM yyyy', new Date());
      const dateB = parse(b[0], 'MMM yyyy', new Date());
      return dateA.getTime() - dateB.getTime();
    });
    
    return {
      labels: sortedEntries.map(([label]) => label),
      counts: sortedEntries.map(([, count]) => count),
    };
  }, [data]);

  // Pie chart config (Role Types)
  const pieChartData = {
    labels: Object.keys(roleData),
    datasets: [{
      data: Object.values(roleData),
      backgroundColor: [
        chartColors.pm,
        chartColors.bi,
        chartColors.fintech,
        chartColors.ai,
        chartColors.other,
      ],
      borderColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: 2,
    }],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 12,
          font: { size: isMobile ? 10 : 12 },
        },
      },
      title: {
        display: true,
        text: 'Jobs by Role Type',
        color: '#FFDD40',
        font: { size: isMobile ? 14 : 16, weight: 'bold' as const },
      },
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const roleType = Object.keys(roleData)[index];
        onRoleFilterClick(roleType);
      }
    },
  };

  // Bar chart config (Country)
  const barChartData = {
    labels: Object.keys(countryData).filter(c => countryData[c] > 0),
    datasets: [{
      label: 'Jobs',
      data: Object.keys(countryData).filter(c => countryData[c] > 0).map(c => countryData[c]),
      backgroundColor: [chartColors.canada, chartColors.usa, chartColors.other],
      borderColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Jobs by Country',
        color: '#FFDD40',
        font: { size: isMobile ? 14 : 16, weight: 'bold' as const },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'rgba(255, 255, 255, 0.6)', stepSize: 1 },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.8)' },
        grid: { display: false },
      },
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const visibleCountries = Object.keys(countryData).filter(c => countryData[c] > 0);
        const country = visibleCountries[index];
        onCountryFilterClick(country);
      }
    },
  };

  // Line chart config (Timeline)
  const lineChartData = {
    labels: timelineData.labels,
    datasets: [{
      label: 'Jobs Posted',
      data: timelineData.counts,
      borderColor: 'rgba(0, 212, 255, 1)',
      backgroundColor: 'rgba(0, 212, 255, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#FFDD40',
      pointBorderColor: '#FFDD40',
      pointRadius: 5,
      pointHoverRadius: 8,
    }],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Jobs Over Time',
        color: '#FFDD40',
        font: { size: isMobile ? 14 : 16, weight: 'bold' as const },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'rgba(255, 255, 255, 0.6)', stepSize: 1 },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.8)', maxRotation: 45 },
        grid: { display: false },
      },
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const monthLabel = timelineData.labels[index];
        const date = parse(monthLabel, 'MMM yyyy', new Date());
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        onDateRangeClick(startOfMonth, endOfMonth);
      }
    },
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="volumetric-glass rounded-3xl p-4 md:p-6 mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#FFDD40' }}>
        Job Analytics
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Click on chart elements to filter the table below.
      </p>
      
      {/* Desktop Layout - 3 columns */}
      {!isMobile ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="h-[280px] p-3 rounded-2xl bg-white/5">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="h-[280px] p-3 rounded-2xl bg-white/5">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="h-[280px] p-3 rounded-2xl bg-white/5">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      ) : (
        /* Mobile Layout - stacked */
        <div className="space-y-4">
          <div className="h-[240px] p-3 rounded-2xl bg-white/5">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="h-[200px] p-3 rounded-2xl bg-white/5">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="h-[200px] p-3 rounded-2xl bg-white/5">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold" style={{ color: '#FFDD40' }}>{data.length}</div>
          <div className="text-xs text-muted-foreground">Total Jobs</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold" style={{ color: '#00d4ff' }}>{countryData.Canada}</div>
          <div className="text-xs text-muted-foreground">Canada</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{countryData.USA}</div>
          <div className="text-xs text-muted-foreground">USA</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{Object.keys(roleData).filter(k => roleData[k] > 0).length}</div>
          <div className="text-xs text-muted-foreground">Role Types</div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalyticsCharts;
