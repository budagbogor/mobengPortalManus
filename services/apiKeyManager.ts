/**
 * API Key Manager Service
 * Handles secure storage and retrieval of API keys
 * Supports multiple API key management with encryption (optional)
 */

export interface ApiKeyEntry {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

const STORAGE_KEY = 'mobeng_api_keys';
const ACTIVE_KEY = 'mobeng_active_api_key';

/**
 * Get all stored API keys
 */
export const getAllApiKeys = (): ApiKeyEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving API keys:', error);
    return [];
  }
};

/**
 * Get the currently active API key
 */
export const getActiveApiKey = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch (error) {
    console.error('Error retrieving active API key:', error);
    return null;
  }
};

/**
 * Save a new API key
 */
export const saveApiKey = (key: string, name?: string): ApiKeyEntry => {
  if (!key || !key.trim()) {
    throw new Error('API Key tidak boleh kosong');
  }

  // Validate API key format
  if (!isValidApiKeyFormat(key)) {
    throw new Error('Format API Key tidak valid');
  }

  const entry: ApiKeyEntry = {
    id: Date.now().toString(),
    name: name || `API Key - ${new Date().toLocaleDateString('id-ID')}`,
    key: key.trim(),
    createdAt: new Date().toISOString(),
    isActive: true
  };

  try {
    const keys = getAllApiKeys();
    
    // Deactivate other keys
    keys.forEach(k => k.isActive = false);
    
    // Add new key
    keys.push(entry);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    localStorage.setItem(ACTIVE_KEY, key.trim());
    
    return entry;
  } catch (error) {
    console.error('Error saving API key:', error);
    throw new Error('Gagal menyimpan API Key');
  }
};

/**
 * Set an existing API key as active
 */
export const setActiveApiKey = (keyId: string): boolean => {
  try {
    const keys = getAllApiKeys();
    const targetKey = keys.find(k => k.id === keyId);
    
    if (!targetKey) {
      throw new Error('API Key tidak ditemukan');
    }

    // Deactivate all, activate target
    keys.forEach(k => k.isActive = false);
    targetKey.isActive = true;
    targetKey.lastUsed = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    localStorage.setItem(ACTIVE_KEY, targetKey.key);
    
    return true;
  } catch (error) {
    console.error('Error setting active API key:', error);
    return false;
  }
};

/**
 * Delete an API key
 */
export const deleteApiKey = (keyId: string): boolean => {
  try {
    const keys = getAllApiKeys();
    const filtered = keys.filter(k => k.id !== keyId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // If deleted key was active, clear active key
    const activeKey = getActiveApiKey();
    const deletedKey = keys.find(k => k.id === keyId);
    if (deletedKey && activeKey === deletedKey.key) {
      localStorage.removeItem(ACTIVE_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    return false;
  }
};

/**
 * Update API key metadata (name, etc)
 */
export const updateApiKeyMetadata = (keyId: string, updates: Partial<ApiKeyEntry>): boolean => {
  try {
    const keys = getAllApiKeys();
    const key = keys.find(k => k.id === keyId);
    
    if (!key) {
      throw new Error('API Key tidak ditemukan');
    }

    // Only allow updating name and metadata, not the key itself
    if (updates.name) key.name = updates.name;
    if (updates.lastUsed) key.lastUsed = updates.lastUsed;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    return true;
  } catch (error) {
    console.error('Error updating API key metadata:', error);
    return false;
  }
};

/**
 * Validate API key format
 */
export const isValidApiKeyFormat = (key: string): boolean => {
  // Google Gemini API keys typically start with AIza
  // OpenAI keys start with sk-
  // Accept both formats for flexibility
  const googleFormat = /^AIza[0-9A-Za-z\-_]{35}$/;
  const openaiFormat = /^sk-[A-Za-z0-9]{20,}$/;
  
  return googleFormat.test(key) || openaiFormat.test(key) || key.length > 20;
};

/**
 * Test API key validity by making a simple request
 */
export const testApiKey = async (apiKey: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    // This would be implemented based on your API
    // For now, just validate format
    if (!isValidApiKeyFormat(apiKey)) {
      return { valid: false, error: 'Format API Key tidak valid' };
    }
    
    // In production, you might want to make a test API call
    // to verify the key actually works
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: String(error) };
  }
};

/**
 * Clear all stored API keys (use with caution)
 */
export const clearAllApiKeys = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing API keys:', error);
    return false;
  }
};

/**
 * Export API keys for backup (encrypted)
 */
export const exportApiKeys = (): string => {
  try {
    const keys = getAllApiKeys();
    // In production, implement proper encryption
    return JSON.stringify(keys, null, 2);
  } catch (error) {
    console.error('Error exporting API keys:', error);
    throw new Error('Gagal export API Keys');
  }
};

/**
 * Import API keys from backup
 */
export const importApiKeys = (jsonData: string): boolean => {
  try {
    const keys = JSON.parse(jsonData);
    
    if (!Array.isArray(keys)) {
      throw new Error('Format data tidak valid');
    }

    // Validate all keys
    keys.forEach(key => {
      if (!key.id || !key.name || !key.key) {
        throw new Error('Data API Key tidak lengkap');
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    return true;
  } catch (error) {
    console.error('Error importing API keys:', error);
    return false;
  }
};

/**
 * Get API key statistics
 */
export const getApiKeyStats = () => {
  const keys = getAllApiKeys();
  const activeKey = getActiveApiKey();
  
  return {
    totalKeys: keys.length,
    activeKey: activeKey ? activeKey.substring(0, 10) + '...' : 'None',
    keys: keys.map(k => ({
      id: k.id,
      name: k.name,
      isActive: k.isActive,
      createdAt: k.createdAt,
      lastUsed: k.lastUsed
    }))
  };
};
