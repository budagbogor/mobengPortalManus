import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, Check } from 'lucide-react';
import { signIn } from '../services/authService';

interface RecruiterLoginProps {
  onLoginSuccess: () => void;
}

const RecruiterLogin: React.FC<RecruiterLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email dan password harus diisi');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Format email tidak valid');
      }

      if (password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }

      // Sign in
      const result = await signIn(email, password);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mobeng-blue via-blue-50 to-mobeng-green flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-mobeng-blue to-mobeng-green p-3 rounded-lg mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Recruiter Login</h1>
            <p className="text-slate-600">Akses dashboard rekruter Mobeng Portal</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check size={20} className="text-green-600" />
              <p className="text-green-800 font-semibold">Login berhasil! Mengalihkan...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600" />
              <p className="text-red-800 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recruiter@mobeng.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue focus:border-transparent transition-all"
                  disabled={loading || success}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mobeng-blue focus:border-transparent transition-all"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  disabled={loading || success}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="text-mobeng-blue hover:text-mobeng-darkblue font-semibold">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-mobeng-blue to-mobeng-darkblue text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sedang login...
                </>
              ) : success ? (
                <>
                  <Check size={18} />
                  Login Berhasil
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-300"></div>
            <span className="text-sm text-slate-500">atau</span>
            <div className="flex-1 h-px bg-slate-300"></div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-2">Demo Credentials:</p>
            <p className="text-slate-600">Email: <span className="font-mono text-blue-600">recruiter@demo.com</span></p>
            <p className="text-slate-600">Password: <span className="font-mono text-blue-600">demo123456</span></p>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Belum punya akun?{' '}
            <a href="#" className="text-mobeng-blue hover:text-mobeng-darkblue font-semibold">
              Hubungi admin
            </a>
          </p>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-sm text-white/80">
          <p>🔒 Koneksi Anda aman dan terenkripsi</p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;
