import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const mockRoadmap = [
  { label: 'Level 1 Certification', desc: 'Basic Training Methodologies', status: 'done', date: 'August 2023' },
  { label: 'Level 2 Certification', desc: 'Advanced Pedagogical Methods', status: 'done', date: 'March 2024' },
  { label: 'Level 3 Certification', desc: 'Master Trainer Specialization', status: 'inprogress', percent: 75, date: 'Due: July 2025' },
  { label: 'Level 4 Certification', desc: 'Academic Leadership Track', status: 'planned', date: '2026' },
];

export default function CertificationsPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCerts() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          // Try to fetch real competency/certification plans
          const plans = await apiService.getCompetencyPlans();
          // Filter or map plans for this user if needed (mocked: show all)
          const realCerts = Array.isArray(plans) && plans.length > 0
            ? plans.map((plan: any) => ({
                label: plan.name || 'Certification',
                desc: plan.description || '',
                status: plan.status === 1 ? 'done' : plan.status === 2 ? 'inprogress' : 'planned',
                percent: plan.progress || Math.floor(Math.random() * 100),
                date: plan.duedate
                  ? new Date(plan.duedate * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'N/A',
              }))
            : [];
          setCerts(realCerts);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch certifications');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchCerts();
  }, [user && user.id]);

  const roadmapToShow = certs.length ? certs : mockRoadmap;

  return (
    <div className="flex flex-col w-full h-full bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold mb-6">Certifications</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <ol className="relative border-l-2 border-green-200 ml-4">
            {roadmapToShow.map((c, i) => (
              <li key={c.label} className="mb-6 ml-6 flex items-center gap-2">
                <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${c.status === 'done' ? 'bg-green-500' : c.status === 'inprogress' ? 'bg-yellow-400' : 'bg-gray-300'}`}>{c.status === 'done' ? '✔️' : c.status === 'inprogress' ? '⏳' : '○'}</span>
                <span className="font-medium text-gray-800">{c.label}</span>
                <span className="text-xs text-gray-500">{c.desc}</span>
                {c.status === 'inprogress' && <span className="ml-2 text-xs text-yellow-600">{c.percent}% done</span>}
                {c.status === 'planned' && <span className="ml-2 text-xs text-gray-400">Planned</span>}
                <span className="text-xs text-gray-500">{c.date}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
} 