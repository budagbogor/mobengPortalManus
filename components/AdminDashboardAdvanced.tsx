import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, Settings, BarChart3, Users, FileText, AlertTriangle, Loader2, Check, ChevronDown } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface Question {
  id: string;
  question_set_id: string;
  text: string;
  options: string[];
  correct_answer_index: number;
}

interface QuestionSet {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  label: string;
  description: string;
  initial_scenario: string;
  system_instruction: string;
}

interface AdminDashboardAdvancedProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboardAdvanced: React.FC<AdminDashboardAdvancedProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'roles' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Questions State
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  
  // Roles State
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showRoleForm, setShowRoleForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    roleLabel: '',
    roleDescription: '',
    initialScenario: '',
    systemInstruction: ''
  });

  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Load question sets and roles
  const loadData = async () => {
    setLoading(true);
    try {
      // Load question sets
      const { data: setsData, error: setsError } = await supabase
        .from('question_sets')
        .select('*');
      
      if (setsError) throw setsError;
      setQuestionSets(setsData || []);
      
      // Load roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      setRoles(rolesData || []);
      
      // Load questions if a set is selected
      if (selectedQuestionSet) {
        loadQuestions(selectedQuestionSet);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  };

  // Load questions for selected set
  const loadQuestions = async (setId: string) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('question_set_id', setId);
      
      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      setMessage({ type: 'error', text: 'Gagal memuat pertanyaan' });
    }
  };

  // Save question
  const handleSaveQuestion = async () => {
    if (!formData.questionText || formData.options.some(opt => !opt)) {
      setMessage({ type: 'error', text: 'Semua field harus diisi' });
      return;
    }

    try {
      if (editingQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('questions')
          .update({
            text: formData.questionText,
            options: formData.options,
            correct_answer_index: formData.correctAnswer
          })
          .eq('id', editingQuestion.id);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Pertanyaan berhasil diperbarui' });
      } else {
        // Insert new question
        const { error } = await supabase
          .from('questions')
          .insert([{
            question_set_id: selectedQuestionSet,
            text: formData.questionText,
            options: formData.options,
            correct_answer_index: formData.correctAnswer
          }]);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Pertanyaan berhasil ditambahkan' });
      }

      // Reset form and reload
      resetQuestionForm();
      loadQuestions(selectedQuestionSet);
    } catch (error) {
      console.error('Error saving question:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan pertanyaan' });
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMessage({ type: 'success', text: 'Pertanyaan berhasil dihapus' });
      loadQuestions(selectedQuestionSet);
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus pertanyaan' });
    }
  };

  // Save role
  const handleSaveRole = async () => {
    if (!formData.roleLabel || !formData.initialScenario || !formData.systemInstruction) {
      setMessage({ type: 'error', text: 'Semua field wajib diisi' });
      return;
    }

    try {
      if (editingRole) {
        // Update existing role
        const { error } = await supabase
          .from('roles')
          .update({
            label: formData.roleLabel,
            description: formData.roleDescription,
            initial_scenario: formData.initialScenario,
            system_instruction: formData.systemInstruction
          })
          .eq('id', editingRole.id);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Role berhasil diperbarui' });
      } else {
        // Insert new role
        const roleId = formData.roleLabel.toLowerCase().replace(/\s+/g, '_');
        const { error } = await supabase
          .from('roles')
          .insert([{
            id: roleId,
            label: formData.roleLabel,
            description: formData.roleDescription,
            initial_scenario: formData.initialScenario,
            system_instruction: formData.systemInstruction
          }]);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Role berhasil ditambahkan' });
      }

      // Reset form and reload
      resetRoleForm();
      loadData();
    } catch (error) {
      console.error('Error saving role:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan role' });
    }
  };

  // Delete role
  const handleDeleteRole = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus role ini? Ini akan mempengaruhi data historis.')) return;

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMessage({ type: 'success', text: 'Role berhasil dihapus' });
      loadData();
    } catch (error) {
      console.error('Error deleting role:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus role' });
    }
  };

  const resetQuestionForm = () => {
    setFormData({
      ...formData,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const resetRoleForm = () => {
    setFormData({
      ...formData,
      roleLabel: '',
      roleDescription: '',
      initialScenario: '',
      systemInstruction: ''
    });
    setEditingRole(null);
    setShowRoleForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-mobeng-blue to-mobeng-darkblue text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={24} />
            <div>
              <h2 className="text-xl font-bold">Admin Dashboard Advanced</h2>
              <p className="text-blue-100 text-sm">Kelola konten dinamis sistem</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
            {message.type === 'success' ? <Check size={20} className="text-green-600" /> : <AlertTriangle size={20} className="text-red-600" />}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>{message.text}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b flex bg-slate-50">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'questions', label: 'Bank Soal', icon: FileText },
            { id: 'roles', label: 'Roles', icon: Users },
            { id: 'settings', label: 'Pengaturan', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors ${
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-mobeng-blue" />
            </div>
          ) : (
            <>
              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Bank Soal</h3>
                    <button
                      onClick={() => setShowQuestionForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold"
                    >
                      <Plus size={18} />
                      Tambah Soal
                    </button>
                  </div>

                  {/* Question Set Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Set Soal</label>
                    <select
                      value={selectedQuestionSet}
                      onChange={(e) => {
                        setSelectedQuestionSet(e.target.value);
                        loadQuestions(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                    >
                      <option value="">-- Pilih Set --</option>
                      {questionSets.map(set => (
                        <option key={set.id} value={set.id}>{set.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Questions List */}
                  {selectedQuestionSet && (
                    <div className="space-y-3">
                      {questions.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">Tidak ada soal di set ini</p>
                      ) : (
                        questions.map((q, idx) => (
                          <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-slate-800">Soal {idx + 1}</p>
                                <p className="text-sm text-slate-600 mt-1">{q.text}</p>
                                <div className="mt-2 space-y-1">
                                  {q.options.map((opt, optIdx) => (
                                    <p key={optIdx} className={`text-sm ${optIdx === q.correct_answer_index ? 'text-green-600 font-semibold' : 'text-slate-600'}`}>
                                      {String.fromCharCode(65 + optIdx)}) {opt} {optIdx === q.correct_answer_index && '✓'}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingQuestion(q);
                                    setFormData({
                                      ...formData,
                                      questionText: q.text,
                                      options: q.options,
                                      correctAnswer: q.correct_answer_index
                                    });
                                    setShowQuestionForm(true);
                                  }}
                                  className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Question Form Modal */}
                  {showQuestionForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                        <h3 className="text-lg font-bold mb-4">{editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Pertanyaan</label>
                            <textarea
                              value={formData.questionText}
                              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                              rows={3}
                              placeholder="Masukkan pertanyaan..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Opsi Jawaban</label>
                            {formData.options.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-slate-600 w-6">{String.fromCharCode(65 + idx)})</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...formData.options];
                                    newOptions[idx] = e.target.value;
                                    setFormData({ ...formData, options: newOptions });
                                  }}
                                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                                  placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                                />
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  checked={formData.correctAnswer === idx}
                                  onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                                  className="w-4 h-4"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={resetQuestionForm}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                          >
                            Batal
                          </button>
                          <button
                            onClick={handleSaveQuestion}
                            className="flex-1 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <Save size={18} />
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Roles Tab */}
              {activeTab === 'roles' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Manajemen Role</h3>
                    <button
                      onClick={() => setShowRoleForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold"
                    >
                      <Plus size={18} />
                      Tambah Role
                    </button>
                  </div>

                  <div className="space-y-3">
                    {roles.length === 0 ? (
                      <p className="text-slate-600 text-center py-8">Tidak ada role</p>
                    ) : (
                      roles.map(role => (
                        <div key={role.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{role.label}</p>
                              <p className="text-sm text-slate-600">{role.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => {
                                  setEditingRole(role);
                                  setFormData({
                                    ...formData,
                                    roleLabel: role.label,
                                    roleDescription: role.description,
                                    initialScenario: role.initial_scenario,
                                    systemInstruction: role.system_instruction
                                  });
                                  setShowRoleForm(true);
                                }}
                                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteRole(role.id)}
                                className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Role Form Modal */}
                  {showRoleForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{editingRole ? 'Edit Role' : 'Tambah Role Baru'}</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Role</label>
                            <input
                              type="text"
                              value={formData.roleLabel}
                              onChange={(e) => setFormData({ ...formData, roleLabel: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                              placeholder="Contoh: Store Leader"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                            <textarea
                              value={formData.roleDescription}
                              onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                              rows={2}
                              placeholder="Deskripsi role..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Skenario Awal</label>
                            <textarea
                              value={formData.initialScenario}
                              onChange={(e) => setFormData({ ...formData, initialScenario: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                              rows={3}
                              placeholder="Skenario yang akan ditampilkan saat mulai simulasi..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Instruksi Sistem</label>
                            <textarea
                              value={formData.systemInstruction}
                              onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue"
                              rows={4}
                              placeholder="Instruksi untuk AI dalam mengevaluasi kandidat..."
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={resetRoleForm}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                          >
                            Batal
                          </button>
                          <button
                            onClick={handleSaveRole}
                            className="flex-1 px-4 py-2 bg-mobeng-green text-white rounded-lg hover:bg-mobeng-darkgreen transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <Save size={18} />
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs (Overview, Settings) */}
              {activeTab === 'overview' && (
                <div className="text-center py-12">
                  <p className="text-slate-600">Overview akan menampilkan statistik sistem di sini</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <p className="text-slate-600">Pengaturan sistem akan tersedia di sini</p>
                </div>
              )}
            </>
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

export default AdminDashboardAdvanced;
