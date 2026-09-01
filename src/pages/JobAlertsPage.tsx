import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table as MuiTable, TableBody as MuiTableBody, TableCell as MuiTableCell, TableContainer, TableHead as MuiTableHead, TableRow as MuiTableRow, TableSortLabel, Tooltip, IconButton, Collapse, useMediaQuery, Stack } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Filter, Loader2, RefreshCw, Search, ChevronDown, ChevronUp, Calendar, BarChart3, ChevronLeft, ChevronRight, CalendarCheck, X, Clock, Clock4, Clock8, Plane, Car, Home, DollarSign, LayoutGrid, TableIcon, Briefcase, Users, Play, Check, Globe, MapPin, Info, ArrowUpRight, Linkedin, Mail, Phone } from 'lucide-react';
import JobFreshnessGraph from '@/components/JobFreshnessGraph';
import NetworkHealthPanel from '@/components/NetworkHealthPanel';
import { format, startOfMonth, endOfMonth, isWithinInterval, parse } from 'date-fns';
import TopNav from '@/components/TopNav';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import JobAnalyticsCharts from '@/components/JobAnalyticsCharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import strategyGuideThumbnail from '@/assets/strategy-guide-thumbnail.jpg';
const siSystemsLogoUrl = '/si-systems-logo.jpg';
const provisoLogoUrl = '/proviso-logo.jpg';
const insightGlobalLogoUrl = '/insight-global-logo.jpg';
const procomLogoUrl = '/Procom_LOGO.png';
const agilusLogoUrl = '/Agilus_LOGO.png';
const ITEMS_PER_PAGE = 20;
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
  recruiterName?: string;
  recruiterLinkedIn?: string;
  strategy: string;
  earningEstimate: string;
  location: string; // City/State/Province/Country
  source?: string; // Source of the job (e.g., ProViso, Insight Global, etc.)
  companyInfo?: string[]; // Array of company info bullet points (optional)
  jobId?: string; // Job ID from the source data
  jobLink?: string; // Original job posting link
}
type Order = 'asc' | 'desc';
const SHEET_ID = '107YoIhvv0VYBWQXlvNNB4T98iw7POO_YRVJ633alVig';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// --- KAN-311: stale-while-revalidate cache ---
const JOB_CACHE_KEY = 'ztopm_job_alerts_cache_v1';
const readJobCache = (): JobData[] | null => {
  try {
    const raw = localStorage.getItem(JOB_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const jobs = Array.isArray(parsed) ? parsed : parsed?.jobs;
    return Array.isArray(jobs) && jobs.length > 0 ? (jobs as JobData[]) : null;
  } catch {
    return null;
  }
};
const writeJobCache = (jobs: JobData[]) => {
  try {
    localStorage.setItem(JOB_CACHE_KEY, JSON.stringify({ jobs, cachedAt: Date.now() }));
  } catch {
    /* quota or private mode — ignore */
  }
};

// Skeleton placeholder matching the Job Card shape for cold visits
const JobCardSkeleton: React.FC = () => (
  <div className="volumetric-glass rounded-2xl p-5 sm:p-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 mb-4">
      <div className="h-4 w-28 rounded bg-white/10" />
      <div className="justify-self-center h-9 w-40 rounded-full bg-white/10" />
      <div className="justify-self-end h-8 w-24 rounded-lg bg-white/10" />
    </div>
    <div className="h-7 w-3/4 rounded bg-[#FFDD40]/25 mb-3" />
    <div className="flex flex-wrap gap-2 mb-5">
      <div className="h-6 w-24 rounded-full bg-[#00d4ff]/20" />
      <div className="h-6 w-20 rounded-full bg-white/10" />
      <div className="h-6 w-28 rounded-full bg-white/10" />
      <div className="h-6 w-16 rounded-full bg-white/10" />
    </div>
    <div className="space-y-4">
      <div>
        <div className="h-4 w-32 rounded bg-[#FFDD40]/20 mb-2" />
        <div className="h-3 w-full rounded bg-white/10 mb-2" />
        <div className="h-3 w-11/12 rounded bg-white/10 mb-2" />
        <div className="h-3 w-9/12 rounded bg-white/10" />
      </div>
      <div>
        <div className="h-4 w-40 rounded bg-[#FFDD40]/20 mb-2" />
        <div className="h-3 w-10/12 rounded bg-white/10 mb-2" />
        <div className="h-3 w-8/12 rounded bg-white/10" />
      </div>
    </div>
    <div className="mt-6 flex items-center justify-between gap-3">
      <div className="h-10 w-44 rounded-xl bg-white/10" />
      <div className="h-10 w-32 rounded-xl bg-[#FFDD40]/20" />
    </div>
  </div>
);


// Canonical list of recruitment sources with descriptions
const sourceDescriptions: Record<string, string> = {
  "Hassan's recruiter Network": "Recruiters and headhunters from Hassan's network directly from his email. Live connections built over a ten-year span. Insider hidden jobs.",
  "Proviso": "Toronto-based IT staffing agency supporting technology and business teams across Canada's financial industry for 15+ years.",
  "Insight Global": "Global staffing and professional services agency founded in 2001, specializing in IT, healthcare, finance, and engineering talent.",
  "S.i. Systems": "Canada's largest IT staffing agency offering contract and direct hire staffing since 1994, connecting top employers with IT talent.",
  "NTT Data": "Global IT services and consulting leader providing technology and business solutions, staffing, and outsourcing services.",
  "Agilus Work Solutions": "Canadian recruitment and staffing firm specializing in temporary, contract, and permanent placements across industries.",
  "Tundra Technical Solutions": "Canadian IT staffing and recruitment agency connecting organizations with technology professionals nationwide.",
  "Procom": "Canada's leading IT staffing and consulting services firm, providing technology talent and workforce solutions.",
  "Nerdy Hire": "Niche tech recruitment platform focused on connecting companies with specialized IT and engineering talent.",
  "HR Brain": "HR and talent solutions provider specializing in recruitment, staffing, and workforce consulting services.",
  "Axelon Services Corporation": "Global staffing and consulting firm delivering IT, finance, and healthcare workforce solutions since 1973.",
  "GTT": "Global staffing and consulting firm specializing in technology, engineering, and professional services placements.",
  "Soho Square Solutions": "Financial services staffing and consulting firm connecting top talent with banks, fintechs, and investment firms.",
};

// Map observed data-source spellings to the canonical source names above
const sourceNameMap: Record<string, string> = {
  "ProViso": "Proviso",
  "Agilus": "Agilus Work Solutions",
  "Agilus (Canada)": "Agilus Work Solutions",
  "SI Systems": "S.i. Systems",
  "S.i. Systems": "S.i. Systems",
  "Nerdyhire": "Nerdy Hire",
  "Nerdy Hire": "Nerdy Hire",
  "Tundra Technical": "Tundra Technical Solutions",
  "Tundra Technical Solutions": "Tundra Technical Solutions",
};

// Case-insensitive, trimmed alias lookup so variants never appear as separate sources
const sourceAliasLookup: Record<string, string> = Object.fromEntries(
  Object.entries(sourceNameMap).map(([alias, canonical]) => [alias.trim().toLowerCase(), canonical])
);

const normalizeSourceName = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return sourceAliasLookup[trimmed.toLowerCase()] || trimmed;
};

// Frontend display labels for sources (does not affect underlying data values)
const sourceDisplayNames: Record<string, string> = {
  "Hassan's recruiter Network": "Hassan's Recruiter Network",
  "Agilus Work Solutions": "Agilus",
};

const getSourceDisplayName = (source: string): string => sourceDisplayNames[source] || source;

// Normalize raw work-type strings to clean badges: Remote / Hybrid / On-site (or null = no chip)
const normalizeWorkMode = (workType: string): 'Remote' | 'Hybrid' | 'On-site' | null => {
  const lower = (workType || '').toLowerCase().trim();
  if (!lower) return null;
  if (lower === 'true' || lower.includes('remote')) return 'Remote';
  if (lower.includes('hybrid')) return 'Hybrid';
  if (lower === 'false' || lower.includes('on-site') || lower.includes('onsite') || lower.includes('in-person') || lower.includes('in person') || lower.includes('in-office')) return 'On-site';
  return null;
};

