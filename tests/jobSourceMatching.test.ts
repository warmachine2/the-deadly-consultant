import { expect, test } from 'bun:test';
import { getJobMatchingSources, getUniqueJobSources, normalizeSourceName, matchesJobSources } from '../src/lib/jobSourceMatching';
import { extractCity } from '../src/lib/countryUtils';
import { parseCSV } from '../src/pages/JobAlertsPage';

const network = "Hassan's recruiter Network";

test('Calgary recruiter jobs match SI Systems and preserve network attribution', () => {
  for (const role of ['Junior Project Manager/Senior Coordinator', 'Project Coordinator']) {
    const job = { role, source: network, company: 'S.i. Systems (for client)', workType: 'In-Person - Calgary, AB', location: '', comments: '', date: 'N/A' };
    expect(extractCity(job.workType, job.location, job.comments)).toBe('Calgary');
    expect(matchesJobSources(job, ['S.i. Systems'])).toBe(true);
    expect(matchesJobSources(job, [network])).toBe(true);
    expect(getJobMatchingSources(job)).toEqual([network, 'S.i. Systems']);
    expect(job.source).toBe(network);
  }
});

test('every requested agency is recognized in Company using shared aliases', () => {
  const cases = [
    ['SI Systems', 'S.i. Systems'], ['S.I. Systems', 'S.i. Systems'],
    ['Procom', 'Procom'], ['Insight Global', 'Insight Global'],
    ['Agilus', 'Agilus Work Solutions'], ['Tundra', 'Tundra Technical Solutions'],
    ['Proviso', 'Proviso'], ['TEKsystems', 'TEKsystems'], ['Kforce', 'Kforce'],
    ['Mondo', 'Mondo'], ['Axelon', 'Axelon Services Corporation'],
    ['NTT Data', 'NTT Data'], ['HR Brain', 'HR Brain'], ['Nerdy Hire', 'Nerdy Hire'],
    ['GTT', 'GTT (Global Technical Talent)'], ['Soho Square', 'Soho Square Solutions'],
    ['Peterson Technology Partners', 'Peterson Technology Partners (PTP)'],
    ['TES', 'TES – The Employment Solution'], ['Motion Recruitment', 'Motion Recruitment'],
  ];
  for (const [alias, canonical] of cases) {
    const job = { source: network, company: `${alias} (for client)` };
    expect(getJobMatchingSources(job)).toContain(canonical);
    expect(matchesJobSources(job, [canonical])).toBe(true);
  }
});

test('matching uses boundaries, multiple agencies, and distinct Dallas attribution', () => {
  expect(getJobMatchingSources({ company: 'United States testing systems' })).toEqual(['United States testing systems']);
  expect(getJobMatchingSources({ company: 'Insight Global Dallas (for client)' })).toEqual(['Insight Global Dallas']);
  expect(getJobMatchingSources({ company: 'Procom / S.I. Systems' }).sort()).toEqual(['Procom', 'S.i. Systems']);
  expect(matchesJobSources({ company: 'Procom' }, ['Mondo'])).toBe(false);
  expect(matchesJobSources({ company: 'Procom' }, [])).toBe(true);
});

test('blank-date Winnipeg recruiter row parses as N/A without dropping its role', () => {
  for (const date of ['', '   ']) {
    const cells = Array<string>(18).fill('');
    cells[0] = date;
    cells[1] = 'Project Coordinator';
    cells[8] = 'In-Person - Winnipeg, MB';
    cells[9] = 'S.i. Systems (for client)';
    cells[17] = network;
    const csv = ['Date,Role', cells.map(value => `"${value}"`).join(',')].join('\n');
    const jobs = parseCSV(csv);
    expect(jobs).toHaveLength(1);
    expect(jobs[0].date).toBe('N/A');
    expect(jobs[0].role).toBe('Project Coordinator');
    expect(matchesJobSources(jobs[0], ['S.i. Systems'])).toBe(true);
    expect(extractCity(jobs[0].workType, jobs[0].location, jobs[0].comments)).toBe('Winnipeg');
  }
});

test('rows without a role still do not parse', () => {
  expect(parseCSV('Date,Role\n2026-11-13," "\n,')).toEqual([]);
});

test('Tanisha variants produce one dropdown option and filter all recruiter jobs', () => {
  const variants = ['Tanisha Systems', 'Tanisha Systems Inc', 'Tanisha Systems Inc.', 'Tanisha Systems, Inc.', 'Tanisha Systems Inc. (client undisclosed)', 'Tanisha Systems Inc (staffing agency for enterprise clients)'];
  const jobs = variants.map(company => ({ source: network, company, role: 'Release Manager', date: '2026-11-13' }));
  expect(getUniqueJobSources(jobs, ['Tanisha Systems Inc.'])).toEqual([network, 'Tanisha Systems Inc.']);
  for (const job of jobs) {
    expect(normalizeSourceName(job.company)).toBe('Tanisha Systems Inc.');
    expect(matchesJobSources(job, ['Tanisha Systems Inc.'])).toBe(true);
    expect(matchesJobSources(job, [network])).toBe(true);
  }
});

test('unseen companies and sources automatically become filter options', () => {
  const jobs = [{ source: network, company: 'Acme Staffing LLC' }, { source: 'New Recruiter', company: 'Acme Staffing LLC (via partner)' }];
  expect(getUniqueJobSources(jobs)).toEqual(['Acme Staffing LLC', network, 'New Recruiter']);
  expect(jobs.filter(job => matchesJobSources(job, ['Acme Staffing LLC']))).toHaveLength(2);
  expect(jobs.filter(job => matchesJobSources(job, [network]))).toHaveLength(1);
});

test('SI Systems variants merge and placeholder companies are ignored', () => {
  const jobs = ['S.i. Systems', 'SI Systems', 'S.I. Systems (for client)', 'N/A', 'None', 'Unknown', 'Undisclosed', '-', ''].map(company => ({ source: network, company }));
  expect(getUniqueJobSources(jobs)).toEqual([network, 'S.i. Systems']);
  expect(jobs.filter(job => matchesJobSources(job, ['SI Systems']))).toHaveLength(3);
});

test('known agency aliases merge without altering existing canonical source values', () => {
  const cases = [
    ['NTT DATA', 'NTT Data'], ['Motion Recruitment Client', 'Motion Recruitment'],
    ['HR Brain client', 'HR Brain'], ['Axelon Services Corporation', 'Axelon Services Corporation'],
    ['Agilus Work Solutions', 'Agilus Work Solutions'],
    ['Global Technical Talent (GTT)', 'GTT (Global Technical Talent)'],
    ['Peterson Technology Partners', 'Peterson Technology Partners (PTP)'],
  ];
  for (const [company, canonical] of cases) {
    const jobs = [{ source: network, company }, { source: network, company: canonical }];
    expect(getUniqueJobSources(jobs)).toEqual([network, canonical].sort());
    expect(matchesJobSources(jobs[0], [canonical])).toBe(true);
  }
});

test('trailing client qualifiers are removed from new company options', () => {
  for (const qualifier of ['for client', 'client undisclosed', 'undisclosed client', 'staffing agency for technology', 'recruiter for enterprise', 'End Client', 'via partner']) {
    const job = { source: network, company: `Acme Staffing LLC (${qualifier})` };
    expect(getUniqueJobSources([job])).toEqual(['Acme Staffing LLC', network]);
    expect(matchesJobSources(job, ['Acme Staffing LLC'])).toBe(true);
  }
});