import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Save, AlertTriangle, CheckCircle2, Loader2, Trash2, Plus, Copy, Check } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => Promise<void>;
  currentApiKey?: string;
}

const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [savedKeys, setSavedKeys] = useState<Array<{ id: string; name: string; key: string; createdAt: string }>>([]);
  const [keyName, setKeyName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSavedKeys();
      if (currentApiKey) {
        setApiKey(currentApiKey);
      }
    }
  }, [isOpen, currentApiKey]);

  const loadSavedKeys = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('mobeng_api_keys');
      if (stored) {
        setSavedKeys(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API Key tidak boleh kosong' });
      return;
    }

    setIsSaving(true);
    try {
      // Validate API key format (basic check)
      if (!apiKey.startsWith('AIza') && !apiKey.startsWith('sk-')) {
        setMessage({ type: 'error', text: 'Format API Key tidak valid. Pastikan Anda menggunakan Gemini API Key yang benar.' });
        setIsSaving(false);
        return;
      }

      // Save to localStorage with metadata
      const newKey = {
        id: Date.now().toString(),
        name: keyName || `API Key - ${new Date().toLocaleDateString('id-ID')}`,
        key: apiKey,
        createdAt: new Date().toISOString()
      };

      const updated = [...savedKeys, newKey];
      localStorage.setItem('mobeng_api_keys', JSON.stringify(updated));
      
      // Call parent handler to update app state
      await onSave(apiKey);
      
      setSavedKeys(updated);
      setMessage({ type: 'success', text: 'API Key berhasil disimpan!' });
      setApiKey('');
      setKeyName('');
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan API Key. Silakan coba lagi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectKey = (key: string) => {
    setApiKey(key);
    setMessage({ type: 'info', text: 'API Key dipilih. Klik "Simpan & Gunakan" untuk mengaktifkan.' });
  };

  const handleDeleteKey = (id: string) => {
    const updated = savedKeys.filter(k => k.id !== id);
    localStorage.setItem('mobeng_api_keys', JSON.stringify(updated));
    setSavedKeys(updated);
    setMessage({ type: 'info', text: 'API Key dihapus' });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-mobeng-blue to-mobeng-darkblue text-white p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pengaturan API Key</h2>
              <p className="text-blue-100 text-sm">Kelola API Key Gemini untuk aplikasi</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Informasi Keamanan</p>
              <p>API Key disimpan secara aman di browser Anda. Jangan bagikan API Key dengan siapapun. Ubah API Key secara berkala untuk keamanan maksimal.</p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' :
              message.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {message.type === 'success' && <CheckCircle2 size={20} className="text-green-600" />}
              {message.type === 'error' && <AlertTriangle size={20} className="text-red-600" />}
              {message.type === 'info' && <AlertTriangle size={20} className="text-blue-600" />}
              <p className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>{message.text}</p>
            </div>
          )}

          {/* Input Section */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-mobeng-green" />
              Tambah API Key Baru
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama API Key (Opsional)
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Contoh: Production Key, Testing Key"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                API Key Gemini
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste API Key Anda di sini (AIza...)"
                  className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue focus:border-transparent font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                📝 Dapatkan API Key dari <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-mobeng-blue hover:underline">Google AI Studio</a>
              </p>
            </div>

            <button
              onClick={handleSaveKey}
              disabled={isSaving || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-mobeng-green to-mobeng-darkgreen text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan & Gunakan
                </>
              )}
            </button>
          </div>

          {/* Saved Keys Section */}
          {savedKeys.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Key size={18} className="text-mobeng-blue" />
                API Key Tersimpan ({savedKeys.length})
              </h3>

              <div className="space-y-3">
                {savedKeys.map((savedKey) => (
                  <div key={savedKey.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{savedKey.name}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {savedKey.key.substring(0, 10)}...{savedKey.key.substring(savedKey.key.length - 5)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Dibuat: {new Date(savedKey.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyKey(savedKey.key)}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                        title="Salin API Key"
                      >
                        {isCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      </button>

                      <button
                        onClick={() => handleSelectKey(savedKey.key)}
                        className="px-3 py-1.5 bg-mobeng-blue text-white text-sm rounded-lg hover:bg-mobeng-darkblue transition-colors font-semibold"
                      >
                        Gunakan
                      </button>

                      <button
                        onClick={() => handleDeleteKey(savedKey.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        title="Hapus API Key"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-amber-900">❓ Cara Mendapatkan API Key:</p>
            <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
              <li>Buka <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-900 font-semibold hover:underline">Google AI Studio</a></li>
              <li>Klik "Get API Key" atau "Create API Key"</li>
              <li>Pilih project atau buat project baru</li>
              <li>Copy API Key dan paste di form di atas</li>
              <li>Klik "Simpan & Gunakan"</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-100 border-t p-4 flex justify-end gap-3">
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

export default ApiSettingsModal;