// Convert hourly earnings strings to monthly equivalents (hourly * 1.14 * 160).
// Monthly strings (with /mo or /month) are preserved as-is. Keeps CAD/USD and *Est. from the raw string.
const formatEarningsMonthly = (raw: string): string => {
  if (!raw || !raw.trim()) return '';
  const str = raw.trim();
  const isMonthly = /\/\s*(mo|month)\b/i.test(str);
  const isHourly = /\/\s*(hr|hour|h)\b/i.test(str);
  if (isMonthly || !isHourly) return str;
  const currency = /\bCAD\b/i.test(str) ? 'CAD' : /\bUSD\b/i.test(str) ? 'USD' : '';
  const hasEst = /\*\s*Est\.?/i.test(str);
  const numbers = str.match(/\$?\s*([\d,]+(?:\.\d+)?)/g) || [];
  const converted = numbers
    .map(n => {
      const v = parseFloat(n.replace(/[^0-9.]/g, ''));
      if (!isFinite(v) || v <= 0) return null;
      return '$' + Math.round(v * 1.14 * 160).toLocaleString('en-US');
    })
    .filter((s): s is string => s !== null);
  if (converted.length === 0) return str;
  let out = converted.join(' - ') + '/mo';
  if (currency) out += ' ' + currency;
  if (hasEst) out += ' *Est.';
  return out;
};

// First numeric amount of the (possibly converted) monthly earnings string, for filtering/ratings
const getMonthlyAmount = (raw: string): number => {
  const formatted = formatEarningsMonthly(raw);
  const m = formatted.match(/([\d,]+(?:\.\d+)?)/);
  return m ? Math.round(parseFloat(m[1].replace(/,/g, ''))) : 0;
};

// Map known cities to filter labels from the work-type/location description string
const extractCity = (workType: string): string => {
  const wt = workType.trim();
  if (!wt) return 'Unknown';
  const lower = wt.toLowerCase();

  // Remote-only roles
  if (lower === 'true' || (lower.includes('remote') && !lower.includes('onsite') && !lower.includes('in-office') && !lower.includes('in person') && !lower.includes('in-person'))) {
    return 'Remote';
  }

  // Canadian cities (listed in user request + common Ontario cities)
  if (lower.includes('mississauga')) return 'Mississauga';
  if (lower.includes('toronto')) return 'Toronto';
  if (lower.includes('vancouver')) return 'Vancouver';
  if (lower.includes('calgary')) return 'Calgary';
  if (lower.includes('winnipeg')) return 'Winnipeg';
  if (lower.includes('ottawa')) return 'Ottawa';
  if (lower.includes('montreal')) return 'Montreal';
  if (lower.includes('brampton')) return 'Brampton';
  if (lower.includes('hamilton')) return 'Hamilton';
  if (lower.includes('london')) return 'London';
  if (lower.includes('canada')) return 'Canada';

  // US cities (common in the data)
  if (lower.includes('jersey city')) return 'Jersey City';
  if (lower.includes('white plains')) return 'White Plains';
  if (lower.includes('new york city')) return 'New York';
  if (lower.includes('new york')) return 'New York';
  if (lower.includes('charlotte')) return 'Charlotte';
  if (lower.includes('boston')) return 'Boston';
  if (lower.includes('harrisburg')) return 'Harrisburg';
  if (lower.includes('buffalo')) return 'Buffalo';
  if (lower.includes('columbia')) return 'Columbia';
  if (lower.includes('jackson')) return 'Jackson';
  if (lower.includes('miami')) return 'Miami';
  if (lower.includes('usa') || lower.includes('united states')) return 'USA';

  return 'Other';
};

