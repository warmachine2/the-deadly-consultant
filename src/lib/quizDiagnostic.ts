export interface DiagnosticOption {
  value: string;
  label: string;
  points: number;
  mqlQualified?: boolean;
  rolePond?: string;
}

export interface DiagnosticQuestion {
  id: number;
  text: string;
  options: DiagnosticOption[];
}

export const QUESTIONS: DiagnosticQuestion[] = [
  {
    "id": 1,
    "text": "How many years of full-time professional work experience do you currently have?",
    "options": [
      {
        "value": "5+ years",
        "label": "5+ years",
        "points": 20,
        "mqlQualified": true
      },
      {
        "value": "3 to 5 years (with university degree)",
        "label": "3 to 5 years (with university degree)",
        "points": 20,
        "mqlQualified": true
      },
      {
        "value": "3 to 5 years (without degree)",
        "label": "3 to 5 years (without degree)",
        "points": 12,
        "mqlQualified": true
      },
      {
        "value": "1 to 2 years",
        "label": "1 to 2 years",
        "points": 5,
        "mqlQualified": false
      },
      {
        "value": "Under 1 year / Current student",
        "label": "Under 1 year / Current student",
        "points": 0,
        "mqlQualified": false
      }
    ]
  },
  {
    "id": 2,
    "text": "Which category best describes your current (or most recent) professional role?",
    "options": [
      {
        "value": "Data, BI, SQL, or Reporting Analyst",
        "label": "Data, BI, SQL, or Reporting Analyst",
        "points": 10,
        "rolePond": "Data_Analyst"
      },
      {
        "value": "Business Analyst, Systems Analyst, or Scrum Master",
        "label": "Business Analyst, Systems Analyst, or Scrum Master",
        "points": 10,
        "rolePond": "BA_Scrum"
      },
      {
        "value": "Project Coordinator, PMO Analyst, or Operations Specialist",
        "label": "Project Coordinator, PMO Analyst, or Operations Specialist",
        "points": 10,
        "rolePond": "Coordinator_Ops"
      },
      {
        "value": "Software Developer, QA Lead, or Engineer",
        "label": "Software Developer, QA Lead, or Engineer",
        "points": 10,
        "rolePond": "Dev_Eng"
      },
      {
        "value": "Accountant, Financial Analyst, or Corporate HR / Admin",
        "label": "Accountant, Financial Analyst, or Corporate HR / Admin",
        "points": 10,
        "rolePond": "Finance_Corp"
      },
      {
        "value": "Other white-collar professional",
        "label": "Other white-collar professional",
        "points": 10,
        "rolePond": "Other_WhiteCollar"
      },
      {
        "value": "Other non-corporate role",
        "label": "Other non-corporate role",
        "points": 4,
        "rolePond": "Other_General"
      }
    ]
  },
  {
    "id": 3,
    "text": "What is your current approximate monthly NET take-home pay (after taxes)?",
    "options": [
      {
        "value": "Under $3,500/mo",
        "label": "Under $3,500/mo",
        "points": 10
      },
      {
        "value": "$3,500 – $5,000/mo ($60k–$85k annual)",
        "label": "$3,500 – $5,000/mo ($60k–$85k annual)",
        "points": 10
      },
      {
        "value": "$5,000 – $7,000/mo ($85k–$115k annual)",
        "label": "$5,000 – $7,000/mo ($85k–$115k annual)",
        "points": 10
      },
      {
        "value": "$7,000+/mo ($115k+ annual)",
        "label": "$7,000+/mo ($115k+ annual)",
        "points": 10
      }
    ]
  },
  {
    "id": 4,
    "text": "What is your #1 career and financial objective over the next 90 days?",
    "options": [
      {
        "value": "Land my first $10k–$15k/mo ($85–$110/hr) PM consulting contract",
        "label": "Land my first $10k–$15k/mo ($85–$110/hr) PM consulting contract",
        "points": 10
      },
      {
        "value": "Escape a capped 9-5 salary and build cash runway via contracting",
        "label": "Escape a capped 9-5 salary and build cash runway via contracting",
        "points": 10
      },
      {
        "value": "Transition into remote/hybrid Data & AI PM leadership",
        "label": "Transition into remote/hybrid Data & AI PM leadership",
        "points": 10
      },
      {
        "value": "Just researching career options for next year",
        "label": "Just researching career options for next year",
        "points": 4
      }
    ]
  },
  {
    "id": 5,
    "text": "Enterprise banks and tech firms pay PM Consultants $85–$120/hr through their own corporation rather than payroll. Are you open to operating as an incorporated contractor?",
    "options": [
      {
        "value": "Yes — a 2x–3x take-home jump is well worth setting up a corp",
        "label": "Yes — a 2x–3x take-home jump is well worth setting up a corp",
        "points": 10
      },
      {
        "value": "Open, but need guidance on corp setup, HST, and taxes",
        "label": "Open, but need guidance on corp setup, HST, and taxes",
        "points": 10
      },
      {
        "value": "Strictly looking for salaried T4/W2 employment",
        "label": "Strictly looking for salaried T4/W2 employment",
        "points": 4
      }
    ]
  },
  {
    "id": 6,
    "text": "How many times have you applied to PM, Scrum, or Analyst roles in the last 6 months without landing an interview?",
    "options": [
      {
        "value": "20+ applications with low or ghosted response rate",
        "label": "20+ applications with low or ghosted response rate",
        "points": 10
      },
      {
        "value": "5 to 20 applications with few initial screenings",
        "label": "5 to 20 applications with few initial screenings",
        "points": 10
      },
      {
        "value": "Haven't started applying yet",
        "label": "Haven't started applying yet",
        "points": 10
      },
      {
        "value": "Actively interviewing now",
        "label": "Actively interviewing now",
        "points": 10
      }
    ]
  },
  {
    "id": 7,
    "text": "Do you currently hold an active PMP certification, or are you eligible to write it?",
    "options": [
      {
        "value": "Active PMP holder",
        "label": "Active PMP holder",
        "points": 10
      },
      {
        "value": "Eligible (3+ years experience) but haven't written it yet",
        "label": "Eligible (3+ years experience) but haven't written it yet",
        "points": 10
      },
      {
        "value": "Don't know if my experience qualifies for PMP audit",
        "label": "Don't know if my experience qualifies for PMP audit",
        "points": 10
      },
      {
        "value": "Under 3 years experience",
        "label": "Under 3 years experience",
        "points": 4
      }
    ]
  },
  {
    "id": 8,
    "text": "When hiring managers evaluate your portfolio, what tangible Data/AI PM assets can you currently demonstrate?",
    "options": [
      {
        "value": "Live Jira/Linear sprint boards and PRDs",
        "label": "Live Jira/Linear sprint boards and PRDs",
        "points": 10
      },
      {
        "value": "Power BI / Tableau analytics dashboards",
        "label": "Power BI / Tableau analytics dashboards",
        "points": 10
      },
      {
        "value": "Standard text resume and spreadsheets only",
        "label": "Standard text resume and spreadsheets only",
        "points": 6
      },
      {
        "value": "No portfolio assets yet",
        "label": "No portfolio assets yet",
        "points": 4
      }
    ]
  },
  {
    "id": 9,
    "text": "If accepted into our 90-Day Consulting Accelerator, how many hours per week can you dedicate to sprints?",
    "options": [
      {
        "value": "8 to 12 hours/week (Evenings & Weekends)",
        "label": "8 to 12 hours/week (Evenings & Weekends)",
        "points": 10
      },
      {
        "value": "5 to 8 hours/week",
        "label": "5 to 8 hours/week",
        "points": 10
      },
      {
        "value": "15+ hours/week (Full immersion)",
        "label": "15+ hours/week (Full immersion)",
        "points": 10
      },
      {
        "value": "Under 5 hours/week",
        "label": "Under 5 hours/week",
        "points": 4
      }
    ]
  },
  {
    "id": 10,
    "text": "Are you in a position to invest in professional mentorship and licensing to secure a $10k–$15k/mo contract?",
    "options": [
      {
        "value": "Yes, ready to invest for guaranteed ROI and expert sprint coaching",
        "label": "Yes, ready to invest for guaranteed ROI and expert sprint coaching",
        "points": 10
      },
      {
        "value": "Yes, if founding scholarships or flexible funding are available",
        "label": "Yes, if founding scholarships or flexible funding are available",
        "points": 10
      },
      {
        "value": "Strictly seeking free advice and resources",
        "label": "Strictly seeking free advice and resources",
        "points": 0
      }
    ]
  }
];

export type QuizAnswers = Record<number, string>;
export const MAX_RAW_SCORE = QUESTIONS.reduce(
  (total, question) => total + Math.max(...question.options.map(option => option.points)), 0
);

export const summarizeQuizAnswers = (answers: QuizAnswers) => {
  const selected = (id: number) => QUESTIONS.find(question => question.id === id)
    ?.options.find(option => option.value === answers[id]);
  const rawScore = QUESTIONS.reduce((total, question) => total + (selected(question.id)?.points ?? 0), 0);
  return {
    rawScore,
    score: Math.round(rawScore / MAX_RAW_SCORE * 100),
    mqlQualified: selected(1)?.mqlQualified ?? false,
    rolePond: selected(2)?.rolePond ?? "",
    experienceBracket: selected(1)?.label ?? "",
    currentIncome: selected(3)?.label ?? "",
    contractorOpen: selected(5)?.label ?? "",
  };
};
