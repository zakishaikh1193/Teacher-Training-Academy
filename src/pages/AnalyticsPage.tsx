import React from 'react';
import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface AnalyticsPageProps {
  // onBack: () => void; // No longer needed
}

const metricCards = [
  { label: 'Total Training Cost Saved', value: '$78.8k', icon: <span className="inline-block bg-violet-100 p-2 rounded-lg"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2" /></svg></span> },
  { label: 'New Users', value: '2,150', icon: <span className="inline-block bg-violet-100 p-2 rounded-lg"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2" /></svg></span> },
  { label: 'Total Active Users', value: '1,784', icon: <span className="inline-block bg-violet-100 p-2 rounded-lg"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2" /></svg></span> },
  { label: 'Learning Effectiveness Improved', value: '12.3%', icon: <span className="inline-block bg-violet-100 p-2 rounded-lg"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2" /></svg></span> },
];

const revenueTrendsData = [
  {
    month: 'Jan',
    trainingHours: 580,
    facultyEngagement: 72,
    sessionsCompleted: 250,
  },
  {
    month: 'Feb',
    trainingHours: 600,
    facultyEngagement: 75,
    sessionsCompleted: 270,
  },
  {
    month: 'Mar',
    trainingHours: 650,
    facultyEngagement: 78,
    sessionsCompleted: 300,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow p-3 text-xs border border-gray-100">
        <div className="font-semibold text-gray-700 mb-1">{label}</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
          <span>Training Hours Logged <b>{payload[0].value}</b></span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          <span>Active Faculty Engagement <b>{payload[1].value}%</b></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-300 inline-block"></span>
          <span>Training Sessions Completed <b>{payload[2].value}</b></span>
        </div>
      </div>
    );
  }
  return null;
};

const trainingByCategory = [
  { label: 'Pedagogical Strategies', value: 1872, percent: 48.6, trend: '+2.5%', trendColor: 'text-green-500', trendBg: 'bg-green-100' },
  { label: 'EdTech Integration', value: 1268, percent: 36.1, trend: '+1.5%', trendColor: 'text-green-500', trendBg: 'bg-green-100' },
  { label: 'Leadership & Classroom Mgmt', value: 901, percent: 23.4, trend: '-1.8%', trendColor: 'text-red-500', trendBg: 'bg-red-100' },
];

const facultyEnrollment = [
  { id: '#T523', date: '24 April 2024', name: 'Dr. Ahmed', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'Completed', statusColor: 'bg-green-100 text-green-700' },
  { id: '#T652', date: '24 April 2024', name: 'Ms. Sara', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'Ongoing', statusColor: 'bg-yellow-100 text-yellow-700' },
  { id: '#T862', date: '20 April 2024', name: 'Mr. Rashid', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', status: 'Pending', statusColor: 'bg-red-100 text-red-700' },
];

const feedbackScores = [
  { id: '#98521', date: '24 April 2024', name: 'Dr. Ahmed', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', score: 4.8, summary: 'Excellent', scoreColor: 'bg-green-100 text-green-700' },
  { id: '#20158', date: '24 April 2024', name: 'Ms. Sara', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', score: 4.5, summary: 'Engaging', scoreColor: 'bg-green-100 text-green-700' },
  { id: '#36589', date: '20 April 2024', name: 'Mr. Rashid', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', score: 3.1, summary: 'Needs More Depth', scoreColor: 'bg-red-100 text-red-700' },
];

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
const regionMarkers = [
  { name: 'Jeddah', coordinates: [39.197971, 21.485811] },
  { name: 'Dammam', coordinates: [50.103273, 26.420682] },
  { name: 'Riyadh', coordinates: [46.6752957, 24.7135517] },
];

const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 relative font-sans">
      {/* Main Content */}
      <div className="w-full h-full px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <span className="text-gray-400">Darkone &gt; Dashboard</span>
        </div>
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metricCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">{card.label}</span>
                {card.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              {/* Mock line chart */}
              <div className="mt-2 h-6 w-full">
                <svg width="100%" height="24" viewBox="0 0 120 24" fill="none">
                  <polyline points="0,20 20,10 40,15 60,8 80,16 100,6 120,18" stroke="#a78bfa" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Trends */}
          <div className="bg-white rounded-xl p-6 shadow border border-gray-100 col-span-1 lg:col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Revenue Trends</span>
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">ALL</button>
                <button className="px-2 py-1 rounded text-gray-400 hover:bg-gray-100">1M</button>
                <button className="px-2 py-1 rounded text-gray-400 hover:bg-gray-100">6M</button>
                <button className="px-2 py-1 rounded text-gray-400 hover:bg-gray-100">1Y</button>
              </div>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueTrendsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  barCategoryGap={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 700]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    align="left"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: 16, fontSize: 13 }}
                  />
                  <Bar dataKey="trainingHours" name="Training Hours Logged" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="facultyEngagement" name="Active Faculty Engagement" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sessionsCompleted" name="Training Sessions Completed" stroke="#a78bfa" strokeWidth={2} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-4">
              <span className="text-violet-400">Training Hours Logged</span>
              <span className="text-green-400">Active Faculty Engagement</span>
              <span className="text-violet-300">Training Sessions Completed</span>
            </div>
          </div>
          {/* Training by Category */}
          <div className="bg-white rounded-xl p-6 shadow border border-gray-100 col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Training by Category</span>
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">ALL</button>
                <button className="px-2 py-1 rounded text-gray-400 hover:bg-gray-100">1M</button>
                <button className="px-2 py-1 rounded text-gray-400 hover:bg-gray-100">6M</button>
                <button className="px-2 py-1 rounded text-gray-400 hover:bg-gray-100">1Y</button>
              </div>
            </div>
            {/* Donut Chart (SVG) */}
            <div className="flex items-center justify-center mb-4">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" stroke="#f3f4f6" strokeWidth="16" fill="none" />
                <circle cx="60" cy="60" r="48" stroke="#4ade80" strokeWidth="16" fill="none" strokeDasharray="302" strokeDashoffset="156" />
                <circle cx="60" cy="60" r="48" stroke="#a78bfa" strokeWidth="16" fill="none" strokeDasharray="302" strokeDashoffset="220" />
                <circle cx="60" cy="60" r="48" stroke="#38bdf8" strokeWidth="16" fill="none" strokeDasharray="302" strokeDashoffset="270" />
              </svg>
            </div>
            {/* Table */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-1">Training Category</th>
                  <th className="py-1">Sessions Completed</th>
                  <th className="py-1">Percentage</th>
                  <th className="py-1">Growth Trend</th>
                </tr>
              </thead>
              <tbody>
                {trainingByCategory.map((cat) => (
                  <tr key={cat.label} className="border-b border-gray-100 last:border-0">
                    <td className="py-1 text-gray-900">{cat.label}</td>
                    <td className="py-1">{cat.value}</td>
                    <td className="py-1">{cat.percent}%</td>
                    <td className="py-1 font-semibold">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${cat.trendBg} ${cat.trendColor}`}>{cat.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Faculty Training Participation by Region (Map) */}
          <div className="bg-white rounded-xl p-6 shadow border border-gray-100 col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Faculty Training Participation by Region</span>
              <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1">View Data <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-64">
                <ComposableMap projectionConfig={{ scale: 110 }} width={500} height={220} style={{ width: '100%', height: '100%' }}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#f3f4f6"
                          stroke="#e5e7eb"
                          style={{ outline: 'none' }}
                        />
                      ))
                    }
                  </Geographies>
                  {regionMarkers.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates}>
                      <circle r={8} fill="#64748b" fillOpacity={0.7} />
                      <text
                        textAnchor="middle"
                        y={-16}
                        style={{ fontFamily: 'inherit', fontSize: 13, fill: '#64748b', fontWeight: 600 }}
                      >
                        {name}
                      </text>
                    </Marker>
                  ))}
                </ComposableMap>
              </div>
            </div>
          </div>
        </div>
        {/* Lower Grid: Enrollment and Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Faculty Enrollment */}
          <div className="bg-white rounded-xl p-6 shadow border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Faculty Enrollment</span>
              <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">View All</button>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-1">ID</th>
                  <th className="py-1">Enrollment Date</th>
                  <th className="py-1">Faculty Name</th>
                  <th className="py-1">Training Status</th>
                </tr>
              </thead>
              <tbody>
                {facultyEnrollment.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-1 text-gray-900">{row.id}</td>
                    <td className="py-1">{row.date}</td>
                    <td className="py-1 flex items-center gap-2">
                      <img src={row.avatar} alt={row.name} className="w-6 h-6 rounded-full object-cover border" />
                      {row.name}
                    </td>
                    <td className="py-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.statusColor}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Training Feedback & Performance Scores */}
          <div className="bg-white rounded-xl p-6 shadow border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Training Feedback & Performance Scores</span>
              <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">View All</button>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-1">ID</th>
                  <th className="py-1">Training Date</th>
                  <th className="py-1">Faculty Name</th>
                  <th className="py-1">Score</th>
                  <th className="py-1">Feedback Summary</th>
                </tr>
              </thead>
              <tbody>
                {feedbackScores.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-1 text-gray-900">{row.id}</td>
                    <td className="py-1">{row.date}</td>
                    <td className="py-1 flex items-center gap-2">
                      <img src={row.avatar} alt={row.name} className="w-6 h-6 rounded-full object-cover border" />
                      {row.name}
                    </td>
                    <td className="py-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.scoreColor}`}>{row.score}</span>
                    </td>
                    <td className="py-1">{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-8 pb-2">2025 © Riyada Training Academy</div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 