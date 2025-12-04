import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Collapse,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, FilterList } from '@mui/icons-material';
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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F4C903',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(17, 24, 39, 0.8)',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(75, 85, 99, 0.4)',
        },
        head: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          color: '#F4C903',
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(244, 201, 3, 0.08) !important',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

const parseCSV = (csvText: string): JobData[] => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  const rows: JobData[] = [];
  
  // Skip header row (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV considering quoted fields
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
    <Card sx={{ mb: 2, backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.4)' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#F4C903', fontWeight: 600 }}>
              {job.role}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              {job.company} • {job.date}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={job.term} size="small" sx={{ backgroundColor: 'rgba(244, 201, 3, 0.2)', color: '#F4C903' }} />
              <Chip label={job.workType} size="small" sx={{ backgroundColor: 'rgba(0, 212, 255, 0.2)', color: '#00d4ff' }} />
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: '#9ca3af' }}>
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#F4C903' }}>Duties</Typography>
              <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.duties}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#F4C903' }}>Required Experience</Typography>
              <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.requiredExperience}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#F4C903' }}>Required Skills</Typography>
              <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.requiredSkills}</Typography>
            </Box>
            {job.additionalRequirements && (
              <Box>
                <Typography variant="caption" sx={{ color: '#F4C903' }}>Additional Requirements</Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.additionalRequirements}</Typography>
              </Box>
            )}
            {job.comments && (
              <Box>
                <Typography variant="caption" sx={{ color: '#F4C903' }}>Comments</Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.comments}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" sx={{ color: '#F4C903' }}>Strategy</Typography>
              <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.strategy}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#F4C903' }}>Earning Estimate</Typography>
              <Typography variant="body2" sx={{ color: '#e5e7eb' }}>{job.earningEstimate}</Typography>
            </Box>
            {(job.recruiterEmail || job.recruiterPhone) && (
              <Box>
                <Typography variant="caption" sx={{ color: '#F4C903' }}>Contact</Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                  {job.recruiterEmail && <span>{job.recruiterEmail}</span>}
                  {job.recruiterEmail && job.recruiterPhone && <span> • </span>}
                  {job.recruiterPhone && <span>{job.recruiterPhone}</span>}
                </Typography>
              </Box>
            )}
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setData(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (property: keyof JobData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];
    
    // Apply date filter
    if (dateFilter === 'this-month') {
      filtered = filtered.filter(row => isThisMonth(row.date));
    } else if (dateFilter === 'all') {
      // Show all
    }
    
    // Sort
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-background">
        <TopNav />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: '#F4C903', 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2.125rem' }
              }}
            >
              Deadly Job Alerts: BI-FinTech / AI Deployment PM Consulting Gigs
            </Typography>
            <Typography variant="body1" sx={{ color: '#9ca3af', mb: 3 }}>
              Curated consulting opportunities with strategy insights on how the BI-FinTech Accelerator bridges skill gaps.
            </Typography>
            
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
              <FilterList sx={{ color: '#F4C903' }} />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: '#9ca3af' }}>Date Filter</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date Filter"
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{ 
                    color: '#e5e7eb',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(75, 85, 99, 0.6)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#F4C903' },
                  }}
                >
                  <MenuItem value="this-month">This Month</MenuItem>
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                {filteredAndSortedData.length} job{filteredAndSortedData.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#F4C903' }} />
            </Box>
          ) : error ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          ) : isMobile ? (
            // Mobile view - cards
            <Box>
              {filteredAndSortedData.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#9ca3af' }}>No jobs found for the selected filter.</Typography>
                </Paper>
              ) : (
                filteredAndSortedData.map((job, index) => (
                  <MobileJobCard key={index} job={job} />
                ))
              )}
            </Box>
          ) : (
            // Desktop view - table
            <TableContainer 
              component={Paper} 
              sx={{ 
                maxHeight: 'calc(100vh - 300px)',
                border: '1px solid rgba(75, 85, 99, 0.4)',
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
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSort(column.id)}
                          sx={{
                            '&.MuiTableSortLabel-root': { color: '#F4C903' },
                            '&.MuiTableSortLabel-root:hover': { color: '#F4C903' },
                            '&.Mui-active': { color: '#F4C903' },
                            '& .MuiTableSortLabel-icon': { color: '#F4C903 !important' },
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
                      <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography sx={{ color: '#9ca3af' }}>No jobs found for the selected filter.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedData.map((row, index) => (
                      <TableRow hover key={index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          const displayValue = column.truncate 
                            ? truncateText(value, column.truncate)
                            : value;
                          
                          return (
                            <TableCell key={column.id}>
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
          )}
        </main>

        <footer className="py-8 text-center text-muted-foreground border-t border-border/40">
          <p>© {new Date().getFullYear()} The Deadly Consultant. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default JobAlertsPage;
