import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  IconButton,
  Collapse,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Filter, Loader2, RefreshCw, Search, ChevronDown, ChevronUp, Calendar, BarChart3, ChevronLeft, ChevronRight, CalendarCheck, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parse } from 'date-fns';
import TopNav from '@/components/TopNav';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import JobAnalyticsCharts from '@/components/JobAnalyticsCharts';

const ITEMS_PER_PAGE = 50;

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
  location: string; // City/State/Province/Country
}

type Order = 'asc' | 'desc';

const SHEET_ID = '1OUBXFK8WOfAccM1iDn59S8tkc6YBWocORuX5pCY3uT8';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const parseCSV = (csvText: string): JobData[] => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  const rows: JobData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= 14) {
      rows.push({
        date: values[0] || '',
        role: values[1] || '',
        term: values[2] || '',
        duties: values[3] || '',
        requiredExperience: values[4] || '',
        requiredSkills: values[5] || '',
        additionalRequirements: values[6] || '',
        comments: values[7] || '',
        workType: values[8] || '',
        company: values[9] || '',
        recruiterEmail: values[10] || '',
        recruiterPhone: values[11] || '',
        strategy: values[12] || '',
        earningEstimate: values[13] || '',
        location: values[14] || '', // New location column (index 14, column O)
      });
    }
  }
  
  return rows;
};

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try various date formats
  const formats = ['yyyy-MM-dd', 'yyyy-M-d', 'MM/dd/yyyy', 'M/d/yyyy', 'dd/MM/yyyy'];
  for (const fmt of formats) {
    try {
      const parsed = parse(dateStr, fmt, new Date());
      if (!isNaN(parsed.getTime())) return parsed;
    } catch {
      continue;
    }
  }
  
  // Fallback to native parsing
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

const columns: { id: keyof JobData; label: string; minWidth?: number; truncate?: number }[] = [
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: 'role', label: 'Role', minWidth: 150 },
  { id: 'location', label: 'Location', minWidth: 120 },
  { id: 'term', label: 'Term', minWidth: 80 },
  { id: 'duties', label: 'Duties', minWidth: 200, truncate: 150 },
  { id: 'requiredExperience', label: 'Required Experience', minWidth: 150 },
  { id: 'requiredSkills', label: 'Required Skills', minWidth: 150 },
  { id: 'additionalRequirements', label: 'Additional Requirements', minWidth: 150 },
  { id: 'comments', label: 'Comments', minWidth: 120, truncate: 150 },
  { id: 'workType', label: 'Remote/Hybrid/In-Person', minWidth: 120 },
  { id: 'company', label: 'Company', minWidth: 120 },
  { id: 'recruiterEmail', label: 'Recruiter Email', minWidth: 150 },
  { id: 'recruiterPhone', label: 'Recruiter Phone', minWidth: 120 },
  { id: 'strategy', label: 'Strategy', minWidth: 200 },
  { id: 'earningEstimate', label: 'Earning Estimate', minWidth: 150 },
];

// Expandable text component
const ExpandableText: React.FC<{ text: string; maxLength: number }> = ({ text, maxLength }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }
  
  return (
    <div>
      <span>{expanded ? text : text.substring(0, maxLength) + '...'}</span>
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-2 text-xs font-medium hover:underline"
        style={{ color: '#FFDD40' }}
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
};

