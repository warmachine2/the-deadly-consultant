import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
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
import { Filter, Loader2, RefreshCw } from 'lucide-react';
import TopNav from '@/components/TopNav';

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
      });
    }
  }
  
  return rows;
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const isThisMonth = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const columns: { id: keyof JobData; label: string; minWidth?: number; truncate?: number }[] = [
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: 'role', label: 'Role', minWidth: 150 },
  { id: 'term', label: 'Term', minWidth: 80 },
  { id: 'duties', label: 'Duties', minWidth: 200, truncate: 200 },
  { id: 'requiredExperience', label: 'Required Experience', minWidth: 150 },
  { id: 'requiredSkills', label: 'Required Skills', minWidth: 150 },
  { id: 'additionalRequirements', label: 'Additional Requirements', minWidth: 150 },
  { id: 'comments', label: 'Comments', minWidth: 120 },
  { id: 'workType', label: 'Remote/Hybrid/In-Person', minWidth: 120 },
  { id: 'company', label: 'Company', minWidth: 120 },
  { id: 'recruiterEmail', label: 'Recruiter Email', minWidth: 150 },
  { id: 'recruiterPhone', label: 'Recruiter Phone', minWidth: 120 },
  { id: 'strategy', label: 'Strategy', minWidth: 200 },
  { id: 'earningEstimate', label: 'Earning Estimate', minWidth: 150 },
];

// Mobile card row component
const MobileJobCard: React.FC<{ job: JobData }> = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="volumetric-glass rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold" style={{ color: '#FFDD40' }}>
            {job.role}
          </h3>
          <p className="text-muted-foreground text-sm">
            {job.company} • {job.date}
          </p>
          <div className="mt-2 flex gap-2 flex-wrap">
            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'rgba(255, 221, 64, 0.2)', color: '#FFDD40' }}>
              {job.term}
            </span>
            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'rgba(0, 212, 255, 0.2)', color: '#00d4ff' }}>
              {job.workType}
            </span>
          </div>
        </div>
        <IconButton 
          size="small" 
          onClick={() => setExpanded(!expanded)} 
          sx={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </div>
      
      <Collapse in={expanded}>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Duties</p>
            <p className="text-sm text-foreground/80">{job.duties}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Required Experience</p>
            <p className="text-sm text-foreground/80">{job.requiredExperience}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Required Skills</p>
            <p className="text-sm text-foreground/80">{job.requiredSkills}</p>
          </div>
          {job.additionalRequirements && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Additional Requirements</p>
              <p className="text-sm text-foreground/80">{job.additionalRequirements}</p>
            </div>
          )}
          {job.comments && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Comments</p>
              <p className="text-sm text-foreground/80">{job.comments}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Strategy</p>
            <p className="text-sm text-foreground/80">{job.strategy}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Earning Estimate</p>
            <p className="text-sm text-foreground/80">{job.earningEstimate}</p>
          </div>
          {(job.recruiterEmail || job.recruiterPhone) && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#FFDD40' }}>Contact</p>
              <p className="text-sm text-foreground/80">
                {job.recruiterEmail && <span>{job.recruiterEmail}</span>}
                {job.recruiterEmail && job.recruiterPhone && <span> • </span>}
                {job.recruiterPhone && <span>{job.recruiterPhone}</span>}
              </p>
            </div>
          )}
        </Stack>
      </Collapse>
    </div>
  );
};

const JobAlertsPage: React.FC = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof JobData>('date');
  const [order, setOrder] = useState<Order>('desc');
  const [dateFilter, setDateFilter] = useState<string>('this-month');
  
  const isMobile = useMediaQuery('(max-width:768px)');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(CSV_URL + '&t=' + Date.now()); // Cache bust
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

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];
    
    if (dateFilter === 'this-month') {
      filtered = filtered.filter(row => isThisMonth(row.date));
    }
    
    filtered.sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      
      if (orderBy === 'date') {
        const dateA = new Date(aValue).getTime() || 0;
        const dateB = new Date(bValue).getTime() || 0;
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      return order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    return filtered;
  }, [data, orderBy, order, dateFilter]);

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      <TopNav />
      
      <main className="flex-1 px-4 md:px-6 pb-6 pt-24">
        {/* Header Section */}
        <div className="volumetric-glass rounded-3xl p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: '#FFDD40' }}>
            Deadly Job Alerts: BI-FinTech / AI Deployment PM Consulting Gigs
          </h1>
          <p className="text-muted-foreground mb-6">
            Curated consulting opportunities with strategy insights on how the BI-FinTech Accelerator bridges skill gaps.
          </p>
          
          {/* Filters */}
          <div className="flex gap-3 flex-wrap items-center">
            <Filter className="w-5 h-5" style={{ color: '#FFDD40' }} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-[#FFDD40]/50 transition-colors"
            >
              <option value="this-month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground hover:border-[#FFDD40]/50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <span className="text-muted-foreground text-sm">
              {filteredAndSortedData.length} job{filteredAndSortedData.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

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
                <p className="text-muted-foreground">No jobs found for the selected filter.</p>
              </div>
            ) : (
              filteredAndSortedData.map((job, index) => (
                <MobileJobCard key={index} job={job} />
              ))
            )}
          </div>
        ) : (
          // Desktop view - table
          <div className="volumetric-glass rounded-3xl overflow-hidden">
            <TableContainer 
              sx={{ 
                maxHeight: 'calc(100vh - 350px)',
                backgroundColor: 'transparent',
                '& .MuiTable-root': {
                  backgroundColor: 'transparent',
                }
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                        sortDirection={orderBy === column.id ? order : false}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          color: '#FFDD40',
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSort(column.id)}
                          sx={{
                            '&.MuiTableSortLabel-root': { color: '#FFDD40' },
                            '&.MuiTableSortLabel-root:hover': { color: '#FFDD40' },
                            '&.Mui-active': { color: '#FFDD40' },
                            '& .MuiTableSortLabel-icon': { color: '#FFDD40 !important' },
                          }}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedData.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={columns.length} 
                        sx={{ 
                          textAlign: 'center', 
                          py: 6, 
                          color: 'rgba(255,255,255,0.6)',
                          backgroundColor: 'transparent',
                          borderBottom: 'none',
                        }}
                      >
                        No jobs found for the selected filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedData.map((row, index) => (
                      <TableRow 
                        hover 
                        key={index}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 221, 64, 0.05) !important',
                          },
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          const displayValue = column.truncate 
                            ? truncateText(value, column.truncate)
                            : value;
                          
                          return (
                            <TableCell 
                              key={column.id}
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                backgroundColor: 'transparent',
                              }}
                            >
                              {column.truncate && value.length > column.truncate ? (
                                <Tooltip title={value} arrow placement="top">
                                  <span style={{ cursor: 'help' }}>{displayValue}</span>
                                </Tooltip>
                              ) : (
                                displayValue
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
