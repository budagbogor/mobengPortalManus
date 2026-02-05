import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, AlertCircle, Download, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AnalyticsData {
  totalSubmissions: number;
  avgLogicScore: number;
  avgSimulationScore: number;
  submissionsByStatus: { status: string; count: number }[];
  submissionsByRole: { role: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  trendData: { date: string; submissions: number }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch submissions
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('*');

      if (error) throw error;

      // Calculate analytics
      const totalSubmissions = submissions?.length || 0;
      const avgLogicScore = submissions
        ? submissions.reduce((sum, s) => sum + (s.logic_score || 0), 0) / totalSubmissions
        : 0;
      const avgSimulationScore = submissions
        ? submissions.reduce((sum, s) => sum + (s.simulation_score || 0), 0) / totalSubmissions
        : 0;

      // Group by status
      const statusGroups = submissions?.reduce((acc: any, s) => {
        const status = s.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const submissionsByStatus = Object.entries(statusGroups || {}).map(([status, count]) => ({
        status,
        count: count as number
      }));

      // Group by role
      const roleGroups = submissions?.reduce((acc: any, s) => {
        const role = s.role || 'unknown';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const submissionsByRole = Object.entries(roleGroups || {}).map(([role, count]) => ({
        role,
        count: count as number
      }));

      // Score distribution
      const scoreDistribution = [
        { range: '0-20', count: submissions?.filter(s => (s.logic_score || 0) < 20).length || 0 },
        { range: '20-40', count: submissions?.filter(s => (s.logic_score || 0) >= 20 && (s.logic_score || 0) < 40).length || 0 },
        { range: '40-60', count: submissions?.filter(s => (s.logic_score || 0) >= 40 && (s.logic_score || 0) < 60).length || 0 },
        { range: '60-80', count: submissions?.filter(s => (s.logic_score || 0) >= 60 && (s.logic_score || 0) < 80).length || 0 },
        { range: '80-100', count: submissions?.filter(s => (s.logic_score || 0) >= 80).length || 0 }
      ];

      // Trend data (mock)
      const trendData = [
        { date: 'Mon', submissions: 12 },
        { date: 'Tue', submissions: 19 },
        { date: 'Wed', submissions: 15 },
        { date: 'Thu', submissions: 25 },
        { date: 'Fri', submissions: 22 },
        { date: 'Sat', submissions: 18 },
        { date: 'Sun', submissions: 14 }
      ];

      setData({
        totalSubmissions,
        avgLogicScore: Math.round(avgLogicScore * 10) / 10,
        avgSimulationScore: Math.round(avgSimulationScore * 10) / 10,
        submissionsByStatus,
        submissionsByRole,
        scoreDistribution,
        trendData
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-mobeng-blue" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Tidak ada data analytics</p>
      </div>
    );
  }

  const COLORS = ['#0085CA', '#78BE20', '#FF6B6B', '#FFA500', '#4ECDC4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600 text-sm mt-1">Wawasan mendalam tentang proses rekrutmen</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
          >
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
            <option value="90days">90 Hari Terakhir</option>
            <option value="all">Semua Waktu</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 font-semibold">Total Submission</p>
            <Users size={24} className="text-mobeng-blue" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{data.totalSubmissions}</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% dari minggu lalu</p>
        </div>

        {/* Avg Logic Score */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 font-semibold">Rata-rata Logic Score</p>
            <TrendingUp size={24} className="text-mobeng-green" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{data.avgLogicScore.toFixed(1)}</p>
          <p className="text-sm text-slate-600 mt-2">dari 100 poin</p>
        </div>

        {/* Avg Simulation Score */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 font-semibold">Rata-rata Simulation</p>
            <CheckCircle size={24} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{data.avgSimulationScore.toFixed(1)}</p>
          <p className="text-sm text-slate-600 mt-2">dari 100 poin</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 font-semibold">Completion Rate</p>
            <AlertCircle size={24} className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {data.totalSubmissions > 0 ? Math.round((data.submissionsByStatus.find(s => s.status === 'completed')?.count || 0) / data.totalSubmissions * 100) : 0}%
          </p>
          <p className="text-sm text-slate-600 mt-2">Kandidat selesai</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Distribusi Skor Logic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0085CA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Status Submission</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.submissionsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.submissionsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Submissions by Role */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Submission per Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.submissionsByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#78BE20" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Tren Submission</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submissions" stroke="#0085CA" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Status Submission Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Jumlah</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Persentase</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.submissionsByStatus.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.status}</td>
                  <td className="px-4 py-3 text-slate-600">{item.count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-mobeng-blue"
                          style={{ width: `${(item.count / data.totalSubmissions) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-600 font-semibold">
                        {Math.round((item.count / data.totalSubmissions) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-mobeng-blue hover:text-mobeng-darkblue font-semibold text-sm">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
