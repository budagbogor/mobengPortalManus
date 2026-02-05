import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, Settings, BarChart3, Users, FileText, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'roles' | 'settings'>('overview');
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-mobeng-blue to-mobeng-darkblue text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
              <p className="text-blue-100 text-sm">Kelola sistem recruitment</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b flex overflow-x-auto bg-slate-50">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'questions', label: 'Question Bank', icon: FileText },
            { id: 'roles', label: 'Roles', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-mobeng-blue text-mobeng-blue'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Ringkasan Sistem</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Total Kandidat</p>
                      <p className="text-3xl font-bold text-mobeng-blue mt-2">{totalCandidates}</p>
                    </div>
                    <Users size={32} className="text-blue-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Total Submission</p>
                      <p className="text-3xl font-bold text-mobeng-green mt-2">{totalSubmissions}</p>
                    </div>
                    <FileText size={32} className="text-green-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Rata-rata Score</p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">{avgScore.toFixed(1)}/10</p>
                    </div>
                    <BarChart3 size={32} className="text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Informasi</p>
                  <p>Dashboard admin ini membantu Anda mengelola sistem recruitment. Gunakan tab di atas untuk mengelola pertanyaan, role, dan pengaturan sistem.</p>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Bank Pertanyaan</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold">
                  <Plus size={18} />
                  Tambah Pertanyaan
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📝 Fitur manajemen pertanyaan akan memungkinkan Anda untuk menambah, mengedit, dan menghapus pertanyaan dari bank soal tanpa perlu mengubah kode aplikasi.
                </p>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-800">Pertanyaan {i}</p>
                      <p className="text-sm text-slate-600">Set A - Paket Standard Mix</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Manajemen Role</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold">
                  <Plus size={18} />
                  Tambah Role
                </button>
              </div>

              <div className="space-y-3">
                {['Mechanic', 'Assistant Leader', 'Store Leader', 'Area Coordinator', 'Regional Head'].map((role, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-800">{role}</p>
                      <p className="text-sm text-slate-600">Role ID: {role.toLowerCase().replace(/\s+/g, '_')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-mobeng-blue text-white text-sm rounded-lg hover:bg-mobeng-darkblue transition-colors font-semibold">
                        Edit
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Pengaturan Sistem</h3>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <div>
                      <p className="font-semibold text-slate-800">Aktifkan Proctoring</p>
                      <p className="text-sm text-slate-600">Deteksi tab switching dan aktivitas mencurigakan</p>
                    </div>
                  </label>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <div>
                      <p className="font-semibold text-slate-800">Izinkan Voice Input</p>
                      <p className="text-sm text-slate-600">Kandidat dapat menggunakan input suara</p>
                    </div>
                  </label>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <div>
                      <p className="font-semibold text-slate-800">Mode Transparent Score</p>
                      <p className="text-sm text-slate-600">Tampilkan score kepada kandidat setelah tes selesai</p>
                    </div>
                  </label>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <label className="block">
                    <p className="font-semibold text-slate-800 mb-2">Token Validity (Jam)</p>
                    <input type="number" defaultValue={24} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue" />
                  </label>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-mobeng-green to-mobeng-darkgreen text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                <Save size={18} className="inline mr-2" />
                Simpan Pengaturan
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
