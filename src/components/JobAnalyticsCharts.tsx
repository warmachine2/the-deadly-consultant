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
import { extractChartCountry } from '@/lib/countryUtils';
import { buildJobTimeline } from '@/lib/jobTimeline';

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
export const extractCountry = (location: string): string => {
  if (!location) return 'Unknown';
  return extractChartCountry(location);
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

  // Active weeks in the last 90 days; retain exact ranges for point clicks.
  const timelineData = useMemo(() => buildJobTimeline(data), [data]);

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
    labels: timelineData.map(bucket => bucket.label),
    datasets: [{
      label: 'Jobs Posted',
      data: timelineData.map(bucket => bucket.count),
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
        const bucket = timelineData[index];
        if (bucket) onDateRangeClick(bucket.startDate, bucket.endDate);
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
