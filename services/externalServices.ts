/**
 * External Services Configuration
 * Handles integration with SendGrid, Twilio, and other external APIs
 */

// ============================================
// SENDGRID CONFIGURATION
// ============================================

export interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export const sendGridConfig: SendGridConfig = {
  apiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
  fromEmail: 'noreply@mobeng.com',
  fromName: 'Mobeng Recruitment Portal'
};

/**
 * Validate SendGrid configuration
 */
export const validateSendGridConfig = (): { valid: boolean; error?: string } => {
  if (!sendGridConfig.apiKey) {
    return {
      valid: false,
      error: 'SendGrid API Key not configured'
    };
  }

  if (!sendGridConfig.apiKey.startsWith('SG.')) {
    return {
      valid: false,
      error: 'Invalid SendGrid API Key format'
    };
  }

  return { valid: true };
};

// ============================================
// TWILIO CONFIGURATION
// ============================================

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  whatsappNumber?: string;
}

export const twilioConfig: TwilioConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
  whatsappNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || ''
};

/**
 * Validate Twilio configuration
 */
export const validateTwilioConfig = (): { valid: boolean; error?: string } => {
  if (!twilioConfig.accountSid || !twilioConfig.authToken) {
    return {
      valid: false,
      error: 'Twilio credentials not configured'
    };
  }

  if (!twilioConfig.phoneNumber) {
    return {
      valid: false,
      error: 'Twilio phone number not configured'
    };
  }

  return { valid: true };
};

// ============================================
// GEMINI CONFIGURATION
// ============================================

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export const geminiConfig: GeminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: 'gemini-2.0-flash'
};

/**
 * Validate Gemini configuration
 */
export const validateGeminiConfig = (): { valid: boolean; error?: string } => {
  if (!geminiConfig.apiKey) {
    return {
      valid: false,
      error: 'Gemini API Key not configured'
    };
  }

  if (!geminiConfig.apiKey.startsWith('AIza')) {
    return {
      valid: false,
      error: 'Invalid Gemini API Key format'
    };
  }

  return { valid: true };
};

// ============================================
// SUPABASE CONFIGURATION
// ============================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const supabaseConfig: SupabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};

/**
 * Validate Supabase configuration
 */
export const validateSupabaseConfig = (): { valid: boolean; error?: string } => {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    return {
      valid: false,
      error: 'Supabase credentials not configured'
    };
  }

  if (!supabaseConfig.url.includes('supabase.co')) {
    return {
      valid: false,
      error: 'Invalid Supabase URL format'
    };
  }

  return { valid: true };
};

// ============================================
// VALIDATION & STATUS
// ============================================

export interface ServiceStatus {
  supabase: { configured: boolean; error?: string };
  gemini: { configured: boolean; error?: string };
  sendgrid: { configured: boolean; error?: string };
  twilio: { configured: boolean; error?: string };
}

/**
 * Get status of all external services
 */
export const getServicesStatus = (): ServiceStatus => {
  const supabaseValidation = validateSupabaseConfig();
  const geminiValidation = validateGeminiConfig();
  const sendgridValidation = validateSendGridConfig();
  const twilioValidation = validateTwilioConfig();

  return {
    supabase: {
      configured: supabaseValidation.valid,
      error: supabaseValidation.error
    },
    gemini: {
      configured: geminiValidation.valid,
      error: geminiValidation.error
    },
    sendgrid: {
      configured: sendgridValidation.valid,
      error: sendgridValidation.error
    },
    twilio: {
      configured: twilioValidation.valid,
      error: twilioValidation.error
    }
  };
};

/**
 * Log services status for debugging
 */
export const logServicesStatus = () => {
  const status = getServicesStatus();

  console.group('🔧 External Services Status');

  console.log('Supabase:', status.supabase.configured ? '✅ Configured' : `❌ ${status.supabase.error}`);
  console.log('Gemini:', status.gemini.configured ? '✅ Configured' : `❌ ${status.gemini.error}`);
  console.log('SendGrid:', status.sendgrid.configured ? '✅ Configured' : `⚠️ ${status.sendgrid.error}`);
  console.log('Twilio:', status.twilio.configured ? '✅ Configured' : `⚠️ ${status.twilio.error}`);

  console.groupEnd();
};

// ============================================
// EMAIL TEMPLATES
// ============================================

export const emailTemplates = {
  invitation: {
    subject: 'Undangan Assessment - Mobeng Recruitment Portal',
    template: (candidateName: string, role: string, invitationUrl: string) => `
      <h1>Selamat datang, ${candidateName}!</h1>
      <p>Anda telah diundang untuk mengikuti assessment untuk posisi <strong>${role}</strong> di Mobeng.</p>
      <p>
        <a href="${invitationUrl}" style="background-color: #0085CA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Mulai Assessment
        </a>
      </p>
      <p>Link ini berlaku selama 24 jam.</p>
      <p>Terima kasih,<br>Tim Recruitment Mobeng</p>
    `
  },
  result: {
    subject: 'Hasil Assessment Anda - Mobeng Recruitment Portal',
    template: (candidateName: string, score: number, status: string) => `
      <h1>Hasil Assessment Anda</h1>
      <p>Terima kasih telah mengikuti assessment, ${candidateName}!</p>
      <p>Skor Anda: <strong>${score}/100</strong></p>
      <p>Status: <strong>${status}</strong></p>
      <p>Kami akan menghubungi Anda dalam waktu 2-3 hari kerja.</p>
      <p>Terima kasih,<br>Tim Recruitment Mobeng</p>
    `
  }
};

// ============================================
// SMS TEMPLATES
// ============================================

export const smsTemplates = {
  invitation: (candidateName: string, role: string, invitationUrl: string) => 
    `Halo ${candidateName}! Anda diundang untuk assessment posisi ${role}. Klik: ${invitationUrl}`,
  
  result: (candidateName: string, score: number, status: string) => 
    `Halo ${candidateName}! Hasil assessment Anda: ${score}/100. Status: ${status}. Terima kasih!`
};

// ============================================
// WHATSAPP TEMPLATES
// ============================================

export const whatsappTemplates = {
  invitation: (candidateName: string, role: string, invitationUrl: string) => `
Halo ${candidateName}! 👋

Anda telah diundang untuk mengikuti assessment untuk posisi *${role}* di Mobeng.

Silakan klik link di bawah untuk memulai:
${invitationUrl}

Link berlaku selama 24 jam.

Terima kasih! 🙏
  `,
  
  result: (candidateName: string, score: number, status: string) => `
Halo ${candidateName}! 👋

Terima kasih telah mengikuti assessment!

📊 Hasil Anda:
• Skor: ${score}/100
• Status: ${status}

Kami akan menghubungi Anda dalam 2-3 hari kerja.

Terima kasih! 🙏
  `
};
