import React, { useState, useEffect } from 'react';
import { getAPIProvider, APIProvider } from '../services/geminiService';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Component to display current AI API provider status
 */
export const APIStatusIndicator: React.FC = () => {
  const [provider, setProvider] = useState<APIProvider>('openrouter');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { provider: currentProvider } = getAPIProvider();
    setProvider(currentProvider);
  }, []);

  const isGemini = provider === 'gemini';
  const statusColor = isGemini ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';
  const badgeColor = isGemini ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800';
  const iconColor = isGemini ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="relative">
      {/* Status Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusColor} hover:shadow-md transition-shadow cursor-pointer`}
        title={`Current AI Provider: ${provider === 'gemini' ? 'Google Gemini' : 'OpenRouter (Fallback)'}`}
      >
        {isGemini ? (
          <CheckCircle className={`w-4 h-4 ${iconColor}`} />
        ) : (
          <AlertCircle className={`w-4 h-4 ${iconColor}`} />
        )}
        <span className={`text-xs font-medium ${badgeColor} px-2 py-1 rounded`}>
          {isGemini ? 'Gemini' : 'OpenRouter'}
        </span>
      </button>

      {/* Tooltip/Info Popup */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Provider Status</h3>
              
              {isGemini ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Provider:</strong> Google Gemini (Primary)
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="text-green-600 font-medium">Active</span>
                  </p>
                  <p className="text-gray-600">
                    Using your configured Gemini API Key for AI processing.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Provider:</strong> OpenRouter (Fallback)
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="text-amber-600 font-medium">Active</span>
                  </p>
                  <p className="text-gray-600">
                    No Gemini API Key configured. Using OpenRouter with google/gemma-3-27b-it:free model.
                  </p>
                  <p className="text-gray-600 mt-3">
                    To use Google Gemini instead, configure your API Key in Settings → API Configuration.
                  </p>
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIStatusIndicator;