// Parse Company Info JSON string to array
const parseCompanyInfo = (infoStr: string): string[] => {
  if (!infoStr) return [];
  try {
    // Try parsing as JSON array
    const parsed = JSON.parse(infoStr);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => typeof item === 'string' && item.trim());
    }
  } catch {
    // If not valid JSON, split by newlines or semicolons
    return infoStr.split(/[;\n]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const parseCSV = (csvText: string): JobData[] => {
  // Handle multi-line quoted fields properly
  const rows: JobData[] = [];
  const chars = csvText.split('');
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;
  let isFirstRow = true;
  let rowNumber = 0;
  
  const addRow = (row: string[]) => {
    rowNumber++;
    // Only require that there's at least a date and role (first 2 columns)
    if (row.length >= 2 && row[0] && row[1]) {
      rows.push({
        date: row[0] || '',
        role: row[1] || '',
        term: row[2] || '',
        duties: row[3] || '',
        requiredExperience: row[4] || '',
        requiredSkills: row[5] || '',
        additionalRequirements: row[6] || '',
        comments: row[7] || '',
        workType: row[8] || '',
        company: row[9] || '',
        recruiterEmail: row[10] || '',
        recruiterPhone: row[11] || '',
        recruiterName: row[20]?.trim() || '',
        recruiterLinkedIn: row[21]?.trim() || '',
        strategy: row[12] || '',
        earningEstimate: row[13] || '',
        location: row[14] || '',
        source: normalizeSourceName(row[17] || ''), // Sources is column 18 (index 17), normalized to canonical names (case-insensitive aliases)
        companyInfo: row[16] ? parseCompanyInfo(row[16]) : undefined,
        jobId: row[19]?.trim() || '', // Job ID is column 20 (index 19)
        jobLink: row[18]?.trim() || '' // Link is column 19 (index 18)
      });
      console.log(`Parsed row ${rowNumber}: ${row[1]} at ${row[9]}`);
    } else {
      console.log(`Skipped row ${rowNumber}: insufficient data`, row.slice(0, 3));
    }
  };

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r' && nextChar === '\n') && !inQuotes) {
      // End of row
      if (char === '\r') i++; // Skip \n in \r\n
      currentRow.push(currentField.trim());
      currentField = '';
      if (isFirstRow) {
        isFirstRow = false;
        console.log('CSV Header columns:', currentRow.length, currentRow);
      } else {
        addRow(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  // Handle last row if no trailing newline
  if (currentRow.length > 0 || currentField) {
    currentRow.push(currentField.trim());
    if (!isFirstRow) {
      addRow(currentRow);
    }
  }
  
  console.log(`Total rows parsed: ${rows.length}`);
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
const columns: {
  id: keyof JobData;
  label: string;
  minWidth?: number;
  truncate?: number;
}[] = [{
  id: 'date',
  label: 'Date',
  minWidth: 100
}, {
  id: 'role',
  label: 'Role',
  minWidth: 150
}, {
  id: 'location',
  label: 'Location',
  minWidth: 120
}, {
  id: 'term',
  label: 'Term',
  minWidth: 80
}, {
  id: 'duties',
  label: 'Duties',
  minWidth: 200,
  truncate: 150
}, {
  id: 'requiredExperience',
  label: 'Required Experience',
  minWidth: 150
}, {
  id: 'requiredSkills',
  label: 'Required Skills',
  minWidth: 150
}, {
  id: 'additionalRequirements',
  label: 'Additional Requirements',
  minWidth: 150
}, {
  id: 'comments',
  label: 'Comments',
  minWidth: 120,
  truncate: 150
}, {
  id: 'workType',
  label: 'Remote/Hybrid/In-Person',
  minWidth: 120
}, {
  id: 'company',
  label: 'Company',
  minWidth: 120
}, {
  id: 'recruiterEmail',
  label: 'Recruiter Email',
  minWidth: 150
}, {
  id: 'recruiterPhone',
  label: 'Recruiter Phone',
  minWidth: 120
}, {
  id: 'strategy',
  label: 'Strategy',
  minWidth: 200
}, {
  id: 'earningEstimate',
  label: 'Earning Estimate',
  minWidth: 150
}];

// Expandable text component
const ExpandableText: React.FC<{
  text: string;
  maxLength: number;
}> = ({
  text,
  maxLength
}) => {
  const [expanded, setExpanded] = useState(false);
  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }
  return <div>
      <span>{expanded ? text : text.substring(0, maxLength) + '...'}</span>
      <button onClick={() => setExpanded(!expanded)} className="ml-2 text-xs font-medium hover:underline" style={{
      color: '#FFDD40'
    }}>
        {expanded ? 'Show Less' : 'Read More'}
      </button>
    </div>;
};

// Duties text component with expandable full content
const DutiesText: React.FC<{
  text: string;
}> = ({ text }) => {
  const [expanded, setExpanded] = useState(true);
  const previewLength = 200;
  
  if (!text || text.length <= previewLength) {
    return <p className="text-lg md:text-xl text-white">{text}</p>;
  }
  
  return (
    <div>
      <p className="text-lg md:text-xl text-white">
        {expanded ? text : text.substring(0, previewLength) + '...'}
      </p>
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="mt-2 text-base font-medium hover:underline transition-colors"
        style={{ color: '#FFDD40' }}
      >
        {expanded ? '▲ Show Less' : '▼ Show More'}
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


// Strategy Video Expanded Player
const StrategyVideoPlayer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgba(244, 201, 3, 0.1), rgba(255, 227, 97, 0.05))',
      border: '1px solid rgba(244, 201, 3, 0.3)'
    }}>
      {/* Header with close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm md:text-base font-bold text-white">
          <span className="text-[#F4C903]">10k/mo+</span> AI / BI-FinTech PM Strategy Guide <span className="text-white/70">[12min]</span>
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/70 hover:text-white" />
        </button>
      </div>
      
      {/* Video Embed */}
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src="https://www.youtube.com/embed/ydWdjQYqoMc?autoplay=1"
          title="10k/mo+ AI / BI-FinTech PM Strategy Guide"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

// Source attribution badge shown on every job card
const SourceBadge: React.FC<{ source?: string; jobLink?: string }> = ({ source, jobLink }) => {
  if (!source) return null;
  const normalizedSource = source.trim();
  const isHassanEmail = /hassan|email/i.test(normalizedSource);
  const displayName = isHassanEmail ? "Hassan's Email" : getSourceDisplayName(normalizedSource);
  const hasLink = !isHassanEmail && jobLink;
  const isSiSystems = normalizedSource === "S.i. Systems";
  const isProviso = normalizedSource === "Proviso";
  const isInsightGlobal = normalizedSource === "Insight Global";
  const isProcom = normalizedSource === "Procom";
  const isAgilus = normalizedSource === "Agilus Work Solutions";

  const content = (
    <>
      {(isSiSystems || isProviso || isInsightGlobal || isProcom || isAgilus) && (
        <span className="h-8 w-auto flex items-center justify-center rounded overflow-hidden bg-white px-1">
          {isSiSystems && (
            <img src={siSystemsLogoUrl} alt="SI Systems" className="h-7 w-auto object-contain" />
          )}
          {isProviso && (
            <img src={provisoLogoUrl} alt="Proviso" className="h-7 w-auto object-contain" />
          )}
          {isInsightGlobal && (
            <img src={insightGlobalLogoUrl} alt="Insight Global" className="h-7 w-auto object-contain" />
          )}
          {isProcom && (
            <img src={procomLogoUrl} alt="Procom" className="h-7 w-auto object-contain" />
          )}
          {isAgilus && (
            <img src={agilusLogoUrl} alt="Agilus" className="h-7 w-auto object-contain" />
          )}
        </span>
      )}
      <span className="text-white">{displayName}</span>
      {hasLink && <ArrowUpRight className="w-3.5 h-3.5 text-white/60" />}
    </>
  );

  if (hasLink) {
    return (
      <a
        href={jobLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/15 w-fit mx-auto"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        {content}
      </a>
    );
  }

  return (
    <span className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium w-fit mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      {content}
    </span>
  );
};

// Job card component (used for both mobile and desktop)
const JobCard: React.FC<{
  job: JobData;
  isDesktop?: boolean;
}> = ({
  job,
  isDesktop = false
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { toast } = useToast();
  const jobAge = calculateJobAge(job.date);
  return <div className={`volumetric-glass rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#FFDD40]/30 w-full ${isDesktop ? '' : 'mb-5'}`} style={{
    background: 'linear-gradient(145deg, rgba(20, 20, 30, 0.9), rgba(10, 10, 20, 0.95))',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
  }}>
      {/* Mobile header: strictly stacked 3 rows (< md) */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Row 1: source badge / logo only */}
        <div className="flex items-center">
          <SourceBadge source={job.source} jobLink={job.jobLink} />
        </div>

        {/* Row 2: Book Session CTA + expand toggle */}
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center flex-1 min-w-0">
            <a href="/book-session" className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 desktop-hover-scale-105 whitespace-normal text-center leading-tight animate-subtle-glow" style={{
              background: 'linear-gradient(135deg, rgba(255, 221, 64, 0.2), rgba(255, 221, 64, 0.1))',
              border: '1px solid rgba(255, 221, 64, 0.5)',
              color: '#FFDD40'
            }}>
              <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Free 30-Min Strategy Session</span>
            </a>
            <span className="text-[10px] mt-1" style={{
              color: 'rgba(255, 255, 255, 0.5)'
            }}>Free</span>
          </div>
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{
            color: '#FFDD40',
            backgroundColor: 'rgba(255, 221, 64, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 221, 64, 0.2)'
            }
          }}>
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </div>

        {/* Row 3: title, company, meta */}
        <div className="min-w-0">
          <h3 className="text-[1.625rem] md:text-[2rem] font-bold leading-tight break-words" style={{
            color: '#FFDD40'
          }}>
            {job.role}
          </h3>
          <p className="text-white font-semibold text-xl md:text-2xl mt-2">
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-white/90 text-lg md:text-xl mt-3">
            <span className="whitespace-nowrap flex-shrink-0">{job.date}</span>
            <span className="px-2.5 py-0.5 whitespace-nowrap text-xs sm:text-sm md:text-lg font-medium rounded-full" style={{
              backgroundColor: 'rgba(255, 221, 64, 0.2)',
              color: '#FFDD40'
            }}>
              {jobAge}
            </span>
            {job.location && <>
              <span>•</span>
              <span className="truncate">{job.location}</span>
            </>}
            {job.jobId && job.jobId !== 'N/A' && job.jobId !== 'n/a' && <>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(job.jobId!);
                  toast({
                    title: "Job ID copied!",
                    duration: 1800,
                  });
                }}
                className="cursor-pointer hover:underline focus:outline-none"
              >
                <span className="md:hidden">Job ID </span>
                <span className="hidden md:inline">ID: </span>
                {job.jobId.substring(0, 8)}…
              </button>
            </>}
          </div>
        </div>
      </div>

      {/* Desktop header: 3-column grid (md and up) — unchanged */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-start gap-4">
        <div className="min-w-0">
          <h3 className="text-[1.625rem] md:text-[2rem] font-bold leading-tight break-words" style={{
            color: '#FFDD40'
          }}>
            {job.role}
          </h3>
          <p className="text-white font-semibold text-xl md:text-2xl mt-2">
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-white/90 text-lg md:text-xl mt-3">
            <span className="whitespace-nowrap flex-shrink-0">{job.date}</span>
            <span className="px-2.5 py-0.5 whitespace-nowrap text-xs sm:text-sm md:text-lg font-medium rounded-full" style={{
              backgroundColor: 'rgba(255, 221, 64, 0.2)',
              color: '#FFDD40'
            }}>
              {jobAge}
            </span>
            {job.location && <>
              <span>•</span>
              <span className="truncate">{job.location}</span>
            </>}
            {job.jobId && job.jobId !== 'N/A' && job.jobId !== 'n/a' && <>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(job.jobId!);
                  toast({
                    title: "Job ID copied!",
                    duration: 1800,
                  });
                }}
                className="cursor-pointer hover:underline focus:outline-none"
              >
                <span className="md:hidden">Job ID </span>
                <span className="hidden md:inline">ID: </span>
                {job.jobId.substring(0, 8)}…
              </button>
            </>}
          </div>
        </div>

        {/* Centered source badge aligned with the role title */}
        <div className="flex justify-center">
          <SourceBadge source={job.source} jobLink={job.jobLink} />
        </div>

        <div className="flex items-start gap-3 justify-end">
          {/* Mini CTA */}
          <div className="flex flex-col items-center">
            <a href="/book-session" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 desktop-hover-scale-105 whitespace-nowrap animate-subtle-glow" style={{
              background: 'linear-gradient(135deg, rgba(255, 221, 64, 0.2), rgba(255, 221, 64, 0.1))',
              border: '1px solid rgba(255, 221, 64, 0.5)',
              color: '#FFDD40'
            }}>
              <CalendarCheck className="w-3.5 h-3.5" />
              <span className="flex flex-col items-start leading-tight">
                <span>Free 30-Min Strategy Session</span>
              </span>
            </a>
            <span className="text-[10px] mt-1" style={{
              color: 'rgba(255, 255, 255, 0.5)'
            }}>Free</span>
          </div>
          <IconButton size="medium" onClick={() => setExpanded(!expanded)} sx={{
            color: '#FFDD40',
            backgroundColor: 'rgba(255, 221, 64, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 221, 64, 0.2)'
            }
          }}>
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </div>
      </div>


      {/* Company Info Banner - Centered below header */}
      {job.companyInfo && job.companyInfo.length > 0 && (
        <div className="mt-4 p-4 md:p-5 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 150, 180, 0.05))',
          border: '1px solid rgba(0, 212, 255, 0.25)',
          boxShadow: '0 4px 16px rgba(0, 212, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5" style={{ color: '#00d4ff' }} />
            <p className="text-lg font-semibold uppercase tracking-wider" style={{
              color: '#00d4ff'
            }}>About {job.company}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {job.companyInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#FFDD40' }} />
                <span className="text-lg text-white/90 leading-relaxed">{info}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="mt-4 flex gap-3 flex-wrap">
        <span className="px-4 py-2 text-lg md:text-xl font-medium rounded-full inline-flex items-center gap-2" style={{
        backgroundColor: 'rgba(0, 212, 255, 0.15)',
        color: '#00d4ff',
        border: '1px solid rgba(0, 212, 255, 0.3)'
      }}>
          {(() => {
            const termLower = job.term.toLowerCase();
            const hasYear = termLower.includes('year') || termLower.includes('12 month');
            const monthMatch = termLower.match(/(\d+)\s*month/);
            const months = monthMatch ? parseInt(monthMatch[1]) : (hasYear ? 12 : 0);
            if (months >= 12) return <Clock className="w-5 h-5" />;
            if (months >= 6) return <Clock8 className="w-5 h-5" />;
            return <Clock4 className="w-5 h-5" />;
          })()}
          {job.term}
        </span>
        {(() => {
          const workMode = normalizeWorkMode(job.workType);
          if (!workMode) return null;
          return (
            <span className="px-4 py-2 text-lg md:text-xl font-medium rounded-full inline-flex items-center gap-2" style={{
            backgroundColor: 'rgba(0, 212, 255, 0.15)',
            color: '#00d4ff',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
              {workMode === 'Remote' ? <Plane className="w-5 h-5" /> : workMode === 'Hybrid' ? <Home className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              {workMode}
            </span>
          );
        })()}
        {job.earningEstimate && <span className="px-4 py-2 text-lg md:text-xl font-medium rounded-full inline-flex items-center gap-2" style={{
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.3)'
      }}>
          {(() => {
            const amount = getMonthlyAmount(job.earningEstimate);
            const dollarCount = amount >= 18000 ? 3 : amount > 15000 ? 2 : 1;
            return (
              <span className="inline-flex" style={{ color: '#FFDD40' }}>
                {[...Array(dollarCount)].map((_, i) => <DollarSign key={i} className="w-4 h-4 -mx-0.5" />)}
              </span>
            );
          })()}
          {(() => {
            const formatted = formatEarningsMonthly(job.earningEstimate);
            const locationLower = job.location?.toLowerCase() || '';
            const fallbackCurrency = locationLower.includes('canada') || locationLower.includes('toronto') || locationLower.includes('vancouver') || locationLower.includes('montreal') || locationLower.includes('calgary') || locationLower.includes('ottawa') ? 'CAD' : 'USD';
            const hasCurrency = /\b(CAD|USD)\b/i.test(formatted);
            const hasEst = /\*\s*Est\.?/i.test(formatted);
            return (
              <>
                {formatted}
                {!hasCurrency && <span className="ml-1 text-base opacity-80">{fallbackCurrency}</span>}
                {!hasEst && <span className="ml-1 text-base opacity-80">*Est.</span>}
              </>
            );
          })()}
          </span>}
        
        {/* Strategy Video Tag Button */}
        <button 
          onClick={() => setIsVideoOpen(!isVideoOpen)}
          className="px-4 py-2 text-lg md:text-xl font-medium rounded-full inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            backgroundColor: isVideoOpen ? 'rgba(244, 201, 3, 0.25)' : 'rgba(244, 201, 3, 0.15)',
            color: '#F4C903',
            border: '1px solid rgba(244, 201, 3, 0.4)'
          }}
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #F4C903, #FFE361)',
              boxShadow: '0 0 8px rgba(244, 201, 3, 0.5)'
            }}
          >
            <Play className="w-3 h-3 text-black ml-0.5" fill="black" />
          </div>
          <span className="text-white group-hover:text-[#F4C903] transition-colors">
            <span className="hidden md:inline">Strategy Guide</span>
            <span className="md:hidden">Video</span>
          </span>
          <span className="text-white/60 text-base">[12m]</span>
        </button>
      </div>

      {/* Strategy Video Player - Shows when expanded */}
      {isVideoOpen && <StrategyVideoPlayer onClose={() => setIsVideoOpen(false)} />}

      {/* Job Freshness Timeline */}
      <JobFreshnessGraph dateStr={job.date} />

      {/* Preview (always visible) */}
      {job.duties && <div className="mt-5">
          <p className="text-lg md:text-xl font-semibold uppercase tracking-wider mb-2" style={{
        color: '#FFDD40'
      }}>Duties</p>
          <DutiesText text={job.duties} />
        </div>}
      
      {/* Expanded Content */}
      <Collapse in={expanded}>
        <div className="mt-5 pt-5 border-t border-white/10 space-y-5">
          {job.requiredExperience && <div>
              <p className="text-lg md:text-xl font-semibold uppercase tracking-wider mb-2" style={{
            color: '#00d4ff'
          }}>Required Experience</p>
              <p className="text-xl md:text-2xl text-white">{job.requiredExperience}</p>
            </div>}
          {job.requiredSkills && <div>
              <p className="text-lg md:text-xl font-semibold uppercase tracking-wider mb-2" style={{
            color: '#00d4ff'
          }}>Required Skills</p>
              <p className="text-xl md:text-2xl text-white">{job.requiredSkills}</p>
            </div>}
          {job.additionalRequirements && <div>
              <p className="text-lg md:text-xl font-semibold uppercase tracking-wider mb-2" style={{
            color: '#00d4ff'
          }}>Additional Requirements</p>
              <p className="text-xl md:text-2xl text-white">{job.additionalRequirements}</p>
            </div>}
          {job.comments && <div>
              <p className="text-lg md:text-xl font-semibold uppercase tracking-wider mb-2" style={{
            color: '#00d4ff'
          }}>Comments</p>
              <p className="text-xl md:text-2xl text-white">{job.comments}</p>
            </div>}
          
          {(job.recruiterName?.trim() || job.recruiterEmail?.trim() || job.recruiterPhone?.trim() || job.recruiterLinkedIn?.trim()) && <div className="pt-3 border-t border-white/10">
              <p className="text-lg md:text-xl font-semibold uppercase tracking-wider mb-3" style={{
            color: '#FFDD40'
          }}>Recruiter Contact</p>
              <div className="space-y-3">
                {job.recruiterName?.trim() && <p className="text-xl md:text-2xl font-semibold text-white">{job.recruiterName}</p>}
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  {job.recruiterEmail?.trim() && <a href={`mailto:${job.recruiterEmail}`} className="inline-flex items-center gap-2 text-lg md:text-xl text-white hover:text-[#00d4ff] transition-colors">
                      <Mail className="w-5 h-5 text-[#00d4ff]" />
                      {job.recruiterEmail}
                    </a>}
                  {job.recruiterPhone?.trim() && <a href={`tel:${job.recruiterPhone.replace(/[^0-9+\-]/g, '')}`} className="inline-flex items-center gap-2 text-lg md:text-xl text-white hover:text-[#00d4ff] transition-colors">
                      <Phone className="w-5 h-5 text-[#00d4ff]" />
                      {job.recruiterPhone}
                    </a>}
                  {job.recruiterLinkedIn?.trim() && job.recruiterLinkedIn.trim().toLowerCase() !== 'n/a' && <a href={job.recruiterLinkedIn.startsWith('http') ? job.recruiterLinkedIn : `https://${job.recruiterLinkedIn}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg md:text-xl text-white hover:text-[#00d4ff] transition-colors">
                      <Linkedin className="w-5 h-5 text-[#00d4ff]" />
                      LinkedIn
                    </a>}
                </div>
              </div>
            </div>}

        </div>
      </Collapse>
    </div>;
};

// Date Range Picker Component
const DateRangePicker: React.FC<{
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartChange: (date: Date | undefined) => void;
  onEndChange: (date: Date | undefined) => void;
}> = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange
}) => {
  return <div className="flex gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-[115px] justify-start text-left font-medium bg-gray-800/80 border-[#FFDD40]/30 hover:bg-gray-700 hover:border-[#FFDD40] text-[#FFDD40] text-xs px-2.5 py-2 h-auto", !startDate && "text-[#FFDD40]/60")}>
            <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            {startDate ? format(startDate, "MMM d") : "Start"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-900 border border-[#FFDD40]/30 z-[100]" align="start">
          <CalendarComponent mode="single" selected={startDate} onSelect={onStartChange} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
      <span className="text-[#FFDD40]/50 text-sm font-medium">→</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-[115px] justify-start text-left font-medium bg-gray-800/80 border-[#FFDD40]/30 hover:bg-gray-700 hover:border-[#FFDD40] text-[#FFDD40] text-xs px-2.5 py-2 h-auto", !endDate && "text-[#FFDD40]/60")}>
            <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            {endDate ? format(endDate, "MMM d") : "End"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-900 border border-[#FFDD40]/30 z-[100]" align="start">
          <CalendarComponent mode="single" selected={endDate} onSelect={onEndChange} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>;
};
const JobAlertsPage: React.FC = () => {
  const [cachedJobs] = useState<JobData[] | null>(() => readJobCache());
  const [data, setData] = useState<JobData[]>(() => cachedJobs ?? []);
  const [loading, setLoading] = useState(() => !cachedJobs);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof JobData>('date');
  const [order, setOrder] = useState<Order>('desc');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  
  // New filter states
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [salaryFilter, setSalaryFilter] = useState<string>('all');
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);


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
  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await fetch(CSV_URL + '&t=' + Date.now());
      if (!response.ok) throw new Error('Failed to fetch data');
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      setData(parsedData);
      writeJobCache(parsedData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      // Silent background refresh must never break a cached view
      if (!silent) setError(err instanceof Error ? err.message : 'Failed to load job data');
    } finally {
      if (!silent) setLoading(false);
    }
  };
  useEffect(() => {
    // Cached visitors: revalidate silently in the background, keeping their page intact
    fetchData(Boolean(cachedJobs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open the Kit (ConvertKit) modal 5 seconds after page mount.
  // Desktop form: 27ad03da2d, Mobile form: 0edbc71770
  useEffect(() => {
    const uid = window.innerWidth < 768 ? '0edbc71770' : '27ad03da2d';
    // Only click once the Kit embed script has actually loaded (flag set by the
    // loader in index.html). If Kit is blocked/slow, we skip — a programmatic
    // click on an unbound toggle anchor would otherwise navigate the page away.
    const tryOpen = () => {
      const loaded = (window as unknown as { __kitLoaded?: Record<string, boolean> }).__kitLoaded;
      if (!loaded?.[uid]) return false;
      const trigger = document.querySelector<HTMLElement>(`[data-formkit-toggle="${uid}"]`);
      trigger?.click();
      return true;
    };
    const timer = setTimeout(() => {
      if (tryOpen()) return;
      const poll = setInterval(() => {
        if (tryOpen()) clearInterval(poll);
      }, 1000);
      setTimeout(() => clearInterval(poll), 25000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  const handleSort = (property: keyof JobData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Extract unique locations, cities, role types, and sources from data
  const {
    countries,
    locations,
    cities,
    uniqueRoleTypes,
    uniqueSources
  } = useMemo(() => {
    const countrySet = new Set<string>();
    const locationSet = new Set<string>();
    const citySet = new Set<string>();
    const roleTypeSet = new Set<string>();
    const sourceSet = new Set<string>();
    
    data.forEach(job => {
      // Extract role type
      roleTypeSet.add(categorizeRole(job.role));
      
      // Extract source (filter out blanks)
      if (job.source && job.source.trim()) {
        sourceSet.add(job.source.trim());
      }
      
      // Extract city from the work type / location description (e.g. "Hybrid - Toronto, ON")
      const city = extractCity(job.workType);
      if (city) citySet.add(city);
      
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
      locations: Array.from(locationSet).sort(),
      cities: Array.from(citySet).sort(),
      uniqueRoleTypes: Array.from(roleTypeSet).sort(),
      // Merge canonical sources with any additional sources found in the data
      uniqueSources: Array.from(new Set([...Object.keys(sourceDescriptions), ...Array.from(sourceSet)])).sort()
    };
  }, [data]);
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Search filter (Role, Duties, Company)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(row => row.role.toLowerCase().includes(query) || row.duties.toLowerCase().includes(query) || row.company.toLowerCase().includes(query));
    }

    // Role type filter (from chart click or dropdown)
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

    // Location filter (by city — extracted from the work type / location description)
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(row => {
        const city = extractCity(row.workType);
        return city === selectedLocation;
      });
    }
    
    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(row => {
        const expText = row.requiredExperience.toLowerCase();
        const yearMatch = expText.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
        const years = yearMatch ? parseInt(yearMatch[1]) : 0;
        
        if (experienceFilter === 'less5') {
          return years < 5;
        } else if (experienceFilter === 'more5') {
          return years >= 5;
        }
        return true;
      });
    }
    
    // Salary filter (uses converted monthly amount)
    if (salaryFilter !== 'all') {
      filtered = filtered.filter(row => {
        const amount = getMonthlyAmount(row.earningEstimate);
        
        if (salaryFilter === 'less15') {
          return amount <= 15000;
        } else if (salaryFilter === '15to18') {
          return amount > 15000 && amount < 18000;
        } else if (salaryFilter === 'more18') {
          return amount >= 18000;
        }
        return true;
      });
    }
    
    // Work type filter (by normalized work mode)
    if (workTypeFilter !== 'all') {
      filtered = filtered.filter(row => {
        const workMode = normalizeWorkMode(row.workType);
        if (workTypeFilter === 'remote') {
          return workMode === 'Remote';
        } else if (workTypeFilter === 'hybrid') {
          return workMode === 'Hybrid';
        } else if (workTypeFilter === 'onsite') {
          return workMode === 'On-site';
        }
        return true;
      });
    }
    
    // Sources filter (multi-select)
    if (selectedSources.length > 0) {
      filtered = filtered.filter(row => {
        const jobSource = row.source?.trim() || '';
        return selectedSources.includes(jobSource);
      });
    }

    // Date range filter
    if (startDate || endDate) {
      filtered = filtered.filter(row => {
        const jobDate = parseDate(row.date);
        if (!jobDate) return true; // Include jobs without valid dates

        if (startDate && endDate) {
          return isWithinInterval(jobDate, {
            start: startDate,
            end: endDate
          });
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
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      // Skip sorting if companyInfo field (array type)
      if (orderBy === 'companyInfo') return 0;
      
      if (orderBy === 'date') {
        const dateA = parseDate(aValue as string)?.getTime() || 0;
        const dateB = parseDate(bValue as string)?.getTime() || 0;
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      const aStr = (aValue as string) || '';
      const bStr = (bValue as string) || '';
      return order === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    return filtered;
  }, [data, orderBy, order, searchQuery, selectedRoleType, selectedCountry, selectedLocation, startDate, endDate, experienceFilter, salaryFilter, workTypeFilter, selectedSources]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedData, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRoleType, selectedCountry, selectedLocation, startDate, endDate, experienceFilter, salaryFilter, workTypeFilter, selectedSources]);
  
  // Toggle source selection
  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRoleType('all');
    setSelectedCountry('all');
    setSelectedLocation('all');
    setStartDate(startOfMonth(new Date()));
    setEndDate(endOfMonth(new Date()));
    setExperienceFilter('all');
    setSalaryFilter('all');
    setWorkTypeFilter('all');
    setSelectedSources([]);
    setCurrentPage(1);
  };
  return <div className="min-h-screen overflow-x-hidden flex flex-col">
      <TopNav />
      
      <main className="flex-1 px-4 md:px-6 pb-6 pt-16">
        {/* Network Health Control Panel */}
        <NetworkHealthPanel />

        {/* Strategy Guide Banner - Mobile */}
        {/* Strategy Guide Banner - Mobile */}
        <div 
          className="flex md:hidden flex-row items-center gap-3 px-4 py-2 mb-4 rounded-xl border border-white/20"
          style={{
            background: "rgba(15, 15, 15, 0.85)",
            backdropFilter: "blur(9px) saturate(150%)",
            WebkitBackdropFilter: "blur(9px) saturate(150%)"
          }}
        >
          <img 
            src={strategyGuideThumbnail} 
            alt="Strategy Guide Preview" 
            className="w-12 h-14 object-cover rounded-md flex-shrink-0 -my-1"
          />
          <span className="text-base font-bold text-white flex-1">
            <span className="text-[#F4C903]">FREE</span> 15 Page AI-Proof BI-FinTech 10k/mo+ PM <span className="text-[#F4C903]">Strategy Guide PDF</span>
          </span>
          <a 
            data-formkit-toggle="0edbc71770"
            href="https://bi-fintech-consultant-academy.kit.com/0edbc71770"
            className="px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-[#F4C903] to-[#FFE361] text-black hover:from-[#FFE361] hover:to-[#F4C903] transition-all shadow-[0_0_12px_rgba(244,201,3,0.5)] hover:shadow-[0_0_20px_rgba(244,201,3,0.7)] flex-shrink-0"
          >
            Download
          </a>
        </div>
        
        {/* Strategy Guide Banner - Desktop */}
        <div 
          className="hidden md:flex flex-row items-center gap-5 px-6 py-2 mb-4 mt-2 rounded-xl border border-white/20"
          style={{
            background: "rgba(15, 15, 15, 0.85)",
            backdropFilter: "blur(9px) saturate(150%)",
            WebkitBackdropFilter: "blur(9px) saturate(150%)"
          }}
        >
          <img 
            src={strategyGuideThumbnail} 
            alt="Strategy Guide Preview" 
            className="w-16 h-20 object-cover rounded-md flex-shrink-0 -my-1"
          />
          <span className="text-2xl font-bold text-white flex-1">
            <span className="text-[#F4C903]">FREE</span> 15 Page AI-Proof BI-FinTech 10k/mo+ PM <span className="text-[#F4C903]">Strategy Guide PDF</span>
          </span>
          <a 
            data-formkit-toggle="27ad03da2d"
            href="https://bi-fintech-consultant-academy.kit.com/27ad03da2d"
            className="px-7 py-3 text-lg font-bold rounded-lg bg-gradient-to-r from-[#F4C903] to-[#FFE361] text-black hover:from-[#FFE361] hover:to-[#F4C903] transition-all shadow-[0_0_15px_rgba(244,201,3,0.5)] hover:shadow-[0_0_25px_rgba(244,201,3,0.7)] flex-shrink-0"
          >
            Download
          </a>
        </div>
        {/* Header Section */}
        <div className="volumetric-glass rounded-3xl p-6 md:p-10 mb-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{
          color: '#FFDD40'
        }}>
            Data, FinTech & Project Management Consulting Contracts Job Board
          </h1>
          <p className="text-white text-lg md:text-xl mb-3">
            The Most Comprehensive BI-FinTech Project Management Consulting Contracts Job Board in North America
          </p>
          <p className="text-sm md:text-base mb-4 text-red-400 italic">
            ⚠️ Skip roles older than 48 hours — recruiters submit top candidates within this window.
          </p>

          {/* Search Bar - Inside Header */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by Role, Duties, or Company..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFDD40]/50 transition-colors text-base" 
            />
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <a href="/book-session" className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 desktop-hover-scale-105" style={{
              background: 'linear-gradient(135deg, rgba(0, 100, 200, 0.8), rgba(0, 150, 255, 0.6))',
              boxShadow: '0 0 30px rgba(0, 150, 255, 0.5), 0 0 60px rgba(0, 150, 255, 0.3)',
              border: '1px solid rgba(0, 150, 255, 0.4)'
            }}>
                <CalendarCheck className="w-5 h-5 mr-2" />
                Free 30-Min Strategy Session
              </a>
              {/* Mobile Link */}
              <a 
                data-formkit-toggle="0edbc71770"
                href="https://bi-fintech-consultant-academy.kit.com/0edbc71770"
                className="md:hidden inline-flex items-center px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 desktop-hover-scale-105 cursor-pointer" 
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 201, 3, 0.8), rgba(255, 221, 64, 0.6))',
                  boxShadow: '0 0 30px rgba(244, 201, 3, 0.5), 0 0 60px rgba(244, 201, 3, 0.3)',
                  border: '1px solid rgba(244, 201, 3, 0.4)',
                  color: '#0a0a0a'
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Sign-up for new PM Contract Alerts
              </a>
              {/* Desktop Link */}
              <a 
                data-formkit-toggle="27ad03da2d"
                href="https://bi-fintech-consultant-academy.kit.com/27ad03da2d"
                className="hidden md:inline-flex items-center px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 desktop-hover-scale-105 cursor-pointer" 
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 201, 3, 0.8), rgba(255, 221, 64, 0.6))',
                  boxShadow: '0 0 30px rgba(244, 201, 3, 0.5), 0 0 60px rgba(244, 201, 3, 0.3)',
                  border: '1px solid rgba(244, 201, 3, 0.4)',
                  color: '#0a0a0a'
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Sign-up for new PM Contract Alerts
              </a>
            </div>
            <p className="text-base md:text-lg mt-3" style={{
            color: '#FFDD40'
          }}>
              Map your career pivot and discover if my 90-Day BI-FinTech Accelerator can help you land these roles — a personal one-on-one call with me
            </p>
          </div>
        </div>

        {/* Strategy Session Modal */}
        <Dialog open={showStrategyModal} onOpenChange={setShowStrategyModal}>
          <DialogContent className="volumetric-glass border-[#00d4ff]/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{
              color: '#FFDD40'
            }}>
                Discuss your AI-Proof Pivot: Certs, Tools, $10k/mo Gigs
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-muted-foreground">
                Book a free 30-minute strategy session to discuss your career pivot, certification paths, and how to land these high-paying consulting gigs.
              </p>
              <a href="/book-session" className="block w-full px-6 py-4 rounded-xl font-bold text-white text-center transition-all duration-300 desktop-hover-scale-105" style={{
              background: 'linear-gradient(135deg, rgba(0, 100, 200, 0.8), rgba(0, 150, 255, 0.6))',
              boxShadow: '0 0 20px rgba(0, 150, 255, 0.4)',
              border: '1px solid rgba(0, 150, 255, 0.4)'
            }}>
                <CalendarCheck className="inline-block w-5 h-5 mr-2" />
                Schedule on Calendly
              </a>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analytics Section - Collapsible (Above Filters) */}
        {!loading && data.length > 0 && (
          <Collapsible open={showAnalytics} onOpenChange={setShowAnalytics} className="mb-6">
            <div className="volumetric-glass rounded-2xl overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" style={{ color: '#00d4ff' }} />
                    <span className="text-lg font-bold" style={{ color: '#00d4ff' }}>
                      Analytics Dashboard
                    </span>
                  </div>
                  {showAnalytics ? (
                    <ChevronUp className="w-5 h-5" style={{ color: '#00d4ff' }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: '#00d4ff' }} />
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-4 pb-5 md:px-5 md:pb-6 border-t border-white/10">
                  <div className="mt-4">
                    <JobAnalyticsCharts 
                      data={data} 
                      onRoleFilterClick={handleRoleFilterClick} 
                      onCountryFilterClick={handleCountryFilterClick} 
                      onDateRangeClick={handleDateRangeClick} 
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Filters Section - Collapsible (Below Analytics, Above Job List) */}
        {!loading && data.length > 0 && (
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="mb-6">
            <div className="volumetric-glass rounded-2xl overflow-hidden shadow-lg">
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Filter className="w-6 h-6" style={{ color: '#FFDD40' }} />
                    <span className="text-xl md:text-2xl font-bold" style={{ color: '#FFDD40' }}>
                      Filters
                    </span>
                    {(selectedSources.length > 0 || selectedRoleType !== 'all' || selectedCountry !== 'all' || selectedLocation !== 'all' || experienceFilter !== 'all' || salaryFilter !== 'all' || workTypeFilter !== 'all' || searchQuery) && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FFDD40]/20 text-[#FFDD40]">
                        Active
                      </span>
                    )}
                    <span className="text-sm text-white/60 ml-2">
                      {filteredAndSortedData.length} job{filteredAndSortedData.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  {filtersOpen ? (
                    <ChevronUp className="w-6 h-6" style={{ color: '#FFDD40' }} />
                  ) : (
                    <ChevronDown className="w-6 h-6" style={{ color: '#FFDD40' }} />
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-5 pb-6 md:px-6 md:pb-8 border-t border-white/10 space-y-5 pt-5">
                  
                  {/* Filter Grid - Responsive */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Sources Multi-Select - First/Prominent - Full width mobile, 2 cols on md+ */}
                    <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                      <label className="text-sm font-bold text-[#FFDD40] flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Sources
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between px-4 py-3 h-11 rounded-xl bg-gray-900 border-white/20 hover:bg-gray-800 hover:border-[#FFDD40]/50 text-white text-sm"
                          >
                            <span className="truncate">
                              {selectedSources.length === 0 
                                ? 'All Sources' 
                                : selectedSources.length <= 2
                                  ? selectedSources.map(getSourceDisplayName).join(', ')
                                  : `${selectedSources.length} selected`
                              }
                            </span>
                            <ChevronDown className="w-4 h-4 ml-2 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0 bg-gray-900 border border-white/20 z-[100]" align="start">
                          <Command className="bg-transparent">
                            <CommandInput placeholder="Search sources..." className="border-b border-white/10" />
                            <CommandList>
                              <CommandEmpty>No sources found.</CommandEmpty>
                              <CommandGroup>
                                {/* Clear All option */}
                                {selectedSources.length > 0 && (
                                  <CommandItem
                                    onSelect={() => setSelectedSources([])}
                                    className="cursor-pointer text-white/70 hover:text-white"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear selection ({selectedSources.length})
                                  </CommandItem>
                                )}
                                {uniqueSources.map(source => {
                                  const description = sourceDescriptions[source] || `Staffing agency providing professional recruitment services.`;
                                  const isSelected = selectedSources.includes(source);
                                  
                                  return (
                                    <CommandItem
                                      key={source}
                                      onSelect={() => toggleSource(source)}
                                      className="cursor-pointer hover:bg-cyan-500/20 data-[selected=true]:bg-cyan-500/20 flex-col items-start gap-1 py-2"
                                    >
                                      <div className="flex items-center gap-2 w-full">
                                        <Checkbox
                                          checked={isSelected}
                                          className="border-white/30 data-[state=checked]:bg-[#FFDD40] data-[state=checked]:border-[#FFDD40]"
                                        />
                                        <span className="text-white font-medium">{getSourceDisplayName(source)}</span>
                                      </div>
                                      {isSelected && (
                                        <p className="text-white/50 text-xs pl-6 leading-relaxed">{description}</p>
                                      )}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Country Filter */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Country
                      </label>
                      <select 
                        value={selectedCountry} 
                        onChange={e => setSelectedCountry(e.target.value)} 
                        className="px-4 py-3 h-11 rounded-xl bg-gray-900 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFDD40]/50 transition-colors cursor-pointer"
                      >
                        <option value="all" className="bg-gray-900 text-white">All Countries</option>
                        <option value="Canada" className="bg-gray-900 text-white">Canada</option>
                        <option value="USA" className="bg-gray-900 text-white">USA</option>
                        {countries.filter(c => c !== 'Canada' && c !== 'USA' && c !== 'N/A' && c !== 'No job text provided').map(country => (
                          <option key={country} value={country} className="bg-gray-900 text-white">{country}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* City Filter */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        City
                      </label>
                      <select 
                        value={selectedLocation} 
                        onChange={e => setSelectedLocation(e.target.value)} 
                        className="px-4 py-3 h-11 rounded-xl bg-gray-900 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFDD40]/50 transition-colors cursor-pointer"
                      >
                        <option value="all" className="bg-gray-900 text-white">All Cities</option>
                        {cities.filter(city => city !== 'Canada').map(city => (
                          <option key={city} value={city} className="bg-gray-900 text-white">{city}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Experience Filter */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Experience
                      </label>
                      <select 
                        value={experienceFilter} 
                        onChange={e => setExperienceFilter(e.target.value)} 
                        className="px-4 py-3 h-11 rounded-xl bg-gray-900 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFDD40]/50 transition-colors cursor-pointer"
                      >
                        <option value="all" className="bg-gray-900 text-white">All Experience</option>
                        <option value="less5" className="bg-gray-900 text-white">&lt; 5 Years</option>
                        <option value="more5" className="bg-gray-900 text-white">≥ 5 Years</option>
                      </select>
                    </div>
                    
                    {/* Salary Filter */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" style={{ color: '#FFDD40' }} />
                        Salary Range
                      </label>
                      <select 
                        value={salaryFilter} 
                        onChange={e => setSalaryFilter(e.target.value)} 
                        className="px-4 py-3 h-11 rounded-xl bg-gray-900 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFDD40]/50 transition-colors cursor-pointer"
                      >
                        <option value="all" className="bg-gray-900 text-white">All Salaries</option>
                        <option value="less15" className="bg-gray-900 text-white">≤ $15k/mo</option>
                        <option value="15to18" className="bg-gray-900 text-white">$15k - $18k/mo</option>
                        <option value="more18" className="bg-gray-900 text-white">≥ $18k/mo</option>
                      </select>
                    </div>
                    
                    {/* Work Type Filter */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        Work Type
                      </label>
                      <select 
                        value={workTypeFilter} 
                        onChange={e => setWorkTypeFilter(e.target.value)} 
                        className="px-4 py-3 h-11 rounded-xl bg-gray-900 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFDD40]/50 transition-colors cursor-pointer"
                      >
                        <option value="all" className="bg-gray-900 text-white">All Types</option>
                        <option value="remote" className="bg-gray-900 text-white">Remote</option>
                        <option value="hybrid" className="bg-gray-900 text-white">Hybrid</option>
                        <option value="onsite" className="bg-gray-900 text-white">On-site</option>
                      </select>
                    </div>
                    
                    {/* Role Type Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Role Type
                      </label>
                      <select 
                        value={selectedRoleType} 
                        onChange={e => setSelectedRoleType(e.target.value)} 
                        className="px-4 py-3 h-11 rounded-xl bg-gray-900 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFDD40]/50 transition-colors cursor-pointer"
                      >
                        <option value="all" className="bg-gray-900 text-white">All Roles</option>
                        {uniqueRoleTypes.map(role => (
                          <option key={role} value={role} className="bg-gray-900 text-white">{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Date Range */}
                    <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
                      <label className="text-xs text-white/60">Date Range</label>
                      <DateRangePicker 
                        startDate={startDate} 
                        endDate={endDate} 
                        onStartChange={setStartDate} 
                        onEndChange={setEndDate} 
                      />
                    </div>
                  </div>
                  
                  {/* Action Row */}
                  <div className="flex gap-3 flex-wrap items-center justify-between pt-3">
                    <div className="flex gap-3 items-center flex-wrap">
                      <button 
                        onClick={() => fetchData()} 
                        disabled={loading} 
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white transition-colors flex items-center gap-2 font-medium shadow-lg shadow-cyan-500/25"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                      <button 
                        onClick={clearFilters} 
                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground hover:border-[#FFDD40]/50 transition-colors font-medium"
                      >
                        Clear Filters
                      </button>
                      
                      {/* View Mode Toggle */}
                      <div className="flex rounded-xl overflow-hidden border border-white/20">
                        <button 
                          onClick={() => setViewMode('card')}
                          className={`px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'card' ? 'text-black' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                          style={viewMode === 'card' ? { backgroundColor: '#FFDD40' } : {}}
                        >
                          <LayoutGrid className="w-4 h-4" />
                          Card
                        </button>
                        <button 
                          onClick={() => setViewMode('table')}
                          className={`px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'table' ? 'text-black' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                          style={viewMode === 'table' ? { backgroundColor: '#FFDD40' } : {}}
                        >
                          <TableIcon className="w-4 h-4" />
                          Table
                        </button>
                      </div>
                    </div>
                    
                    {/* Active Filters Display */}
                    {(selectedRoleType !== 'all' || selectedSources.length > 0) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedRoleType !== 'all' && (
                          <span className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1" style={{
                            backgroundColor: 'rgba(255, 221, 64, 0.2)',
                            color: '#FFDD40'
                          }}>
                            {selectedRoleType}
                            <button onClick={() => setSelectedRoleType('all')} className="ml-1 hover:opacity-70">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {selectedSources.length > 0 && (
                          <span className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1" style={{
                            backgroundColor: 'rgba(255, 221, 64, 0.2)',
                            color: '#FFDD40'
                          }}>
                            {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''}
                            <button onClick={() => setSelectedSources([])} className="ml-1 hover:opacity-70">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}


        {/* Recruiter contact disclaimer */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 backdrop-blur-sm sm:px-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/80" aria-hidden="true" />
          <p className="text-sm sm:text-base font-medium leading-relaxed text-white/95">
            <span className="font-bold text-[#FFDD40]">Note:</span> Only jobs sourced from Hassan&rsquo;s Recruiter Network include the recruiter&rsquo;s direct email and/or phone number. For all other listings, please contact the agency using the details provided in the job posting.
          </p>
        </div>

        {loading ? <div className="space-y-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div> : error ? <div className="volumetric-glass rounded-3xl p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div> : viewMode === 'table' ? (
          // Table View
          <div className="volumetric-glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Date</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Role</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Company</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Location</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap w-[80px]">Term</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap w-[120px]">Work Type</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Salary</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Experience</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-[#FFDD40] font-bold whitespace-nowrap">Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        No jobs found for the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((job, index) => {
                      const jobDate = parseDate(job.date);
                      const hoursAgo = jobDate ? Math.round((Date.now() - jobDate.getTime()) / (1000 * 60 * 60)) : 0;
                      const status = hoursAgo <= 6 ? 'HOT' : hoursAgo <= 24 ? 'Ideal' : hoursAgo <= 48 ? 'Hurry' : 'Stale';
                      const statusColor = hoursAgo <= 6 ? '#ff4444' : hoursAgo <= 24 ? '#4ade80' : hoursAgo <= 48 ? '#FFDD40' : '#ef4444';
                      
                      const amount = getMonthlyAmount(job.earningEstimate);
                      const dollarCount = amount >= 18000 ? 3 : amount > 15000 ? 2 : 1;
                      const workMode = normalizeWorkMode(job.workType);
                      const formattedEarnings = formatEarningsMonthly(job.earningEstimate);
                      const locationLower = job.location?.toLowerCase() || '';
                      const currency = locationLower.includes('canada') || locationLower.includes('toronto') || locationLower.includes('vancouver') || locationLower.includes('montreal') || locationLower.includes('calgary') || locationLower.includes('ottawa') ? 'CAD' : 'USD';
                      const earningsHasCurrency = /\b(CAD|USD)\b/i.test(formattedEarnings);
                      const earningsHasEst = /\*\s*Est\.?/i.test(formattedEarnings);
                      
                      return (
                        <TableRow key={index} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{job.date}</span>
                              <span className="text-xs text-white/50">{hoursAgo}h ago</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white font-medium max-w-[200px]">
                            <span className="line-clamp-2">{job.role}</span>
                          </TableCell>
                          <TableCell className="text-white whitespace-nowrap">{job.company}</TableCell>
                          <TableCell className="text-white/80 whitespace-nowrap max-w-[150px] truncate">{job.location}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
                              {job.term}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {workMode && (
                              <span className="px-2 py-1 rounded-full text-xs inline-flex items-center gap-1" style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
                                {workMode === 'Remote' ? <Plane className="w-3 h-3" /> : workMode === 'Hybrid' ? <Home className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                                {workMode}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {job.earningEstimate && (
                              <span className="px-2 py-1 rounded-full text-xs inline-flex items-center gap-1" style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                                <span className="inline-flex" style={{ color: '#FFDD40' }}>
                                  {[...Array(dollarCount)].map((_, i) => <DollarSign key={i} className="w-3 h-3 -mx-0.5" />)}
                                </span>
                                {formattedEarnings}{!earningsHasCurrency && ` ${currency}`}{!earningsHasEst && ' *Est.'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-white/80 max-w-[120px] truncate text-xs">{job.requiredExperience}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: `${statusColor}20`,
                                color: statusColor,
                                boxShadow: `0 0 8px ${statusColor}40`
                              }}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {job.recruiterEmail && (
                              <a href={`mailto:${job.recruiterEmail}`} className="text-[#00d4ff] hover:underline text-xs">
                                Email
                              </a>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination for Table */}
            {totalPages > 1 && <div className="flex justify-center items-center gap-2 p-4 border-t border-white/10 flex-wrap">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
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
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === pageNum ? 'text-black' : 'bg-white/5 border border-white/10 hover:border-[#FFDD40]/50'}`} 
                      style={currentPage === pageNum ? { backgroundColor: '#FFDD40' } : {}}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground ml-2">
                ({filteredAndSortedData.length} total)
              </span>
            </div>}
          </div>
        ) : isMobile ?
      // Mobile view - cards
      <div>
            {filteredAndSortedData.length === 0 ? <div className="volumetric-glass rounded-3xl p-8 text-center">
                <p className="text-muted-foreground">No jobs found for the selected filters.</p>
              </div> : <>
                {paginatedData.map((job, index) => <JobCard key={index} job={job} />)}
                {/* Pagination for Mobile */}
                {totalPages > 1 && <div className="flex justify-center items-center gap-4 mt-6 mb-4">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>}
              </>}
          </div> :
      // Desktop view - cards grid
      <div>
            {filteredAndSortedData.length === 0 ? <div className="volumetric-glass rounded-3xl p-8 text-center">
                <p className="text-muted-foreground">No jobs found for the selected filters.</p>
              </div> : <>
                <div className="flex flex-col gap-6">
                  {paginatedData.map((job, index) => <JobCard key={index} job={job} isDesktop />)}
                </div>
                {/* Pagination for Desktop */}
                {totalPages > 1 && <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({
                length: Math.min(5, totalPages)
              }, (_, i) => {
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
                return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === pageNum ? 'text-black' : 'bg-white/5 border border-white/10 hover:border-[#FFDD40]/50'}`} style={currentPage === pageNum ? {
                  backgroundColor: '#FFDD40'
                } : {}}>
                            {pageNum}
                          </button>;
              })}
                    </div>
                    
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:border-[#FFDD40]/50 transition-colors">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <span className="text-sm text-muted-foreground ml-2">
                      ({filteredAndSortedData.length} total)
                    </span>
                  </div>}
              </>}
          </div>}
      </main>

      <footer className="glass-effect rounded-t-3xl mt-auto py-4 px-4">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Zero to PM Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default JobAlertsPage;