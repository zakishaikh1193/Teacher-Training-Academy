import React, { useState, useEffect, useRef } from 'react';
import { Bell, Plus, User, Search, ChevronDown, Users, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sidebarMenu = [
  { label: 'Analaytics Dashboard', key: 'analytics-dashboard', active: true },
  { label: 'Training Completion', key: 'training-completion' },
  { label: 'Leadership Growth', key: 'leadership-growth' },
  { label: 'Behavioral Insights', key: 'behavioral-insights' },
  { label: 'Cognitive Reports', key: 'cognitive-reports' },
  { label: 'Teaching Effectiveness', key: 'teaching-effectiveness' },
  { label: 'Collaboration Engagement', key: 'collaboration-engagement' },
  { label: 'Work Satisfaction', key: 'work-life-satisfaction' },
  // { label: 'Work Satisfaction', key: 'work-satisfaction' },
  { label: 'Platform Adoption', key: 'platform-adoption' },
];

const trainingByCategory = [
  { category: 'Pedagogical Strategies', sessions: 1872, percent: 48.6, trend: '+2.5%' },
  { category: 'EdTech Integration', sessions: 1268, percent: 36.1, trend: '+1.5%' },
  { category: 'Leadership & Classroom Mgmt', sessions: 901, percent: 23.4, trend: '-1.8%' },
];

const facultyEnrollment = [
  { id: '#T523', date: '24 April 2024', name: 'Dr. Ahmed', status: 'Completed' },
  { id: '#T652', date: '24 April 2024', name: 'Ms. Sara', status: 'Ongoing' },
  { id: '#T862', date: '20 April 2024', name: 'Mr. Rashid', status: 'Pending' },
];

const feedbackScores = [
  { id: '#98521', date: '24 April 2024', name: 'Dr. Ahmed', score: 4.8, summary: 'Excellent' },
  { id: '#20158', date: '24 April 2024', name: 'Ms. Sara', score: 4.5, summary: 'Engaging' },
  { id: '#36589', date: '20 April 2024', name: 'Mr. Rashid', score: 3.8, summary: 'Needs More Depth' },
];

// Mock data for Feedback Incorporation Rates
const feedbackData = [
  { id: 'T001', value: 63.25 },
  { id: 'T002', value: 57.5 },
  { id: 'T003', value: 62.5 }
];

// Mock data for Student Perception of Teaching Effectiveness
const perceptionData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Clarity of Instruction Score',
      type: 'areaspline', // Render this as a filled area chart with a smooth line
      color: '#D8DADD', // Light grey area and line
      data: [65, 65, 90, 97, 80, 98, 78, 86, 60, 82]
    },
    {
      name: 'Engagement Level Score',
      type: 'spline',
      color: '#5457C2', // Blue
      data: [96, 69, 92, 72, 86, 76, 90, 96, 95, 63]
    },
    {
      name: 'Fairness in Assessment Score',
      type: 'spline',
      color: '#B49733', // Gold/Mustard
      data: [64, 75, 85, 93, 76, 93, 85, 83, 68, 72]
    },
    {
      name: 'Supportiveness & Approachability Score',
      type: 'spline',
      color: '#65C453', // Green
      data: [72, 97, 85, 75, 98, 63, 68, 62, 60, 65]
    },
    {
      name: 'Overall Teaching Effectiveness Score',
      type: 'spline',
      color: '#C257A6', // Purple/Magenta
      data: [78, 77, 82, 85, 83, 82, 76, 82, 72, 70]
    }
  ]
};

// Mock data for Interdepartmental Collaboration Trends
const collaborationData = {
  // The X-axis labels combine an ID and a Department name
  categories: [
    'T001 Technology', 'T002 Physical Education', 'T003 Languages',
    'T004 Languages', 'T005 Physical Education', 'T006 Technology',
    'T007 Science', 'T008 Science', 'T009 Mathematics', 'T010 Technology'
  ],
  series: [
    {
      name: 'Collaboration with Other Departments',
      color: '#6748D7', // The primary purple color for the tall bars
      data: [69, 42, 20, 29, 97, 81, 69, 41, 86, 22]
    },
    {
      name: 'Cross-Departmental Projects Involved',
      color: '#00A071', // The teal/green color
      data: [3, 8, 1, 5, 5, 9, 3, 9, 1, 5]
    },
    {
      name: 'Interdisciplinary Teaching Sessions Led',
      color: '#D8DADD', // The light grey color
      data: [1, 3, 0.5, 1, 3, 3, 1, 4, 3, 1]
    }
  ]
};

// Mock data for Participation in Research & Development Initiatives
const initiativeData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Primary Initiative Score',
      color: '#8A56E0',
      data: [3, 3, 18, 13, 13, 11, 0, 9, 2, 15]
    },
    {
      name: 'Secondary Initiative Score',
      color: '#34D399',
      data: [12, 11, 5, 18, 17, 13, 13, 1, 2, 4]
    },
    {
      name: 'Tertiary Initiative Score',
      color: '#A78BFA',
      data: [0, 0, 4, 0, 2, 4, 0, 1, 2, 2]
    },
    {
      name: 'Overall R&D Engagement Score',
      color: '#34D399',
      lineWidth: 4,
      data: [6, 10, 4, 5, 5, 2, 4, 4, 5, 5]
    }
  ]
};

const knowledgeSharingData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Peer Mentorship Hours',
      type: 'areaspline',
      color: '#D8DADD',
      yAxis: 0,
      data: [29, 34, 30, 25, 29, 8, 47, 21, 25, 24]
    },
    {
      name: 'Workshops Attended',
      type: 'spline',
      color: '#5457C2',
      yAxis: 0,
      data: [7, 7, 3, 5, 7, 6, 7, 7, 5, 6]
    },
    {
      name: 'Sessions Conducted for Peers',
      type: 'spline',
      color: '#EAB308',
      yAxis: 0,
      data: [7, 7, 1, 6, 7, 6, 8, 7, 6, 7]
    },
    {
      name: 'Collaborative Teaching Instances',
      type: 'spline',
      color: '#65C453',
      yAxis: 0,
      data: [5, 6, 3, 6, 6, 6, 7, 7, 5, 6]
    },
    {
      name: 'Overall Knowledge Sharing Score',
      type: 'spline',
      color: '#E972E4',
      yAxis: 0,
      plotData: [29, 35, 15, 29, 29, 31, 22, 35, 28, 33],
      tooltipData: [48, 54, 41, 42, 49, 26, 69, 42, 41, 43]
    }
  ]
};

const communityData = [
  {
    id: 'T001',
    series: [
      { name: 'Discussion Forum Posts', value: 23, color: '#8B5CF6' },
      { name: 'Webinars Attended', value: 8, color: '#2DD4BF' },
      { name: 'Workshops Contributed To', value: 12, color: '#3B82F6' },
      { name: 'Collaborative Research Participation', value: 5, color: '#059669' },
      { name: 'Overall Engagement Score', value: 110, color: '#F472B6' }
    ]
  },
  {
    id: 'T002',
    series: [
      { name: 'Discussion Forum Posts', value: 45, color: '#8B5CF6' },
      { name: 'Webinars Attended', value: 4, color: '#2DD4BF' },
      { name: 'Workshops Contributed To', value: 6, color: '#3B82F6' },
      { name: 'Collaborative Research Participation', value: 2, color: '#059669' },
      { name: 'Overall Engagement Score', value: 130, color: '#F472B6' }
    ]
  },
  {
    id: 'T003',
    series: [
      { name: 'Discussion Forum Posts', value: 20, color: '#8B5CF6' },
      { name: 'Webinars Attended', value: 10, color: '#2DD4BF' },
      { name: 'Workshops Contributed To', value: 15, color: '#3B82F6' },
      { name: 'Collaborative Research Participation', value: 3, color: '#059669' },
      { name: 'Overall Engagement Score', value: 115, color: '#F472B6' }
    ]
  }
];

const attendanceData = {
  categories: ["01 Jan", "Feb '24", "Mar '24", "Apr '24", "May '24", "Jun '24", "Jul '24", "Aug '24", "Sep '24", "Oct '24"],
  series: [
    {
      name: 'Workshops Attended',
      type: 'column',
      color: '#8B5CF6',
      data: [20, 0, 30, 20, 26, 23, 30, 13, 17, 10]
    },
    {
      name: 'Conferences Attended',
      type: 'areaspline',
      color: '#2DD4BF',
      data: [3, 5, 8, 3, 7, 5, 3, 8, 7, 4]
    },
    {
      name: 'Total Participation',
      type: 'spline',
      color: '#F472B6',
      data: [23, 22, 38, 23, 33, 28, 33, 21, 24, 14]
    }
  ]
};

const satisfactionData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Work Hours per Week',
      color: '#8B5CF6',
      data: [49, 37, 42, 32, 59, 30, 38, 59, 59, 53]
    },
    {
      name: 'Personal Time Satisfaction Score',
      color: '#2DD4BF',
      data: [99, 79, 76, 68, 64, 88, 74, 91, 92, 70]
    },
    {
      name: 'Stress Management Effectiveness Score',
      color: '#E5E7EB',
      data: [91, 85, 92, 82, 0, 0, 89, 0, 0, 0]
    },
    {
      name: 'Flexibility in Work Schedule Score',
      color: '#65A30D',
      data: [92, 68, 87, 70, 80, 94, 75, 89, 75, 83]
    },
    {
      name: 'Overall Work-Life Balance Score',
      color: '#CA8A04',
      data: [92, 0, 86, 74, 79, 90, 79, 82, 86, 71]
    }
  ]
};

// Mock data for Teacher Stress & Burnout Indicators
const stressIndicatorsData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Workload Stress Score',
      type: 'column',
      color: '#8B5CF6', // Lavender/Purple
      data: [81, 81, 64, 60, 90, 100, 88, 93, 76, 66]
    },
    {
      name: 'Emotional Exhaustion Score',
      type: 'areaspline',
      color: '#2DD4BF', // Teal/Green
      data: [98, 77, 77, 65, 80, 88, 85, 87, 91, 84]
    },
    {
      name: 'Work-Life Balance Score',
      type: 'spline',
      color: '#F472B6', // Pink
      lineWidth: 4, // Make this line thicker
      data: [99, 99, 86, 86, 75, 65, 95, 86, 88, 89]
    },
    {
      name: 'Job Satisfaction Score',
      type: 'spline',
      color: '#FBBF24', // Gold/Yellow
      data: [90, 90, 79, 75, 100, 60, 68, 63, 67, 58]
    }
  ]
};

// Mock data for Job Satisfaction & Motivation Index
const motivationIndexData = [
  {
    id: 'T001',
    // The hover state content
    hoverContent: {
      label: 'Career Growth Satisfaction',
      value: '76%',
      color: '#FBBF24' // The color for the label text
    },
    // The concentric rings data
    rings: [
      { name: 'Ring 1', value: 85, color: '#8B5CF6' }, // Outer Purple
      { name: 'Ring 2', value: 75, color: '#F472B6' }, // Pink
      { name: 'Ring 3', value: 65, color: '#2DD4BF' }, // Teal
      { name: 'Ring 4', value: 55, color: '#FBBF24' }, // Yellow
      { name: 'Ring 5', value: 45, color: '#6366F1' }  // Inner Purple
    ]
  },
  {
    id: 'T002',
    hoverContent: {
      label: 'Career Growth Satisfaction',
      value: '82%',
      color: '#FBBF24'
    },
    rings: [
      { name: 'Ring 1', value: 90, color: '#8B5CF6' },
      { name: 'Ring 2', value: 40, color: '#F472B6' },
      { name: 'Ring 3', value: 80, color: '#2DD4BF' },
      { name: 'Ring 4', value: 70, color: '#FBBF24' },
      { name: 'Ring 5', value: 60, color: '#6366F1' }
    ]
  },
  {
    id: 'T003',
    hoverContent: {
      label: 'Career Growth Satisfaction',
      value: '79%',
      color: '#FBBF24'
    },
    rings: [
      { name: 'Ring 1', value: 88, color: '#8B5CF6' },
      { name: 'Ring 2', value: 78, color: '#F472B6' },
      { name: 'Ring 3', value: 48, color: '#2DD4BF' },
      { name: 'Ring 4', value: 68, color: '#FBBF24' },
      { name: 'Ring 5', value: 58, color: '#6366F1' }
    ]
  }
];

// Mock data for Psychological Safety in Work Environment
const psychologicalSafetyData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Overall Psychological Safety Index',
      type: 'areaspline',
      color: '#E5E7EB', // Light Grey
      data: [70, 70, 65, 75, 77, 68, 68, 78, 59, 68]
    },
    {
      name: 'Comfort in Expressing Ideas Score',
      type: 'spline',
      color: '#84CC16', // Light Green
      data: [80, 85, 75, 83, 73, 95, 85, 60, 60, 92]
    },
    {
      name: 'Trust in Leadership Score',
      type: 'spline',
      color: '#6366F1', // Indigo/Blue
      data: [72, 77, 70, 65, 92, 70, 80, 92, 68, 67]
    },
    {
      name: 'Peer Support & Inclusivity Score',
      type: 'spline',
      color: '#2DD4BF', // Teal
      data: [75, 70, 72, 80, 80, 70, 70, 58, 80, 82]
    },
    {
      name: 'Fear of Negative Consequences Score (Reversed)',
      type: 'spline',
      color: '#A78BFA', // Light Purple
      data: [35, 22, 20, 18, 14, 18, 34, 5, 26, 35]
    }
  ]
};

// Mock data for Impact of Workload on Performance & Satisfaction
const workloadImpactData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'Work-Life Balance Score',
      type: 'spline',
      color: '#EF4444', // Red
      lineWidth: 4, // Make this line thicker
      data: [98, 76, 92, 85, 95, 88, 92, 82, 90, 88]
    },
    {
      name: 'Job Satisfaction Score',
      type: 'spline',
      color: '#22C55E', // Green
      data: [66, 66, 95, 95, 92, 62, 80, 80, 85, 88]
    },
    {
      name: 'Performance Evaluation Score',
      type: 'spline',
      color: '#FBBF24', // Yellow/Gold
      data: [62, 62, 70, 92, 82, 82, 85, 88, 82, 85]
    },
    {
      name: 'Weekly Work Hours',
      type: 'spline',
      color: '#3B82F6', // Blue
      data: [56, 56, 92, 90, 90, 82, 55, 38, 38, 50]
    },
    {
      name: 'Workload Impact Index',
      type: 'spline',
      color: '#6366F1', // Indigo/Purple
      data: [-12, -12, -38, -62, -38, -40, -22, -42, -45, -35]
    }
  ]
};

// Mock data for Platform Usage Over Time
const platformUsageData = {
  categories: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10'],
  series: [
    {
      name: 'McGraw Hill Usage (Hours)',
      type: 'spline',
      color: '#6366F1', // Indigo/Purple
      data: [225, 345, 374, 160, 424, 447, 152, 377, 448, 405]
    },
    {
      name: 'PowerSchool Usage (Hours)',
      type: 'spline',
      color: '#22C55E', // Green
      data: [271, 417, 364, 158, 463, 172, 390, 330, 165, 252]
    },
    {
      name: 'KODEIT Usage (Hours)',
      type: 'spline',
      color: '#F59E0B', // Amber/Gold
      data: [247, 101, 447, 271, 448, 322, 449, 393, 281, 410]
    }
  ]
};

// Mock data for Adoption Rate by Faculty
const facultyAdoptionData = {
  categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
  series: [
    {
      name: 'McGraw Hill Adoption',
      color: '#6366F1', // Medium Purple
      data: [61, 79, 61, 63, 59, 69, 52, 51, 89, 31]
    },
    {
      name: 'PowerSchool Adoption',
      color: '#22C55E', // Green
      data: [47, 66, 34, 70, 51, 83, 55, 58, 50, 29]
    },
    {
      name: 'KODEIT Adoption',
      color: '#E5E7EB', // Light Grey
      data: [29, 0, 28, 65, 85, 95, 91, 0, 90, 76] // Using 0 for missing bars
    },
    {
      name: 'Overall Adoption Rate',
      color: '#8B5CF6', // Darker Purple
      data: [48, 81, 42, 58, 39, 83, 66, 51, 76, 45]
    }
  ]
};

// Mock data for Most Accessed Features per Platform
const platformFeaturesData = {
  'McGraw Hill': [
    { name: 'Digital Textbooks', value: 45, color: '#8B5CF6' },
    { name: 'Assessment Tools', value: 96, color: '#2DD4BF' },
    { name: 'Interactive Exercises', value: 92, color: '#3B82F6' }
  ],
  'PowerSchool': [
    { name: 'Gradebook', value: 60, color: '#8B5CF6' },
    { name: 'Attendance Tracking', value: 85, color: '#2DD4BF' },
    { name: 'Parent Communication', value: 40, color: '#3B82F6' }
  ],
  'KODEIT': [
    { name: 'Coding Challenges', value: 75, color: '#8B5CF6' },
    { name: 'Project-Based Learning', value: 55, color: '#2DD4BF' },
    { name: 'Gamified Learning Modules', value: 35, color: '#3B82F6' }
  ]
};

  // Time Spent per Platform Data
  const timeSpentData = {
    categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
    series: [
      {
        name: 'Total Time Spent (Hours)',
        type: 'areaspline',
        color: '#E5E7EB', // Light Grey
        data: [92, 58, 65, 98, 62, 105, 87, 105, 85, 78]
      },
      {
        name: 'McGraw Hill Time (Hours)',
        type: 'spline',
        color: '#8B5CF6', // Purple
        data: [15, 20, 12, 23, 32, 22, 41, 15, 30, 35]
      },
      {
        name: 'PowerSchool Time (Hours)',
        type: 'spline',
        color: '#22C55E', // Green
        data: [50, 32, 43, 44, 25, 30, 10, 41, 32, 38]
      },
      {
        name: 'KODEIT Time (Hours)',
        type: 'spline',
        color: '#EF4444', // Red
        data: [28, 5, 12, 32, 15, 25, 36, 49, 22, 5]
      }
    ]
  };

  // Assessment Completion Rates Data
  const assessmentRatesData = {
    categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
    series: [
      {
        name: 'McGraw Hill Assessments Completed',
        type: 'column',
        color: '#6366F1', // Purple
        data: [18, 19, 41, 0, 15, 26, 31, 20, 33, 23]
      },
      {
        name: 'PowerSchool Assessments Completed',
        type: 'areaspline',
        color: '#2DD4BF', // Teal/Green with semi-transparent fill
        data: [20, 31, 20, 25, 35, 25, 28, 29, 30, 45]
      },
      {
        name: 'KODEIT Assessments Completed',
        type: 'spline',
        color: '#F472B6', // Pink
        lineWidth: 4, // Make this line thicker
        data: [29, 20, 38, 40, 40, 39, 47, 18, 25, 30]
      },
      {
        name: 'Total Assessments Completed',
        type: 'spline',
        color: '#FCA5A5', // Light Red
        data: [62, 68, 85, 102, 90, 90, 110, 68, 85, 100]
      }
    ]
  };

  // Platform Satisfaction & User Feedback Scores Data
  const feedbackScoresData = [
    {
      id: 'T001',
      data: [
        { name: 'McGraw Hill Satisfaction Score', value: 69, color: '#A78BFA' }, // Light Purple
        { name: 'PowerSchool Satisfaction Score', value: 85, color: '#4ADE80' }, // Light Green
        { name: 'KODEIT Satisfaction Score', value: 92, color: '#3B82F6' }, // Medium Blue
        { name: 'Overall Satisfaction Score', value: 110, color: '#0D9488' }  // Dark Teal/Green
      ]
    },
    {
      id: 'T002',
      data: [
        { name: 'McGraw Hill Satisfaction Score', value: 80, color: '#A78BFA' },
        { name: 'PowerSchool Satisfaction Score', value: 70, color: '#4ADE80' },
        { name: 'KODEIT Satisfaction Score', value: 88, color: '#3B82F6' },
        { name: 'Overall Satisfaction Score', value: 100, color: '#0D9488' }
      ]
    },
    {
      id: 'T003',
      data: [
        { name: 'McGraw Hill Satisfaction Score', value: 75, color: '#A78BFA' },
        { name: 'PowerSchool Satisfaction Score', value: 90, color: '#4ADE80' },
        { name: 'KODEIT Satisfaction Score', value: 85, color: '#3B82F6' },
        { name: 'Overall Satisfaction Score', value: 105, color: '#0D9488' }
      ]
    },
    {
      id: 'T004',
      data: [
        { name: 'McGraw Hill Satisfaction Score', value: 65, color: '#A78BFA' },
        { name: 'PowerSchool Satisfaction Score', value: 95, color: '#4ADE80' },
        { name: 'KODEIT Satisfaction Score', value: 78, color: '#3B82F6' },
        { name: 'Overall Satisfaction Score', value: 98, color: '#0D9488' }
      ]
    }
  ];

  // Correlation Between Platform Usage & Teaching Effectiveness Data
  const correlationData = {
    categories: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010'],
    series: [
      {
        name: 'Total Platform Usage Hours',
        color: '#8B5CF6', // Purple
        data: [160, 60, 160, 90, 250, 95, 140, 115, 130, 160]
      },
      {
        name: 'Teaching Effectiveness Score',
        color: '#2DD4BF', // Teal/Green
        data: [90, 80, 70, 50, 60, 95, 70, 80, 70, 70]
      }
    ]
  };

  // Training & Support Ticket Trends Data
  const ticketTrendsData = {
    categories: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10'],
    series: [
      // Order matters for stacking: bottom layer first.
      {
        name: 'McGraw Hill Support Tickets',
        type: 'areaspline',
        color: '#8B5CF6', // Purple
        data: [12, 15, 18, 25, 45, 30, 15, 5, 10, 45]
      },
      {
        name: 'KODEIT Support Tickets',
        type: 'areaspline',
        color: '#E5E7EB', // Light Grey
        data: [39, 42, 40, 35, 25, 20, 10, 2, 25, 45]
      },
      {
        name: 'PowerSchool Support Tickets',
        type: 'areaspline',
        color: '#F59E0B', // Amber/Gold
        data: [45, 35, 30, 20, 15, 35, 25, 5, 20, 40]
      },
      {
        // This is the top layer that completes the stack
        name: 'Total Support Tickets', // Visually represented by the top edge of the stack
        type: 'areaspline',
        color: '#22C55E', // Green
        // The data for this series is the sum of the others at each point.
        // E.g., for 2024-01: 12 + 39 + 45 = 96
        // The chart library should handle the stacking to create this total line.
        // We still define it for the tooltip and markers.
        data: [96, 92, 88, 80, 85, 85, 50, 12, 55, 130] // This data is for the tooltip/markers
      }
    ]
  };

const topCards = [
  {
    title: 'Total Training Cost Saved',
    value: '$78.8k',
    icon: <Clock className="w-6 h-6 text-purple-400" />, // Use a relevant icon
    iconBg: 'bg-purple-100',
  },
  {
    title: 'New Users',
    value: '2,150',
    icon: <Activity className="w-6 h-6 text-purple-400" />, // Use a relevant icon
    iconBg: 'bg-purple-100',
  },
  {
    title: 'Total Active Users',
    value: '1,784',
    icon: <Users className="w-6 h-6 text-purple-400" />, // Use a relevant icon
    iconBg: 'bg-purple-100',
  },
  {
    title: 'Learning Effectiveness Improved',
    value: '12.3%',
    icon: <User className="w-6 h-6 text-purple-400" />, // Use a relevant icon
    iconBg: 'bg-purple-100',
  },
];

const trainingParticipationData = [
  { month: '2024-01', value: 143 },
  { month: '2024-02', value: 92 },
  { month: '2024-03', value: 144 },
  { month: '2024-04', value: 135 },
  { month: '2024-05', value: 121 },
  { month: '2024-06', value: 183 },
  { month: '2024-07', value: 72 },
  { month: '2024-08', value: 106 },
];

const donutData = [
  { label: 'T001', value: 10, color: '#6366f1' },
  { label: 'T002', value: 8, color: '#06b6d4' },
  { label: 'T003', value: 12, color: '#3b82f6' },
  { label: 'T004', value: 14, color: '#14b8a6' },
  { label: 'T005', value: 9, color: '#f43f5e' },
  { label: 'T006', value: 11, color: '#818cf8' },
  { label: 'T007', value: 7, color: '#38bdf8' },
  { label: 'T008', value: 13, color: '#6366f1' },
  { label: 'T009', value: 15, color: '#14b8a6' },
  { label: 'T010', value: 10, color: '#a5b4fc' },
];

const completionRateData = [
  { program: 'Active Learning Strategies', rate: 95 },
  { program: 'Classroom Management', rate: 78 },
  { program: 'EdTech Integration', rate: 82 },
  { program: 'Assessment & Feedback', rate: 85 },
  { program: 'Differentiated Instruction', rate: 80 },
  { program: 'Inclusive Teaching', rate: 90 },
  { program: 'Student Engagement Tec...', rate: 68 },
  { program: 'Digital Tools for Educators', rate: 80 },
  { program: 'Leadership in Education', rate: 75 },
  { program: 'Curriculum Design', rate: 88 },
];

const dropoffData = [
  { program: 'Active Learning Strategies', enrollment: 116, completed: 88, dropoff: -31.82 },
  { program: 'Classroom Management', enrollment: 181, completed: 69, dropoff: 61.88 },
  { program: 'EdTech Integration', enrollment: 163, completed: 141, dropoff: 15.6 },
  { program: 'Assessment & Feedback', enrollment: 88, completed: 73, dropoff: 17.05 },
  { program: 'Differentiated Instruction', enrollment: 115, completed: 62, dropoff: 46.09 },
  { program: 'Inclusive Teaching', enrollment: 165, completed: 124, dropoff: 24.85 },
  { program: 'Student Engagement Techniques', enrollment: 137, completed: 41, dropoff: 70.07 },
  { program: 'Leadership in Education', enrollment: 150, completed: 76, dropoff: 49.33 },
  { program: 'Curriculum Design', enrollment: 102, completed: 59, dropoff: -72.88 },
];

const completionModeData = [
  { program: 'Active Learning Strategies', self: 30.12, instructor: 30.12 },
  { program: 'Classroom Management', self: 60.45, instructor: 60.45 },
  { program: 'EdTech Integration', self: 58.92, instructor: 59.74 },
  { program: 'Assessment & Feedback', self: 20.11, instructor: 21.05 },
  { program: 'Differentiated Instruction', self: 32.88, instructor: 33.12 },
  { program: 'Inclusive Teaching', self: 62.01, instructor: 62.01 },
  { program: 'Student Engagement Techniques', self: 51.22, instructor: 51.22 },
  { program: 'Digital Tools for Educators', self: 28.45, instructor: 28.45 },
  { program: 'Leadership in Education', self: 35.67, instructor: 36.12 },
  { program: 'Curriculum Design', self: 41.23, instructor: 41.23 },
];

const readinessMetrics = [
  { key: 'communication', label: 'Communication Skills', color: '#6366f1' },
  { key: 'decision', label: 'Decision Making', color: '#14b8a6' },
  { key: 'problem', label: 'Problem-Solving', color: '#a3a3a3' },
  { key: 'team', label: 'Team Collaboration', color: '#ef4444' },
  { key: 'adapt', label: 'Adaptability', color: '#fbbf24' },
  { key: 'readiness', label: 'Readiness', color: '#38bdf8' },
];
const readinessData = [
  { teacher: 'T001', communication: 75, decision: 97, problem: 80, team: 93, adapt: 70, readiness: 80 },
  { teacher: 'T002', communication: 67, decision: 78, problem: 88, team: 77, adapt: 80, readiness: 79 },
  { teacher: 'T003', communication: 62, decision: 99, problem: 70, team: 100, adapt: 89, readiness: 78 },
  { teacher: 'T004', communication: 92, decision: 85, problem: 97, team: 91, adapt: 72, readiness: 88 },
  { teacher: 'T005', communication: 74, decision: 90, problem: 65, team: 76, adapt: 68, readiness: 80 },
  { teacher: 'T006', communication: 98, decision: 63, problem: 60, team: 88, adapt: 78, readiness: 78 },
  { teacher: 'T007', communication: 89, decision: 79, problem: 85, team: 99, adapt: 87, readiness: 86 },
  { teacher: 'T008', communication: 77, decision: 74, problem: 82, team: 67, adapt: 65, readiness: 76 },
  { teacher: 'T009', communication: 90, decision: 80, problem: 78, team: 95, adapt: 73, readiness: 83 },
  { teacher: 'T010', communication: 82, decision: 72, problem: 66, team: 92, adapt: 79, readiness: 78 },
];

const mentorshipMetrics = [
  { key: 'mentorship', label: 'Mentorship Hours Completed', color: '#14b8a6' },
  { key: 'coaching', label: 'Coaching Sessions Attended', color: '#fbbf24' },
  { key: 'feedback', label: 'Feedback Score (Out of 5)', color: '#ef4444' },
  { key: 'improvement', label: 'Improvement Noted (%)', color: '#3b82f6' },
];
const mentorshipData = [
  { teacher: 'T001', mentorship: 12, coaching: 8, feedback: 4.2, improvement: 38 },
  { teacher: 'T002', mentorship: 15, coaching: 10, feedback: 4.5, improvement: 41 },
  { teacher: 'T003', mentorship: 18, coaching: 11, feedback: 4.0, improvement: 36 },
  { teacher: 'T004', mentorship: 20, coaching: 13, feedback: 4.7, improvement: 44 },
  { teacher: 'T005', mentorship: 17, coaching: 9, feedback: 4.1, improvement: 48 },
  { teacher: 'T006', mentorship: 14, coaching: 7, feedback: 3.9, improvement: 29 },
  { teacher: 'T007', mentorship: 19, coaching: 12, feedback: 4.8, improvement: 50 },
  { teacher: 'T008', mentorship: 16, coaching: 8, feedback: 4.3, improvement: 33 },
  { teacher: 'T009', mentorship: 13, coaching: 6, feedback: 4.0, improvement: 22 },
  { teacher: 'T010', mentorship: 11, coaching: 5, feedback: 3.8, improvement: 20 },
];

const leadershipProgressionMetrics = [
  { key: 'communication', label: 'Communication Skills', color: '#6366f1' },
  { key: 'decision', label: 'Decision Making', color: '#22c55e' },
  { key: 'problem', label: 'Problem-Solving', color: '#3b82f6' },
  { key: 'team', label: 'Team Collaboration', color: '#a21caf' },
  { key: 'adapt', label: 'Adaptability', color: '#fbbf24' },
];
const leadershipProgressionData = [
  { month: '2024-01', communication: 80, decision: 98, problem: 74, team: 86, adapt: 98 },
  { month: '2024-02', communication: 85, decision: 76.4, problem: 69, team: 85, adapt: 85 },
  { month: '2024-03', communication: 79.6, decision: 71, problem: 71, team: 90, adapt: 79.6 },
  { month: '2024-04', communication: 87, decision: 89, problem: 75, team: 90, adapt: 60 },
  { month: '2024-05', communication: 96, decision: 80.2, problem: 75, team: 95, adapt: 85 },
  { month: '2024-06', communication: 95, decision: 80.6, problem: 67, team: 61, adapt: 85 },
  { month: '2024-07', communication: 88, decision: 76.4, problem: 71, team: 88, adapt: 71 },
  { month: '2024-08', communication: 98, decision: 77, problem: 69, team: 92, adapt: 80 },
  { month: '2024-09', communication: 100, decision: 82.2, problem: 60, team: 97, adapt: 60 },
  { month: '2024-10', communication: 92, decision: 95, problem: 64, team: 73, adapt: 87 },
];