// Calculate job age helper
const calculateJobAge = (dateStr: string): string => {
  const jobDate = parseDate(dateStr);
  if (!jobDate) return 'N/A';
  
  const today = new Date();
  const diffTime = today.getTime() - jobDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Future';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Job card component (used for both mobile and desktop)
const JobCard: React.FC<{ job: JobData; isDesktop?: boolean }> = ({ job, isDesktop = false }) => {
  const [expanded, setExpanded] = useState(true);
  const jobAge = calculateJobAge(job.date);

  return (
    <div 
      className={`volumetric-glass rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#FFDD40]/30 w-full ${isDesktop ? '' : 'mb-5'}`}
      style={{
        background: 'linear-gradient(145deg, rgba(20, 20, 30, 0.9), rgba(10, 10, 20, 0.95))',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: '#FFDD40' }}>
            {job.role}
          </h3>
          <p className="text-white font-semibold text-base md:text-lg mt-2">
            {job.company}
          </p>
          <div className="flex items-center gap-3 text-white/90 text-sm md:text-base mt-2">
            <span>{job.date}</span>
            <span className="px-2 py-0.5 rounded-full text-xs md:text-sm font-medium" style={{ backgroundColor: 'rgba(255, 221, 64, 0.2)', color: '#FFDD40' }}>
              {jobAge}
            </span>
            {job.location && (
              <>
                <span>•</span>
                <span className="truncate">{job.location}</span>
              </>
            )}
          </div>
        </div>
        <IconButton 
          size="medium" 
          onClick={() => setExpanded(!expanded)} 
          sx={{ 
            color: '#FFDD40',
            backgroundColor: 'rgba(255, 221, 64, 0.1)',
            '&:hover': { backgroundColor: 'rgba(255, 221, 64, 0.2)' }
          }}
        >
          {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </div>

      {/* Tags */}
      <div className="mt-4 flex gap-3 flex-wrap">
        <span className="px-4 py-1.5 text-sm md:text-base font-medium rounded-full" style={{ backgroundColor: 'rgba(255, 221, 64, 0.15)', color: '#FFDD40', border: '1px solid rgba(255, 221, 64, 0.3)' }}>
          {job.term}
        </span>
        <span className="px-4 py-1.5 text-sm md:text-base font-medium rounded-full" style={{ backgroundColor: 'rgba(255, 221, 64, 0.15)', color: '#FFDD40', border: '1px solid rgba(255, 221, 64, 0.3)' }}>
          {job.workType}
        </span>
        {job.earningEstimate && (
          <span className="px-4 py-1.5 text-sm md:text-base font-medium rounded-full" style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            {job.earningEstimate}
          </span>
        )}
      </div>

      {/* Preview (always visible) */}
      {job.duties && (
        <div className="mt-5">
          <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFDD40' }}>Duties</p>
          <p className="text-base md:text-lg text-white line-clamp-2">{job.duties}</p>
        </div>
      )}
      
      {/* Expanded Content */}
      <Collapse in={expanded}>
        <div className="mt-5 pt-5 border-t border-white/10 space-y-5">
          {job.requiredExperience && (
            <div>
              <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFDD40' }}>Required Experience</p>
              <p className="text-base md:text-lg text-white">{job.requiredExperience}</p>
            </div>
          )}
          {job.requiredSkills && (
            <div>
              <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFDD40' }}>Required Skills</p>
              <p className="text-base md:text-lg text-white">{job.requiredSkills}</p>
            </div>
          )}
          {job.additionalRequirements && (
            <div>
              <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFDD40' }}>Additional Requirements</p>
              <p className="text-base md:text-lg text-white">{job.additionalRequirements}</p>
            </div>
          )}
          {job.comments && (
            <div>
              <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFDD40' }}>Comments</p>
              <p className="text-base md:text-lg text-white">{job.comments}</p>
            </div>
          )}
          {job.strategy && (
            <div className="p-4 md:p-5 rounded-xl" style={{ backgroundColor: 'rgba(255, 221, 64, 0.08)', border: '1px solid rgba(255, 221, 64, 0.2)' }}>
              <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFDD40' }}>Strategy</p>
              <p className="text-base md:text-lg text-white">{job.strategy}</p>
            </div>
          )}
          {(job.recruiterEmail || job.recruiterPhone) && (
            <div className="pt-3 border-t border-white/10">
              <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-3" style={{ color: '#FFDD40' }}>Recruiter Contact</p>
              <div className="flex flex-wrap gap-4 text-base md:text-lg">
                {job.recruiterEmail && (
                  <a href={`mailto:${job.recruiterEmail}`} className="text-white hover:text-[#FFDD40] transition-colors">
                    {job.recruiterEmail}
                  </a>
                )}
                {job.recruiterPhone && (
                  <span className="text-white">{job.recruiterPhone}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
};

// Date Range Picker Component
const DateRangePicker: React.FC<{
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartChange: (date: Date | undefined) => void;
  onEndChange: (date: Date | undefined) => void;
}> = ({ startDate, endDate, onStartChange, onEndChange }) => {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal bg-gray-900 border-white/20 hover:bg-gray-800 hover:border-[#FFDD40]/50 text-white",
              !startDate && "text-white/60"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-900 border border-white/20 z-[100]" align="start">
          <CalendarComponent
            mode="single"
            selected={startDate}
            onSelect={onStartChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <span className="text-white/60">to</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal bg-gray-900 border-white/20 hover:bg-gray-800 hover:border-[#FFDD40]/50 text-white",
              !endDate && "text-white/60"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-900 border border-white/20 z-[100]" align="start">
          <CalendarComponent
            mode="single"
            selected={endDate}
            onSelect={onEndChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const JobAlertsPage: React.FC = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof JobData>('date');
  const [order, setOrder] = useState<Order>('desc');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth(new Date()));
  const [showFilters, setShowFilters] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStrategyModal, setShowStrategyModal] = useState(false);

  // Role categorization helper
  const categorizeRole = (role: string): string => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('fintech') || roleLower.includes('finance') || roleLower.includes('financial')) return 'FinTech';
    if (roleLower.includes('bi') || roleLower.includes('business intelligence') || roleLower.includes('data') || roleLower.includes('analytics')) return 'BI/Data';
    if (roleLower.includes('ai') || roleLower.includes('artificial') || roleLower.includes('machine learning') || roleLower.includes('ml')) return 'AI/ML';
    if (roleLower.includes('pm') || roleLower.includes('project manager') || roleLower.includes('product manager') || roleLower.includes('program')) return 'PM';
    return 'Other';
  };

  // Chart click handlers
  const handleRoleFilterClick = (roleType: string) => {
    setSelectedRoleType(roleType);
  };

  const handleCountryFilterClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleDateRangeClick = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const isMobile = useMediaQuery('(max-width:768px)');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(CSV_URL + '&t=' + Date.now());
      if (!response.ok) throw new Error('Failed to fetch data');
      const csvText = await response.text();
      console.log('CSV Response:', csvText);
      const parsedData = parseCSV(csvText);
      console.log('Parsed data:', parsedData);
      setData(parsedData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load job data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (property: keyof JobData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Extract unique locations from data
  const { countries, locations } = useMemo(() => {
    const countrySet = new Set<string>();
    const locationSet = new Set<string>();
    
    data.forEach(job => {
      if (job.location) {
        locationSet.add(job.location);
        // Try to extract country (assume last part after comma is country)
        const parts = job.location.split(',').map(p => p.trim());
        const lastPart = parts[parts.length - 1]?.toUpperCase();
        if (lastPart === 'CANADA' || lastPart === 'CA' || lastPart === 'CAN') {
          countrySet.add('Canada');
        } else if (lastPart === 'USA' || lastPart === 'US' || lastPart === 'UNITED STATES') {
          countrySet.add('USA');
        } else if (parts.length > 0) {
          countrySet.add(parts[parts.length - 1]);
        }
      }
    });
    
    return {
      countries: Array.from(countrySet).sort(),
      locations: Array.from(locationSet).sort()
    };
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];
    
    // Search filter (Role, Duties, Company)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(row => 
        row.role.toLowerCase().includes(query) ||
        row.duties.toLowerCase().includes(query) ||
        row.company.toLowerCase().includes(query)
      );
    }
    
    // Role type filter (from chart click)
    if (selectedRoleType !== 'all') {
      filtered = filtered.filter(row => categorizeRole(row.role) === selectedRoleType);
    }
    
    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(row => {
        const loc = row.location?.toUpperCase() || '';
        if (selectedCountry === 'Canada') {
          return loc.includes('CANADA') || loc.includes(', CA') || loc.endsWith(' CA');
        } else if (selectedCountry === 'USA') {
          return loc.includes('USA') || loc.includes('UNITED STATES') || loc.includes(', US') || loc.endsWith(' US');
        }
        return loc.includes(selectedCountry.toUpperCase());
      });
    }
    
    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(row => row.location === selectedLocation);
    }
    
    // Date range filter
    if (startDate || endDate) {
      filtered = filtered.filter(row => {
        const jobDate = parseDate(row.date);
        if (!jobDate) return true; // Include jobs without valid dates
        
        if (startDate && endDate) {
          return isWithinInterval(jobDate, { start: startDate, end: endDate });
        } else if (startDate) {
          return jobDate >= startDate;
        } else if (endDate) {
          return jobDate <= endDate;
        }
        return true;
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      
      if (orderBy === 'date') {
        const dateA = parseDate(aValue)?.getTime() || 0;
        const dateB = parseDate(bValue)?.getTime() || 0;
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      return order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    return filtered;
  }, [data, orderBy, order, searchQuery, selectedRoleType, selectedCountry, selectedLocation, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedData, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRoleType, selectedCountry, selectedLocation, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRoleType('all');
    setSelectedCountry('all');
    setSelectedLocation('all');
    setStartDate(startOfMonth(new Date()));
    setEndDate(endOfMonth(new Date()));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      <TopNav />
      
      <main className="flex-1 px-4 md:px-6 pb-6 pt-24">
        {/* Header Section */}
        <div className="volumetric-glass rounded-3xl p-6 md:p-10 mb-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#FFDD40' }}>
            Deadly Job Alerts: BI-FinTech / AI Deployment PM Consulting Gigs
          </h1>
          <p className="text-white text-lg md:text-xl mb-3">
            Curated consulting opportunities with strategy insights on how the BI-FinTech Accelerator bridges skill gaps.
          </p>
          <p className="text-base md:text-lg mb-6" style={{ color: '#FFDD40' }}>
            Only recruiter-sourced gigs shown. AI-parsed for AI/BI-FinTech PM fits.
          </p>
          
          {/* Toggle Buttons Row */}
          <div className="flex gap-4 flex-wrap mb-4">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#00d4ff' }}
            >
              <BarChart3 className="w-4 h-4" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              {showAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#FFDD40' }}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Active Role Filter Indicator */}
          {selectedRoleType !== 'all' && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtered by role:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(255, 221, 64, 0.2)', color: '#FFDD40' }}>
                {selectedRoleType}
              </span>
              <button
                onClick={() => setSelectedRoleType('all')}
                className="text-xs text-muted-foreground hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
          
          {/* Filters Section */}
          {showFilters ? (
            <div 
              className="space-y-4 cursor-pointer"
              onClick={(e) => {
                // Only collapse if clicking on the container background, not on interactive elements
                const target = e.target as HTMLElement;
                const isInteractive = target.closest('input, select, button, a, [role="button"]');
                if (!isInteractive) {
                  setShowFilters(false);
                }
              }}
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by Role, Duties, or Company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFDD40]/50 transition-colors"
                />
              </div>
              
              {/* Filter Row */}
              <div className="flex gap-3 flex-wrap items-center">
                {/* Country Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-gray-900 border border-white/20 text-white focus:outline-none focus:border-[#FFDD40]/50 transition-colors min-w-[120px] cursor-pointer"
                  >
                    <option value="all" className="bg-gray-900 text-white">All Countries</option>
                    <option value="Canada" className="bg-gray-900 text-white">Canada</option>
                    <option value="USA" className="bg-gray-900 text-white">USA</option>
                    {countries.filter(c => c !== 'Canada' && c !== 'USA').map(country => (
                      <option key={country} value={country} className="bg-gray-900 text-white">{country}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60">City/State</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-gray-900 border border-white/20 text-white focus:outline-none focus:border-[#FFDD40]/50 transition-colors min-w-[150px] cursor-pointer"
                  >
                    <option value="all" className="bg-gray-900 text-white">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc} className="bg-gray-900 text-white">{loc}</option>
                    ))}
                  </select>
                </div>
                
                {/* Date Range */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Date Range</label>
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                  />
                </div>
              </div>
              
              {/* Action Row */}
              <div className="flex gap-3 flex-wrap items-center justify-between">
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => fetchData()}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground hover:border-[#FFDD40]/50 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground hover:border-[#FFDD40]/50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
                <span className="text-muted-foreground text-sm">
                  {filteredAndSortedData.length} job{filteredAndSortedData.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          ) : (
            <div 
              className="volumetric-glass-inner rounded-2xl p-4 cursor-pointer hover:border-[#FFDD40]/50 transition-all mt-4"
              onClick={() => setShowFilters(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5" style={{ color: '#FFDD40' }} />
                  <span className="text-sm font-medium" style={{ color: '#FFDD40' }}>
                    Filters & Search
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (Click to expand)
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" style={{ color: '#FFDD40' }} />
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowStrategyModal(true)}
              className="px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 100, 200, 0.8), rgba(0, 150, 255, 0.6))',
                boxShadow: '0 0 30px rgba(0, 150, 255, 0.5), 0 0 60px rgba(0, 150, 255, 0.3)',
                border: '1px solid rgba(0, 150, 255, 0.4)',
              }}
            >
              <CalendarCheck className="inline-block w-5 h-5 mr-2" />
              Book Free 45-Min Strategy Session
            </button>
            <p className="text-sm mt-2" style={{ color: '#FFDD40' }}>
              Let's map your career pivot and explore tailored training paths to land these roles — one-on-one with me
            </p>
          </div>
        </div>

        {/* Strategy Session Modal */}
        <Dialog open={showStrategyModal} onOpenChange={setShowStrategyModal}>
          <DialogContent className="volumetric-glass border-[#00d4ff]/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#FFDD40' }}>
                Discuss your AI-Proof Pivot: Certs, Tools, $10k/mo Gigs
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-muted-foreground">
                Book a free 45-minute strategy session to discuss your career pivot, certification paths, and how to land these high-paying consulting gigs.
              </p>
              <a
                href="https://calendly.com/hassankhalidkhan"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 rounded-xl font-bold text-white text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 100, 200, 0.8), rgba(0, 150, 255, 0.6))',
                  boxShadow: '0 0 20px rgba(0, 150, 255, 0.4)',
                  border: '1px solid rgba(0, 150, 255, 0.4)',
                }}
              >
                <CalendarCheck className="inline-block w-5 h-5 mr-2" />
                Schedule on Calendly
              </a>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analytics Section */}
        {!loading && data.length > 0 && (
          <div className="mb-6">
            {showAnalytics ? (
              <div 
                className="cursor-pointer"
                onClick={(e) => {
                  // Only collapse if clicking on empty area, not on interactive chart elements
                  const target = e.target as HTMLElement;
                  const isInteractive = target.closest('canvas, button, a, [role="button"], .recharts-wrapper');
                  if (!isInteractive) {
                    setShowAnalytics(false);
                  }
                }}
              >
                <JobAnalyticsCharts
                  data={data}
                  onRoleFilterClick={handleRoleFilterClick}
                  onCountryFilterClick={handleCountryFilterClick}
                  onDateRangeClick={handleDateRangeClick}
                />
              </div>
            ) : (
              <div 
                className="volumetric-glass rounded-2xl p-4 cursor-pointer hover:border-[#00d4ff]/50 transition-all"
                onClick={() => setShowAnalytics(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" style={{ color: '#00d4ff' }} />
                    <span className="text-sm font-medium" style={{ color: '#00d4ff' }}>
                      Analytics Dashboard
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (Click to expand)
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: '#00d4ff' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="volumetric-glass rounded-3xl p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : isMobile ? (
          // Mobile view - cards
          <div>
            {filteredAndSortedData.length === 0 ? (
              <div className="volumetric-glass rounded-3xl p-8 text-center">
                <p className="text-muted-foreground">No jobs found for the selected filters.</p>
              </div>
            ) : (
              <>
                {paginatedData.map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
                {/* Pagination for Mobile */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6 mb-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Desktop view - cards grid
          <div>
            {filteredAndSortedData.length === 0 ? (
              <div className="volumetric-glass rounded-3xl p-8 text-center">
                <p className="text-muted-foreground">No jobs found for the selected filters.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6">
                  {paginatedData.map((job, index) => (
                    <JobCard key={index} job={job} isDesktop />
                  ))}
                </div>
                {/* Pagination for Desktop */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                              currentPage === pageNum
                                ? 'text-black'
                                : 'bg-white/5 border border-white/10 hover:border-[#FFDD40]/50'
                            }`}
                            style={currentPage === pageNum ? { backgroundColor: '#FFDD40' } : {}}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <span className="text-sm text-muted-foreground ml-2">
                      ({filteredAndSortedData.length} total)
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <footer className="glass-effect rounded-t-3xl mt-auto py-4 px-4">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} The Deadly Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default JobAlertsPage;