const personalityTraits = [
  { key: 'openness', label: 'Big Five Trait - Openness (%)', color: '#6366f1' },
  { key: 'conscientiousness', label: 'Big Five Trait - Conscientiousness (%)', color: '#14b8a6' },
  { key: 'extraversion', label: 'Big Five Trait - Extraversion (%)', color: '#a3a3a3' },
  { key: 'agreeableness', label: 'Big Five Trait - Agreeableness (%)', color: '#fbbf24' },
  { key: 'neuroticism', label: 'Big Five Trait - Neuroticism (%)', color: '#8b5cf6' },
];
const personalityData = [
  { teacher: 'T001 INFP', openness: 68, conscientiousness: 93, extraversion: 59, agreeableness: 78, neuroticism: 54 },
  { teacher: 'T002 ISFJ', openness: 84, conscientiousness: 54, extraversion: 89, agreeableness: 69, neuroticism: 41 },
  { teacher: 'T003 INTJ', openness: 97, conscientiousness: 74, extraversion: 83, agreeableness: 87, neuroticism: 54 },
  { teacher: 'T004 INFP', openness: 61, conscientiousness: 75, extraversion: 62, agreeableness: 71, neuroticism: 29 },
  { teacher: 'T005 ISTP', openness: 77, conscientiousness: 78, extraversion: 91, agreeableness: 84, neuroticism: 42 },
  { teacher: 'T006 ENFP', openness: 71, conscientiousness: 66, extraversion: 54, agreeableness: 61, neuroticism: 29 },
  { teacher: 'T007 INFJ', openness: 54, conscientiousness: 99, extraversion: 81, agreeableness: 79, neuroticism: 89 },
  { teacher: 'T008 INTJ', openness: 91, conscientiousness: 90, extraversion: 54, agreeableness: 61, neuroticism: 69 },
  { teacher: 'T009 INTJ', openness: 87, conscientiousness: 71, extraversion: 77, agreeableness: 80, neuroticism: 89 },
  { teacher: 'T010 INFJ', openness: 98, conscientiousness: 74, extraversion: 89, agreeableness: 88, neuroticism: 87 },
];

const eiMetrics = [
  { key: 'motivation', label: 'Motivation Score', color: '#3b82f6' }, // blue
  { key: 'selfReg', label: 'Self-Regulation Score', color: '#06b6d4' }, // teal
  { key: 'empathy', label: 'Empathy Score', color: '#f59e42' }, // orange
  { key: 'awareness', label: 'Self-Awareness Score', color: '#a78bfa' }, // purple
  { key: 'social', label: 'Social Skills Score', color: '#f472b6' }, // pink
];
const eiData = [
  { group: 'Group A', motivation: 85, selfReg: 78, empathy: 92, awareness: 88, social: 90 },
  { group: 'Group B', motivation: 92, selfReg: 85, empathy: 88, awareness: 91, social: 87 },
  { group: 'Group C', motivation: 78, selfReg: 90, empathy: 85, awareness: 89, social: 93 },
];

const workstyleData = [
  { category: 'D1 Independent', conflict: 82, teamwork: 75, communication: 88 },
  { category: 'T002 Independent', conflict: 78, teamwork: 68, communication: 85 },
  { category: 'T003 Flexible', conflict: 85, teamwork: 72, communication: 90 },
  { category: 'T004 Structured', conflict: 70, teamwork: 67, communication: 97 },
  { category: 'T006 Structured', conflict: 88, teamwork: 85, communication: 92 },
  { category: 'T007 Structured', conflict: 92, teamwork: 91, communication: 89 },
  { category: 'T008 Structured', conflict: 87, teamwork: 88, communication: 94 },
  { category: 'T009 Hybrid', conflict: 90, teamwork: 86, communication: 96 },
  { category: 'T010 Structured', conflict: 83, teamwork: 62, communication: 91 },
];

const workstyleMetrics = [
  { key: 'conflict', label: 'Conflict Resolution Score', color: '#9ca3af' }, // grey
  { key: 'teamwork', label: 'Teamwork Effectiveness Score', color: '#8b5cf6' }, // purple
  { key: 'communication', label: 'Communication Adaptability Score', color: '#10b981' }, // green
];

const workstyleCollabData = [
  { category: 'D1 Independent', conflict: 80, teamwork: 75, communication: 77 },
  { category: 'T002 Independent', conflict: 95, teamwork: 65, communication: 75 },
  { category: 'T003 Flexible', conflict: 65, teamwork: 75, communication: 70 },
  { category: 'T004 Structured', conflict: 70, teamwork: 67, communication: 88 },
  { category: 'T005 Structured', conflict: 78, teamwork: 67, communication: 88 },
  { category: 'T006 Structured', conflict: 90, teamwork: 70, communication: 80 },
  { category: 'T007 Structured', conflict: 100, teamwork: 75, communication: 85 },
  { category: 'T008 Structured', conflict: 120, teamwork: 80, communication: 90 },
  { category: 'T009 Hybrid', conflict: 110, teamwork: 65, communication: 75 },
  { category: 'T010 Structured', conflict: 130, teamwork: 85, communication: 60 },
];

// Data for the Adaptability & Resilience Index Chart
const adaptabilityResilienceMetrics = [
  { key: 'stress', label: 'Stress Management Score', color: '#6366f1' },
  { key: 'adaptToChange', label: 'Adaptability to Change Score', color: '#14b8a6' },
  { key: 'resilience', label: 'Resilience Under Pressure Score', color: '#8b5cf6' },
  { key: 'crisis', label: 'Crisis Response Effectiveness Score', color: '#2dd4bf' },
  { key: 'index', label: 'Adaptability & Resilience Index', color: '#a78bfa' },
];

const adaptabilityResilienceData = [
  { category: 'New Teachers', stress: 86, adaptToChange: 82, resilience: 94, crisis: 77, index: 84.75 },
  { category: 'Experienced Teachers', stress: 95, adaptToChange: 88, resilience: 91, crisis: 85, index: 89.5 },
  { category: 'Mentors', stress: 62, adaptToChange: 75, resilience: 68, crisis: 80, index: 71.25 },
  { category: 'Department Heads', stress: 60, adaptToChange: 68.25, resilience: 76, crisis: 71, index: 68.81 },
  { category: 'Subject Specialists', stress: 71, adaptToChange: 63, resilience: 92, crisis: 88, index: 78.5 },
  { category: 'Innovative Educators', stress: 61, adaptToChange: 89, resilience: 77, crisis: 80, index: 76.75 },
  { category: 'Tech-Savvy Teachers', stress: 86, adaptToChange: 63, resilience: 95, crisis: 89, index: 83.25 },
  { category: 'Student-Centered Teachers', stress: 62, adaptToChange: 87, resilience: 79.25, crisis: 82, index: 77.56 },
  { category: 'Leadership Track Faculty', stress: 61, adaptToChange: 100, resilience: 65, crisis: 71.5, index: 74.38 },
  { category: 'Pedagogical Experts', stress: 67, adaptToChange: 94, resilience: 86, crisis: 82, index: 82.25 },
];

const criticalThinkingData = [
  { category: 'T001', value: 78.50 },
  { category: 'T002', value: 77.25 },
  { category: 'T003', value: 81.00 },
  { category: 'T004', value: 71.75 },
  { category: 'T005', value: 78.00 },
  { category: 'T006', value: 78.25 },
  { category: 'T007', value: 78.50 },
  { category: 'T008', value: 82.00 },
  { category: 'T009', value: 88.00 },
  { category: 'T010', value: 86.50 },
];

const creativityInnovationMetrics = [
  { key: 'openness', label: 'Openness to New Ideas Score', color: '#6366f1' }, // Indigo
  { key: 'innovation', label: 'Innovation in Teaching Methods Score', color: '#14b8a6' }, // Teal
  { key: 'experimentation', label: 'Experimentation & Risk-taking Score', color: '#d1d5db' }, // Gray
  { key: 'adaptation', label: 'Adaptation to Emerging Trends Score', color: '#a1a100' }, // Olive
  { key: 'creativity', label: 'Creativity & Innovation Index', color: '#c026d3' }, // Magenta
];

const creativityInnovationData = [
  { category: 'T001', openness: 68, innovation: 83, experimentation: 84, adaptation: 60, creativity: 74 },
  { category: 'T002', openness: 98, innovation: 91, experimentation: 68, adaptation: 77, creativity: 81 },
  { category: 'T003', openness: 73, innovation: 93, experimentation: 85, adaptation: 69, creativity: 79 },
  { category: 'T004', openness: 59, innovation: 75, experimentation: 94, adaptation: 100, creativity: 82 },
  { category: 'T005', openness: 64, innovation: 68, experimentation: 90, adaptation: 65, creativity: 71 },
  { category: 'T006', openness: 77, innovation: 78, experimentation: 99, adaptation: 77, creativity: 78 },
  { category: 'T007', openness: 83, innovation: 88, experimentation: 74, adaptation: 77, creativity: 81 },
  { category: 'T008', openness: 63, innovation: 83, experimentation: 71, adaptation: 80, creativity: 74 },
  { category: 'T009', openness: 61, innovation: 78, experimentation: 71, adaptation: 98, creativity: 77 },
  { category: 'T010', openness: 88, innovation: 62, experimentation: 89, adaptation: 66, creativity: 76 },
];

const cognitiveLoadMetrics = [
  { key: 'workingMemory', label: 'Working Memory Capacity Score', color: '#8b5cf6', patternId: 'pattern-vert-lines' },
  { key: 'processingSpeed', label: 'Processing Speed Score', color: '#3b82f6', patternId: 'pattern-horiz-lines' },
  { key: 'infoRetention', label: 'Information Retention Score', color: '#2dd4bf', patternId: 'pattern-grid' },
  { key: 'loadManagement', label: 'Cognitive Load Management Score', color: '#14b8a6', patternId: 'pattern-dots' },
  { key: 'index', label: 'Cognitive Load & Processing Speed Index', color: '#ef4444' }
];

const cognitiveLoadData = [
  {
    teacherId: 'T001',
    scores: { workingMemory: 25, processingSpeed: 25, infoRetention: 25, loadManagement: 25 },
    index: 82.75
  },
  {
    teacherId: 'T002',
    scores: { workingMemory: 25, processingSpeed: 25, infoRetention: 25, loadManagement: 25 },
    index: 85.50
  },
  {
    teacherId: 'T003',
    scores: { workingMemory: 25, processingSpeed: 25, infoRetention: 25, loadManagement: 25 },
    index: 81.00
  },
];

// Data for Learning Style Preference Report
const learningStyleMetrics = [
  { key: 'visual', label: 'Visual Learning Preference (%)', color: '#d1d5db' }, // Gray
  { key: 'auditory', label: 'Auditory Learning Preference (%)', color: '#6366f1' }, // Indigo
  { key: 'kinesthetic', label: 'Kinesthetic Learning Preference (%)', color: '#34d399' }, // Teal
];

const learningStyleData = [
  { category: 'T001', visual: 28, auditory: 28, kinesthetic: 45 },
  { category: 'T002', visual: 41, auditory: 40, kinesthetic: 26 },
  { category: 'T003', visual: 36, auditory: 20, kinesthetic: 41 },
  { category: 'T004', visual: 43, auditory: 42, kinesthetic: 20 },
  { category: 'T005', visual: 20, auditory: 35, kinesthetic: 52 },
  { category: 'T006', visual: 32, auditory: 31, kinesthetic: 35 },
  { category: 'T007', visual: 36, auditory: 35, kinesthetic: 28 },
  { category: 'T008', visual: 52, auditory: 32, kinesthetic: 35 },
  { category: 'T009', visual: 30, auditory: 56, kinesthetic: 39 },
  { category: 'T010', visual: 35, auditory: 38, kinesthetic: 27 },
];

// Data for Self-Efficacy & Confidence Growth Over Time
const selfEfficacyMetrics = [
  { key: 'task', label: 'Task Confidence Score', color: '#818cf8', type: 'bar' }, // Light Indigo
  { key: 'problem', label: 'Problem-Solving Confidence Score', color: '#34d399', type: 'area' }, // Teal
  { key: 'adaptability', label: 'Adaptability Confidence Score', color: '#fcd34d', type: 'area' }, // Yellow
  { key: 'decision', label: 'Decision-Making Confidence Score', color: '#fb7185', type: 'area' }, // Rose
  { key: 'index', label: 'Self-Efficacy & Confidence Index', color: '#f43f5e', type: 'line' }, // Red
];

const selfEfficacyData = [
  { month: 'Jan \'24', task: 74, problem: 88, adaptability: 80, decision: 85, index: 82 },
  { month: 'Feb \'24', task: 70, problem: 78, adaptability: 75, decision: 72, index: 74 },
  { month: 'Mar \'24', task: 89, problem: 68, adaptability: 72, decision: 80, index: 77 },
  { month: 'Apr \'24', task: 77, problem: 94, adaptability: 78, decision: 95, index: 86 },
  { month: 'May \'24', task: 88, problem: 66, adaptability: 90, decision: 98, index: 85 },
  { month: 'Jun \'24', task: 77, problem: 78, adaptability: 74, decision: 88, index: 79 },
  { month: 'Jul \'24', task: 65, problem: 75, adaptability: 88, decision: 80, index: 77 },
  { month: 'Aug \'24', task: 69, problem: 84, adaptability: 94, decision: 78, index: 81 },
  { month: 'Sep \'24', task: 72, problem: 78, adaptability: 80, decision: 70, index: 75 },
  { month: 'Oct \'24', task: 72, problem: 78, adaptability: 78, decision: 68, index: 74 },
];

const teachingCompetencyMetrics = [
  { key: 'subjectKnowledge', label: 'Subject Knowledge Score', color: '#8b5cf6' }, // Purple
  { key: 'classroomManagement', label: 'Classroom Management Score', color: '#06b6d4' }, // Light Blue/Cyan
  { key: 'instructionalDesign', label: 'Instructional Design Score', color: '#3b82f6' }, // Blue
  { key: 'studentEngagement', label: 'Student Engagement Score', color: '#14b8a6' }, // Teal/Green
  { key: 'overallCompetency', label: 'Overall Teaching Competency Score', color: '#ec4899' }, // Pink/Red
];

const teachingCompetencyData = [
  {
    sessionTitle: 'Session 1',
    scores: { subjectKnowledge: 88, classroomManagement: 75, instructionalDesign: 92, studentEngagement: 85, overallCompetency: 80 }
  },
  {
    sessionTitle: 'Session 2',
    scores: { subjectKnowledge: 85, classroomManagement: 78, instructionalDesign: 88, studentEngagement: 83, overallCompetency: 82 }
  },
  {
    sessionTitle: 'Session 3',
    scores: { subjectKnowledge: 92, classroomManagement: 80, instructionalDesign: 95, studentEngagement: 88, overallCompetency: 90 }
  },
];

const activeLearningMetrics = [
  { key: 'inquiryBased', label: 'Inquiry-Based Learning', color: '#f59e0b' }, // Amber
  { key: 'projectBased', label: 'Project-Based Learning', color: '#14b8a6' }, // Teal
  { key: 'collaborative', label: 'Collaborative Learning', color: '#ec4899' }, // Pink
  { key: 'flippedClassroom', label: 'Flipped Classroom', color: '#6366f1' }, // Indigo
];

const activeLearningData = [
  {
    teacherId: 'T001',
    rates: { inquiryBased: 53, projectBased: 75, collaborative: 68, flippedClassroom: 82 },
    total: 70
  },
  {
    teacherId: 'T002',
    rates: { inquiryBased: 65, projectBased: 82, collaborative: 55, flippedClassroom: 78 },
    total: 70
  },
  {
    teacherId: 'T003',
    rates: { inquiryBased: 48, projectBased: 68, collaborative: 72, flippedClassroom: 90 },
    total: 70
  },
];

const assessmentDesignMetrics = [
  { key: 'clarity', label: 'Assessment Clarity Score', color: '#6366f1' }, // Indigo
  { key: 'alignment', label: 'Alignment with Learning Objectives Score', color: '#14b8a6' }, // Teal
  { key: 'diversity', label: 'Question Diversity Score', color: '#d1d5db' }, // Gray
  { key: 'fairness', label: 'Fairness & Bias-Free Design Score', color: '#be185d' }, // Rose/Magenta
  { key: 'quality', label: 'Overall Assessment Quality Score', color: '#a1a100' }, // Olive
];

const assessmentDesignData = [
  { category: 'T001', clarity: 63, alignment: 67, diversity: 60, fairness: 69, quality: 64 },
  { category: 'T002', clarity: 61, alignment: 91, diversity: 65, fairness: 79, quality: 97 },
  { category: 'T003', clarity: 69, alignment: 85, diversity: 84, fairness: 84, quality: 84 },
  { category: 'T004', clarity: 77, alignment: 84, diversity: 90, fairness: 84, quality: 84 },
  { category: 'T005', clarity: 64, alignment: 68, diversity: 62, fairness: 93, quality: 71 },
  { category: 'T006', clarity: 76, alignment: 97, diversity: 70, fairness: 68, quality: 77 },
  { category: 'T007', clarity: 87, alignment: 85, diversity: 73, fairness: 72, quality: 84 },
  { category: 'T008', clarity: 98, alignment: 80, diversity: 75, fairness: 78, quality: 77 },
  { category: 'T009', clarity: 59, alignment: 64, diversity: 100, fairness: 72, quality: 72 },
  { category: 'T010', clarity: 83, alignment: 96, diversity: 100, fairness: 75, quality: 88 },
];



// Add smooth curve function before the component
const createSmoothCurve = (points: {x: number, y: number}[], tension: number = 0.3): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    // Calculate control points
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    
    const cp1x = current.x + dx * tension;
    const cp1y = current.y + dy * tension;
    const cp2x = next.x - dx * tension;
    const cp2y = next.y - dy * tension;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return path;
};

const createRingSegment = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string, animationProgress: number = 1) => {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  
  const animatedEndRad = startRad + (endRad - startRad) * animationProgress;
  
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(animatedEndRad);
  const y2 = centerY + radius * Math.sin(animatedEndRad);
  
  const largeArcFlag = Math.abs(animatedEndRad - startRad) > Math.PI ? 1 : 0;
  
  return {
    path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    color
  };
};

export const AIAnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('analytics-dashboard');
  // For animated bar chart
  const [barHeights, setBarHeights] = useState<number[]>(trainingParticipationData.map(() => 0));
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  // For animated donut chart
  const [donutPercents, setDonutPercents] = useState<number[]>(donutData.map(() => 0));
  const [hoveredDonut, setHoveredDonut] = useState<number | null>(null);
  const [completionBarWidths, setCompletionBarWidths] = useState<number[]>(completionRateData.map(() => 0));
  const [dropoffAnim, setDropoffAnim] = useState(0);
  const [dropoffHover, setDropoffHover] = useState<number | null>(1); // Default to 1 for initial static tooltip
  const [completionModeAnim, setCompletionModeAnim] = useState(0);
  const [completionModeHover, setCompletionModeHover] = useState<{i: number, type: 'self'|'instructor'}|null>(null);
  const [readinessAnim, setReadinessAnim] = useState(0);
  const [readinessHover, setReadinessHover] = useState<{i: number, m: string}|null>(null);
  const [mentorshipAnim, setMentorshipAnim] = useState(0);
  const [mentorshipHover, setMentorshipHover] = useState<{i: number, m: string}|null>(null);
  const [leadershipAnim, setLeadershipAnim] = useState(0);
  const [leadershipHover, setLeadershipHover] = useState<number|null>(3);
  const [personalityAnim, setPersonalityAnim] = useState(0);
  const [personalityHover, setPersonalityHover] = useState<{i: number, m: string}|null>(null);
  const [eiAnim, setEiAnim] = useState(0);
  const [eiHover, setEiHover] = useState<{g: number, m: string}|null>(null);
  const [workstyleAnim, setWorkstyleAnim] = useState(1); // Start at 1 to show the chart immediately
  const [workstyleHover, setWorkstyleHover] = useState<{category: string, metric: string} | null>(null);
  const [workstyleCollabAnim, setWorkstyleCollabAnim] = useState(0);
  const [workstyleCollabHover, setWorkstyleCollabHover] = useState<{category: string, metric: string} | null>(null);
  const [adaptabilityAnim, setAdaptabilityAnim] = useState(0);
  const [adaptabilityHover, setAdaptabilityHover] = useState<string | null>('New Teachers'); // Default hover on 'New Teachers'
  const [criticalThinkingAnim, setCriticalThinkingAnim] = useState(0);
  const [criticalThinkingHover, setCriticalThinkingHover] = useState<number | null>(null);
  const [creativityAnim, setCreativityAnim] = useState(0);
  const [creativityHover, setCreativityHover] = useState<{ i: number; m: string } | null>(null);
  const [cognitiveLoadHover, setCognitiveLoadHover] = useState<string | null>('T001'); // Default hover on T001
  const [learningStyleAnim, setLearningStyleAnim] = useState(0);
  const [learningStyleHover, setLearningStyleHover] = useState<number | null>(null);
  const [selfEfficacyAnim, setSelfEfficacyAnim] = useState(0);
  const [selfEfficacyHover, setSelfEfficacyHover] = useState<number | null>(null);
  const [teachingCompetencyAnim, setTeachingCompetencyAnim] = useState(0);
  const [teachingCompetencyHover, setTeachingCompetencyHover] = useState<{ sessionIdx: number; metricKey: string } | null>(null);
  const [activeLearningAnim, setActiveLearningAnim] = useState(0);
  const [activeLearningHover, setActiveLearningHover] = useState<{ teacherIdx: number; metricKey: string } | null>(null);
  const [assessmentDesignAnim, setAssessmentDesignAnim] = useState(0);
  const [assessmentDesignHover, setAssessmentDesignHover] = useState<{ i: number; m: string } | null>(null);
  const [feedbackIncorporationAnim, setFeedbackIncorporationAnim] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState<string | null>(null);
  const [perceptionAnim, setPerceptionAnim] = useState(0);
  const [perceptionHover, setPerceptionHover] = useState<string | null>(null);
  const [collaborationAnim, setCollaborationAnim] = useState(1);
  const [collaborationHover, setCollaborationHover] = useState<string | null>(null);
  const [initiativeAnim, setInitiativeAnim] = useState(1);
  const [initiativeHover, setInitiativeHover] = useState<string | null>(null);
  const [knowledgeSharingAnim, setKnowledgeSharingAnim] = useState(1);
  const [knowledgeSharingHover, setKnowledgeSharingHover] = useState<string | null>(null);
  const [communityAnim, setCommunityAnim] = useState(1);
  const [communityHover, setCommunityHover] = useState<{id: string, segment: string} | null>(null);
  const [attendanceAnim, setAttendanceAnim] = useState(1);
  const [attendanceHover, setAttendanceHover] = useState<string | null>(null);
  const [satisfactionAnim, setSatisfactionAnim] = useState(1);
  const [satisfactionHover, setSatisfactionHover] = useState<{category: string, series: string} | null>(null);
  const [stressAnim, setStressAnim] = useState(1);
  const [stressHover, setStressHover] = useState<string | null>(null);
  const [motivationAnim, setMotivationAnim] = useState(1);
  const [motivationHover, setMotivationHover] = useState<string | null>(null);
  const [psychologicalAnim, setPsychologicalAnim] = useState(1);
  const [psychologicalHover, setPsychologicalHover] = useState<string | null>(null);
  const [workloadAnim, setWorkloadAnim] = useState(1);
  const [workloadHover, setWorkloadHover] = useState<string | null>(null);
  const [platformUsageAnim, setPlatformUsageAnim] = useState(1);
  const [platformUsageHover, setPlatformUsageHover] = useState<string | null>(null);
  const [facultyAdoptionAnim, setFacultyAdoptionAnim] = useState(1);
  const [facultyAdoptionHover, setFacultyAdoptionHover] = useState<{category: string, series: string} | null>(null);
  const [platformFeaturesAnim, setPlatformFeaturesAnim] = useState(1);
  const [platformFeaturesHover, setPlatformFeaturesHover] = useState<{platform: string, feature: string} | null>(null);
  const [timeSpentHover, setTimeSpentHover] = useState<string | null>(null);
  const [assessmentRatesHover, setAssessmentRatesHover] = useState<string | null>(null);
  const [feedbackScoresHover, setFeedbackScoresHover] = useState<{id: string, slice: string} | null>(null);
  const [correlationHover, setCorrelationHover] = useState<{category: string, series: string} | null>(null);
  const [ticketTrendsHover, setTicketTrendsHover] = useState<string | null>(null);


  useEffect(() => {
    if (activeSection === 'training-completion') {
      // Animate bars in
      const maxVal = Math.max(...trainingParticipationData.map(d => d.value));
      setTimeout(() => {
        setBarHeights(trainingParticipationData.map(d => (d.value / maxVal) * 150));
      }, 100);
      // Animate donut segments in
      let acc = 0;
      const total = donutData.reduce((sum, d) => sum + d.value, 0);
      const animSteps = 30;
      let step = 0;
      const animate = () => {
        step++;
        setDonutPercents(
          donutData.map((d, i) => {
            const percent = d.value / total;
            return Math.min(percent, percent * (step / animSteps));
          })
        );
        setCompletionBarWidths(
          completionRateData.map((d) => Math.min(d.rate, d.rate * (step / animSteps)))
        );
        if (step < animSteps) setTimeout(animate, 18);
      };
      animate();
      // Animate dropoff chart
      let stepDropoff = 0;
      const animStepsDropoff = 30;
      const animateDropoff = () => {
        stepDropoff++;
        setDropoffAnim(Math.min(1, stepDropoff / animStepsDropoff));
        if (stepDropoff < animStepsDropoff) setTimeout(animateDropoff, 18);
      };
      animateDropoff();
      // Animate completion mode bars
      let stepMode = 0;
      const animStepsMode = 30;
      const animateMode = () => {
        stepMode++;
        setCompletionModeAnim(Math.min(1, stepMode / animStepsMode));
        if (stepMode < animStepsMode) setTimeout(animateMode, 18);
      };
      animateMode();
    } else if (activeSection === 'leadership-growth') {
      let step = 0;
      const animSteps = 30;
      const animateReadiness = () => {
        step++;
        setReadinessAnim(Math.min(1, step / animSteps));
        if (step < animSteps) setTimeout(animateReadiness, 18);
      };
      animateReadiness();
      let stepMentor = 0;
      const animStepsMentor = 30;
      const animateMentor = () => {
        stepMentor++;
        setMentorshipAnim(Math.min(1, stepMentor / animStepsMentor));
        if (stepMentor < animStepsMentor) setTimeout(animateMentor, 18);
      };
      animateMentor();
      let stepLead = 0;
      const animStepsLead = 30;
      const animateLead = () => {
        stepLead++;
        setLeadershipAnim(Math.min(1, stepLead / animStepsLead));
        if (stepLead < animStepsLead) setTimeout(animateLead, 18);
      };
      animateLead();
    } else {
      setBarHeights(trainingParticipationData.map(() => 0));
      setDonutPercents(donutData.map(() => 0));
      setCompletionBarWidths(completionRateData.map(() => 0));
      setDropoffAnim(0);
      setCompletionModeAnim(0);
      setReadinessAnim(0);
      setMentorshipAnim(0);
      setLeadershipAnim(0);
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'behavioral-insights') {
      let step = 0;
      const animSteps = 30;
      const animatePersonality = () => {
        step++;
        setPersonalityAnim(Math.min(1, step / animSteps));
        if (step < animSteps) setTimeout(animatePersonality, 18);
      };
      animatePersonality();
      const stepEi = 0;
      const animStepsEi = 50;
      const animateEi = () => {
        if (stepEi < animStepsEi) {
          setEiAnim((stepEi + 1) / animStepsEi);
          setTimeout(animateEi, 20);
        }
      };
      animateEi();
      
      let stepWorkstyle = 0;
      const animStepsWorkstyle = 50;
      const animateWorkstyle = () => {
        stepWorkstyle++;
        setWorkstyleAnim(Math.min(1, stepWorkstyle / animStepsWorkstyle));
        if (stepWorkstyle < animStepsWorkstyle) setTimeout(animateWorkstyle, 20);
      };
      animateWorkstyle();
      let stepWorkstyleCollab = 0;
      const animStepsWorkstyleCollab = 50;
      const animateWorkstyleCollab = () => {
        stepWorkstyleCollab++;
        setWorkstyleCollabAnim(Math.min(1, stepWorkstyleCollab / animStepsWorkstyleCollab));
        if (stepWorkstyleCollab < animStepsWorkstyleCollab) setTimeout(animateWorkstyleCollab, 18);
      };
      animateWorkstyleCollab();
      
      // Animate adaptability chart
      let stepAdaptability = 0;
      const animStepsAdaptability = 50;
      const animateAdaptability = () => {
        stepAdaptability++;
        setAdaptabilityAnim(Math.min(1, stepAdaptability / animStepsAdaptability));
        if (stepAdaptability < animStepsAdaptability) {
          setTimeout(animateAdaptability, 20);
        }
      };
      animateAdaptability();
    } else {
      setPersonalityAnim(0);
      setEiAnim(0);
      setWorkstyleCollabAnim(0);
      setAdaptabilityAnim(0);
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'cognitive-reports') {
      let step = 0;
      const animSteps = 30;
                        const animate = () => {
                    step++;
                    // Keep the existing animation for the first chart
                    setCriticalThinkingAnim(Math.min(1, step / animSteps));
                    // Add the animation for the new chart
                    setCreativityAnim(Math.min(1, step / animSteps));
                    // Add animations for the new charts
                    setLearningStyleAnim(Math.min(1, step / animSteps));
                    setSelfEfficacyAnim(Math.min(1, step / animSteps));
                    if (step < animSteps) {
                        setTimeout(animate, 18);
                    }
                  };
                  animate();
                } else {
                  // Reset all animations
                  setCriticalThinkingAnim(0);
                  setCreativityAnim(0);
                  setLearningStyleAnim(0);
                  setSelfEfficacyAnim(0);
                }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'teaching-effectiveness') {
      let step = 0;
      const animSteps = 30;
      const animate = () => {
        step++;
        setTeachingCompetencyAnim(Math.min(1, step / animSteps));
        setActiveLearningAnim(Math.min(1, step / animSteps));
        setAssessmentDesignAnim(Math.min(1, step / animSteps));
        setFeedbackIncorporationAnim(Math.min(1, step / animSteps));
        setPerceptionAnim(Math.min(1, step / animSteps));
        if (step < animSteps) {
          setTimeout(animate, 18);
        }
      };
      animate();
    } else if (activeSection === 'collaboration-engagement') {
      let step = 0;
      const animSteps = 30;
      const animate = () => {
        step++;
        const animValue = Math.min(1, step / animSteps);
        setCollaborationAnim(animValue);
        setInitiativeAnim(animValue);
        setKnowledgeSharingAnim(animValue);
        setCommunityAnim(animValue);
        setAttendanceAnim(animValue);
        if (step < animSteps) {
          setTimeout(animate, 18);
        }
      };
      animate();
    } else if (activeSection === 'work-life-satisfaction') {
      let step = 0;
      const animSteps = 30;
      const animate = () => {
        step++;
        const animValue = Math.min(1, step / animSteps);
        setSatisfactionAnim(animValue);
        setStressAnim(animValue);
        setMotivationAnim(animValue);
        setPsychologicalAnim(animValue);
        setWorkloadAnim(animValue);
        setPlatformUsageAnim(animValue);
        setFacultyAdoptionAnim(animValue);
        if (step < animSteps) {
          setTimeout(animate, 18);
        }
      };
      animate();
    } else if (activeSection === 'platform-adoption') {
      let step = 0;
      const animSteps = 30;
      const animate = () => {
        step++;
        const animValue = Math.min(1, step / animSteps);
        setPlatformUsageAnim(animValue);
        setFacultyAdoptionAnim(animValue);
        setPlatformFeaturesAnim(animValue);
        if (step < animSteps) {
          setTimeout(animate, 18);
        }
      };
      animate();
    } else {
      setTeachingCompetencyAnim(0);
      setActiveLearningAnim(0);
      setAssessmentDesignAnim(0);
      setFeedbackIncorporationAnim(0);
      setPerceptionAnim(0);
      setCollaborationAnim(0);
      setInitiativeAnim(0);
      setKnowledgeSharingAnim(0);
      setCommunityAnim(0);
      setAttendanceAnim(0);
      setSatisfactionAnim(0);
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics-dashboard':
        return (
          <>
            {/* Top Cards Section and main dashboard content here */}
            {/* ...existing dashboard content... */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Dashboard</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Darkone</span>
                <span className="mx-1">&gt;</span>
                <span className="text-gray-500">Dashboard</span>
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {topCards.map((card, idx) => (
                <div key={card.title} className="bg-white rounded-lg shadow border p-5 flex flex-col min-w-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="truncate text-gray-500 text-sm font-semibold max-w-[120px]" title={card.title}>{card.title.length > 22 ? card.title.slice(0, 20) + '...' : card.title}</div>
                    <div className={`rounded-lg p-2 ${card.iconBg}`}>{card.icon}</div>
            </div>
                  <div className="text-2xl font-bold text-gray-700 mb-2">{card.value}</div>
                  <div className="flex-1 flex items-end">
                    {/* Purple line chart placeholder */}
                    <svg width="100%" height="32" viewBox="0 0 120 32">
                      <polyline
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="2"
                        points="0,28 10,20 20,24 30,16 40,18 50,12 60,20 70,14 80,22 90,16 100,24 110,18 120,22"
                      />
                      <circle cx="60" cy="20" r="2.5" fill="#a78bfa" />
                      <rect x="58" y="10" width="16" height="16" rx="4" fill="transparent" />
                      <text x="62" y="18" fontSize="10" fill="#a78bfa" style={{display:'none'}}>60</text>
                    </svg>
              </div>
              </div>
              ))}
            </div>
            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Revenue Trends */}
              <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Revenue Trends</div>
                  <div className="flex gap-2 text-xs">
                    <button className="px-2 py-1 rounded bg-gray-100">ALL</button>
                    <button className="px-2 py-1 rounded bg-gray-100">1M</button>
                    <button className="px-2 py-1 rounded bg-gray-100">6M</button>
                    <button className="px-2 py-1 rounded bg-gray-100">1Y</button>
          </div>
        </div>
                <div className="h-48 flex items-center justify-center">
                  {/* Placeholder for bar chart */}
                  <svg width="100%" height="100%" viewBox="0 0 200 120">
                    <rect x="20" y="40" width="30" height="60" fill="#a78bfa" />
                    <rect x="80" y="40" width="30" height="60" fill="#a78bfa" />
                    <rect x="140" y="40" width="30" height="60" fill="#a78bfa" />
                    <line x1="0" y1="100" x2="200" y2="100" stroke="#64748b" strokeDasharray="4" />
                  </svg>
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-purple-600">Training Hours Logged</span>
                  <span className="text-green-600">Active Faculty Engagement</span>
                  <span className="text-purple-600">Training Sessions Completed</span>
                </div>
              </div>
              {/* Training by Category */}
              <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Training by Category</div>
                  <div className="flex gap-2 text-xs">
                    <button className="px-2 py-1 rounded bg-gray-100">ALL</button>
                    <button className="px-2 py-1 rounded bg-gray-100">1M</button>
                    <button className="px-2 py-1 rounded bg-gray-100">6M</button>
                    <button className="px-2 py-1 rounded bg-gray-100">1Y</button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="#f3f4f6" />
                    <path d="M40 40 L40 8 A32 32 0 0 1 72 40 Z" fill="#34d399" />
                    <path d="M40 40 L72 40 A32 32 0 1 1 40 8 Z" fill="#a78bfa" />
                  </svg>
                  <div className="flex-1">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="text-left">Training Category</th>
                          <th className="text-right">Sessions Completed</th>
                          <th className="text-right">Percentage</th>
                          <th className="text-right">Growth Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainingByCategory.map((row) => (
                          <tr key={row.category}>
                            <td className="py-1 text-gray-700">{row.category}</td>
                            <td className="py-1 text-right">{row.sessions}</td>
                            <td className="py-1 text-right">{row.percent}%</td>
                            <td className="py-1 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${row.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.trend}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
      </div>
            </div>
            </div>
              {/* Faculty Training Participation by Region */}
              <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Faculty Training Participation by Region</div>
                  <button className="text-xs text-gray-500 border rounded px-2 py-1">View Data</button>
          </div>
                <div className="h-48 flex items-center justify-center">
                  {/* Placeholder for world map */}
                  <svg width="100%" height="100%" viewBox="0 0 200 100">
                    <rect x="0" y="0" width="200" height="100" fill="#f3f4f6" />
                    <circle cx="120" cy="60" r="8" fill="#64748b" />
                    <text x="110" y="85" fontSize="12" fill="#64748b">Riyadh</text>
                  </svg>
        </div>
              </div>
              </div>
            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Faculty Enrollment */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Faculty Enrollment</div>
                  <button className="text-xs text-gray-500 border rounded px-2 py-1">View All</button>
              </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left">ID</th>
                      <th className="text-left">Enrollment Date</th>
                      <th className="text-left">Faculty Name</th>
                      <th className="text-left">Training Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyEnrollment.map((row) => (
                      <tr key={row.id}>
                        <td className="py-1">{row.id}</td>
                        <td className="py-1">{row.date}</td>
                        <td className="py-1 flex items-center gap-2">
                          <img src="/default-avatar.png" alt={row.name} className="w-6 h-6 rounded-full object-cover border" />
                          {row.name}
                        </td>
                        <td className="py-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'Completed' ? 'bg-green-100 text-green-700' : row.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
              {/* Training Feedback & Performance Scores */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Training Feedback & Performance Scores</div>
                  <button className="text-xs text-gray-500 border rounded px-2 py-1">View All</button>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left">ID</th>
                      <th className="text-left">Training Date</th>
                      <th className="text-left">Faculty Name</th>
                      <th className="text-left">Score</th>
                      <th className="text-left">Feedback Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackScores.map((row) => (
                      <tr key={row.id}>
                        <td className="py-1">{row.id}</td>
                        <td className="py-1">{row.date}</td>
                        <td className="py-1 flex items-center gap-2">
                          <img src="/default-avatar.png" alt={row.name} className="w-6 h-6 rounded-full object-cover border" />
                          {row.name}
                        </td>
                        <td className="py-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${row.score >= 4.5 ? 'bg-green-100 text-green-700' : row.score >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{row.score}</span>
                        </td>
                        <td className="py-1">{row.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        </div>
            </div>
          </>
        );
      case 'training-completion':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Training Completion</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Bar Chart */}
              <div className="bg-white rounded-xl shadow p-8 mb-8 lg:mb-0">
                <div className="mb-4">
                  <span className="text-lg font-semibold text-gray-700">Total Training Participation Over Time</span>
        </div>
                <div className="w-full flex flex-col items-center">
                  {/* Animated Bar Chart */}
                  <div className="relative w-full max-w-2xl h-64 flex items-end justify-between px-8" style={{minWidth: 400}}>
                    {/* Y grid lines */}
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="absolute left-0 w-full border-t border-gray-200" style={{top: `${40 + i*24}px`}} />
                    ))}
                    {/* Bars */}
                    {trainingParticipationData.map((d, i) => {
                      const barWidth = 32;
                      const gap = 18;
                      const maxVal = Math.max(...trainingParticipationData.map(d => d.value));
                      const barHeight = barHeights[i];
                      const x = i * (barWidth + gap);
                      return (
                        <div
                          key={d.month}
                          className="flex flex-col items-center justify-end relative"
                          style={{ width: barWidth, height: 190 }}
                          onMouseEnter={() => setHoveredBar(i)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Value label */}
                          <span className="mb-1 text-sm font-bold text-gray-700 select-none" style={{opacity: barHeight > 0 ? 1 : 0, transition: 'opacity 0.3s'}}>{d.value}</span>
                          {/* Bar */}
                          <div
                            className="rounded bg-purple-400 transition-all duration-700"
                            style={{
                              width: barWidth,
                              height: `${barHeight}px`,
                              minHeight: 8,
                              maxHeight: 150,
                              opacity: 0.85,
                              transitionDelay: `${i * 80}ms`,
                            }}
                          ></div>
                          {/* Month label */}
                          <span className="mt-2 text-xs text-gray-500 select-none">{d.month.slice(5)}</span>
                          {/* Tooltip on hover */}
                          {hoveredBar === i && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
                              <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-xs text-gray-700 whitespace-nowrap">
                                <div className="font-semibold mb-1">{d.month}</div>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
                                  <span>Participation: <span className="font-bold">{d.value}</span></span>
          </div>
        </div>
              </div>
                )}
              </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-4">Tracks the number of teachers attending training programs.</div>
                </div>
              </div>
              {/* Right: Completion Rate by Training Program */}
              <div className="bg-white rounded-xl shadow p-8 flex flex-col">
                <div className="mb-4">
                  <span className="text-lg font-semibold text-gray-700">Completion Rate by Training Program</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  {completionRateData.map((d, i) => (
                    <div key={d.program} className="flex items-center mb-3">
                      <div className="w-48 truncate text-sm text-gray-600 mr-4">{d.program}</div>
                      <div className="flex-1 bg-gray-100 rounded h-5 relative">
                        <div
                          className="bg-teal-400 h-5 rounded transition-all duration-700"
                          style={{ width: `${completionBarWidths[i]}%`, minWidth: 8, transitionDelay: `${i * 60}ms` }}
                        ></div>
                        <span className="absolute right-2 top-0 text-xs font-bold text-gray-700 h-5 flex items-center">{Math.round(completionBarWidths[i])}%</span>
              </div>
            </div>
          ))}
        </div>
    </div>
            </div>
            {/* Donut Chart Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-4">
                <span className="text-lg font-semibold text-gray-700">Training Hours per Teacher</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center" style={{height: 220}}>
                  <svg width="340" height="220" viewBox="0 0 220 220">
                    <g transform="translate(110,110)">
                      {(() => {
                        const total = donutData.reduce((sum, d) => sum + d.value, 0);
                        let acc = 0;
                        return donutData.map((d, i) => {
                          const percent = donutPercents[i];
                          const startAngle = (acc / total) * 2 * Math.PI;
                          acc += d.value * percent / (d.value / total);
                          const endAngle = (acc / total) * 2 * Math.PI;
                          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
                          const rOuter = 90;
                          const rInner = 60;
                          const x0 = Math.cos(startAngle) * rOuter;
                          const y0 = Math.sin(startAngle) * rOuter;
                          const x1 = Math.cos(endAngle) * rOuter;
                          const y1 = Math.sin(endAngle) * rOuter;
                          const x2 = Math.cos(endAngle) * rInner;
                          const y2 = Math.sin(endAngle) * rInner;
                          const x3 = Math.cos(startAngle) * rInner;
                          const y3 = Math.sin(startAngle) * rInner;
                          const path = [
                            `M${x0},${y0}`,
                            `A${rOuter},${rOuter} 0 ${largeArc} 1 ${x1},${y1}`,
                            `L${x2},${y2}`,
                            `A${rInner},${rInner} 0 ${largeArc} 0 ${x3},${y3}`,
                            'Z',
                          ].join(' ');
                          return (
                            <path
                              key={d.label}
                              d={path}
                              fill={d.color}
                              opacity={hoveredDonut === i ? 1 : 0.85}
                              style={{transition: 'opacity 0.2s'}}
                              onMouseEnter={() => setHoveredDonut(i)}
                              onMouseLeave={() => setHoveredDonut(null)}
                            />
                          );
                        });
                      })()}
                    </g>
                  </svg>
                  {/* Tooltip on hover */}
                  {hoveredDonut !== null && (() => {
                    // Find the angle for the hovered segment
                    const total = donutData.reduce((sum, d) => sum + d.value, 0);
                    let acc = 0;
                    for (let i = 0; i < hoveredDonut; i++) acc += donutData[i].value;
                    const percent = donutData[hoveredDonut].value / total;
                    const midAngle = ((acc + donutData[hoveredDonut].value / 2) / total) * 2 * Math.PI;
                    const r = 90;
                    const x = 110 + Math.cos(midAngle) * r;
                    const y = 110 + Math.sin(midAngle) * r;
                    return (
                      <div
                        className="absolute z-20"
                        style={{
                          left: x,
                          top: y - 40,
                          transform: 'translate(-50%, -100%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow" style={{background: donutData[hoveredDonut].color}}>
                          {donutData[hoveredDonut].label}: {donutData[hoveredDonut].value}
            </div>
                      </div>
                    );
                  })()}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {donutData.map((d, i) => (
                    <div key={d.label} className="flex items-center gap-2 text-xs font-semibold">
                      <span className="inline-block w-4 h-2 rounded-full" style={{background: d.color}}></span>
                      <span className="text-gray-500">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Drop-off Rate in Training Programs Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Drop-off Rate in Training Programs</span>
              </div>
              <div className="text-xs text-gray-500 mb-4">Identifies where participants disengage.</div>
              <div className="w-full overflow-x-auto">
                <svg className="block mx-auto w-full h-[440px] min-w-[900px]" viewBox="0 0 900 420" preserveAspectRatio="none">
                  {/* Y grid lines */}
                  {[0,1,2,3,4,5].map(i => (
                    <line key={i} x1="60" x2="860" y1={80 + i*60} y2={80 + i*60} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X grid lines and hover lines */}
                  {dropoffData.map((d, i) => (
                    <g key={d.program}>
                      <line x1={100 + i*85} x2={100 + i*85} y1={80} y2={380} stroke="#e5e7eb" strokeDasharray="4" strokeWidth="1" />
                      {/* Hover vertical line */}
                      {dropoffHover === i && (
                        <line x1={100 + i*85} x2={100 + i*85} y1={80} y2={380} stroke="#a3a3a3" strokeDasharray="2" strokeWidth="2" />
                      )}
                    </g>
                  ))}
                  {/* Lines */}
                  {["enrollment","completed","dropoff"].map((key, idx) => {
                    const color = key === 'enrollment' ? '#6366f1' : key === 'completed' ? '#14b8a6' : '#ef4444';
                    const points = dropoffData.map((d, i) => {
                      let val = key === 'enrollment' ? d.enrollment : key === 'completed' ? d.completed : d.dropoff;
                      // Y scale: enrollment/completed 0-200, dropoff -100 to 100
                      let y;
                      if (key === 'dropoff') {
                        y = 230 - (val * dropoffAnim) * 100 / 200;
                      } else {
                        y = 380 - (val * dropoffAnim) * 200 / 200;
                      }
                      return [100 + i*85, y];
                    });
    return (
                      <polyline
                        key={key}
                        fill="none"
                        stroke={color}
                        strokeWidth={key==='dropoff'?2.5:3}
                        points={points.map(p => p.join(',')).join(' ')}
                        style={{transition: 'all 0.7s'}}
                      />
                    );
                  })}
                  {/* Points and value labels */}
                  {dropoffData.map((d, i) => {
                    const x = 100 + i*85;
                    // Enrollment
                    const y1 = 380 - (d.enrollment * dropoffAnim) * 200 / 200;
                    // Completed
                    const y2 = 380 - (d.completed * dropoffAnim) * 200 / 200;
                    // Dropoff
                    const y3 = 230 - (d.dropoff * dropoffAnim) * 100 / 200;
                    return (
                      <g key={d.program}>
                        {/* Enrollment */}
                        <rect x={x-18} y={y1-18} width={36} height={22} rx={5} fill="#6366f1" />
                        <text x={x} y={y1-3} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fff">{Math.round(d.enrollment * dropoffAnim)}</text>
                        {/* Completed */}
                        <rect x={x-18} y={y2-18} width={36} height={22} rx={5} fill="#14b8a6" />
                        <text x={x} y={y2-3} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fff">{Math.round(d.completed * dropoffAnim)}</text>
                        {/* Dropoff */}
                        <rect x={x-24} y={y3-16} width={48} height={22} rx={5} fill="#ef4444" />
                        <text x={x} y={y3} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fff">{(d.dropoff * dropoffAnim).toFixed(2)}</text>
                      </g>
                    );
                  })}
                  {/* Tooltip on hover */}
                  {dropoffHover !== null && (() => {
                    const i = dropoffHover;
                    const x = 100 + i*85;
                    const d = dropoffData[i];
                    const y1 = 380 - (d.enrollment * dropoffAnim) * 200 / 200;
                    const y2 = 380 - (d.completed * dropoffAnim) * 200 / 200;
                    const y3 = 230 - (d.dropoff * dropoffAnim) * 100 / 200;
                    return (
                      <g>
                        {/* Tooltip box */}
                        <rect x={x-70} y={y1-90} width={140} height={70} rx={10} fill="#fff" stroke="#e5e7eb" />
                        <text x={x} y={y1-70} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#444">{d.program.length > 22 ? d.program.slice(0,22)+'...' : d.program}</text>
                        <circle cx={x-40} cy={y1-50} r={6} fill="#6366f1" />
                        <text x={x-30} y={y1-46} fontSize="13" fill="#444">Enrollment Count: {d.enrollment.toFixed(2)}</text>
                        <circle cx={x-40} cy={y1-30} r={6} fill="#14b8a6" />
                        <text x={x-30} y={y1-26} fontSize="13" fill="#444">Completed Count: {d.completed.toFixed(2)}</text>
                        <circle cx={x-40} cy={y1-10} r={6} fill="#ef4444" />
                        <text x={x-30} y={y1-6} fontSize="13" fill="#444">Drop-off Rate (%): {d.dropoff.toFixed(2)}</text>
                      </g>
                    );
                  })()}
                  {/* X axis labels (hoverable) */}
                  {dropoffData.map((d, i) => (
                    <g key={d.program}>
                      <rect x={100 + i*85 - 60} y={395} width={120} height={28} fill={dropoffHover === i ? '#f1f5f9' : 'transparent'} rx={6}
                        style={{cursor:'pointer'}}
                        onMouseEnter={() => setDropoffHover(i)}
                        onMouseLeave={() => setDropoffHover(null)}
                      />
                      <text x={100 + i*85} y={415} textAnchor="middle" fontSize="13" fill="#64748b" style={{cursor:'pointer',fontWeight:dropoffHover===i?700:400}} onMouseEnter={() => setDropoffHover(i)} onMouseLeave={() => setDropoffHover(null)}>{d.program.length > 18 ? d.program.slice(0,18)+'...' : d.program}</text>
                    </g>
                  ))}
                  {/* Y axis labels */}
                  {[0,50,100,150,200].map((v, i) => (
                    <text key={v} x={50} y={380 - v*200/200 + 5} textAnchor="end" fontSize="12" fill="#a3a3a3">{v.toFixed(2)}</text>
                  ))}
                  {/* Legend */}
                  <circle cx={700} cy={60} r={7} fill="#6366f1" />
                  <text x={715} y={65} fontSize="14" fill="#6366f1">Enrollment Count</text>
                  <circle cx={830} cy={60} r={7} fill="#14b8a6" />
                  <text x={845} y={65} fontSize="14" fill="#14b8a6">Completed Count</text>
                  <circle cx={700} cy={85} r={7} fill="#ef4444" />
                  <text x={715} y={90} fontSize="14" fill="#ef4444">Drop-off Rate (%)</text>
                </svg>
          </div>
        </div>
            {/* Self-paced vs Instructor-led Course Completion Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Self-paced vs Instructor-led Course Completion</span>
      </div>
              <div className="w-full overflow-x-auto">
                <svg className="block mx-auto w-full h-[440px] min-w-[1000px]" viewBox="0 0 1000 440" preserveAspectRatio="none">
                  {/* Y grid lines */}
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <line key={i} x1="70" x2="980" y1={80 + i*45} y2={80 + i*45} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* Bars */}
                  {completionModeData.map((d, i) => {
                    const x0 = 110 + i*85;
                    const barW = 28;
                    const maxVal = 70;
                    const hSelf = (d.self * completionModeAnim) * 270 / maxVal;
                    const hInstr = (d.instructor * completionModeAnim) * 270 / maxVal;
                    return (
                      <g key={d.program}>
                        {/* Self-paced */}
                        <rect
                          x={x0 - barW - 4}
                          y={350 - hSelf}
                          width={barW}
                          height={hSelf}
                          rx={4}
                          fill="#6366f1"
                          opacity={completionModeHover && completionModeHover.i === i && completionModeHover.type === 'self' ? 1 : 0.85}
                          style={{cursor:'pointer',transition:'all 0.7s'}}
                          onMouseEnter={() => setCompletionModeHover({i, type:'self'})}
                          onMouseLeave={() => setCompletionModeHover(null)}
                        />
                        {/* Instructor-led */}
                        <rect
                          x={x0 + 4}
                          y={350 - hInstr}
                          width={barW}
                          height={hInstr}
                          rx={4}
                          fill="#14b8a6"
                          opacity={completionModeHover && completionModeHover.i === i && completionModeHover.type === 'instructor' ? 1 : 0.85}
                          style={{cursor:'pointer',transition:'all 0.7s'}}
                          onMouseEnter={() => setCompletionModeHover({i, type:'instructor'})}
                          onMouseLeave={() => setCompletionModeHover(null)}
                        />
                        {/* Tooltip on hover */}
                        {completionModeHover && completionModeHover.i === i && (
                          <g>
                            <rect x={x0-60} y={350 - Math.max(hSelf,hInstr) - 60} width={120} height={38} rx={8} fill="#f1f5f9" stroke="#e5e7eb" />
                            <text x={x0} y={350 - Math.max(hSelf,hInstr) - 44} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#444">{d.program.length>18?d.program.slice(0,18)+'...':d.program}</text>
                            <circle cx={x0} cy={350 - Math.max(hSelf,hInstr) - 28} r={5} fill={completionModeHover.type==='self'?'#6366f1':'#14b8a6'} />
                            <text x={x0+10} y={350 - Math.max(hSelf,hInstr) - 24} fontSize="13" fill="#444">{completionModeHover.type==='self'?'Self-paced':'Instructor-led'}: {completionModeHover.type==='self'?d.self.toFixed(2):d.instructor.toFixed(2)}</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                  {/* X axis labels (rotated) */}
                  {completionModeData.map((d, i) => (
                    <g key={d.program}>
                      <text
                        x={110 + i*85}
                        y={400}
                        textAnchor="end"
                        fontSize="13"
                        fill="#64748b"
                        transform={`rotate(-35,${110 + i*85},400)`}
                        style={{fontWeight:400}}
                      >
                        {d.program}
                      </text>
                    </g>
                  ))}
                  {/* Y axis labels */}
                  {[0,10,20,30,40,50,60,70].map((v, i) => (
                    <text key={v} x={60} y={350 - v*270/70 + 5} textAnchor="end" fontSize="12" fill="#a3a3a3">{v.toFixed(2)}</text>
                  ))}
                  {/* Y axis title */}
                  <text x={30} y={220} textAnchor="middle" fontSize="14" fill="#64748b" transform="rotate(-90,30,220)">percentage</text>
                  {/* Legend */}
                  <rect x={400} y={420-30} width={18} height={12} rx={2} fill="#6366f1" />
                  <text x={420} y={420-20} fontSize="14" fill="#6366f1">Self-paced</text>
                  <rect x={500} y={420-30} width={18} height={12} rx={2} fill="#14b8a6" />
                  <text x={520} y={420-20} fontSize="14" fill="#14b8a6">Instructor-led</text>
                </svg>
        </div>
            </div>
          </div>
        );
      case 'leadership-growth':
  return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Leadership Growth</h2>
            <div className="bg-white rounded-xl shadow p-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Leadership Readiness Index</span>
              </div>
              <div className="w-full overflow-x-auto">
                <svg className="block mx-auto w-full h-[440px] min-w-[1200px]" viewBox="0 0 1200 440" preserveAspectRatio="none">
                  {/* Y grid lines */}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                    <line key={i} x1="70" x2="1150" y1={60 + i*34} y2={60 + i*34} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* Bars */}
                  {readinessData.map((d, i) => {
                    const x0 = 120 + i*100;
                    const barW = 14;
                    const maxVal = 100;
                    return readinessMetrics.map((m, j) => {
                      const value = d[m.key as keyof typeof d] as number;
                      const h = (value * Number(readinessAnim)) * 320 / maxVal;
                      return (
                        <g key={m.key}>
                          <rect
                            x={x0 - 42 + j*barW}
                            y={380 - h}
                            width={barW-2}
                            height={h}
                            rx={3}
                            fill={m.color}
                            opacity={readinessHover && readinessHover.i === i && readinessHover.m === m.key ? 1 : 0.85}
                            style={{cursor:'pointer',transition:'all 0.7s'}}
                            onMouseEnter={() => setReadinessHover({i, m: m.key})}
                            onMouseLeave={() => setReadinessHover(null)}
                          />
                          {/* Tooltip on hover */}
                          {readinessHover && readinessHover.i === i && readinessHover.m === m.key && (
                            <g>
                              <rect x={x0-60} y={380 - h - 60} width={120} height={38} rx={8} fill="#f1f5f9" stroke="#e5e7eb" />
                              <text x={x0} y={380 - h - 44} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#444">{d.teacher}</text>
                              <circle cx={x0} cy={380 - h - 28} r={5} fill={m.color} />
                              <text x={x0+10} y={380 - h - 24} fontSize="13" fill="#444">{m.label}: {value}</text>
                            </g>
                          )}
                        </g>
                      );
                    });
                  })}
                  {/* X axis labels */}
                  {readinessData.map((d, i) => (
                    <text
                      key={d.teacher}
                      x={120 + i*100}
                      y={410}
                      textAnchor="middle"
                      fontSize="14"
                      fill="#64748b"
                      style={{fontWeight:400}}
                    >
                      {d.teacher}
                    </text>
                  ))}
                  {/* Y axis labels */}
                  {[0,10,20,30,40,50,60,70,80,90,100].map((v, i) => (
                    <text key={v} x={60} y={380 - v*320/100 + 5} textAnchor="end" fontSize="12" fill="#a3a3a3">{v.toFixed(2)}</text>
                  ))}
                  {/* Legend */}
                  {readinessMetrics.map((m, i) => (
                    <g key={m.key}>
                      <rect x={200 + i*170} y={430} width={18} height={12} rx={2} fill={m.color} />
                      <text x={220 + i*170} y={440} fontSize="14" fill={m.color}>{m.label}</text>
                    </g>
                  ))}
                </svg>
                  </div>
                </div>
            {/* Mentorship & Coaching Effectiveness Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Mentorship & Coaching Effectiveness</span>
            </div>
              <div className="w-full overflow-x-auto">
                <svg className="block mx-auto w-full h-[440px] min-w-[1200px]" viewBox="0 0 1200 440" preserveAspectRatio="none">
                  {/* Y axis labels */}
                  {mentorshipData.map((d, i) => (
                    <text
                      key={d.teacher}
                      x={60}
                      y={70 + i*34}
                      textAnchor="end"
                      fontSize="14"
                      fill="#64748b"
                      style={{fontWeight:400}}
                    >
                      {d.teacher}
                    </text>
                  ))}
                  {/* X grid lines */}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                    <line key={i} x1={100 + i*110} x2={100 + i*110} y1={40} y2={400} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* Bars */}
                  {mentorshipData.map((d, i) => {
                    const y0 = 70 + i*34;
                    const barH = 8;
                    const maxVals = [25, 15, 5, 50];
                    return mentorshipMetrics.map((m, j) => {
                      let maxVal = maxVals[j];
                      const value = d[m.key as keyof typeof d] as number;
                      const w = (value * Number(mentorshipAnim)) * 900 / maxVal;
                      const color = m.color;
                      return (
                        <g key={m.key}>
                          <rect
                            x={100}
                            y={y0 + j*barH - 12}
                            width={w}
                            height={barH-2}
                            rx={3}
                            fill={color}
                            opacity={mentorshipHover && mentorshipHover.i === i && mentorshipHover.m === m.key ? 1 : 0.85}
                            style={{cursor:'pointer',transition:'all 0.7s'}}
                            onMouseEnter={() => setMentorshipHover({i, m: m.key})}
                            onMouseLeave={() => setMentorshipHover(null)}
                          />
                          {/* Tooltip on hover */}
                          {mentorshipHover && mentorshipHover.i === i && mentorshipHover.m === m.key && (
                            <g>
                              <rect x={100 + w - 10} y={y0 + j*barH - 40} width={180} height={38} rx={8} fill="#f1f5f9" stroke="#e5e7eb" />
                              <text x={100 + w + 80} y={y0 + j*barH - 24} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#444">{d.teacher}</text>
                              <circle cx={100 + w} cy={y0 + j*barH - 10} r={5} fill={color} />
                              <text x={100 + w + 15} y={y0 + j*barH - 6} fontSize="13" fill="#444">{m.label}: {value}</text>
                            </g>
                          )}
                        </g>
                      );
                    });
                  })}
                  {/* X axis labels */}
                  {[0,10,20,30,40,50].map((v, i) => (
                    <text key={v} x={100 + v*18} y={420} textAnchor="middle" fontSize="12" fill="#a3a3a3">{v.toFixed(2)}</text>
                  ))}
                  {/* Legend */}
                  {mentorshipMetrics.map((m, i) => (
                    <g key={m.key}>
                      <rect x={200 + i*250} y={430} width={18} height={12} rx={2} fill={m.color} />
                      <text x={220 + i*250} y={440} fontSize="14" fill={m.color}>{m.label}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            {/* Progression of Leadership Skills Over Time Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Progression of Leadership Skills Over Time</span>
              </div>
              <div className="w-full overflow-x-auto">
                <svg className="block mx-auto w-full h-[440px] min-w-[1200px]" viewBox="0 0 1200 440" preserveAspectRatio="none">
                  {/* Y grid lines */}
                  {[0,1,2,3,4,5,6,7,8,9].map(i => (
                    <line key={i} x1="70" x2="1150" y1={60 + i*38} y2={60 + i*38} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X grid lines and hover lines */}
                  {leadershipProgressionData.map((d, i) => (
                    <g key={d.month}>
                      <line x1={120 + i*110} x2={120 + i*110} y1={60} y2={400} stroke="#e5e7eb" strokeDasharray="4" strokeWidth="1" />
                      {leadershipHover === i && (
                        <line x1={120 + i*110} x2={120 + i*110} y1={60} y2={400} stroke="#a3a3a3" strokeDasharray="2" strokeWidth="2" />
                      )}
                    </g>
                  ))}
                  {/* Lines */}
                  {leadershipProgressionMetrics.map((m, idx) => {
                    const color = m.color;
                    const points = leadershipProgressionData.map((d, i) => {
                      const val = d[m.key as keyof typeof d] as number;
                      const y = 400 - (val * leadershipAnim) * 340 / 100;
                      return [120 + i*110, y];
                    });
                    return (
                      <polyline
                        key={m.key}
                        fill="none"
                        stroke={color}
                        strokeWidth={3}
                        points={points.map(p => p.join(',')).join(' ')}
                        style={{transition: 'all 0.7s'}}
                      />
                    );
                  })}
                  {/* Points and value labels */}
                  {leadershipProgressionData.map((d, i) => (
                    <g key={d.month}>
                      {leadershipProgressionMetrics.map((m, j) => {
                        const val = d[m.key as keyof typeof d] as number;
                        const y = 400 - (val * leadershipAnim) * 340 / 100;
                        return (
                          <g key={m.key}>
                            <rect x={120 + i*110 - 16} y={y-16} width={32} height={22} rx={5} fill={m.color} />
                            <text x={120 + i*110} y={y} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fff">{Math.round(val * leadershipAnim)}</text>
                          </g>
                        );
                      })}
                    </g>
                  ))}
                  {/* Tooltip on hover */}
                  {leadershipHover !== null && (() => {
                    const i = leadershipHover;
                    const d = leadershipProgressionData[i];
                    const x = 120 + i*110;
                    return (
                      <g>
                        <rect x={x-70} y={120} width={180} height={160} rx={10} fill="#fff" stroke="#e5e7eb" />
                        <text x={x} y={140} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#444">{d.month}</text>
                        {leadershipProgressionMetrics.map((m, j) => (
                          <g key={m.key}>
                            <circle cx={x-50} cy={160 + j*22} r={6} fill={m.color} />
                            <text x={x-35} y={164 + j*22} fontSize="13" fill="#444">{m.label}: {(d[m.key as keyof typeof d] as number).toFixed(1)}</text>
                          </g>
                        ))}
                        {/* Average */}
                        <circle cx={x-50} cy={160 + 5*22} r={6} fill="#22c55e" />
                        <text x={x-35} y={164 + 5*22} fontSize="13" fill="#444">Average Leadership Score: {(
                          leadershipProgressionMetrics.reduce((sum, m) => sum + (d[m.key as keyof typeof d] as number), 0) / leadershipProgressionMetrics.length
                        ).toFixed(1)}</text>
                      </g>
                    );
                  })()}
                  {/* X axis labels (hoverable) */}
                  {leadershipProgressionData.map((d, i) => (
                    <g key={d.month}>
                      <rect x={120 + i*110 - 40} y={410} width={80} height={28} fill={leadershipHover === i ? '#f1f5f9' : 'transparent'} rx={6}
                        style={{cursor:'pointer'}}
                        onMouseEnter={() => setLeadershipHover(i)}
                        onMouseLeave={() => setLeadershipHover(null)}
                      />
                      <text x={120 + i*110} y={430} textAnchor="middle" fontSize="13" fill="#64748b" style={{cursor:'pointer',fontWeight:leadershipHover===i?700:400}} onMouseEnter={() => setLeadershipHover(i)} onMouseLeave={() => setLeadershipHover(null)}>{d.month}</text>
                    </g>
                  ))}
                  {/* Y axis labels */}
                  {[10,20,30,40,50,60,70,80,90,100].map((v, i) => (
                    <text key={v} x={60} y={400 - v*340/100 + 5} textAnchor="end" fontSize="12" fill="#a3a3a3">{v.toFixed(2)}</text>
                  ))}
                  {/* Legend */}
                  {leadershipProgressionMetrics.map((m, i) => (
                    <g key={m.key}>
                      <rect x={200 + i*180} y={430} width={18} height={12} rx={2} fill={m.color} />
                      <text x={220 + i*180} y={440} fontSize="14" fill={m.color}>{m.label}</text>
                    </g>
                  ))}
                  {/* Average legend */}
                  <rect x={200 + 5*180} y={430} width={18} height={12} rx={2} fill="#22c55e" />
                  <text x={220 + 5*180} y={440} fontSize="14" fill="#22c55e">Average Leadership Score</text>
                </svg>
        </div>
            </div>
    </div>
  );
      case 'behavioral-insights':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Behavioral Insights</h2>
            <div className="text-sm text-gray-500 mb-4">Active Section: {activeSection}</div>
            <div className="bg-white rounded-xl shadow p-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Personality Type Distribution</span>
          </div>
              <div className="w-full overflow-x-auto">
                <svg className="block mx-auto w-full h-[440px] min-w-[1200px]" viewBox="0 0 1200 440" preserveAspectRatio="none">
                  {/* Y grid lines */}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                    <line key={i} x1="70" x2="1150" y1={60 + i*34} y2={60 + i*34} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* Bars */}
                  {personalityData.map((d, i) => {
                    const x0 = 120 + i*100;
                    const barW = 18;
                    const maxVal = 100;
                    return personalityTraits.map((m, j) => {
                      const value = d[m.key as keyof typeof d] as number;
                      const h = (value * Number(personalityAnim)) * 320 / maxVal;
                      return (
                        <g key={m.key}>
                          <rect
                            x={x0 - 45 + j*barW}
                            y={380 - h}
                            width={barW-2}
                            height={h}
                            rx={3}
                            fill={m.color}
                            opacity={personalityHover && personalityHover.i === i && personalityHover.m === m.key ? 1 : 0.85}
                            style={{cursor:'pointer',transition:'all 0.7s'}}
                            onMouseEnter={() => setPersonalityHover({i, m: m.key})}
                            onMouseLeave={() => setPersonalityHover(null)}
                          />
                          {/* Tooltip on hover */}
                          {personalityHover && personalityHover.i === i && personalityHover.m === m.key && (
                            <g>
                              <rect x={x0-60} y={380 - h - 60} width={180} height={38} rx={8} fill="#f1f5f9" stroke="#e5e7eb" />
                              <text x={x0} y={380 - h - 44} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#444">{d.teacher}</text>
                              <circle cx={x0} cy={380 - h - 28} r={5} fill={m.color} />
                              <text x={x0+10} y={380 - h - 24} fontSize="13" fill="#444">{m.label}: {value}</text>
                            </g>
                          )}
                        </g>
                      );
                    });
                  })}
                  {/* X axis labels */}
                  {personalityData.map((d, i) => (
                    <text
                      key={d.teacher}
                      x={120 + i*100}
                      y={410}
                      textAnchor="middle"
                      fontSize="14"
                      fill="#64748b"
                      style={{fontWeight:400}}
                    >
                      {d.teacher}
                    </text>
                  ))}
                  {/* Y axis labels */}
                  {[0,10,20,30,40,50,60,70,80,90,100].map((v, i) => (
                    <text key={v} x={60} y={380 - v*320/100 + 5} textAnchor="end" fontSize="12" fill="#a3a3a3">{v.toFixed(2)}</text>
                  ))}
                  {/* Legend */}
                  {personalityTraits.map((m, i) => (
                    <g key={m.key}>
                      <rect x={200 + i*220} y={430} width={18} height={12} rx={2} fill={m.color} />
                      <text x={220 + i*220} y={440} fontSize="14" fill={m.color}>{m.label}</text>
                    </g>
                  ))}
                </svg>
        </div>
      </div>
            {/* Emotional Intelligence Scores by Teacher Group Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-2">
                <span className="text-lg font-semibold text-gray-700">Emotional Intelligence Scores by Teacher Group</span>
              </div>
              <div className="flex flex-row items-center justify-between gap-8 w-full">
                {eiData.map((group, gIdx) => (
                  <div key={group.group} className="flex flex-col items-center justify-center w-1/3">
                    <svg width="400" height="400" viewBox="0 0 400 400" className="mb-2">
                      {eiMetrics.map((m, i) => {
                        const radius = 170 - i*20;
                        const value = group[m.key as keyof typeof group] as number;
                        const circ = 2 * Math.PI * radius;
                        const offset = circ * (1 - (value/100) * eiAnim);
                        return (
                          <g key={m.key}>
                            <circle
                              cx="200" cy="200" r={radius}
                              fill="none"
                              stroke="#f3f4f6"
                              strokeWidth={14}
                            />
                            <circle
                              cx="200" cy="200" r={radius}
                              fill="none"
                              stroke={m.color}
                              strokeWidth={14}
                              strokeDasharray={circ}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              style={{transition:'stroke-dashoffset 0.7s', cursor:'pointer', opacity: eiHover && eiHover.g === gIdx && eiHover.m === m.key ? 1 : 0.85}}
                              onMouseEnter={() => setEiHover({g: gIdx, m: m.key})}
                              onMouseLeave={() => setEiHover(null)}
                            />
                          </g>
                        );
                      })}
                      {/* Center text */}
                      <circle cx="200" cy="200" r="100" fill="#fff" />
                      <text x="200" y="195" textAnchor="middle" fontSize="22" fontWeight="bold" fill={(() => {
                        if (eiHover && eiHover.g === gIdx) {
                          const m = eiMetrics.find(m => m.key === eiHover.m);
                          return m ? m.color : '#3b82f6';
                        }
                        return gIdx === 0 ? '#f59e42' : gIdx === 1 ? '#06b6d4' : '#a78bfa';
                      })()}>
                        {eiHover && eiHover.g === gIdx
                          ? eiMetrics.find(m => m.key === eiHover.m)?.label
                          : group.group}
                      </text>
                      <text x="200" y="225" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#222">
                        {eiHover && eiHover.g === gIdx
                          ? group[eiHover.m as keyof typeof group] + '%'
                          : ''}
                      </text>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Adaptability & Resilience Index Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-6">
                <span className="text-lg font-semibold text-gray-700">Adaptability & Resilience Index</span>
              </div>
              <div className="relative">
                <svg width="100%" height="600" viewBox="0 0 1200 600" className="w-full">
                  {/* Grid lines */}
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((tick, i) => (
                    <g key={tick}>
                      <line x1="100" y1={600 - (tick - 10) * 5.45} x2="1100" y2={600 - (tick - 10) * 5.45} stroke="#f3f4f6" strokeWidth="1" />
                      <text x="90" y={600 - (tick - 10) * 5.45 + 4} textAnchor="end" fontSize="14" fill="#6b7280">{tick.toFixed(2)}</text>
                    </g>
                  ))}
                  
                  {/* Create smooth curve points for each metric */}
                  {(() => {
                    const stressPoints = adaptabilityResilienceData.map((item, i) => ({
                      x: 100 + i * 100,
                      y: 600 - (item.stress - 10) * 5.45 * adaptabilityAnim
                    }));
                    
                    const adaptToChangePoints = adaptabilityResilienceData.map((item, i) => ({
                      x: 100 + i * 100,
                      y: 600 - (item.adaptToChange - 10) * 5.45 * adaptabilityAnim
                    }));
                    
                    const resiliencePoints = adaptabilityResilienceData.map((item, i) => ({
                      x: 100 + i * 100,
                      y: 600 - (item.resilience - 10) * 5.45 * adaptabilityAnim
                    }));
                    
                    const crisisPoints = adaptabilityResilienceData.map((item, i) => ({
                      x: 100 + i * 100,
                      y: 600 - (item.crisis - 10) * 5.45 * adaptabilityAnim
                    }));
                    
                    const indexPoints = adaptabilityResilienceData.map((item, i) => ({
                      x: 100 + i * 100,
                      y: 600 - (item.index - 10) * 5.45 * adaptabilityAnim
                    }));
                    
                    return (
                      <>
                        {/* Stress Management Score line (blue) */}
                        <path 
                          d={createSmoothCurve(stressPoints)} 
                          fill="none" 
                          stroke="#6366f1" 
                          strokeWidth="5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Adaptability to Change Score line (teal) */}
                        <path 
                          d={createSmoothCurve(adaptToChangePoints)} 
                          fill="none" 
                          stroke="#14b8a6" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Resilience Under Pressure Score line (purple) */}
                        <path 
                          d={createSmoothCurve(resiliencePoints)} 
                          fill="none" 
                          stroke="#8b5cf6" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Crisis Response Effectiveness Score line (cyan) */}
                        <path 
                          d={createSmoothCurve(crisisPoints)} 
                          fill="none" 
                          stroke="#2dd4bf" 
                          strokeWidth="5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Adaptability & Resilience Index line (light purple) */}
                        <path 
                          d={createSmoothCurve(indexPoints)} 
                          fill="none" 
                          stroke="#a78bfa" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Data points for all metrics */}
                        {adaptabilityResilienceData.map((item, i) => (
                          <g key={i}>
                            {/* Stress Management points */}
                            <g>
                              <rect 
                                x={100 + i * 100 - 15} 
                                y={600 - (item.stress - 10) * 5.45 * adaptabilityAnim - 15} 
                                width="30" 
                                height="30" 
                                rx="4" 
                                fill="#6366f1" 
                              />
                              <text 
                                x={100 + i * 100} 
                                y={600 - (item.stress - 10) * 5.45 * adaptabilityAnim + 4} 
                                textAnchor="middle" 
                                fontSize="12" 
                                fontWeight="bold" 
                                fill="white"
                              >
                                {item.stress}
                              </text>
                            </g>
                            
                            {/* Adaptability to Change points */}
                            <g>
                              <rect 
                                x={100 + i * 100 - 15} 
                                y={600 - (item.adaptToChange - 10) * 5.45 * adaptabilityAnim - 15} 
                                width="30" 
                                height="30" 
                                rx="4" 
                                fill="#14b8a6" 
                              />
                              <text 
                                x={100 + i * 100} 
                                y={600 - (item.adaptToChange - 10) * 5.45 * adaptabilityAnim + 4} 
                                textAnchor="middle" 
                                fontSize="12" 
                                fontWeight="bold" 
                                fill="white"
                              >
                                {item.adaptToChange}
                              </text>
                            </g>
                            
                            {/* Resilience Under Pressure points */}
                            <g>
                              <rect 
                                x={100 + i * 100 - 15} 
                                y={600 - (item.resilience - 10) * 5.45 * adaptabilityAnim - 15} 
                                width="30" 
                                height="30" 
                                rx="4" 
                                fill="#8b5cf6" 
                              />
                              <text 
                                x={100 + i * 100} 
                                y={600 - (item.resilience - 10) * 5.45 * adaptabilityAnim + 4} 
                                textAnchor="middle" 
                                fontSize="12" 
                                fontWeight="bold" 
                                fill="white"
                              >
                                {item.resilience}
                              </text>
                            </g>
                            
                            {/* Crisis Response Effectiveness points */}
                            <g>
                              <rect 
                                x={100 + i * 100 - 15} 
                                y={600 - (item.crisis - 10) * 5.45 * adaptabilityAnim - 15} 
                                width="30" 
                                height="30" 
                                rx="4" 
                                fill="#2dd4bf" 
                              />
                              <text 
                                x={100 + i * 100} 
                                y={600 - (item.crisis - 10) * 5.45 * adaptabilityAnim + 4} 
                                textAnchor="middle" 
                                fontSize="12" 
                                fontWeight="bold" 
                                fill="white"
                              >
                                {item.crisis}
                              </text>
                            </g>
                            
                            {/* Adaptability & Resilience Index points */}
                            <g>
                              <rect 
                                x={100 + i * 100 - 15} 
                                y={600 - (item.index - 10) * 5.45 * adaptabilityAnim - 15} 
                                width="30" 
                                height="30" 
                                rx="4" 
                                fill="#a78bfa" 
                              />
                              <text 
                                x={100 + i * 100} 
                                y={600 - (item.index - 10) * 5.45 * adaptabilityAnim + 4} 
                                textAnchor="middle" 
                                fontSize="12" 
                                fontWeight="bold" 
                                fill="white"
                              >
                                {item.index.toFixed(2)}
                              </text>
                            </g>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                  
                  {/* Hover vertical line */}
                  {adaptabilityHover && (
                    <line 
                      x1={100 + adaptabilityResilienceData.findIndex(item => item.category === adaptabilityHover) * 100} 
                      y1="80" 
                      x2={100 + adaptabilityResilienceData.findIndex(item => item.category === adaptabilityHover) * 100} 
                      y2="580" 
                      stroke="#d1d5db" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                    />
                  )}
                </svg>
                
                {/* Custom X-axis tabs */}
                <div className="flex justify-center gap-4 mt-6">
                  {adaptabilityResilienceData.map((item) => (
                    <div
                      key={item.category}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 relative ${
                        adaptabilityHover === item.category
                          ? 'bg-blue-50 border-2 border-blue-200 text-blue-700 font-semibold'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      onMouseEnter={() => setAdaptabilityHover(item.category)}
                      onMouseLeave={() => setAdaptabilityHover(null)}
                    >
                      {item.category}
                      {adaptabilityHover === item.category && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-200"></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Tooltip */}
                {adaptabilityHover && (
                  <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm" style={{
                    left: `${100 + adaptabilityResilienceData.findIndex(item => item.category === adaptabilityHover) * 100}px`,
                    top: '20px',
                    transform: 'translateX(-50%)'
                  }}>
                    <div className="font-semibold text-gray-800 mb-2">{adaptabilityHover}</div>
                    {adaptabilityResilienceMetrics.map((metric) => {
                      const item = adaptabilityResilienceData.find(item => item.category === adaptabilityHover);
                      const value = item ? item[metric.key as keyof typeof item] as number : 0;
                      return (
                        <div key={metric.key} className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: metric.color}}></div>
                          <span className="text-gray-600">{metric.label}:</span>
                          <span className="font-semibold">{value.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Workstyle & Collaboration Preference Analysis Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-6">
                <span className="text-lg font-semibold text-gray-700">Workstyle & Collaboration Preference Analysis - Preferred Workstyle</span>
                <div className="text-sm text-gray-500 mt-1">Chart Animation: {workstyleAnim.toFixed(2)}</div>
              </div>
              <div className="relative">
                <svg width="100%" height="600" viewBox="0 0 1200 600" className="w-full">
                  {/* Grid lines */}
                  {[60, 65, 70, 75, 80, 85, 90, 95, 100].map((tick, i) => (
                    <g key={tick}>
                      <line x1="100" y1={600 - (tick - 60) * 5.2} x2="1100" y2={600 - (tick - 60) * 5.2} stroke="#f3f4f6" strokeWidth="1" />
                      <text x="90" y={600 - (tick - 60) * 5.2 + 4} textAnchor="end" fontSize="14" fill="#6b7280">{tick}</text>
                    </g>
                  ))}
                  
                  {/* X-axis labels */}
                  {workstyleData.map((item, i) => (
                    <text key={item.category} x={100 + i * 125} y="580" textAnchor="middle" fontSize="13" fill="#6b7280" className="cursor-pointer hover:fill-gray-800" onMouseEnter={() => setWorkstyleHover({category: item.category, metric: ''})} onMouseLeave={() => setWorkstyleHover(null)}>
                      {item.category}
                    </text>
                  ))}
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="conflictGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Create smooth curve points for each metric */}
                  {(() => {
                    const conflictPoints = workstyleData.map((item, i) => ({
                      x: 100 + i * 125,
                      y: 600 - (item.conflict - 60) * 5.2 * workstyleAnim
                    }));
                    
                    const teamworkPoints = workstyleData.map((item, i) => ({
                      x: 100 + i * 125,
                      y: 600 - (item.teamwork - 60) * 5.2 * workstyleAnim
                    }));
                    
                    const communicationPoints = workstyleData.map((item, i) => ({
                      x: 100 + i * 125,
                      y: 600 - (item.communication - 60) * 5.2 * workstyleAnim
                    }));
                    
                    return (
                      <>
                        {/* Area fill for conflict resolution (gray area chart) */}
                        <path 
                          d={`${createSmoothCurve(conflictPoints)} L ${100 + (workstyleData.length - 1) * 125},600 L 100,600 Z`} 
                          fill="url(#conflictGradient)" 
                        />
                        
                        {/* Conflict Resolution Score line (gray) */}
                        <path 
                          d={createSmoothCurve(conflictPoints)} 
                          fill="none" 
                          stroke="#9ca3af" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Teamwork Effectiveness Score line (purple) */}
                        <path 
                          d={createSmoothCurve(teamworkPoints)} 
                          fill="none" 
                          stroke="#8b5cf6" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Communication Adaptability Score line (green) */}
                        <path 
                          d={createSmoothCurve(communicationPoints)} 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Data points for all metrics */}
                        {workstyleData.map((item, i) => (
                          <g key={i}>
                            {/* Conflict points */}
                            <circle 
                              cx={100 + i * 125} 
                              cy={600 - (item.conflict - 60) * 5.2 * workstyleAnim} 
                              r="5" 
                              fill="#9ca3af" 
                              stroke="white" 
                              strokeWidth="2" 
                              className="cursor-pointer hover:r-8" 
                              onMouseEnter={() => setWorkstyleHover({category: item.category, metric: 'conflict'})} 
                              onMouseLeave={() => setWorkstyleHover(null)} 
                            />
                            
                            {/* Teamwork points */}
                            <circle 
                              cx={100 + i * 125} 
                              cy={600 - (item.teamwork - 60) * 5.2 * workstyleAnim} 
                              r="5" 
                              fill="#8b5cf6" 
                              stroke="white" 
                              strokeWidth="2" 
                              className="cursor-pointer hover:r-8" 
                              onMouseEnter={() => setWorkstyleHover({category: item.category, metric: 'teamwork'})} 
                              onMouseLeave={() => setWorkstyleHover(null)} 
                            />
                            
                            {/* Communication points */}
                            <circle 
                              cx={100 + i * 125} 
                              cy={600 - (item.communication - 60) * 5.2 * workstyleAnim} 
                              r="5" 
                              fill="#10b981" 
                              stroke="white" 
                              strokeWidth="2" 
                              className="cursor-pointer hover:r-8" 
                              onMouseEnter={() => setWorkstyleHover({category: item.category, metric: 'communication'})} 
                              onMouseLeave={() => setWorkstyleHover(null)} 
                            />
                          </g>
                        ))}
                      </>
                    );
                  })()}
                  
                  {/* Hover vertical line */}
                  {workstyleHover && workstyleHover.category && (
                    <line 
                      x1={100 + workstyleData.findIndex(item => item.category === workstyleHover.category) * 125} 
                      y1="80" 
                      x2={100 + workstyleData.findIndex(item => item.category === workstyleHover.category) * 125} 
                      y2="580" 
                      stroke="#d1d5db" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                    />
                  )}
                </svg>
                
                {/* Legend */}
                <div className="flex justify-center gap-8 mt-4">
                  {workstyleMetrics.map((metric) => (
                    <div key={metric.key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: metric.color}}></div>
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Tooltip */}
                {workstyleHover && workstyleHover.category && workstyleHover.metric && (
                  <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm" style={{
                    left: `${100 + workstyleData.findIndex(item => item.category === workstyleHover.category) * 125}px`,
                    top: '20px',
                    transform: 'translateX(-50%)'
                  }}>
                    <div className="font-semibold text-gray-800 mb-1">{workstyleHover.category}</div>
                    {workstyleMetrics.map((metric) => {
                      const item = workstyleData.find(item => item.category === workstyleHover.category);
                      const value = item ? item[metric.key as keyof typeof item] as number : 0;
                      return (
                        <div key={metric.key} className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: metric.color}}></div>
                          <span className="text-gray-600">{metric.label}:</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* Workstyle & Collaboration Preference Analysis Section */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <div className="mb-6">
                <span className="text-lg font-semibold text-gray-700">Workstyle & Collaboration Preference Analysis - Collaboration Preference</span>
          </div>
              <div className="relative">
                <svg width="100%" height="440" viewBox="0 0 1000 440" className="w-full">
                  {/* Grid lines */}
                  {[60, 65, 70, 75, 80, 85, 90, 95, 100].map((tick, i) => (
                    <g key={tick}>
                      <line x1="80" y1={440 - (tick - 60) * 3.8} x2="920" y2={440 - (tick - 60) * 3.8} stroke="#f3f4f6" strokeWidth="1" />
                      <text x="70" y={440 - (tick - 60) * 3.8 + 4} textAnchor="end" fontSize="12" fill="#6b7280">{tick}</text>
                    </g>
                  ))}
                  
                  {/* X-axis labels */}
                  {workstyleCollabData.map((item, i) => (
                    <text key={item.category} x={80 + i * 93} y="430" textAnchor="middle" fontSize="11" fill="#6b7280" className="cursor-pointer hover:fill-gray-800" onMouseEnter={() => setWorkstyleCollabHover({category: item.category, metric: ''})} onMouseLeave={() => setWorkstyleCollabHover(null)}>
                      {item.category}
                    </text>
                  ))}
                  
                  {/* Conflict Resolution Score line with area */}
                  <defs>
                    <linearGradient id="collabGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill for conflict resolution */}
                  <path d={`M ${workstyleCollabData.map((item, i) => `${80 + i * 93},${440 - (item.conflict - 60) * 3.8 * workstyleCollabAnim}`).join(' L ')} L ${80 + (workstyleCollabData.length - 1) * 93},440 L 80,440 Z`} fill="url(#collabGradient)" />
                  
                  {/* Lines */}
                  {workstyleMetrics.map((metric, mIdx) => (
                    <g key={metric.key}>
                      <path d={`M ${workstyleCollabData.map((item, i) => `${80 + i * 93},${440 - (item[metric.key as keyof typeof item] as number - 60) * 3.8 * workstyleCollabAnim}`).join(' L ')}`} fill="none" stroke={metric.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Data points */}
                      {workstyleCollabData.map((item, i) => (
                        <circle key={`${metric.key}-${i}`} cx={80 + i * 93} cy={440 - (item[metric.key as keyof typeof item] as number - 60) * 3.8 * workstyleCollabAnim} r="4" fill={metric.color} stroke="white" strokeWidth="2" className="cursor-pointer hover:r-6" onMouseEnter={() => setWorkstyleCollabHover({category: item.category, metric: metric.key})} onMouseLeave={() => setWorkstyleCollabHover(null)} />
                      ))}
                    </g>
                  ))}
                  
                  {/* Hover vertical line */}
                  {workstyleCollabHover && workstyleCollabHover.category && (
                    <line x1={80 + workstyleCollabData.findIndex(item => item.category === workstyleCollabHover.category) * 93} y1="60" x2={80 + workstyleCollabData.findIndex(item => item.category === workstyleCollabHover.category) * 93} y2="420" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
                  )}
                </svg>
                
                {/* Legend */}
                <div className="flex justify-center gap-8 mt-4">
                  {workstyleMetrics.map((metric) => (
                    <div key={metric.key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: metric.color}}></div>
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                  ))}
        </div>
                
                {/* Tooltip */}
                {workstyleCollabHover && workstyleCollabHover.category && workstyleCollabHover.metric && (
                  <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm" style={{
                    left: `${80 + workstyleCollabData.findIndex(item => item.category === workstyleCollabHover.category) * 93}px`,
                    top: '20px',
                    transform: 'translateX(-50%)'
                  }}>
                    <div className="font-semibold text-gray-800 mb-1">{workstyleCollabHover.category}</div>
                    {workstyleMetrics.map((metric) => {
                      const item = workstyleCollabData.find(item => item.category === workstyleCollabHover.category);
                      const value = item ? item[metric.key as keyof typeof item] as number : 0;
                      return (
                        <div key={metric.key} className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: metric.color}}></div>
                          <span className="text-gray-600">{metric.label}:</span>
                          <span className="font-semibold">{value}</span>
      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Engagement in Professional Learning Communities */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Engagement in Professional Learning Communities</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {communityData.map((community, communityIndex) => {
                  // Calculate total for percentage calculations
                  const total = community.series.reduce((sum, item) => sum + item.value, 0);
                  
                  // Create donut chart segments
                  const createDonutSegment = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
                    const x1 = 200 + radius * Math.cos(startAngle);
                    const y1 = 200 + radius * Math.sin(startAngle);
                    const x2 = 200 + radius * Math.cos(endAngle);
                    const y2 = 200 + radius * Math.sin(endAngle);
                    
                    const innerX1 = 200 + innerRadius * Math.cos(startAngle);
                    const innerY1 = 200 + innerRadius * Math.sin(startAngle);
                    const innerX2 = 200 + innerRadius * Math.cos(endAngle);
                    const innerY2 = 200 + innerRadius * Math.sin(endAngle);
                    
                    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
                    
                    const outerArc = `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
                    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`;
                    
                    return `M ${x1} ${y1} ${outerArc} L ${innerX2} ${innerY2} ${innerArc} Z`;
                  };
                  
                  let currentAngle = -Math.PI / 2; // Start from top
                  
                  return (
                    <div key={community.id} className="bg-white border border-gray-200 rounded-lg p-6 relative">
                      {/* Chart ID */}
                      <div className="text-sm text-gray-500 mb-4">{community.id}</div>
                      
                      {/* Donut Chart */}
                      <div className="relative flex justify-center">
                        <svg width="400" height="400" viewBox="0 0 400 400" className="w-full max-w-sm">
                          {/* Background circle */}
                          <circle
                            cx="200"
                            cy="200"
                            r="120"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="24"
                          />
                          
                          {/* Donut segments */}
                          {community.series.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const segmentAngle = (percentage / 100) * 2 * Math.PI;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + segmentAngle;
                            
                            currentAngle = endAngle;
                            
                            const pathData = createDonutSegment(startAngle, endAngle, 120, 96);
                            
                            return (
                              <g key={item.name}>
                                {/* Gradient definition for 3D effect */}
                                <defs>
                                  <linearGradient id={`gradient-${community.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={item.color} stopOpacity="1" />
                                    <stop offset="100%" stopColor={item.color} stopOpacity="0.8" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Segment path */}
                                                                 <path
                                   d={pathData}
                                   fill={`url(#gradient-${community.id}-${index})`}
                                   opacity={communityAnim}
                                   className="transition-all duration-1000 ease-out animate-community-segment-grow"
                                   onMouseEnter={() => setCommunityHover({id: community.id, segment: item.name})}
                                   onMouseLeave={() => setCommunityHover(null)}
                                   style={{
                                     filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                                     animationDelay: `${index * 0.2}s`
                                   }}
                                 />
                              </g>
                            );
                          })}
                          
                          {/* Center circle */}
                          <circle
                            cx="200"
                            cy="200"
                            r="96"
                            fill="white"
                          />
                        </svg>
                        
                                                 {/* Hover tooltip */}
                         {communityHover && communityHover.id === community.id && (
                           <div 
                             className="absolute bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg z-10 animate-community-tooltip-fade"
                             style={{
                               backgroundColor: community.series.find(s => s.name === communityHover.segment)?.color,
                               color: 'white',
                               top: '50%',
                               left: '50%',
                               transform: 'translate(-50%, -50%)',
                               marginTop: '-80px'
                             }}
                           >
                            <div className="text-sm font-medium">
                              {communityHover.segment}: {community.series.find(s => s.name === communityHover.segment)?.value}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Legend */}
                      <div className="mt-6">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {community.series.slice(0, 4).map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{backgroundColor: item.color}}
                              ></div>
                              <span className="text-xs text-gray-600">{item.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{backgroundColor: community.series[4].color}}
                            ></div>
                            <span className="text-xs text-gray-600">{community.series[4].name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Workshop & Conference Attendance Over Time */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Workshop & Conference Attendance Over Time</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < attendanceData.categories.length) {
                    setAttendanceHover(attendanceData.categories[categoryIndex]);
                  } else {
                    setAttendanceHover(null);
                  }
                }}
                onMouseLeave={() => setAttendanceHover(null)}
              >
                {/* Grid lines */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 8}
                    x2="1300"
                    y2={400 - tick * 8}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 8 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {attendanceData.categories.map((category, index) => (
                  <g key={category}>
                    <text
                      x={150 + index * 120}
                      y="450"
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {category}
                    </text>
                    {/* Vertical grid lines */}
                    <line
                      x1={150 + index * 120}
                      y1="50"
                      x2={150 + index * 120}
                      y2="400"
                      stroke="#f3f4f6"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  </g>
                ))}
                
                {/* Hover vertical line */}
                {attendanceHover && (
                  <line
                    x1={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120}
                    y1="50"
                    x2={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* X-axis label highlight */}
                {attendanceHover && (
                  <rect
                    x={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120 - 30}
                    y="440"
                    width="60"
                    height="20"
                    fill="#f3f4f6"
                    rx="4"
                  />
                )}
                
                {/* Areaspline fill (Conferences Attended) */}
                {(() => {
                  const conferencesSeries = attendanceData.series.find(s => s.name === 'Conferences Attended');
                  if (conferencesSeries) {
                    const points = conferencesSeries.data.map((value, index) => ({
                      x: 150 + index * 120,
                      y: 400 - (value / 40) * 350
                    }));
                    
                    const pathData = createSmoothCurve(points);
                    const areaPath = `${pathData} L ${points[points.length - 1].x} 400 L ${points[0].x} 400 Z`;
                    
                                         return (
                       <path
                         d={areaPath}
                         fill={conferencesSeries.color}
                         opacity="0.3"
                         className="transition-all duration-1000 ease-out animate-attendance-area-fill"
                       />
                     );
                  }
                  return null;
                })()}
                
                {/* Column bars (Workshops Attended) */}
                {(() => {
                  const workshopsSeries = attendanceData.series.find(s => s.name === 'Workshops Attended');
                  if (workshopsSeries) {
                    return workshopsSeries.data.map((value, index) => {
                      const barHeight = (value / 40) * 350 * attendanceAnim;
                      const barWidth = 40;
                      const barX = 150 + index * 120 - barWidth / 2;
                      const barY = 400 - barHeight;
                      
                      return (
                        <g key={`workshop-${index}`}>
                                                     {/* Bar with rounded top */}
                           <rect
                             x={barX}
                             y={barY}
                             width={barWidth}
                             height={barHeight}
                             fill={workshopsSeries.color}
                             opacity={attendanceAnim}
                             className="transition-all duration-1000 ease-out animate-satisfaction-bar-grow"
                             rx="4"
                             ry="4"
                             style={{ animationDelay: `${index * 0.1}s` }}
                           />
                        </g>
                      );
                    });
                  }
                  return null;
                })()}
                
                {/* Spline lines */}
                {attendanceData.series.map((series) => {
                  if (series.type === 'spline' || series.type === 'areaspline') {
                    const points = series.data.map((value, index) => ({
                      x: 150 + index * 120,
                      y: 400 - (value / 40) * 350
                    }));
                    
                    const pathData = createSmoothCurve(points);
                    
                    return (
                                             <path
                         key={series.name}
                         d={pathData}
                         fill="none"
                         stroke={series.color}
                         strokeWidth="3"
                         opacity={attendanceAnim}
                         className="transition-all duration-1000 ease-out animate-attendance-line-draw"
                       />
                    );
                  }
                  return null;
                })}
                
                {/* Tooltip */}
                {attendanceHover && (
                  <g>
                    <rect
                      x={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120 + 20}
                      y="50"
                      width="200"
                      height="120"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120 + 120}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {attendanceHover}
                    </text>
                    {/* All series data in tooltip */}
                    {attendanceData.series.map((series, index) => {
                      const value = series.data[attendanceData.categories.findIndex(cat => cat === attendanceHover)];
                      return (
                        <g key={series.name}>
                          <circle
                            cx={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120 + 40}
                            cy={90 + index * 25}
                            r="4"
                            fill={series.color}
                          />
                          <text
                            x={150 + attendanceData.categories.findIndex(cat => cat === attendanceHover) * 120 + 55}
                            y={95 + index * 25}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: <tspan fontWeight="bold">{value}%</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-8 mt-6">
                {attendanceData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'cognitive-reports':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Cognitive Reports</h2>
            <div className="bg-white rounded-xl shadow p-1">
              <div className="mb-0">
                <span className="text-lg font-semibold text-gray-700">Critical Thinking & Problem-Solving Scores - Overall Score</span>
              </div>
              <div className="relative">
                <svg width="100%" height="500" viewBox="0 0 1600 500" className="w-full">
                  {/* Grid lines */}
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((tick, i) => (
                    <g key={tick}>
                      <line x1={100 + (tick / 90) * 1300} y1="80" x2={100 + (tick / 90) * 1300} y2="420" stroke="#f3f4f6" strokeWidth="1" />
                      <text x={100 + (tick / 90) * 1300} y="440" textAnchor="middle" fontSize="14" fill="#6b7280">{tick}</text>
                    </g>
                  ))}
                  
                  {/* Y-axis labels */}
                  {criticalThinkingData.map((item, i) => (
                    <text key={item.category} x="90" y={100 + i * 35} textAnchor="end" fontSize="14" fill="#6b7280" className="font-semibold">
                      {item.category}
                    </text>
                  ))}
                  
                  {/* Horizontal bars */}
                  {criticalThinkingData.map((item, i) => {
                    const barWidth = (item.value / 90) * 1300 * criticalThinkingAnim;
                    const barY = 85 + i * 35;
                    const barHeight = 25;
                    
                    return (
                      <g key={item.category}>
                        <rect
                          x="100"
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          rx="4"
                          fill="#2dd4bf"
                          className="cursor-pointer transition-all duration-200 hover:opacity-80"
                          onMouseEnter={() => setCriticalThinkingHover(i)}
                          onMouseLeave={() => setCriticalThinkingHover(null)}
                        />
                      </g>
                    );
                  })}
                  
                  {/* Tooltip */}
                  {criticalThinkingHover !== null && (
                    <g>
                      {/* Tooltip background */}
                      <rect
                        x={100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 10}
                        y={100 + criticalThinkingHover * 35 - 25}
                        width="120"
                        height="60"
                        rx="8"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                      />
                      
                      {/* Tooltip arrow */}
                      <polygon
                        points={`${100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 5},${100 + criticalThinkingHover * 35} ${100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 10},${100 + criticalThinkingHover * 35 - 5} ${100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 10},${100 + criticalThinkingHover * 35 + 5}`}
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      
                      {/* Tooltip content */}
                      <text x={100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 20} y={100 + criticalThinkingHover * 35 - 10} fontSize="14" fontWeight="bold" fill="#374151">
                        {criticalThinkingData[criticalThinkingHover].category}
                      </text>
                      
                      <circle cx={100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 20} cy={100 + criticalThinkingHover * 35 + 5} r="4" fill="#2dd4bf" />
                      <text x={100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 30} y={100 + criticalThinkingHover * 35 + 8} fontSize="12" fill="#6b7280">
                        series-1:
                      </text>
                      <text x={100 + (criticalThinkingData[criticalThinkingHover].value / 90) * 1300 + 80} y={100 + criticalThinkingHover * 35 + 8} fontSize="12" fontWeight="bold" fill="#374151">
                        {criticalThinkingData[criticalThinkingHover].value.toFixed(2)}
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>
            
            {/* Creativity & Innovation Index Section */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <div className="mb-4">
                <span className="text-lg font-semibold text-gray-700">Creativity & Innovation Index</span>
              </div>
              <div className="relative">
                <svg width="100%" height="500" viewBox="0 0 1600 500" className="w-full">
                  {/* Grid lines */}
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick, i) => (
                    <g key={tick}>
                      <line x1="100" y1={500 - (tick / 100) * 400} x2="1500" y2={500 - (tick / 100) * 400} stroke="#f3f4f6" strokeWidth="1" />
                      <text x="90" y={500 - (tick / 100) * 400 + 4} textAnchor="end" fontSize="14" fill="#6b7280">{tick.toFixed(2)}</text>
                    </g>
                  ))}
                  
                  {/* X-axis labels */}
                  {creativityInnovationData.map((item, i) => (
                    <text key={item.category} x={150 + i * 140} y="480" textAnchor="middle" fontSize="14" fill="#6b7280" className="font-semibold">
                      {item.category}
                    </text>
                  ))}
                  
                  {/* Grouped bars */}
                  {creativityInnovationData.map((item, i) => {
                    const groupX = 150 + i * 140;
                    const barWidth = 20;
                    const barSpacing = 5;
                    const totalBarWidth = creativityInnovationMetrics.length * barWidth + (creativityInnovationMetrics.length - 1) * barSpacing;
                    const startX = groupX - totalBarWidth / 2;
                    
                    return (
                      <g key={item.category}>
                        {creativityInnovationMetrics.map((metric, j) => {
                          const barX = startX + j * (barWidth + barSpacing);
                          const barHeight = (item[metric.key as keyof typeof item] as number / 100) * 400 * creativityAnim;
                          const barY = 500 - barHeight;
                          
                          return (
                            <rect
                              key={metric.key}
                              x={barX}
                              y={barY}
                              width={barWidth}
                              height={barHeight}
                              rx="2"
                              fill={metric.color}
                              className="cursor-pointer transition-all duration-200 hover:opacity-80"
                              onMouseEnter={() => setCreativityHover({ i, m: metric.key })}
                              onMouseLeave={() => setCreativityHover(null)}
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                  
                  {/* Hover vertical line */}
                  {creativityHover && (
                    <line 
                      x1={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25)} 
                      y1="80" 
                      x2={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25)} 
                      y2="480" 
                      stroke="#d1d5db" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                    />
                  )}
                  
                  {/* Tooltip */}
                  {creativityHover && (
                    <g>
                      {/* Tooltip background */}
                      <rect
                        x={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25) - 60}
                        y={80}
                        width="200"
                        height="60"
                        rx="8"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                      />
                      
                      {/* Tooltip arrow */}
                      <polygon
                        points={`${150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25)},${140} ${150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25) - 5},${150} ${150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25) + 5},${150}`}
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      
                      {/* Tooltip content */}
                      <text x={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25)} y="100" fontSize="14" fontWeight="bold" fill="#374151" textAnchor="middle">
                        {creativityInnovationData[creativityHover.i].category}
                      </text>
                      
                      <circle cx={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25) - 80} cy="115" r="4" fill={creativityInnovationMetrics.find(m => m.key === creativityHover.m)?.color} />
                      <text x={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25) - 70} y="120" fontSize="12" fill="#6b7280">
                        {creativityInnovationMetrics.find(m => m.key === creativityHover.m)?.label}:
                      </text>
                      <text x={150 + creativityHover.i * 140 + (creativityInnovationMetrics.findIndex(m => m.key === creativityHover.m) * 25) + 80} y="120" fontSize="12" fontWeight="bold" fill="#374151">
                        {creativityInnovationData[creativityHover.i][creativityHover.m as keyof typeof creativityInnovationData[0]]} %
                      </text>
                    </g>
                  )}
                </svg>
                
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6">
                  {creativityInnovationMetrics.map((metric) => (
                    <div key={metric.key} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{backgroundColor: metric.color}}></div>
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Cognitive Load & Processing Speed Reports Section */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <div className="mb-6">
                <span className="text-lg font-semibold text-gray-700">Cognitive Load & Processing Speed Reports</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {cognitiveLoadData.map((teacher) => (
                  <div
                    key={teacher.teacherId}
                    className="bg-white rounded-lg shadow p-6 relative"
                    onMouseEnter={() => setCognitiveLoadHover(teacher.teacherId)}
                    onMouseLeave={() => setCognitiveLoadHover(null)}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Teacher ID: {teacher.teacherId}</h3>
                    
                    {/* Tooltip */}
                    {cognitiveLoadHover === teacher.teacherId && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold z-10">
                        Cognitive Load & Processing Speed Index: {teacher.index.toFixed(2)}
                      </div>
                    )}
                    
                    {/* Donut Chart */}
                    <div className="relative flex justify-center mb-4">
                      <svg width="200" height="200" viewBox="0 0 200 200" className="w-48 h-48">
                        {/* SVG Patterns */}
                        <defs>
                          <pattern id="pattern-vert-lines" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect width="10" height="10" fill="#8b5cf6"/>
                            <line x1="5" y1="0" x2="5" y2="10" stroke="white" strokeWidth="1" opacity="0.3"/>
                          </pattern>
                          <pattern id="pattern-horiz-lines" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect width="10" height="10" fill="#3b82f6"/>
                            <line x1="0" y1="5" x2="10" y2="5" stroke="white" strokeWidth="1" opacity="0.3"/>
                          </pattern>
                          <pattern id="pattern-grid" patternUnits="userSpaceOnUse" width="8" height="8">
                            <rect width="8" height="8" fill="#2dd4bf"/>
                            <rect width="8" height="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                          <pattern id="pattern-dots" patternUnits="userSpaceOnUse" width="8" height="8">
                            <rect width="8" height="8" fill="#14b8a6"/>
                            <circle cx="4" cy="4" r="1" fill="white" opacity="0.3"/>
                          </pattern>
                          
                          {/* Inner shadow filter */}
                          <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(0,0,0,0.1)"/>
                          </filter>
                        </defs>
                        
                        {/* Donut segments */}
                        <g filter="url(#inner-shadow)">
                          {/* Top-left segment (Working Memory) */}
                          <path
                            d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z"
                            fill="url(#pattern-vert-lines)"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                          />
                          
                          {/* Top-right segment (Processing Speed) */}
                          <path
                            d="M 100 100 L 180 100 A 80 80 0 0 1 100 180 Z"
                            fill="url(#pattern-horiz-lines)"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                          
                          {/* Bottom-right segment (Information Retention) */}
                          <path
                            d="M 100 100 L 100 180 A 80 80 0 0 1 20 100 Z"
                            fill="url(#pattern-grid)"
                            stroke="#2dd4bf"
                            strokeWidth="2"
                          />
                          
                          {/* Bottom-left segment (Cognitive Load Management) */}
                          <path
                            d="M 100 100 L 20 100 A 80 80 0 0 1 100 20 Z"
                            fill="url(#pattern-dots)"
                            stroke="#14b8a6"
                            strokeWidth="2"
                          />
                        </g>
                        
                        {/* Center white circle */}
                        <circle cx="100" cy="100" r="40" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                      </svg>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2">
                      {cognitiveLoadMetrics.map((metric) => (
                        <div key={metric.key} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: metric.color}}></div>
                          <span className="text-sm text-gray-600">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Learning Style & Self-Efficacy Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Learning Style Preference Report */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Learning Style Preference Report</h3>
                  <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 3l10 10M13 3L3 13" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <svg width="100%" height="400" viewBox="0 0 800 400" className="w-full">
                  {/* Grid lines */}
                  {[20, 25, 30, 35, 40, 45, 50, 55, 60].map((tick) => (
                    <line
                      key={tick}
                      x1="80"
                      y1={400 - (tick - 20) * 6.33}
                      x2="720"
                      y2={400 - (tick - 20) * 6.33}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Left Y-axis labels */}
                  {[20, 25, 30, 35, 40, 45, 50, 55, 60].map((tick) => (
                    <text
                      key={tick}
                      x="70"
                      y={400 - (tick - 20) * 6.33 + 4}
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      {tick.toFixed(2)}
                    </text>
                  ))}
                  
                  {/* Right Y-axis labels */}
                  {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((tick) => (
                    <text
                      key={tick}
                      x="730"
                      y={400 - (tick - 10) * 8.67}
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="start"
                    >
                      {tick.toFixed(2)}
                    </text>
                  ))}
                  
                  {/* X-axis labels */}
                  {learningStyleData.map((item, index) => (
                    <text
                      key={item.category}
                      x={80 + index * 64}
                      y="390"
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {item.category}
                    </text>
                  ))}
                  
                  {/* Visual Learning Area Chart */}
                  <path
                    d={`M ${learningStyleData.map((item, index) => 
                      `${80 + index * 64} ${400 - (item.visual - 20) * 6.33}`
                    ).join(' L ')}`}
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    opacity={learningStyleAnim}
                  />
                  <path
                    d={`M ${learningStyleData.map((item, index) => 
                      `${80 + index * 64} ${400 - (item.visual - 20) * 6.33}`
                    ).join(' L ')} L ${80 + (learningStyleData.length - 1) * 64} 400 L 80 400 Z`}
                    fill="url(#visualGradient)"
                    opacity={learningStyleAnim * 0.3}
                  />
                  
                  {/* Auditory Learning Line */}
                  <path
                    d={`M ${learningStyleData.map((item, index) => 
                      `${80 + index * 64} ${400 - (item.auditory - 20) * 6.33}`
                    ).join(' L ')}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    opacity={learningStyleAnim}
                  />
                  
                  {/* Kinesthetic Learning Line (Right Y-axis) */}
                  <path
                    d={`M ${learningStyleData.map((item, index) => 
                      `${80 + index * 64} ${400 - (item.kinesthetic - 10) * 8.67}`
                    ).join(' L ')}`}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    opacity={learningStyleAnim}
                  />
                  
                  {/* Data points */}
                  {learningStyleData.map((item, index) => (
                    <g key={item.category}>
                      <circle
                        cx={80 + index * 64}
                        cy={400 - (item.visual - 20) * 6.33}
                        r="3"
                        fill="#d1d5db"
                        opacity={learningStyleAnim}
                        onMouseEnter={() => setLearningStyleHover(index)}
                        onMouseLeave={() => setLearningStyleHover(null)}
                      />
                      <circle
                        cx={80 + index * 64}
                        cy={400 - (item.auditory - 20) * 6.33}
                        r="3"
                        fill="#6366f1"
                        opacity={learningStyleAnim}
                        onMouseEnter={() => setLearningStyleHover(index)}
                        onMouseLeave={() => setLearningStyleHover(null)}
                      />
                      <circle
                        cx={80 + index * 64}
                        cy={400 - (item.kinesthetic - 10) * 8.67}
                        r="3"
                        fill="#34d399"
                        opacity={learningStyleAnim}
                        onMouseEnter={() => setLearningStyleHover(index)}
                        onMouseLeave={() => setLearningStyleHover(null)}
                      />
                    </g>
                  ))}
                  
                  {/* Hover line */}
                  {learningStyleHover !== null && (
                    <line
                      x1={80 + learningStyleHover * 64}
                      y1="50"
                      x2={80 + learningStyleHover * 64}
                      y2="350"
                      stroke="#6b7280"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  )}
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="visualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Tooltip */}
                {learningStyleHover !== null && (
                  <div
                    className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                    style={{
                      left: `${80 + learningStyleHover * 64}px`,
                      top: '20px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      {learningStyleData[learningStyleHover].category}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-sm text-gray-600">Visual Learning Preference (%):</span>
                        <span className="text-sm font-semibold">{learningStyleData[learningStyleHover].visual} points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm text-gray-600">Auditory Learning Preference (%):</span>
                        <span className="text-sm font-semibold">{learningStyleData[learningStyleHover].auditory} points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                        <span className="text-sm text-gray-600">Kinesthetic Learning Preference (%):</span>
                        <span className="text-sm font-semibold">{learningStyleData[learningStyleHover].kinesthetic} points</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  {learningStyleMetrics.map((metric) => (
                    <div key={metric.key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: metric.color}}></div>
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Self-Efficacy & Confidence Growth Over Time */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-6">Self-Efficacy & Confidence Growth Over Time</h3>
                
                <svg width="100%" height="400" viewBox="0 0 800 400" className="w-full">
                  {/* Grid lines */}
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                    <line
                      key={tick}
                      x1="80"
                      y1={400 - tick * 3.6}
                      x2="720"
                      y2={400 - tick * 3.6}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                    <text
                      key={tick}
                      x="70"
                      y={400 - tick * 3.6 + 4}
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      {tick.toFixed(2)}
                    </text>
                  ))}
                  
                  {/* Y-axis label */}
                  <text
                    x="20"
                    y="200"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                    transform="rotate(-90 20 200)"
                  >
                    Points
                  </text>
                  
                  {/* X-axis labels */}
                  {selfEfficacyData.map((item, index) => (
                    <text
                      key={item.month}
                      x={80 + index * 64}
                      y="390"
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {item.month}
                    </text>
                  ))}
                  
                  {/* Task Confidence Bars */}
                  {selfEfficacyData.map((item, index) => (
                    <rect
                      key={item.month}
                      x={80 + index * 64 - 20}
                      y={400 - item.task * 3.6 * selfEfficacyAnim}
                      width="40"
                      height={item.task * 3.6 * selfEfficacyAnim}
                      fill="#818cf8"
                      opacity={0.8}
                      onMouseEnter={() => setSelfEfficacyHover(index)}
                      onMouseLeave={() => setSelfEfficacyHover(null)}
                    />
                  ))}
                  
                  {/* Problem-Solving Area Chart */}
                  <path
                    d={`M ${selfEfficacyData.map((item, index) => 
                      `${80 + index * 64} ${400 - item.problem * 3.6}`
                    ).join(' L ')} L ${80 + (selfEfficacyData.length - 1) * 64} 400 L 80 400 Z`}
                    fill="url(#problemGradient)"
                    opacity={selfEfficacyAnim * 0.3}
                  />
                  
                  {/* Adaptability Area Chart */}
                  <path
                    d={`M ${selfEfficacyData.map((item, index) => 
                      `${80 + index * 64} ${400 - item.adaptability * 3.6}`
                    ).join(' L ')} L ${80 + (selfEfficacyData.length - 1) * 64} 400 L 80 400 Z`}
                    fill="url(#adaptabilityGradient)"
                    opacity={selfEfficacyAnim * 0.3}
                  />
                  
                  {/* Decision-Making Area Chart */}
                  <path
                    d={`M ${selfEfficacyData.map((item, index) => 
                      `${80 + index * 64} ${400 - item.decision * 3.6}`
                    ).join(' L ')} L ${80 + (selfEfficacyData.length - 1) * 64} 400 L 80 400 Z`}
                    fill="url(#decisionGradient)"
                    opacity={selfEfficacyAnim * 0.3}
                  />
                  
                  {/* Self-Efficacy Index Line */}
                  <path
                    d={`M ${selfEfficacyData.map((item, index) => 
                      `${80 + index * 64} ${400 - item.index * 3.6}`
                    ).join(' L ')}`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    opacity={selfEfficacyAnim}
                  />
                  
                  {/* Data points for line */}
                  {selfEfficacyData.map((item, index) => (
                    <circle
                      key={item.month}
                      cx={80 + index * 64}
                      cy={400 - item.index * 3.6}
                      r="4"
                      fill="#f43f5e"
                      opacity={selfEfficacyAnim}
                      onMouseEnter={() => setSelfEfficacyHover(index)}
                      onMouseLeave={() => setSelfEfficacyHover(null)}
                    />
                  ))}
                  
                  {/* Hover line */}
                  {selfEfficacyHover !== null && (
                    <line
                      x1={80 + selfEfficacyHover * 64}
                      y1="50"
                      x2={80 + selfEfficacyHover * 64}
                      y2="350"
                      stroke="#6b7280"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  )}
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="problemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="adaptabilityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="decisionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fb7185" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#fb7185" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Tooltip */}
                {selfEfficacyHover !== null && (
                  <div
                    className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                    style={{
                      left: `${80 + selfEfficacyHover * 64}px`,
                      top: '20px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      {selfEfficacyData[selfEfficacyHover].month}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-400"></div>
                        <span className="text-sm text-gray-600">Task Confidence Score:</span>
                        <span className="text-sm font-semibold">{selfEfficacyData[selfEfficacyHover].task}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                        <span className="text-sm text-gray-600">Problem-Solving Confidence Score:</span>
                        <span className="text-sm font-semibold">{selfEfficacyData[selfEfficacyHover].problem}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="text-sm text-gray-600">Adaptability Confidence Score:</span>
                        <span className="text-sm font-semibold">{selfEfficacyData[selfEfficacyHover].adaptability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                        <span className="text-sm text-gray-600">Decision-Making Confidence Score:</span>
                        <span className="text-sm font-semibold">{selfEfficacyData[selfEfficacyHover].decision}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600">Self-Efficacy & Confidence Index:</span>
                        <span className="text-sm font-semibold">{selfEfficacyData[selfEfficacyHover].index}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  {selfEfficacyMetrics.map((metric) => (
                    <div key={metric.key} className="flex items-center gap-2">
                      <div 
                        className={metric.type === 'bar' ? 'w-3 h-3' : 'w-3 h-3 rounded-full'} 
                        style={{backgroundColor: metric.color}}
                      ></div>
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                  ))}
                                 </div>
               </div>
             </div>
             

             
             {/* Student Perception of Teaching Effectiveness Section */}

           </div>
         );
      case 'teaching-effectiveness':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Teaching Competency Growth Over Sessions</h2>
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {teachingCompetencyData.map((session, sessionIdx) => {
                // Calculate total score for percentage calculations
                const totalScore = Object.values(session.scores).reduce((sum, score) => sum + score, 0);
                
                                 // Calculate pie chart slices
                 const createPieSlice = (startAngle: number, endAngle: number, radius: number) => {
                   const x1 = 150 + radius * Math.cos(startAngle);
                   const y1 = 150 + radius * Math.sin(startAngle);
                   const x2 = 150 + radius * Math.cos(endAngle);
                   const y2 = 150 + radius * Math.sin(endAngle);
                   
                   const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
                   
                   return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                 };
                
                return (
                                     <div key={session.sessionTitle} className="bg-white rounded-xl shadow p-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{session.sessionTitle}</h3>
                    
                                         <div className="relative flex justify-center mb-4">
                       <svg width="300" height="300" viewBox="0 0 300 300" className="w-64 h-64">
                         {/* Pie chart slices */}
                         {teachingCompetencyMetrics.map((metric, metricIdx) => {
                           const score = session.scores[metric.key as keyof typeof session.scores];
                           const percentage = score / totalScore;
                           
                           // Calculate angles for this slice
                           const previousMetrics = teachingCompetencyMetrics.slice(0, metricIdx);
                           const previousTotal = previousMetrics.reduce((sum, m) => sum + session.scores[m.key as keyof typeof session.scores], 0);
                           const startAngle = (previousTotal / totalScore) * 2 * Math.PI - Math.PI / 2;
                           const endAngle = ((previousTotal + score) / totalScore) * 2 * Math.PI - Math.PI / 2;
                           
                           // Animate the slice based on teachingCompetencyAnim
                           const animatedEndAngle = startAngle + (endAngle - startAngle) * teachingCompetencyAnim;
                           
                           return (
                             <path
                               key={metric.key}
                               d={createPieSlice(startAngle, animatedEndAngle, 120)}
                               fill={metric.color}
                               stroke="white"
                               strokeWidth="4"
                               onMouseEnter={() => setTeachingCompetencyHover({ sessionIdx, metricKey: metric.key })}
                               onMouseLeave={() => setTeachingCompetencyHover(null)}
                             />
                           );
                         })}
                        
                                                 {/* Center circle */}
                         <circle cx="150" cy="150" r="35" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                        
                                                 {/* Tooltip */}
                         {teachingCompetencyHover && 
                          teachingCompetencyHover.sessionIdx === sessionIdx && (
                           <g>
                             {/* Tooltip background */}
                             <rect
                               x="200"
                               y="60"
                               width="160"
                               height="35"
                               rx="4"
                               fill={teachingCompetencyMetrics.find(m => m.key === teachingCompetencyHover.metricKey)?.color}
                               stroke="white"
                               strokeWidth="1"
                             />
                             {/* Tooltip text */}
                             <text
                               x="210"
                               y="82"
                               fontSize="12"
                               fill="white"
                               fontWeight="bold"
                             >
                               {teachingCompetencyMetrics.find(m => m.key === teachingCompetencyHover.metricKey)?.label}: {session.scores[teachingCompetencyHover.metricKey as keyof typeof session.scores]}
                             </text>
                           </g>
                         )}
                      </svg>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2">
                      {teachingCompetencyMetrics.map((metric) => (
                        <div key={metric.key} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: metric.color}}></div>
                          <span className="text-sm text-gray-600">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
                             })}
             </div>
             
             {/* Active Learning Implementation Rates Section */}
             <div className="mt-8">
               <h3 className="text-xl font-semibold text-gray-700 mb-6">Active Learning Implementation Rates</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {activeLearningData.map((teacher, teacherIdx) => (
                   <div key={teacher.teacherId} className="bg-white rounded-xl shadow p-6">
                     <h4 className="text-lg font-semibold text-gray-800 mb-4">{teacher.teacherId}</h4>
                     
                     <div className="relative flex justify-center">
                       <svg width="200" height="200" viewBox="0 0 200 200" className="w-48 h-48">
                         {/* Radial progress rings */}
                         {activeLearningMetrics.map((metric, metricIdx) => {
                           const rate = teacher.rates[metric.key as keyof typeof teacher.rates];
                           const radius = 30 + metricIdx * 15; // Increasing radius for each ring
                           const circumference = 2 * Math.PI * radius;
                           const strokeDasharray = circumference;
                           const strokeDashoffset = circumference - (rate / 100) * circumference * activeLearningAnim;
                           
                           return (
                             <g key={metric.key}>
                               {/* Background ring */}
                               <circle
                                 cx="100"
                                 cy="100"
                                 r={radius}
                                 fill="none"
                                 stroke="#e5e7eb"
                                 strokeWidth="8"
                               />
                               {/* Progress ring */}
                               <circle
                                 cx="100"
                                 cy="100"
                                 r={radius}
                                 fill="none"
                                 stroke={metric.color}
                                 strokeWidth="8"
                                 strokeDasharray={strokeDasharray}
                                 strokeDashoffset={strokeDashoffset}
                                 strokeLinecap="round"
                                 transform="rotate(-90 100 100)"
                                 onMouseEnter={() => setActiveLearningHover({ teacherIdx, metricKey: metric.key })}
                                 onMouseLeave={() => setActiveLearningHover(null)}
                               />
                             </g>
                           );
                         })}
                         
                         {/* Center text */}
                         <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#374151">
                           {activeLearningHover && activeLearningHover.teacherIdx === teacherIdx ? (
                             <>
                               <tspan x="100" dy="-8" fill={activeLearningMetrics.find(m => m.key === activeLearningHover.metricKey)?.color} fontWeight="bold">
                                 {activeLearningMetrics.find(m => m.key === activeLearningHover.metricKey)?.label}
                               </tspan>
                               <tspan x="100" dy="16" fill="#374151" fontWeight="bold">
                                 {teacher.rates[activeLearningHover.metricKey as keyof typeof teacher.rates]}%
                               </tspan>
                             </>
                           ) : (
                             <tspan x="100" fill="#374151" fontWeight="bold">Total</tspan>
                           )}
                         </text>
                       </svg>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             {/* Assessment Design Quality Report Section */}
             <div className="mt-8">
               <h3 className="text-xl font-semibold text-gray-700 mb-6">Assessment Design Quality Report</h3>
               <div className="bg-white rounded-xl shadow p-6">
                 <svg width="100%" height="500" viewBox="0 0 1200 500" className="w-full">
                   {/* Grid lines */}
                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                     <line
                       key={tick}
                       x1="100"
                       y1={450 - tick * 3.5}
                       x2="1100"
                       y2={450 - tick * 3.5}
                       stroke="#f3f4f6"
                       strokeWidth="1"
                     />
                   ))}
                   
                   {/* Y-axis labels */}
                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                     <text
                       key={tick}
                       x="90"
                       y={450 - tick * 3.5 + 4}
                       fontSize="12"
                       fill="#6b7280"
                       textAnchor="end"
                     >
                       {tick.toFixed(2)}
                     </text>
                   ))}
                   
                   {/* X-axis labels */}
                   {assessmentDesignData.map((item, index) => (
                     <text
                       key={item.category}
                       x={150 + index * 100}
                       y="480"
                       fontSize="12"
                       fill="#6b7280"
                       textAnchor="middle"
                     >
                       {item.category}
                     </text>
                   ))}
                   
                   {/* Grouped bars */}
                   {assessmentDesignData.map((item, groupIndex) => (
                     <g key={item.category}>
                       {assessmentDesignMetrics.map((metric, metricIndex) => {
                         const value = item[metric.key as keyof typeof item] as number;
                         const barWidth = 12;
                         const barSpacing = 4;
                         const groupWidth = assessmentDesignMetrics.length * (barWidth + barSpacing) - barSpacing;
                         const groupStartX = 150 + groupIndex * 100 - groupWidth / 2;
                         const barX = groupStartX + metricIndex * (barWidth + barSpacing);
                         const barHeight = (value / 100) * 350 * assessmentDesignAnim;
                         const barY = 450 - barHeight;
                         
                         return (
                           <rect
                             key={metric.key}
                             x={barX}
                             y={barY}
                             width={barWidth}
                             height={barHeight}
                             fill={metric.color}
                             onMouseEnter={() => setAssessmentDesignHover({ i: groupIndex, m: metric.key })}
                             onMouseLeave={() => setAssessmentDesignHover(null)}
                           />
                         );
                       })}
                     </g>
                   ))}
                   
                   {/* Tooltip */}
                   {assessmentDesignHover && (
                     <g>
                       {/* Tooltip background */}
                       <rect
                         x={150 + assessmentDesignHover.i * 100 - 80}
                         y="50"
                         width="160"
                         height="60"
                         rx="6"
                         fill="white"
                         stroke="#e5e7eb"
                         strokeWidth="1"
                         filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                       />
                       {/* Tooltip arrow */}
                       <polygon
                         points={`${150 + assessmentDesignHover.i * 100},110 ${150 + assessmentDesignHover.i * 100 - 8},120 ${150 + assessmentDesignHover.i * 100 + 8},120`}
                         fill="white"
                         stroke="#e5e7eb"
                         strokeWidth="1"
                       />
                       {/* Tooltip content */}
                       <text
                         x={150 + assessmentDesignHover.i * 100}
                         y="70"
                         fontSize="12"
                         fill="#374151"
                         fontWeight="bold"
                         textAnchor="middle"
                       >
                         {assessmentDesignData[assessmentDesignHover.i].category}
                       </text>
                       <text
                         x={150 + assessmentDesignHover.i * 100}
                         y="90"
                         fontSize="11"
                         fill="#6b7280"
                         textAnchor="middle"
                       >
                         {assessmentDesignMetrics.find(m => m.key === assessmentDesignHover.m)?.label}:
                       </text>
                       <text
                         x={150 + assessmentDesignHover.i * 100}
                         y="105"
                         fontSize="12"
                         fill="#374151"
                         fontWeight="bold"
                         textAnchor="middle"
                       >
                         ${assessmentDesignData[assessmentDesignHover.i][assessmentDesignHover.m as keyof typeof assessmentDesignData[0]]} thousands
                       </text>
                       {/* Colored dot */}
                       <circle
                         cx={150 + assessmentDesignHover.i * 100 - 60}
                         cy="70"
                         r="4"
                         fill={assessmentDesignMetrics.find(m => m.key === assessmentDesignHover.m)?.color}
                       />
                     </g>
                   )}
                 </svg>
                 
                 {/* Legend */}
                 <div className="flex justify-center gap-6 mt-6">
                   {assessmentDesignMetrics.map((metric) => (
                     <div key={metric.key} className="flex items-center gap-2">
                       <div className="w-4 h-4" style={{backgroundColor: metric.color}}></div>
                       <span className="text-sm text-gray-600">{metric.label}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
             
             {/* Teaching Effectiveness Section */}
             <div className="mt-8">
               <h3 className="text-xl font-semibold text-gray-700 mb-6">Feedback Incorporation Rates : Overall Feedback Incorporation Rate</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {feedbackData.map((teacher) => (
                   <div 
                     key={teacher.id} 
                     className={`bg-white rounded-xl shadow-lg p-8 transition-all duration-300 transform animate-bounce-in ${
                       feedbackHover === teacher.id 
                         ? 'scale-105 shadow-2xl bg-blue-50' 
                         : 'hover:scale-105 hover:shadow-xl'
                     }`}
                     onMouseEnter={() => setFeedbackHover(teacher.id)}
                     onMouseLeave={() => setFeedbackHover(null)}
                   >
                     <h4 className={`text-xl font-semibold mb-6 text-center transition-colors duration-300 ${
                       feedbackHover === teacher.id ? 'text-blue-700' : 'text-gray-800'
                     }`}>
                       {teacher.id}
                     </h4>
                     
                     <div className="relative flex justify-center">
                       <svg width="300" height="300" viewBox="0 0 300 300" className="w-64 h-64">
                         {/* Background track */}
                         <circle
                           cx="150"
                           cy="150"
                           r="120"
                           fill="none"
                           stroke="#e5e7eb"
                           strokeWidth="16"
                         />
                         
                         {/* Progress arc */}
                         <circle
                           cx="150"
                           cy="150"
                           r="120"
                           fill="none"
                           stroke={feedbackHover === teacher.id ? "#3b82f6" : "#6b7280"}
                           strokeWidth={feedbackHover === teacher.id ? "18" : "16"}
                           strokeDasharray={`${2 * Math.PI * 120}`}
                           strokeDashoffset={`${2 * Math.PI * 120 * (1 - (teacher.value / 100) * feedbackIncorporationAnim)}`}
                           transform={`rotate(-90 150 150) ${feedbackHover === teacher.id ? 'scale(1.02)' : 'scale(1)'}`}
                           className="transition-all duration-500 ease-out"
                         />
                         
                         {/* Center text */}
                         <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#374151">
                           <tspan x="150" dy="-12" fontWeight="bold">
                             Overall Feedback: {teacher.id}
                           </tspan>
                           <tspan x="150" dy="24" fontWeight="bold" fontSize="20">
                             {teacher.value.toFixed(2)}%
                           </tspan>
                         </text>
                         
                         {/* Hover effect overlay */}
                         <circle
                           cx="150"
                           cy="150"
                           r="120"
                           fill="none"
                           stroke={feedbackHover === teacher.id ? "#3b82f6" : "transparent"}
                           strokeWidth="16"
                           strokeOpacity={feedbackHover === teacher.id ? "0.3" : "0"}
                           className="cursor-pointer transition-all duration-300"
                         />
                         
                         {/* Animated pulse effect on hover */}
                         {feedbackHover === teacher.id && (
                           <circle
                             cx="150"
                             cy="150"
                             r="130"
                             fill="none"
                             stroke="#3b82f6"
                             strokeWidth="2"
                             strokeOpacity="0.4"
                             className="animate-pulse"
                           />
                         )}
                         
                         {/* Glow effect on hover */}
                         {feedbackHover === teacher.id && (
                           <circle
                             cx="150"
                             cy="150"
                             r="125"
                             fill="none"
                             stroke="#3b82f6"
                             strokeWidth="4"
                             strokeOpacity="0.2"
                             className="animate-ping"
                           />
                         )}
                       </svg>
                     </div>
                     
                     {/* Enhanced info section */}
                     <div className="mt-6 text-center">
                       <div className="text-sm text-gray-600 mb-2">
                         Feedback Incorporation Rate
                       </div>
                       <div className={`text-2xl font-bold transition-colors duration-300 ${
                         feedbackHover === teacher.id ? 'text-blue-700' : 'text-gray-800'
                       }`}>
                         {teacher.value.toFixed(2)}%
                       </div>
                       <div className="text-xs text-gray-500 mt-2">
                         {teacher.value >= 60 ? 'Excellent' : teacher.value >= 50 ? 'Good' : 'Needs Improvement'}
                       </div>
                     </div>
                     
                     {/* Hover tooltip */}
                     {feedbackHover === teacher.id && (
                       <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs rounded-lg px-3 py-1 shadow-lg z-10">
                         <div className="text-center">
                           <div className="font-semibold">Detailed View</div>
                           <div className="text-blue-100">Click for more details</div>
                         </div>
                         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
             
             {/* Student Perception of Teaching Effectiveness Section */}
             <div className="mt-8">
               <div className="bg-white rounded-xl shadow p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-semibold text-gray-700">Student Perception of Teaching Effectiveness</h3>
                   <div className="flex gap-2">
                     <button className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                         <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                       </svg>
                     </button>
                     <button className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                         <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                       </svg>
                     </button>
                     <button className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                         <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                       </svg>
                     </button>
                   </div>
                 </div>
                 
                                                    <svg width="100%" height="600" viewBox="0 0 1600 600" className="w-full chart-container">
                   {/* Definitions for gradients and filters */}
                   <defs>
                     <linearGradient id="chartBackground" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.5"/>
                       <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.3"/>
                     </linearGradient>
                     <filter id="glow">
                       <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                       <feMerge> 
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                       </feMerge>
                     </filter>
                   </defs>
                   
                   {/* Background gradient */}
                   <rect x="120" y="50" width="1360" height="450" fill="url(#chartBackground)" rx="8"/>
                   
                   {/* Grid lines */}
                    {[60, 65, 70, 75, 80, 85, 90, 95, 100].map((tick) => (
                      <line
                        key={tick}
                        x1="120"
                        y1={500 - (tick - 60) * 4.4}
                        x2="1480"
                        y2={500 - (tick - 60) * 4.4}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Left Y-axis labels */}
                    {[60, 65, 70, 75, 80, 85, 90, 95, 100].map((tick) => (
                      <text
                        key={tick}
                        x="110"
                        y={500 - (tick - 60) * 4.4 + 4}
                        fontSize="14"
                        fill="#6b7280"
                        textAnchor="end"
                      >
                        {tick.toFixed(2)}
                      </text>
                    ))}
                    
                    {/* Right Y-axis labels */}
                    {[60, 65, 70, 75, 80, 85, 90, 95, 100].map((tick) => (
                      <text
                        key={tick}
                        x="1490"
                        y={500 - (tick - 60) * 4.4 + 4}
                        fontSize="14"
                        fill="#6b7280"
                        textAnchor="start"
                      >
                        {tick.toFixed(2)}
                      </text>
                    ))}
                   
                   {/* Data series */}
                   {perceptionData.series.map((series, seriesIndex) => {
                     const points = series.data.map((value, index) => ({
                       x: 200 + index * 130,
                       y: 500 - (value - 60) * 4.4
                     }));
                     
                     const pathData = createSmoothCurve(points);
                     
                     return (
                       <g key={series.name}>
                         {/* Area fill for areaspline type */}
                         {series.type === 'areaspline' && (
                           <path
                             d={`${pathData} L ${points[points.length - 1].x} 500 L ${points[0].x} 500 Z`}
                             fill={series.color}
                             fillOpacity="0.3"
                             opacity={perceptionAnim}
                             className="transition-all duration-1000 ease-out"
                           />
                         )}
                         {/* Line with dynamic stroke width */}
                         <path
                           d={pathData}
                           fill="none"
                           stroke={series.color}
                           strokeWidth={perceptionHover ? "3" : "2"}
                           opacity={perceptionAnim}
                           className="transition-all duration-500 ease-out chart-line"
                         />
                         
                         {/* Data points with animation */}
                         {points.map((point, index) => (
                           <circle
                             key={`${series.name}-${index}`}
                             cx={point.x}
                             cy={point.y}
                             r={perceptionHover && perceptionData.categories[index] === perceptionHover ? "6" : "3"}
                             fill={series.color}
                             opacity={perceptionAnim}
                             className={`transition-all duration-300 ease-out chart-point ${
                               perceptionHover && perceptionData.categories[index] === perceptionHover ? 'animate-data-point' : ''
                             }`}
                             style={{
                               animationDelay: `${seriesIndex * 100 + index * 50}ms`
                             }}
                           />
                         ))}
                       </g>
                     );
                   })}
                   
                   {/* Interactive elements */}
                   {perceptionHover && (
                     <g>
                       {/* Vertical dotted line with animation */}
                       <line
                         x1={200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130}
                         y1="50"
                         x2={200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130}
                         y2="500"
                         stroke="#6b7280"
                         strokeWidth="2"
                         strokeDasharray="5,5"
                         className="animate-pulse"
                       />
                       
                       {/* Enhanced data point markers */}
                       {perceptionData.series.map((series) => {
                         const hoveredData = series.data[perceptionData.categories.findIndex(cat => cat === perceptionHover)];
                         const x = 200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130;
                         const y = 500 - (hoveredData - 60) * 4.4;
                         
                         return (
                           <g key={series.name}>
                             {/* Glow effect */}
                             <circle
                               cx={x}
                               cy={y}
                               r="12"
                               fill={series.color}
                               opacity="0.2"
                               className="animate-ping"
                             />
                             {/* Main point */}
                             <circle
                               cx={x}
                               cy={y}
                               r="6"
                               fill={series.color}
                               stroke="white"
                               strokeWidth="2"
                             />
                           </g>
                         );
                       })}
                       
                       {/* Enhanced Tooltip */}
                       <g>
                         <rect
                           x={200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130 + 30}
                           y="30"
                           width="250"
                           height="140"
                           rx="8"
                           fill="white"
                           stroke="#e5e7eb"
                           strokeWidth="1"
                           filter="drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))"
                           className="transition-all duration-300"
                         />
                         <text
                           x={200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130 + 155}
                           y="55"
                           fontSize="14"
                           fill="#374151"
                           fontWeight="bold"
                           textAnchor="middle"
                         >
                           {perceptionHover}
                         </text>
                         {perceptionData.series.map((series, index) => {
                           const hoveredData = series.data[perceptionData.categories.findIndex(cat => cat === perceptionHover)];
                           
                           return (
                             <g key={series.name}>
                               <circle
                                 cx={200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130 + 50}
                                 cy={80 + index * 22}
                                 r="4"
                                 fill={series.color}
                                 className="animate-pulse"
                               />
                               <text
                                 x={200 + perceptionData.categories.findIndex(cat => cat === perceptionHover) * 130 + 60}
                                 y={80 + index * 22 + 4}
                                 fontSize="12"
                                 fill="#6b7280"
                                 fontWeight="500"
                               >
                                 {series.name}: {hoveredData} %
                               </text>
                             </g>
                           );
                         })}
                       </g>
                     </g>
                   )}
                 </svg>
                 
                 {/* Category buttons */}
                 <div className="flex justify-center gap-2 mt-4 flex-wrap">
                   {perceptionData.categories.map((category) => (
                     <button
                       key={category}
                       className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                         perceptionHover === category
                           ? 'bg-gray-300 text-gray-700'
                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                       }`}
                       onMouseEnter={() => setPerceptionHover(category)}
                       onMouseLeave={() => setPerceptionHover(null)}
                     >
                       {category}
                       {perceptionHover === category && (
                         <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300"></div>
                       )}
                     </button>
                   ))}
                 </div>
                 
                 {/* Legend */}
                 <div className="flex justify-center gap-6 mt-4">
                   {perceptionData.series.map((series) => (
                     <div key={series.name} className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                       <span className="text-sm text-gray-600">{series.name}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         );
      case 'collaboration-engagement':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Collaboration Engagement</h2>
            
            {/* Interdepartmental Collaboration Trends */}
                         <div className="bg-white rounded-xl shadow p-6">
               <h3 className="text-xl font-semibold text-gray-700 mb-6">Interdepartmental Collaboration Trends</h3>
              
              <svg width="100%" height="500" viewBox="0 0 1400 500" className="w-full">
                {/* Grid lines */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 3.5}
                    x2="1300"
                    y2={400 - tick * 3.5}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 3.5 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(2)}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {collaborationData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover highlight band */}
                {collaborationHover && (
                  <rect
                    x={150 + collaborationData.categories.findIndex(cat => cat === collaborationHover) * 120 - 30}
                    y="50"
                    width="60"
                    height="350"
                    fill="#f8fafc"
                    opacity="0.5"
                  />
                )}
                
                {/* Grouped bars */}
                {collaborationData.categories.map((category, categoryIndex) => (
                  <g key={category}>
                    {collaborationData.series.map((series, seriesIndex) => {
                      const value = series.data[categoryIndex];
                      const barWidth = 12;
                      const barSpacing = 4;
                      const groupWidth = collaborationData.series.length * (barWidth + barSpacing) - barSpacing;
                      const groupStartX = 150 + categoryIndex * 120 - groupWidth / 2;
                      const barX = groupStartX + seriesIndex * (barWidth + barSpacing);
                                             const barHeight = Math.max((value / 100) * 350 * (collaborationAnim || 1), 3);
                      const barY = 400 - barHeight;
                      
                      return (
                        <g key={`${category}-${series.name}`}>
                                                     {/* Bar */}
                           <rect
                             x={barX}
                             y={barY}
                             width={barWidth}
                             height={barHeight}
                             fill={series.color}
                             opacity={collaborationAnim || 1}
                             stroke="#e5e7eb"
                             strokeWidth="0.5"
                             className="transition-all duration-300 ease-out"
                             onMouseEnter={() => setCollaborationHover(category)}
                             onMouseLeave={() => setCollaborationHover(null)}
                           />
                          
                          {/* Hover effect */}
                          {collaborationHover === category && (
                            <rect
                              x={barX}
                              y={barY}
                              width={barWidth}
                              height={barHeight}
                              fill={series.color}
                              opacity="0.3"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                ))}
                
                {/* Tooltip */}
                {collaborationHover && (
                  <g>
                    <rect
                      x={150 + collaborationData.categories.findIndex(cat => cat === collaborationHover) * 120 - 100}
                      y="50"
                      width="200"
                      height="80"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + collaborationData.categories.findIndex(cat => cat === collaborationHover) * 120}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {collaborationHover}
                    </text>
                    {collaborationData.series.map((series, index) => {
                      const value = series.data[collaborationData.categories.findIndex(cat => cat === collaborationHover)];
                      
                      return (
                        <g key={series.name}>
                          <rect
                            x={150 + collaborationData.categories.findIndex(cat => cat === collaborationHover) * 120 - 80}
                            y={80 + index * 20}
                            width="8"
                            height="8"
                            fill={series.color}
                          />
                          <text
                            x={150 + collaborationData.categories.findIndex(cat => cat === collaborationHover) * 120 - 65}
                            y={85 + index * 20}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: {value}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-8 mt-6">
                {collaborationData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-4 h-4" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Participation in Research & Development Initiatives */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Participation in Research & Development Initiatives</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < initiativeData.categories.length) {
                    setInitiativeHover(initiativeData.categories[categoryIndex]);
                  } else {
                    setInitiativeHover(null);
                  }
                }}
                onMouseLeave={() => setInitiativeHover(null)}
              >
                {/* Grid lines */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 8}
                    x2="1300"
                    y2={400 - tick * 8}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 8 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {initiativeData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* X-axis title */}
                <text
                  x="750"
                  y="470"
                  fontSize="14"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  Month
                </text>
                
                {/* Watermark */}
                <text
                  x="750"
                  y="200"
                  fontSize="16"
                  fill="#9ca3af"
                  textAnchor="middle"
                  opacity="0.3"
                >
                  2025 © Riyara Training Academy
                </text>
                
                {/* Hover vertical line */}
                {initiativeHover && (
                  <line
                    x1={150 + initiativeData.categories.findIndex(cat => cat === initiativeHover) * 120}
                    y1="50"
                    x2={150 + initiativeData.categories.findIndex(cat => cat === initiativeHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* Data series lines */}
                {initiativeData.series.map((series, seriesIndex) => {
                  const points = series.data.map((value, index) => ({
                    x: 150 + index * 120,
                    y: 400 - (value / 40) * 350
                  }));
                  
                  const pathData = createSmoothCurve(points);
                  
                  return (
                    <g key={series.name}>
                      {/* Line path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={series.color}
                        strokeWidth={series.lineWidth || 2}
                        opacity={initiativeAnim}
                        className="transition-all duration-1000 ease-out animate-initiative-draw"
                      />
                      
                      {/* Data points and labels (only for non-Overall R&D series) */}
                      {series.name !== 'Overall R&D Engagement Score' && points.map((point, index) => {
                        const value = series.data[index];
                        return (
                          <g key={`${series.name}-${index}`}>
                            {/* Square marker */}
                            <rect
                              x={point.x - 8}
                              y={point.y - 8}
                              width="16"
                              height="16"
                              fill={series.color}
                              opacity={initiativeAnim}
                              className="transition-all duration-300 animate-initiative-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            />
                            {/* Value label */}
                            <text
                              x={point.x}
                              y={point.y - 12}
                              fontSize="10"
                              fill="white"
                              textAnchor="middle"
                              fontWeight="bold"
                              opacity={initiativeAnim}
                            >
                              {value}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                
                {/* Tooltip */}
                {initiativeHover && (
                  <g>
                    <rect
                      x={150 + initiativeData.categories.findIndex(cat => cat === initiativeHover) * 120 - 100}
                      y="50"
                      width="200"
                      height="60"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + initiativeData.categories.findIndex(cat => cat === initiativeHover) * 120}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {initiativeHover}
                    </text>
                    {/* Only show Overall R&D Engagement Score in tooltip */}
                    {(() => {
                      const overallSeries = initiativeData.series.find(s => s.name === 'Overall R&D Engagement Score');
                      const value = overallSeries?.data[initiativeData.categories.findIndex(cat => cat === initiativeHover)];
                      return (
                        <g>
                          <rect
                            x={150 + initiativeData.categories.findIndex(cat => cat === initiativeHover) * 120 - 80}
                            y="80"
                            width="8"
                            height="8"
                            fill={overallSeries?.color}
                          />
                          <text
                            x={150 + initiativeData.categories.findIndex(cat => cat === initiativeHover) * 120 - 65}
                            y="88"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {overallSeries?.name}: {value}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                )}
              </svg>
            </div>
            
            {/* Knowledge Sharing & Peer Learning Scores */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Knowledge Sharing & Peer Learning Scores</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < knowledgeSharingData.categories.length) {
                    setKnowledgeSharingHover(knowledgeSharingData.categories[categoryIndex]);
                  } else {
                    setKnowledgeSharingHover(null);
                  }
                }}
                onMouseLeave={() => setKnowledgeSharingHover(null)}
              >
                {/* Grid lines */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 7}
                    x2="1300"
                    y2={400 - tick * 7}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Left Y-axis labels (Series A) */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 7 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(1)}
                  </text>
                ))}
                
                {/* Right Y-axis labels (Series B) */}
                {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((tick) => (
                  <text
                    key={tick}
                    x="1310"
                    y={400 - (tick / 180) * 350 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="start"
                  >
                    {tick.toFixed(1)}
                  </text>
                ))}
                
                {/* Y-axis titles */}
                <text
                  x="50"
                  y="200"
                  fontSize="14"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform="rotate(-90, 50, 200)"
                >
                  Series A
                </text>
                <text
                  x="1350"
                  y="200"
                  fontSize="14"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform="rotate(-90, 1350, 200)"
                >
                  Series B
                </text>
                
                {/* X-axis labels */}
                {knowledgeSharingData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover vertical line */}
                {knowledgeSharingHover && (
                  <line
                    x1={150 + knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover) * 120}
                    y1="50"
                    x2={150 + knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* Data series lines and areas */}
                {knowledgeSharingData.series.map((series, seriesIndex) => {
                  const dataToUse = series.plotData || series.data;
                  const points = dataToUse.map((value, index) => ({
                    x: 150 + index * 120,
                    y: 400 - (value / 50) * 350
                  }));
                  
                  const pathData = createSmoothCurve(points);
                  
                  return (
                    <g key={series.name}>
                      {/* Areaspline fill (only for areaspline type) */}
                      {series.type === 'areaspline' && (
                                                 <path
                           d={`${pathData} L ${points[points.length - 1].x} 400 L ${points[0].x} 400 Z`}
                           fill={series.color}
                           opacity="0.3"
                           className="transition-all duration-1000 ease-out animate-knowledge-area-fill"
                         />
                      )}
                      
                                             {/* Line path */}
                       <path
                         d={pathData}
                         fill="none"
                         stroke={series.color}
                         strokeWidth={series.name === 'Overall Knowledge Sharing Score' ? 3 : 2}
                         opacity={knowledgeSharingAnim}
                         className="transition-all duration-1000 ease-out animate-knowledge-draw"
                       />
                      
                      {/* Data points with circles on hover */}
                      {knowledgeSharingHover && points.map((point, index) => {
                        const categoryIndex = knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover);
                        if (index === categoryIndex) {
                                                     return (
                             <circle
                               key={`${series.name}-${index}`}
                               cx={point.x}
                               cy={point.y}
                               r="4"
                               fill={series.color}
                               className="animate-knowledge-point-pulse"
                             />
                           );
                        }
                        return null;
                      })}
                    </g>
                  );
                })}
                
                {/* Tooltip */}
                {knowledgeSharingHover && (
                  <g>
                    <rect
                      x={150 + knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover) * 120 + 20}
                      y="50"
                      width="200"
                      height="140"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover) * 120 + 120}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {knowledgeSharingHover}
                    </text>
                    {/* All series data in tooltip */}
                    {knowledgeSharingData.series.map((series, index) => {
                      const dataToUse = series.tooltipData || series.data;
                      const value = dataToUse[knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover)];
                      return (
                        <g key={series.name}>
                          <circle
                            cx={150 + knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover) * 120 + 40}
                            cy={90 + index * 20}
                            r="4"
                            fill={series.color}
                          />
                          <text
                            x={150 + knowledgeSharingData.categories.findIndex(cat => cat === knowledgeSharingHover) * 120 + 55}
                            y={95 + index * 20}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: <tspan fontWeight="bold">{value} points</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
                
                {/* Chart controls */}
                <g className="chart-controls">
                  <rect x="1250" y="20" width="120" height="30" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4"/>
                  <circle cx="1265" cy="35" r="3" fill="#6b7280"/>
                  <text x="1275" y="40" fontSize="10" fill="#6b7280">+</text>
                  <circle cx="1285" cy="35" r="3" fill="#6b7280"/>
                  <text x="1295" y="40" fontSize="10" fill="#6b7280">-</text>
                  <circle cx="1305" cy="35" r="3" fill="#6b7280"/>
                  <text x="1315" y="40" fontSize="10" fill="#6b7280">⊞</text>
                  <circle cx="1325" cy="35" r="3" fill="#6b7280"/>
                  <text x="1335" y="40" fontSize="10" fill="#6b7280">⌂</text>
                  <circle cx="1345" cy="35" r="3" fill="#6b7280"/>
                  <text x="1355" y="40" fontSize="10" fill="#6b7280">☰</text>
                </g>
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {knowledgeSharingData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'work-life-satisfaction':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Work-Life Satisfaction</h2>
            
            {/* Work-Life Balance Satisfaction Report */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Work-Life Balance Satisfaction Report</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < satisfactionData.categories.length) {
                    const category = satisfactionData.categories[categoryIndex];
                    const seriesIndex = Math.floor((x - (150 + categoryIndex * 120) + 60) / 20);
                    if (seriesIndex >= 0 && seriesIndex < satisfactionData.series.length) {
                      const series = satisfactionData.series[seriesIndex];
                      if (series.data[categoryIndex] > 0) {
                        setSatisfactionHover({category, series: series.name});
                      } else {
                        setSatisfactionHover({category, series: series.name});
                      }
                    } else {
                      setSatisfactionHover({category, series: ''});
                    }
                  } else {
                    setSatisfactionHover(null);
                  }
                }}
                onMouseLeave={() => setSatisfactionHover(null)}
              >
                {/* Grid lines */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 3.5}
                    x2="1300"
                    y2={400 - tick * 3.5}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 3.5 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(2)}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {satisfactionData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover highlight band */}
                {satisfactionHover && (
                  <rect
                    x={150 + satisfactionData.categories.findIndex(cat => cat === satisfactionHover.category) * 120 - 30}
                    y="50"
                    width="60"
                    height="350"
                    fill="#f8fafc"
                    opacity="0.5"
                  />
                )}
                
                {/* Grouped bars */}
                {satisfactionData.categories.map((category, categoryIndex) => (
                  <g key={category}>
                    {satisfactionData.series.map((series, seriesIndex) => {
                      const value = series.data[categoryIndex];
                      if (value === 0) return null; // Don't render bars with 0 values
                      
                      const barWidth = 12;
                      const barSpacing = 4;
                      const groupWidth = satisfactionData.series.length * (barWidth + barSpacing) - barSpacing;
                      const groupStartX = 150 + categoryIndex * 120 - groupWidth / 2;
                      const barX = groupStartX + seriesIndex * (barWidth + barSpacing);
                                             const barHeight = Math.max((value / 100) * 350 * (satisfactionAnim || 1), 3);
                      const barY = 400 - barHeight;
                      
                      return (
                        <g key={`${category}-${series.name}`}>
                          {/* Bar */}
                                                     <rect
                             x={barX}
                             y={barY}
                             width={barWidth}
                             height={barHeight}
                             fill={series.color}
                             opacity={satisfactionAnim || 1}
                             stroke="#e5e7eb"
                             strokeWidth="0.5"
                             className="transition-all duration-1000 ease-out animate-satisfaction-bar-grow"
                             style={{ animationDelay: `${categoryIndex * 0.1 + seriesIndex * 0.05}s` }}
                             onMouseEnter={() => setSatisfactionHover({category, series: series.name})}
                             onMouseLeave={() => setSatisfactionHover(null)}
                           />
                        </g>
                      );
                    })}
                  </g>
                ))}
                
                {/* Tooltip */}
                {satisfactionHover && satisfactionHover.series && (
                  <g>
                                         <rect
                       x={150 + satisfactionData.categories.findIndex(cat => cat === satisfactionHover.category) * 120 + 20}
                       y="200"
                       width="200"
                       height="60"
                       rx="6"
                       fill="white"
                       stroke="#e5e7eb"
                       strokeWidth="1"
                       filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                       className="animate-satisfaction-tooltip-fade"
                     />
                    <text
                      x={150 + satisfactionData.categories.findIndex(cat => cat === satisfactionHover.category) * 120 + 120}
                      y="220"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {satisfactionHover.category}
                    </text>
                    {/* Series data in tooltip */}
                    {(() => {
                      const series = satisfactionData.series.find(s => s.name === satisfactionHover.series);
                      const value = series?.data[satisfactionData.categories.findIndex(cat => cat === satisfactionHover.category)];
                      return (
                        <g>
                          <circle
                            cx={150 + satisfactionData.categories.findIndex(cat => cat === satisfactionHover.category) * 120 + 40}
                            cy="240"
                            r="4"
                            fill={series?.color}
                          />
                          <text
                            x={150 + satisfactionData.categories.findIndex(cat => cat === satisfactionHover.category) * 120 + 55}
                            y="245"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {satisfactionHover.series}: <tspan fontWeight="bold">{value}</tspan>
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                )}
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {satisfactionData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Teacher Stress & Burnout Indicators */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Teacher Stress & Burnout Indicators</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < stressIndicatorsData.categories.length) {
                    setStressHover(stressIndicatorsData.categories[categoryIndex]);
                  } else {
                    setStressHover(null);
                  }
                }}
                onMouseLeave={() => setStressHover(null)}
              >
                {/* Grid lines */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 3.5}
                    x2="1300"
                    y2={400 - tick * 3.5}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 3.5 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {stressIndicatorsData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover vertical line */}
                {stressHover && (
                  <line
                    x1={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120}
                    y1="50"
                    x2={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* X-axis label highlight */}
                {stressHover && (
                  <rect
                    x={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120 - 20}
                    y="430"
                    width="40"
                    height="20"
                    fill="#f3f4f6"
                    rx="4"
                  />
                )}
                
                {/* Data series */}
                {stressIndicatorsData.series.map((series, seriesIndex) => {
                  if (series.type === 'column') {
                    // Column chart (bars)
                    return (
                      <g key={series.name}>
                        {series.data.map((value, index) => {
                          const barWidth = 60;
                          const barX = 150 + index * 120 - barWidth / 2;
                          const barHeight = (value / 100) * 350 * stressAnim;
                          const barY = 400 - barHeight;
                          
                          return (
                            <rect
                              key={`${series.name}-${index}`}
                              x={barX}
                              y={barY}
                              width={barWidth}
                              height={barHeight}
                              fill={series.color}
                              opacity={stressAnim}
                              className="transition-all duration-1000 ease-out animate-stress-bar-grow"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            />
                          );
                        })}
                      </g>
                    );
                  } else {
                    // Line charts
                    const points = series.data.map((value, index) => ({
                      x: 150 + index * 120,
                      y: 400 - (value / 100) * 350
                    }));
                    
                    const pathData = createSmoothCurve(points);
                    
                    return (
                      <g key={series.name}>
                        {/* Area fill for areaspline */}
                        {series.type === 'areaspline' && (
                          <path
                            d={`${pathData} L ${points[points.length - 1].x} 400 L ${points[0].x} 400 Z`}
                            fill={series.color}
                            fillOpacity="0.3"
                            opacity={stressAnim}
                            className="transition-all duration-1000 ease-out animate-stress-area-fill"
                          />
                        )}
                        
                        {/* Line path */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={series.color}
                          strokeWidth={series.lineWidth || 2}
                          opacity={stressAnim}
                          className="transition-all duration-1000 ease-out animate-stress-line-draw"
                        />
                        
                        {/* Data points on hover */}
                        {stressHover && points.map((point, index) => {
                          const categoryIndex = stressIndicatorsData.categories.findIndex(cat => cat === stressHover);
                          if (index === categoryIndex) {
                            return (
                              <circle
                                key={`${series.name}-${index}`}
                                cx={point.x}
                                cy={point.y}
                                r="4"
                                fill={series.color}
                                stroke="white"
                                strokeWidth="2"
                                className="animate-stress-point-pulse"
                              />
                            );
                          }
                          return null;
                        })}
                      </g>
                    );
                  }
                })}
                
                {/* Tooltip */}
                {stressHover && (
                  <g>
                    <rect
                      x={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120 + 20}
                      y="50"
                      width="200"
                      height="140"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120 + 120}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {stressHover}
                    </text>
                    {/* All series data in tooltip */}
                    {stressIndicatorsData.series.map((series, index) => {
                      const value = series.data[stressIndicatorsData.categories.findIndex(cat => cat === stressHover)];
                      return (
                        <g key={series.name}>
                          <circle
                            cx={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120 + 40}
                            cy={90 + index * 22}
                            r="4"
                            fill={series.color}
                          />
                          <text
                            x={150 + stressIndicatorsData.categories.findIndex(cat => cat === stressHover) * 120 + 55}
                            y={95 + index * 22}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: <tspan fontWeight="bold">{value}%</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {stressIndicatorsData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Job Satisfaction & Motivation Index */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Job Satisfaction & Motivation Index</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {motivationIndexData.map((chart) => (
                  <div 
                    key={chart.id} 
                    className="bg-white rounded-xl border border-gray-200 p-8 relative"
                    onMouseEnter={() => setMotivationHover(chart.id)}
                    onMouseLeave={() => setMotivationHover(null)}
                  >
                    {/* Chart ID in top-left corner */}
                    <div className="absolute top-4 left-4 text-sm font-semibold text-gray-700">
                      {chart.id}
                    </div>
                    
                    {/* Multi-ring radial chart */}
                    <div className="flex justify-center items-center">
                      <svg width="400" height="400" viewBox="0 0 400 400" className="w-80 h-80">
                        <defs>
                          {/* Gradient definitions for 3D effect */}
                          {chart.rings.map((ring, index) => (
                            <linearGradient key={ring.name} id={`gradient-${chart.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={ring.color} stopOpacity="0.8"/>
                              <stop offset="100%" stopColor={ring.color} stopOpacity="1"/>
                            </linearGradient>
                          ))}
                        </defs>
                        
                        {/* Background rings (unfilled tracks) */}
                        {chart.rings.map((ring, index) => {
                          const radius = 160 - index * 20; // Decreasing radius for each ring, increased for larger chart
                          return (
                            <circle
                              key={`bg-${ring.name}`}
                              cx="200"
                              cy="200"
                              r={radius}
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="16"
                            />
                          );
                        })}
                        
                        {/* Animated ring segments */}
                        {chart.rings.map((ring, index) => {
                          const radius = 160 - index * 20;
                          const startAngle = 0;
                          const endAngle = (ring.value / 100) * 360;
                          const segment = createRingSegment(200, 200, radius, startAngle, endAngle, ring.color, motivationAnim);
                          
                          return (
                            <path
                              key={ring.name}
                              d={segment.path}
                              fill="none"
                              stroke={`url(#gradient-${chart.id}-${index})`}
                              strokeWidth="16"
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out animate-motivation-ring-grow"
                              style={{ animationDelay: `${index * 0.2}s` }}
                            />
                          );
                        })}
                        
                        {/* Center circle */}
                        <circle
                          cx="200"
                          cy="200"
                          r="60"
                          fill="white"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        
                        {/* Center text */}
                        <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#374151">
                          {motivationHover === chart.id ? (
                            <>
                              <tspan x="200" dy="-10" fill={chart.hoverContent.color} fontWeight="bold" fontSize="16">
                                {chart.hoverContent.label}
                              </tspan>
                              <tspan x="200" dy="20" fill="#374151" fontWeight="bold" fontSize="20">
                                {chart.hoverContent.value}
                              </tspan>
                            </>
                          ) : (
                            <tspan x="200" fill="#374151" fontWeight="bold" fontSize="16">
                              Score: {chart.id}
                            </tspan>
                          )}
                        </text>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Psychological Safety in Work Environment */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Psychological Safety in Work Environment</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < psychologicalSafetyData.categories.length) {
                    setPsychologicalHover(psychologicalSafetyData.categories[categoryIndex]);
                  } else {
                    setPsychologicalHover(null);
                  }
                }}
                onMouseLeave={() => setPsychologicalHover(null)}
              >
                {/* Grid lines */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - tick * 3.5}
                    x2="1300"
                    y2={400 - tick * 3.5}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - tick * 3.5 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(2)}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {psychologicalSafetyData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover vertical line */}
                {psychologicalHover && (
                  <line
                    x1={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120}
                    y1="50"
                    x2={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* X-axis label highlight */}
                {psychologicalHover && (
                  <rect
                    x={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120 - 20}
                    y="430"
                    width="40"
                    height="20"
                    fill="#f3f4f6"
                    rx="4"
                  />
                )}
                
                {/* Data series */}
                {psychologicalSafetyData.series.map((series, seriesIndex) => {
                  const points = series.data.map((value, index) => ({
                    x: 150 + index * 120,
                    y: 400 - (value / 100) * 350
                  }));
                  
                  const pathData = createSmoothCurve(points);
                  
                  return (
                    <g key={series.name}>
                      {/* Area fill for areaspline */}
                      {series.type === 'areaspline' && (
                        <path
                          d={`${pathData} L ${points[points.length - 1].x} 400 L ${points[0].x} 400 Z`}
                          fill={series.color}
                          fillOpacity="0.3"
                          opacity={psychologicalAnim}
                          className="transition-all duration-1000 ease-out animate-psychological-area-fill"
                        />
                      )}
                      
                      {/* Line path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="2"
                        opacity={psychologicalAnim}
                        className="transition-all duration-1000 ease-out animate-psychological-line-draw"
                      />
                      
                      {/* Data points on hover */}
                      {psychologicalHover && points.map((point, index) => {
                        const categoryIndex = psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover);
                        if (index === categoryIndex) {
                          return (
                            <circle
                              key={`${series.name}-${index}`}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill={series.color}
                              stroke="white"
                              strokeWidth="2"
                              className="animate-psychological-point-pulse"
                            />
                          );
                        }
                        return null;
                      })}
                    </g>
                  );
                })}
                
                {/* Tooltip */}
                {psychologicalHover && (
                  <g>
                    <rect
                      x={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120 + 20}
                      y="50"
                      width="250"
                      height="140"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120 + 145}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {psychologicalHover}
                    </text>
                    {/* All series data in tooltip */}
                    {psychologicalSafetyData.series.map((series, index) => {
                      const value = series.data[psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover)];
                      return (
                        <g key={series.name}>
                          <circle
                            cx={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120 + 40}
                            cy={90 + index * 22}
                            r="4"
                            fill={series.color}
                          />
                          <text
                            x={150 + psychologicalSafetyData.categories.findIndex(cat => cat === psychologicalHover) * 120 + 55}
                            y={95 + index * 22}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: <tspan fontWeight="bold">{value} %</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
                
                {/* Chart Controls */}
                <g className="chart-controls">
                  {/* Control background */}
                  <rect x="1250" y="20" width="120" height="30" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4"/>
                  
                  {/* Zoom In */}
                  <circle cx="1265" cy="35" r="3" fill="#6b7280"/>
                  <text x="1275" y="40" fontSize="10" fill="#6b7280">+</text>
                  
                  {/* Zoom Out */}
                  <circle cx="1285" cy="35" r="3" fill="#6b7280"/>
                  <text x="1295" y="40" fontSize="10" fill="#6b7280">-</text>
                  
                  {/* Zoom Tool (Blue) */}
                  <circle cx="1305" cy="35" r="3" fill="#3b82f6"/>
                  <text x="1315" y="40" fontSize="10" fill="#3b82f6">⊞</text>
                  
                  {/* Pan Tool */}
                  <circle cx="1325" cy="35" r="3" fill="#6b7280"/>
                  <text x="1335" y="40" fontSize="10" fill="#6b7280">✋</text>
                  
                  {/* Reset Zoom */}
                  <circle cx="1345" cy="35" r="3" fill="#6b7280"/>
                  <text x="1355" y="40" fontSize="10" fill="#6b7280">⌂</text>
                  
                  {/* Hamburger Menu */}
                  <circle cx="1365" cy="35" r="3" fill="#6b7280"/>
                  <text x="1375" y="40" fontSize="10" fill="#6b7280">☰</text>
                </g>
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {psychologicalSafetyData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Impact of Workload on Performance & Satisfaction */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Impact of Workload on Performance & Satisfaction</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < workloadImpactData.categories.length) {
                    setWorkloadHover(workloadImpactData.categories[categoryIndex]);
                  } else {
                    setWorkloadHover(null);
                  }
                }}
                onMouseLeave={() => setWorkloadHover(null)}
              >
                {/* Grid lines */}
                {[-80, -60, -40, -20, 0, 20, 40, 60, 80, 100].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - ((tick + 80) / 180) * 350}
                    x2="1300"
                    y2={400 - ((tick + 80) / 180) * 350}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[-80, -60, -40, -20, 0, 20, 40, 60, 80, 100].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - ((tick + 80) / 180) * 350 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(2)}
                  </text>
                ))}
                
                {/* Y-axis title */}
                <text
                  x="50"
                  y="200"
                  fontSize="14"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform="rotate(-90, 50, 200)"
                >
                  Performance & Satisfaction
                </text>
                
                {/* X-axis labels */}
                {workloadImpactData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover vertical line */}
                {workloadHover && (
                  <line
                    x1={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120}
                    y1="50"
                    x2={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* X-axis label highlight */}
                {workloadHover && (
                  <rect
                    x={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120 - 20}
                    y="430"
                    width="40"
                    height="20"
                    fill="#f3f4f6"
                    rx="4"
                  />
                )}
                
                {/* Data series */}
                {workloadImpactData.series.map((series, seriesIndex) => {
                  const points = series.data.map((value, index) => ({
                    x: 150 + index * 120,
                    y: 400 - ((value + 80) / 180) * 350
                  }));
                  
                  const pathData = createSmoothCurve(points);
                  
                  return (
                    <g key={series.name}>
                      {/* Line path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={series.color}
                        strokeWidth={series.lineWidth || 2}
                        opacity={workloadAnim}
                        className="transition-all duration-1000 ease-out animate-workload-line-draw"
                      />
                      
                      {/* Data point markers */}
                      {points.map((point, index) => (
                        <circle
                          key={`${series.name}-${index}`}
                          cx={point.x}
                          cy={point.y}
                          r="3"
                          fill={series.color}
                          opacity={workloadAnim}
                          className="transition-all duration-300 ease-out"
                        />
                      ))}
                      
                      {/* Data points on hover */}
                      {workloadHover && points.map((point, index) => {
                        const categoryIndex = workloadImpactData.categories.findIndex(cat => cat === workloadHover);
                        if (index === categoryIndex) {
                          return (
                            <circle
                              key={`${series.name}-${index}-hover`}
                              cx={point.x}
                              cy={point.y}
                              r="5"
                              fill={series.color}
                              stroke="white"
                              strokeWidth="2"
                              className="animate-workload-point-pulse"
                            />
                          );
                        }
                        return null;
                      })}
                    </g>
                  );
                })}
                
                {/* Tooltip */}
                {workloadHover && (
                  <g>
                    <rect
                      x={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120 + 20}
                      y="50"
                      width="250"
                      height="140"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120 + 145}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {workloadHover}
                    </text>
                    {/* All series data in tooltip */}
                    {workloadImpactData.series.map((series, index) => {
                      const value = series.data[workloadImpactData.categories.findIndex(cat => cat === workloadHover)];
                      return (
                        <g key={series.name}>
                          <circle
                            cx={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120 + 40}
                            cy={90 + index * 22}
                            r="4"
                            fill={series.color}
                          />
                          <text
                            x={150 + workloadImpactData.categories.findIndex(cat => cat === workloadHover) * 120 + 55}
                            y={95 + index * 22}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: <tspan fontWeight="bold">{value.toFixed(2)}</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
                
                {/* Chart Controls */}
                <g className="chart-controls">
                  {/* Control background */}
                  <rect x="1250" y="20" width="120" height="30" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4"/>
                  
                  {/* Zoom In */}
                  <circle cx="1265" cy="35" r="3" fill="#6b7280"/>
                  <text x="1275" y="40" fontSize="10" fill="#6b7280">+</text>
                  
                  {/* Zoom Out */}
                  <circle cx="1285" cy="35" r="3" fill="#6b7280"/>
                  <text x="1295" y="40" fontSize="10" fill="#6b7280">-</text>
                  
                  {/* Zoom Tool (Blue) */}
                  <circle cx="1305" cy="35" r="3" fill="#3b82f6"/>
                  <text x="1315" y="40" fontSize="10" fill="#3b82f6">⊞</text>
                  
                  {/* Pan Tool */}
                  <circle cx="1325" cy="35" r="3" fill="#6b7280"/>
                  <text x="1335" y="40" fontSize="10" fill="#6b7280">✋</text>
                  
                  {/* Reset Zoom */}
                  <circle cx="1345" cy="35" r="3" fill="#6b7280"/>
                  <text x="1355" y="40" fontSize="10" fill="#6b7280">⌂</text>
                  
                  {/* Hamburger Menu */}
                  <circle cx="1365" cy="35" r="3" fill="#6b7280"/>
                  <text x="1375" y="40" fontSize="10" fill="#6b7280">☰</text>
                </g>
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {workloadImpactData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'work-satisfaction':
        return <div className="p-8"><h2 className="text-2xl font-bold mb-4">Work Satisfaction</h2><div className="bg-white rounded-xl shadow p-8">This is the Work Satisfaction section. Add your content here.</div></div>;
      case 'platform-adoption':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Platform Adoption</h2>
            
            {/* Platform Usage Over Time */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Platform Usage Over Time</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < platformUsageData.categories.length) {
                    setPlatformUsageHover(platformUsageData.categories[categoryIndex]);
                  } else {
                    setPlatformUsageHover(null);
                  }
                }}
                onMouseLeave={() => setPlatformUsageHover(null)}
              >
                {/* Grid lines */}
                {[80, 126.7, 173.3, 220, 313.3, 360, 406.7, 453.3, 500].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - ((tick - 80) / 420) * 350}
                    x2="1300"
                    y2={400 - ((tick - 80) / 420) * 350}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[80, 126.7, 173.3, 220, 313.3, 360, 406.7, 453.3, 500].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - ((tick - 80) / 420) * 350 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(1)}
                  </text>
                ))}
                
                {/* Y-axis title */}
                <text
                  x="50"
                  y="200"
                  fontSize="14"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform="rotate(-90, 50, 200)"
                >
                  Hours
                </text>
                
                {/* X-axis labels */}
                {platformUsageData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* X-axis title */}
                <text
                  x="750"
                  y="480"
                  fontSize="14"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  Month
                </text>
                
                {/* Hover vertical line */}
                {platformUsageHover && (
                  <line
                    x1={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120}
                    y1="50"
                    x2={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120}
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                )}
                
                {/* X-axis label highlight */}
                {platformUsageHover && (
                  <rect
                    x={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120 - 20}
                    y="430"
                    width="40"
                    height="20"
                    fill="#f3f4f6"
                    rx="4"
                  />
                )}
                
                {/* Data series */}
                {platformUsageData.series.map((series, seriesIndex) => {
                  const points = series.data.map((value, index) => ({
                    x: 150 + index * 120,
                    y: 400 - ((value - 80) / 420) * 350
                  }));
                  
                  const pathData = createSmoothCurve(points);
                  
                  return (
                    <g key={series.name}>
                      {/* Line path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="2"
                        opacity={platformUsageAnim}
                        className="transition-all duration-1000 ease-out animate-platform-line-draw"
                      />
                      
                      {/* Data point markers with labels */}
                      {points.map((point, index) => (
                        <g key={`${series.name}-${index}`}>
                          {/* Square marker with value */}
                          <rect
                            x={point.x - 15}
                            y={point.y - 20}
                            width="30"
                            height="25"
                            fill={series.color}
                            rx="3"
                            opacity={platformUsageAnim}
                            className="transition-all duration-300 ease-out"
                          />
                          <text
                            x={point.x}
                            y={point.y - 5}
                            fontSize="10"
                            fill="white"
                            textAnchor="middle"
                            fontWeight="bold"
                            opacity={platformUsageAnim}
                            className="transition-all duration-300 ease-out"
                          >
                            {series.data[index]}
                          </text>
                        </g>
                      ))}
                      
                      {/* Data points on hover */}
                      {platformUsageHover && points.map((point, index) => {
                        const categoryIndex = platformUsageData.categories.findIndex(cat => cat === platformUsageHover);
                        if (index === categoryIndex) {
                          return (
                            <circle
                              key={`${series.name}-${index}-hover`}
                              cx={point.x}
                              cy={point.y}
                              r="6"
                              fill={series.color}
                              stroke="white"
                              strokeWidth="2"
                              className="animate-platform-point-pulse"
                            />
                          );
                        }
                        return null;
                      })}
                    </g>
                  );
                })}
                
                {/* Tooltip */}
                {platformUsageHover && (
                  <g>
                    <rect
                      x={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120 + 20}
                      y="50"
                      width="250"
                      height="120"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120 + 145}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {platformUsageHover}
                    </text>
                    {/* All series data in tooltip */}
                    {platformUsageData.series.map((series, index) => {
                      const value = series.data[platformUsageData.categories.findIndex(cat => cat === platformUsageHover)];
                      return (
                        <g key={series.name}>
                          <circle
                            cx={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120 + 40}
                            cy={90 + index * 25}
                            r="4"
                            fill={series.color}
                          />
                          <text
                            x={150 + platformUsageData.categories.findIndex(cat => cat === platformUsageHover) * 120 + 55}
                            y={95 + index * 25}
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {series.name}: <tspan fontWeight="bold">{value}</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
                
                {/* Legend - Top Right Corner */}
                <g className="legend">
                  {/* Legend background */}
                  <rect x="1100" y="20" width="200" height="80" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4"/>
                  
                  {/* Legend items */}
                  {platformUsageData.series.map((series, index) => (
                    <g key={series.name}>
                      <circle
                        cx="1120"
                        cy={40 + index * 25}
                        r="4"
                        fill={series.color}
                      />
                      <text
                        x="1135"
                        y={45 + index * 25}
                        fontSize="10"
                        fill="#6b7280"
                      >
                        {series.name}
                      </text>
                    </g>
                  ))}
                </g>
              </svg>
            </div>
            
            {/* Adoption Rate by Faculty */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Adoption Rate by Faculty</h3>
              
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 1400 500" 
                className="w-full"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const categoryIndex = Math.round((x - 150) / 120);
                  if (categoryIndex >= 0 && categoryIndex < facultyAdoptionData.categories.length) {
                    const category = facultyAdoptionData.categories[categoryIndex];
                    const groupStartX = 150 + categoryIndex * 120;
                    const barWidth = 20;
                    const barSpacing = 5;
                    const groupWidth = facultyAdoptionData.series.length * barWidth + (facultyAdoptionData.series.length - 1) * barSpacing;
                    const groupStartXAdjusted = groupStartX - groupWidth / 2;
                    
                    // Calculate which bar is being hovered
                    const relativeX = x - groupStartXAdjusted;
                    const barIndex = Math.floor(relativeX / (barWidth + barSpacing));
                    
                    if (barIndex >= 0 && barIndex < facultyAdoptionData.series.length) {
                      const series = facultyAdoptionData.series[barIndex];
                      const value = series.data[categoryIndex];
                      if (value > 0) { // Only show tooltip for bars with values > 0
                        setFacultyAdoptionHover({category, series: series.name});
                      } else {
                        setFacultyAdoptionHover(null);
                      }
                    } else {
                      setFacultyAdoptionHover(null);
                    }
                  } else {
                    setFacultyAdoptionHover(null);
                  }
                }}
                onMouseLeave={() => setFacultyAdoptionHover(null)}
              >
                {/* Grid lines */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <line
                    key={tick}
                    x1="100"
                    y1={400 - (tick / 100) * 350}
                    x2="1300"
                    y2={400 - (tick / 100) * 350}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <text
                    key={tick}
                    x="90"
                    y={400 - (tick / 100) * 350 + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {tick.toFixed(2)}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {facultyAdoptionData.categories.map((category, index) => (
                  <text
                    key={category}
                    x={150 + index * 120}
                    y="450"
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {category}
                  </text>
                ))}
                
                {/* Hover highlight band */}
                {facultyAdoptionHover && (
                  <rect
                    x={150 + facultyAdoptionData.categories.findIndex(cat => cat === facultyAdoptionHover.category) * 120 - 60}
                    y="50"
                    width="120"
                    height="350"
                    fill="#f8fafc"
                    opacity="0.5"
                  />
                )}
                
                {/* Grouped bars */}
                {facultyAdoptionData.categories.map((category, categoryIndex) => {
                  const groupStartX = 150 + categoryIndex * 120;
                  const barWidth = 20;
                  const barSpacing = 5;
                  const groupWidth = facultyAdoptionData.series.length * barWidth + (facultyAdoptionData.series.length - 1) * barSpacing;
                  const groupStartXAdjusted = groupStartX - groupWidth / 2;
                  
                  return (
                    <g key={category}>
                      {facultyAdoptionData.series.map((series, seriesIndex) => {
                        const value = series.data[categoryIndex];
                        const barX = groupStartXAdjusted + seriesIndex * (barWidth + barSpacing);
                        const barHeight = Math.max((value / 100) * 350, 3);
                        
                        return (
                          <g key={`${category}-${series.name}`}>
                            {/* Only render bars with values > 0 */}
                            {value > 0 && (
                              <rect
                                x={barX}
                                y={400 - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill={series.color}
                                stroke="#e5e7eb"
                                strokeWidth="0.5"
                                className="transition-all duration-300 ease-out"
                              />
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                
                {/* Tooltip */}
                {facultyAdoptionHover && (
                  <g>
                    <rect
                      x={150 + facultyAdoptionData.categories.findIndex(cat => cat === facultyAdoptionHover.category) * 120 + 20}
                      y="50"
                      width="200"
                      height="80"
                      rx="6"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text
                      x={150 + facultyAdoptionData.categories.findIndex(cat => cat === facultyAdoptionHover.category) * 120 + 120}
                      y="70"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {facultyAdoptionHover.category}
                    </text>
                    {/* Single series data in tooltip */}
                    {(() => {
                      const series = facultyAdoptionData.series.find(s => s.name === facultyAdoptionHover.series);
                      const value = series?.data[facultyAdoptionData.categories.findIndex(cat => cat === facultyAdoptionHover.category)];
                      return (
                        <g>
                          <circle
                            cx={150 + facultyAdoptionData.categories.findIndex(cat => cat === facultyAdoptionHover.category) * 120 + 40}
                            cy="90"
                            r="4"
                            fill={series?.color}
                          />
                          <text
                            x={150 + facultyAdoptionData.categories.findIndex(cat => cat === facultyAdoptionHover.category) * 120 + 55}
                            y="95"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {facultyAdoptionHover.series}: <tspan fontWeight="bold">{value} %</tspan>
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                )}
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {facultyAdoptionData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Most Accessed Features per Platform */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Most Accessed Features per Platform</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(platformFeaturesData).map(([platform, features]) => {
                  const total = features.reduce((sum, feature) => sum + feature.value, 0);
                  let currentAngle = 0;
                  
                  return (
                    <div key={platform} className="bg-white rounded-lg border p-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">{platform}</h4>
                      
                      <div className="relative flex justify-center">
                        <svg 
                          width="400" 
                          height="400" 
                          viewBox="0 0 400 400"
                          className="w-80 h-80"
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left - 200;
                            const y = e.clientY - rect.top - 200;
                            const distance = Math.sqrt(x * x + y * y);
                            
                            if (distance >= 80 && distance <= 160) {
                              const angle = Math.atan2(y, x) * (180 / Math.PI);
                              const normalizedAngle = angle < 0 ? angle + 360 : angle;
                              
                              let cumulativeAngle = 0;
                              for (const feature of features) {
                                const segmentAngle = (feature.value / total) * 360;
                                if (normalizedAngle >= cumulativeAngle && normalizedAngle <= cumulativeAngle + segmentAngle) {
                                  setPlatformFeaturesHover({platform, feature: feature.name});
                                  return;
                                }
                                cumulativeAngle += segmentAngle;
                              }
                            } else {
                              setPlatformFeaturesHover(null);
                            }
                          }}
                          onMouseLeave={() => setPlatformFeaturesHover(null)}
                        >
                          <defs>
                            {features.map((feature, index) => (
                              <linearGradient key={feature.name} id={`gradient-${platform}-${index}`}>
                                <stop offset="0%" stopColor={feature.color} />
                                <stop offset="100%" stopColor={feature.color} style={{opacity: 0.6}} />
                              </linearGradient>
                            ))}
                          </defs>
                          
                          {/* Donut segments */}
                          {features.map((feature, index) => {
                            const segmentAngle = (feature.value / total) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + segmentAngle;
                            
                            const startRad = (startAngle - 90) * (Math.PI / 180);
                            const endRad = (endAngle - 90) * (Math.PI / 180);
                            
                            const outerRadius = 160;
                            const innerRadius = 80;
                            
                            const x1 = 200 + outerRadius * Math.cos(startRad);
                            const y1 = 200 + outerRadius * Math.sin(startRad);
                            const x2 = 200 + outerRadius * Math.cos(endRad);
                            const y2 = 200 + outerRadius * Math.sin(endRad);
                            
                            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                            
                            const outerPath = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
                            const innerPath = `M ${x2} ${y2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
                            const fullPath = outerPath + ' ' + innerPath;
                            
                            currentAngle += segmentAngle;
                            
                            return (
                              <path
                                key={feature.name}
                                d={fullPath}
                                fill={`url(#gradient-${platform}-${index})`}
                                opacity={platformFeaturesAnim}
                                className="transition-all duration-500 ease-out animate-platform-segment-grow"
                                style={{
                                  animationDelay: `${index * 0.2}s`
                                }}
                              />
                            );
                          })}
                          
                          {/* Center circle */}
                          <circle cx="200" cy="200" r="80" fill="white" />
                        </svg>
                        
                        {/* Tooltip */}
                        {platformFeaturesHover && platformFeaturesHover.platform === platform && (
                          <div 
                            className="absolute rounded-lg shadow-lg p-3 text-sm"
                            style={{
                              backgroundColor: features.find(f => f.name === platformFeaturesHover.feature)?.color,
                              color: 'white',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10,
                              minWidth: '120px',
                              textAlign: 'center'
                            }}
                          >
                            <div className="font-semibold">
                              {platformFeaturesHover.feature}: {features.find(f => f.name === platformFeaturesHover.feature)?.value}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" 
                                 style={{borderTopColor: features.find(f => f.name === platformFeaturesHover.feature)?.color}}>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex justify-center gap-6 mt-4 flex-wrap">
                        {features.map((feature) => (
                          <div key={feature.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: feature.color}}></div>
                            <span className="text-sm text-gray-600">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Time Spent per Platform */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Time Spent per Platform</h3>
              
              <div className="relative">
                {/* Chart Controls */}
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5v14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-500 border border-blue-500 hover:bg-blue-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h18M3 6h18M3 18h18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                
                <svg 
                  width="100%" 
                  height="500" 
                  viewBox="0 0 1400 500" 
                  className="w-full"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const categoryIndex = Math.round((x - 150) / 120);
                    if (categoryIndex >= 0 && categoryIndex < timeSpentData.categories.length) {
                      setTimeSpentHover(timeSpentData.categories[categoryIndex]);
                    } else {
                      setTimeSpentHover(null);
                    }
                  }}
                  onMouseLeave={() => setTimeSpentHover(null)}
                >
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100, 120].map((tick) => (
                    <line
                      key={tick}
                      x1="100"
                      y1={400 - (tick / 120) * 350}
                      x2="1300"
                      y2={400 - (tick / 120) * 350}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 20, 40, 60, 80, 100, 120].map((tick) => (
                    <text
                      key={tick}
                      x="90"
                      y={400 - (tick / 120) * 350 + 4}
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      {tick}
                    </text>
                  ))}
                  
                  {/* Y-axis title */}
                  <text
                    x="50"
                    y="200"
                    fontSize="14"
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight="bold"
                    transform="rotate(-90, 50, 200)"
                  >
                    Time Spent (Hours)
                  </text>
                  
                  {/* X-axis labels */}
                  {timeSpentData.categories.map((category, index) => (
                    <text
                      key={category}
                      x={150 + index * 120}
                      y="450"
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {category}
                    </text>
                  ))}
                  
                  {/* Hover vertical line */}
                  {timeSpentHover && (
                    <line
                      x1={150 + timeSpentData.categories.findIndex(cat => cat === timeSpentHover) * 120}
                      y1="50"
                      x2={150 + timeSpentData.categories.findIndex(cat => cat === timeSpentHover) * 120}
                      y2="400"
                      stroke="#d1d5db"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  )}
                  
                  {/* Chart series */}
                  {timeSpentData.series.map((series, seriesIndex) => {
                    const points = series.data.map((value, index) => ({
                      x: 150 + index * 120,
                      y: 400 - (value / 120) * 350
                    }));
                    
                    if (series.type === 'areaspline') {
                      // Create area path
                      const areaPath = points.map((point, index) => {
                        if (index === 0) return `M ${point.x} ${point.y}`;
                        return `L ${point.x} ${point.y}`;
                      }).join(' ') + ` L ${points[points.length - 1].x} 400 L ${points[0].x} 400 Z`;
                      
                      return (
                        <path
                          key={series.name}
                          d={areaPath}
                          fill={series.color}
                          fillOpacity="0.3"
                          className="transition-all duration-1000 ease-out"
                          style={{
                            animationDelay: `${seriesIndex * 0.2}s`
                          }}
                        />
                      );
                    } else {
                      // Create smooth line path
                      const linePath = createSmoothCurve(points);
                      
                      return (
                        <g key={series.name}>
                          <path
                            d={linePath}
                            fill="none"
                            stroke={series.color}
                            strokeWidth="3"
                            className="transition-all duration-1000 ease-out"
                            style={{
                              animationDelay: `${seriesIndex * 0.2}s`
                            }}
                          />
                          {/* Data points */}
                          {points.map((point, index) => (
                            <circle
                              key={index}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill={series.color}
                              className="transition-all duration-300 ease-out"
                              style={{
                                animationDelay: `${seriesIndex * 0.2 + index * 0.1}s`
                              }}
                            />
                          ))}
                        </g>
                      );
                    }
                  })}
                  
                  {/* Hover intersection points */}
                  {timeSpentHover && timeSpentData.series.map((series, seriesIndex) => {
                    const categoryIndex = timeSpentData.categories.findIndex(cat => cat === timeSpentHover);
                    const value = series.data[categoryIndex];
                    const x = 150 + categoryIndex * 120;
                    const y = 400 - (value / 120) * 350;
                    
                    return (
                      <circle
                        key={series.name}
                        cx={x}
                        cy={y}
                        r="6"
                        fill={series.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
                
                {/* Custom Tooltip */}
                {timeSpentHover && (
                  <div 
                    className="absolute bg-white rounded-lg shadow-lg border p-3 text-sm"
                    style={{
                      left: `${150 + timeSpentData.categories.findIndex(cat => cat === timeSpentHover) * 120 - 100}px`,
                      top: '20px',
                      zIndex: 10,
                      minWidth: '200px'
                    }}
                  >
                    <div className="font-semibold text-gray-800 mb-2">{timeSpentHover}</div>
                    {timeSpentData.series.map((series) => {
                      const categoryIndex = timeSpentData.categories.findIndex(cat => cat === timeSpentHover);
                      const value = series.data[categoryIndex];
                      return (
                        <div key={series.name} className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                          <span className="text-gray-600">{series.name}:</span>
                          <span className="font-bold">{value} Hours</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Total value label */}
                {timeSpentHover && (() => {
                  const categoryIndex = timeSpentData.categories.findIndex(cat => cat === timeSpentHover);
                  const totalValue = timeSpentData.series[0].data[categoryIndex];
                  const x = 150 + categoryIndex * 120;
                  const y = 400 - (totalValue / 120) * 350;
                  
                  return (
                    <div 
                      className="absolute bg-gray-200 rounded-full px-3 py-1 text-sm font-bold"
                      style={{
                        left: `${x - 20}px`,
                        top: `${y - 40}px`,
                        zIndex: 10
                      }}
                    >
                      {totalValue}
                    </div>
                  );
                })()}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {timeSpentData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Assessment Completion Rates on Each Platform */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Assessment Completion Rates on Each Platform</h3>
              
              <div className="relative">
                <svg 
                  width="100%" 
                  height="500" 
                  viewBox="0 0 1400 500" 
                  className="w-full"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const categoryIndex = Math.round((x - 150) / 120);
                    if (categoryIndex >= 0 && categoryIndex < assessmentRatesData.categories.length) {
                      setAssessmentRatesHover(assessmentRatesData.categories[categoryIndex]);
                    } else {
                      setAssessmentRatesHover(null);
                    }
                  }}
                  onMouseLeave={() => setAssessmentRatesHover(null)}
                >
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100, 120].map((tick) => (
                    <line
                      key={tick}
                      x1="100"
                      y1={400 - (tick / 120) * 350}
                      x2="1300"
                      y2={400 - (tick / 120) * 350}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 20, 40, 60, 80, 100, 120].map((tick) => (
                    <text
                      key={tick}
                      x="90"
                      y={400 - (tick / 120) * 350 + 4}
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      {tick}
                    </text>
                  ))}
                  
                  {/* Y-axis title */}
                  <text
                    x="50"
                    y="200"
                    fontSize="14"
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight="bold"
                    transform="rotate(-90, 50, 200)"
                  >
                    Completion Rates
                  </text>
                  
                  {/* X-axis labels */}
                  {assessmentRatesData.categories.map((category, index) => (
                    <text
                      key={category}
                      x={150 + index * 120}
                      y="450"
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="middle"
                      className={assessmentRatesHover === category ? "bg-gray-200 px-2 py-1 rounded" : ""}
                    >
                      {category}
                    </text>
                  ))}
                  
                  {/* Hover vertical line */}
                  {assessmentRatesHover && (
                    <line
                      x1={150 + assessmentRatesData.categories.findIndex(cat => cat === assessmentRatesHover) * 120}
                      y1="50"
                      x2={150 + assessmentRatesData.categories.findIndex(cat => cat === assessmentRatesHover) * 120}
                      y2="400"
                      stroke="#d1d5db"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  )}
                  
                  {/* Chart series */}
                  {assessmentRatesData.series.map((series, seriesIndex) => {
                    const points = series.data.map((value, index) => ({
                      x: 150 + index * 120,
                      y: 400 - (value / 120) * 350
                    }));
                    
                    if (series.type === 'column') {
                      // Create column bars
                      return (
                        <g key={series.name}>
                          {points.map((point, index) => (
                            <rect
                              key={index}
                              x={point.x - 20}
                              y={point.y}
                              width="40"
                              height={400 - point.y}
                              fill={series.color}
                              className="transition-all duration-1000 ease-out"
                              style={{
                                animationDelay: `${seriesIndex * 0.2 + index * 0.1}s`
                              }}
                            />
                          ))}
                          {/* Data point markers on top of bars */}
                          {points.map((point, index) => (
                            <circle
                              key={`marker-${index}`}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill={series.color}
                              stroke="white"
                              strokeWidth="2"
                              className="transition-all duration-300 ease-out"
                              style={{
                                animationDelay: `${seriesIndex * 0.2 + index * 0.1}s`
                              }}
                            />
                          ))}
                        </g>
                      );
                    } else if (series.type === 'areaspline') {
                      // Create area path
                      const areaPath = points.map((point, index) => {
                        if (index === 0) return `M ${point.x} ${point.y}`;
                        return `L ${point.x} ${point.y}`;
                      }).join(' ') + ` L ${points[points.length - 1].x} 400 L ${points[0].x} 400 Z`;
                      
                      return (
                        <g key={series.name}>
                          <path
                            d={areaPath}
                            fill={series.color}
                            fillOpacity="0.3"
                            className="transition-all duration-1000 ease-out"
                            style={{
                              animationDelay: `${seriesIndex * 0.2}s`
                            }}
                          />
                          <path
                            d={createSmoothCurve(points)}
                            fill="none"
                            stroke={series.color}
                            strokeWidth="3"
                            className="transition-all duration-1000 ease-out"
                            style={{
                              animationDelay: `${seriesIndex * 0.2}s`
                            }}
                          />
                          {/* Data points */}
                          {points.map((point, index) => (
                            <circle
                              key={index}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill={series.color}
                              className="transition-all duration-300 ease-out"
                              style={{
                                animationDelay: `${seriesIndex * 0.2 + index * 0.1}s`
                              }}
                            />
                          ))}
                        </g>
                      );
                    } else {
                      // Create smooth line path
                      const linePath = createSmoothCurve(points);
                      const strokeWidth = series.lineWidth || 3;
                      
                      return (
                        <g key={series.name}>
                          <path
                            d={linePath}
                            fill="none"
                            stroke={series.color}
                            strokeWidth={strokeWidth}
                            className="transition-all duration-1000 ease-out"
                            style={{
                              animationDelay: `${seriesIndex * 0.2}s`
                            }}
                          />
                          {/* Data points */}
                          {points.map((point, index) => (
                            <circle
                              key={index}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill={series.color}
                              className="transition-all duration-300 ease-out"
                              style={{
                                animationDelay: `${seriesIndex * 0.2 + index * 0.1}s`
                              }}
                            />
                          ))}
                        </g>
                      );
                    }
                  })}
                  
                  {/* Hover intersection points */}
                  {assessmentRatesHover && assessmentRatesData.series.map((series, seriesIndex) => {
                    const categoryIndex = assessmentRatesData.categories.findIndex(cat => cat === assessmentRatesHover);
                    const value = series.data[categoryIndex];
                    const x = 150 + categoryIndex * 120;
                    const y = 400 - (value / 120) * 350;
                    
                    return (
                      <circle
                        key={series.name}
                        cx={x}
                        cy={y}
                        r="6"
                        fill={series.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
                
                {/* Custom Tooltip */}
                {assessmentRatesHover && (
                  <div 
                    className="absolute bg-white rounded-lg shadow-lg border p-3 text-sm"
                    style={{
                      left: `${150 + assessmentRatesData.categories.findIndex(cat => cat === assessmentRatesHover) * 120 + 20}px`,
                      top: '20px',
                      zIndex: 10,
                      minWidth: '250px'
                    }}
                  >
                    <div className="font-semibold text-gray-800 mb-2">{assessmentRatesHover}</div>
                    {assessmentRatesData.series.map((series) => {
                      const categoryIndex = assessmentRatesData.categories.findIndex(cat => cat === assessmentRatesHover);
                      const value = series.data[categoryIndex];
                      return (
                        <div key={series.name} className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                          <span className="text-gray-600">{series.name}:</span>
                          <span className="font-bold">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {assessmentRatesData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Platform Satisfaction & User Feedback Scores */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Platform Satisfaction & User Feedback Scores</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {feedbackScoresData.map((chartData) => {
                  const total = chartData.data.reduce((sum, item) => sum + item.value, 0);
                  let currentAngle = 0;
                  
                  return (
                    <div key={chartData.id} className="bg-white rounded-lg border p-4 relative">
                      <div className="text-sm font-semibold text-gray-600 mb-4">{chartData.id}</div>
                      
                      <div className="relative flex justify-center">
                        <svg 
                          width="300" 
                          height="300" 
                          viewBox="0 0 300 300"
                          className="w-64 h-64"
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left - 150;
                            const y = e.clientY - rect.top - 150;
                            const distance = Math.sqrt(x * x + y * y);
                            
                            if (distance <= 120) {
                              const angle = Math.atan2(y, x) * (180 / Math.PI);
                              const normalizedAngle = angle < 0 ? angle + 360 : angle;
                              
                              let cumulativeAngle = 0;
                              for (const slice of chartData.data) {
                                const sliceAngle = (slice.value / total) * 360;
                                if (normalizedAngle >= cumulativeAngle && normalizedAngle <= cumulativeAngle + sliceAngle) {
                                  setFeedbackScoresHover({id: chartData.id, slice: slice.name});
                                  return;
                                }
                                cumulativeAngle += sliceAngle;
                              }
                            } else {
                              setFeedbackScoresHover(null);
                            }
                          }}
                          onMouseLeave={() => setFeedbackScoresHover(null)}
                        >
                          {/* Pie slices */}
                          {chartData.data.map((slice, index) => {
                            const sliceAngle = (slice.value / total) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + sliceAngle;
                            
                            const startRad = (startAngle - 90) * (Math.PI / 180);
                            const endRad = (endAngle - 90) * (Math.PI / 180);
                            
                            const radius = 120;
                            const x1 = 150 + radius * Math.cos(startRad);
                            const y1 = 150 + radius * Math.sin(startRad);
                            const x2 = 150 + radius * Math.cos(endRad);
                            const y2 = 150 + radius * Math.sin(endRad);
                            
                            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                            const path = `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                            
                            currentAngle += sliceAngle;
                            
                            return (
                              <path
                                key={slice.name}
                                d={path}
                                fill={slice.color}
                                className="transition-all duration-500 ease-out"
                                style={{
                                  animationDelay: `${index * 0.1}s`
                                }}
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Tooltip */}
                        {feedbackScoresHover && feedbackScoresHover.id === chartData.id && (
                          <div 
                            className="absolute rounded-lg shadow-lg p-3 text-sm"
                            style={{
                              backgroundColor: chartData.data.find(s => s.name === feedbackScoresHover.slice)?.color,
                              color: 'white',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10,
                              minWidth: '200px',
                              textAlign: 'center'
                            }}
                          >
                            <div className="font-semibold">
                              {feedbackScoresHover.slice}: {chartData.data.find(s => s.name === feedbackScoresHover.slice)?.value}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-col gap-2 mt-4">
                        {chartData.data.map((slice) => (
                          <div key={slice.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: slice.color}}></div>
                            <span className="text-sm text-gray-600">{slice.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Correlation Between Platform Usage & Teaching Effectiveness */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Correlation Between Platform Usage & Teaching Effectiveness</h3>
              
              <div className="relative">
                <svg 
                  width="100%" 
                  height="600" 
                  viewBox="0 0 1400 600" 
                  className="w-full"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Calculate category index based on Y position
                    const categoryIndex = Math.round((y - 100) / 40);
                    if (categoryIndex >= 0 && categoryIndex < correlationData.categories.length) {
                      const category = correlationData.categories[categoryIndex];
                      
                      // Calculate which series is being hovered based on X position
                      const maxValue = 350; // 350% scale
                      const xScale = 1200 / maxValue; // 1200px width for 350% scale
                      const xValue = x - 200; // 200px offset for Y-axis labels
                      
                      if (xValue > 0 && xValue < 1200) {
                        const percentage = xValue / xScale;
                        const platformUsage = correlationData.series[0].data[categoryIndex];
                        const teachingEffectiveness = correlationData.series[1].data[categoryIndex];
                        
                        if (percentage <= platformUsage) {
                          setCorrelationHover({category, series: 'Total Platform Usage Hours'});
                        } else if (percentage <= platformUsage + teachingEffectiveness) {
                          setCorrelationHover({category, series: 'Teaching Effectiveness Score'});
                        } else {
                          setCorrelationHover(null);
                        }
                      } else {
                        setCorrelationHover(null);
                      }
                    } else {
                      setCorrelationHover(null);
                    }
                  }}
                  onMouseLeave={() => setCorrelationHover(null)}
                >
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200, 250, 300, 350].map((tick) => (
                    <line
                      key={tick}
                      x1={200 + (tick / 350) * 1200}
                      y1="50"
                      x2={200 + (tick / 350) * 1200}
                      y2="450"
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* X-axis labels */}
                  {[0, 50, 100, 150, 200, 250, 300, 350].map((tick) => (
                    <text
                      key={tick}
                      x={200 + (tick / 350) * 1200}
                      y="480"
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {tick}%
                    </text>
                  ))}
                  
                  {/* X-axis title */}
                  <text
                    x="800"
                    y="510"
                    fontSize="14"
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    Percentage
                  </text>
                  
                  {/* Y-axis labels */}
                  {correlationData.categories.map((category, index) => (
                    <text
                      key={category}
                      x="190"
                      y={120 + index * 40}
                      fontSize="12"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      {category}
                    </text>
                  ))}
                  
                  {/* Horizontal stacked bars */}
                  {correlationData.categories.map((category, categoryIndex) => {
                    const platformUsage = correlationData.series[0].data[categoryIndex];
                    const teachingEffectiveness = correlationData.series[1].data[categoryIndex];
                    const total = platformUsage + teachingEffectiveness;
                    
                    const barY = 100 + categoryIndex * 40;
                    const barHeight = 30;
                    
                    // Calculate positions
                    const platformUsageWidth = (platformUsage / 350) * 1200;
                    const teachingEffectivenessWidth = (teachingEffectiveness / 350) * 1200;
                    
                    // Special color for T003's platform usage
                    const platformColor = category === 'T003' ? '#A78BFA' : correlationData.series[0].color;
                    
                    return (
                      <g key={category}>
                        {/* Platform Usage Hours bar */}
                        <rect
                          x="200"
                          y={barY}
                          width={platformUsageWidth}
                          height={barHeight}
                          fill={platformColor}
                          className="transition-all duration-1000 ease-out"
                          style={{
                            animationDelay: `${categoryIndex * 0.1}s`
                          }}
                        />
                        
                        {/* Teaching Effectiveness Score bar */}
                        <rect
                          x={200 + platformUsageWidth}
                          y={barY}
                          width={teachingEffectivenessWidth}
                          height={barHeight}
                          fill={correlationData.series[1].color}
                          className="transition-all duration-1000 ease-out"
                          style={{
                            animationDelay: `${categoryIndex * 0.1 + 0.2}s`
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
                
                {/* Custom Tooltip */}
                {correlationHover && (
                  <div 
                    className="absolute bg-white rounded-lg shadow-lg border p-3 text-sm"
                    style={{
                      left: `${200 + Math.random() * 800}px`, // Dynamic positioning
                      top: '20px',
                      zIndex: 10,
                      minWidth: '200px'
                    }}
                  >
                    <div className="font-semibold text-gray-800 mb-2">{correlationHover.category}</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{
                          backgroundColor: correlationHover.series === 'Total Platform Usage Hours' 
                            ? (correlationHover.category === 'T003' ? '#A78BFA' : correlationData.series[0].color)
                            : correlationData.series[1].color
                        }}
                      ></div>
                      <span className="text-gray-600">{correlationHover.series}:</span>
                      <span className="font-bold">
                        {correlationHover.series === 'Total Platform Usage Hours' 
                          ? correlationData.series[0].data[correlationData.categories.indexOf(correlationHover.category)]
                          : correlationData.series[1].data[correlationData.categories.indexOf(correlationHover.category)]
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                {correlationData.series.map((series) => (
                  <div key={series.name} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{backgroundColor: series.color}}></div>
                    <span className="text-sm text-gray-600">{series.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Training & Support Ticket Trends for Platforms */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Training & Support Ticket Trends for Platforms</h3>
              
              <div className="relative w-full h-[600px]">
                {/* Chart Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5v14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-500 border border-blue-500 hover:bg-blue-600 flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h18M3 6h18M3 18h18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                
                {/* Legend */}
                <div className="absolute top-4 left-4 flex gap-6 z-10">
                  {ticketTrendsData.series.map((series) => (
                    <div key={series.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: series.color}}></div>
                      <span className="text-sm text-gray-600 font-medium">{series.name}</span>
                    </div>
                  ))}
                </div>
                
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 1600 600" 
                  className="w-full h-full"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const categoryIndex = Math.round((x - 120) / 140);
                    if (categoryIndex >= 0 && categoryIndex < ticketTrendsData.categories.length) {
                      setTicketTrendsHover(ticketTrendsData.categories[categoryIndex]);
                    } else {
                      setTicketTrendsHover(null);
                    }
                  }}
                  onMouseLeave={() => setTicketTrendsHover(null)}
                >
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200, 250, 300].map((tick) => (
                    <line
                      key={tick}
                      x1="120"
                      y1={500 - (tick / 300) * 400}
                      x2="1480"
                      y2={500 - (tick / 300) * 400}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 50, 100, 150, 200, 250, 300].map((tick) => (
                    <text
                      key={tick}
                      x="110"
                      y={500 - (tick / 300) * 400 + 5}
                      fontSize="14"
                      fill="#6b7280"
                      textAnchor="end"
                      fontWeight="500"
                    >
                      {tick}
                    </text>
                  ))}
                  
                  {/* Y-axis title */}
                  <text
                    x="60"
                    y="300"
                    fontSize="16"
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight="bold"
                    transform="rotate(-90, 60, 300)"
                  >
                    Tickets
                  </text>
                  
                  {/* X-axis labels */}
                  {ticketTrendsData.categories.map((category, index) => (
                    <text
                      key={category}
                      x={120 + index * 140}
                      y="550"
                      fontSize="14"
                      fill="#6b7280"
                      textAnchor="middle"
                      fontWeight="500"
                      className={ticketTrendsHover === category ? "bg-gray-200 px-3 py-1 rounded" : ""}
                    >
                      {category}
                    </text>
                  ))}
                  
                  {/* Hover vertical line */}
                  {ticketTrendsHover && (
                    <line
                      x1={120 + ticketTrendsData.categories.findIndex(cat => cat === ticketTrendsHover) * 140}
                      y1="100"
                      x2={120 + ticketTrendsData.categories.findIndex(cat => cat === ticketTrendsHover) * 140}
                      y2="500"
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeDasharray="8,8"
                    />
                  )}
                  
                  {/* Stacked area chart */}
                  {ticketTrendsData.series.map((series, seriesIndex) => {
                    // Calculate stacked values
                    const stackedPoints = series.data.map((value, index) => {
                      let stackedValue = value;
                      if (seriesIndex > 0) {
                        // Add values from previous series for stacking
                        for (let i = 0; i < seriesIndex; i++) {
                          stackedValue += ticketTrendsData.series[i].data[index];
                        }
                      }
                      return {
                        x: 120 + index * 140,
                        y: 500 - (stackedValue / 300) * 400
                      };
                    });
                    
                    // Create stacked area path
                    const areaPath = stackedPoints.map((point, index) => {
                      if (index === 0) return `M ${point.x} ${point.y}`;
                      return `L ${point.x} ${point.y}`;
                    }).join(' ') + ` L ${stackedPoints[stackedPoints.length - 1].x} 500 L ${stackedPoints[0].x} 500 Z`;
                    
                    return (
                      <g key={series.name}>
                        <path
                          d={areaPath}
                          fill={series.color}
                          fillOpacity={series.name === 'Total Support Tickets' ? 0 : 0.7}
                          className="transition-all duration-1500 ease-out"
                          style={{
                            animationDelay: `${seriesIndex * 0.3}s`
                          }}
                        />
                        <path
                          d={createSmoothCurve(stackedPoints)}
                          fill="none"
                          stroke={series.color}
                          strokeWidth={series.name === 'Total Support Tickets' ? 4 : 2}
                          className="transition-all duration-1500 ease-out"
                          style={{
                            animationDelay: `${seriesIndex * 0.3}s`
                          }}
                        />
                        {/* Data points */}
                        {stackedPoints.map((point, index) => (
                          <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={series.name === 'Total Support Tickets' ? 5 : 4}
                            fill={series.name === 'Total Support Tickets' ? series.color : 'white'}
                            stroke={series.color}
                            strokeWidth={series.name === 'Total Support Tickets' ? 0 : 2}
                            className="transition-all duration-500 ease-out"
                            style={{
                              animationDelay: `${seriesIndex * 0.3 + index * 0.1}s`
                            }}
                          />
                        ))}
                      </g>
                    );
                  })}
                  
                  {/* Hover intersection points */}
                  {ticketTrendsHover && ticketTrendsData.series.map((series, seriesIndex) => {
                    const categoryIndex = ticketTrendsData.categories.findIndex(cat => cat === ticketTrendsHover);
                    let stackedValue = series.data[categoryIndex];
                    if (seriesIndex > 0) {
                      for (let i = 0; i < seriesIndex; i++) {
                        stackedValue += ticketTrendsData.series[i].data[categoryIndex];
                      }
                    }
                    const x = 120 + categoryIndex * 140;
                    const y = 500 - (stackedValue / 300) * 400;
                    
                    return (
                      <circle
                        key={series.name}
                        cx={x}
                        cy={y}
                        r={series.name === 'Total Support Tickets' ? 7 : 6}
                        fill={series.name === 'Total Support Tickets' ? series.color : 'white'}
                        stroke={series.color}
                        strokeWidth={series.name === 'Total Support Tickets' ? 0 : 2}
                        className="animate-pulse"
                      />
                    );
                  })}
                </svg>
                
                {/* Custom Tooltip */}
                {ticketTrendsHover && (
                  <div 
                    className="absolute bg-white rounded-lg shadow-xl border p-4 text-sm"
                    style={{
                      left: `${120 + ticketTrendsData.categories.findIndex(cat => cat === ticketTrendsHover) * 140 - 120}px`,
                      top: '30px',
                      zIndex: 10,
                      minWidth: '280px'
                    }}
                  >
                    <div className="font-semibold text-gray-800 mb-3 text-base">{ticketTrendsHover}</div>
                    {ticketTrendsData.series.map((series) => {
                      const categoryIndex = ticketTrendsData.categories.findIndex(cat => cat === ticketTrendsHover);
                      const value = series.data[categoryIndex];
                      return (
                        <div key={series.name} className="flex items-center gap-3 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: series.color}}></div>
                          <span className="text-gray-600 flex-1">{series.name}:</span>
                          <span className="font-bold text-lg">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Total value label */}
                {ticketTrendsHover && (() => {
                  const categoryIndex = ticketTrendsData.categories.findIndex(cat => cat === ticketTrendsHover);
                  const totalValue = ticketTrendsData.series[3].data[categoryIndex]; // Total Support Tickets
                  const x = 120 + categoryIndex * 140;
                  const y = 500 - (totalValue / 300) * 400;
                  
                  return (
                    <div 
                      className="absolute bg-green-500 rounded-full px-4 py-2 text-base font-bold text-white border-2 border-white shadow-lg"
                      style={{
                        left: `${x - 25}px`,
                        top: `${y - 50}px`,
                        zIndex: 10
                      }}
                    >
                      {totalValue}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-row">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-6 px-4 min-h-screen">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo/Riyada.png" alt="Logo" className="w-12 h-12 mb-2" />
          <span className="font-bold text-blue-700 text-lg">Riyada Trainings</span>
              </div>
        <nav className="flex-1">
          <div className="text-xs text-gray-400 uppercase mb-2 ml-2">Menu...</div>
          <ul className="space-y-1">
            {sidebarMenu.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-all duration-200 ${activeSection === item.key ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveSection(item.key)}
                >
                  <span className="text-base">{item.label}</span>
                  {activeSection === item.key && <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{item.label === 'Analaytics Dashboard' ? '03' : ''}</span>}
                </button>
              </li>
            ))}
          </ul>
          </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">Menu</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="2" rx="1" fill="#64748b"/><rect x="4" y="11" width="16" height="2" rx="1" fill="#64748b"/><rect x="4" y="16" width="16" height="2" rx="1" fill="#64748b"/></svg>
            </button>
            <input className="border rounded px-3 py-2 w-72" placeholder="Search..." />
            </div>
            <div className="flex items-center gap-4">
            <button className="relative bg-white p-2 rounded-full hover:bg-blue-50">
              <Bell className="w-6 h-6 text-blue-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
              </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate('/dashboard')}>
              <Plus className="w-4 h-4" /> Dashboard
              </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/default-avatar.png" alt="User" className="w-9 h-9 rounded-full object-cover border" />
              <span className="font-medium text-gray-700">Admin User</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-0 bg-[#fafbfc]">
          {renderSection()}
        </main>
        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-400">2025 © Riyada Training Academy</footer>
      </div>
    </div>
  );
};