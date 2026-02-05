/**
 * Notification Service
 * Handles multi-channel notifications (Email, SMS, WhatsApp)
 */

import { supabase } from './supabaseClient';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp';

export interface NotificationPayload {
  recipientEmail?: string;
  recipientPhone?: string;
  candidateName: string;
  candidateId: string;
  channel: NotificationChannel;
  type: 'invitation' | 'result' | 'reminder';
  data: {
    invitationToken?: string;
    scores?: {
      logicScore: number;
      simulationScore: number;
      overallScore: number;
    };
    status?: 'recommended' | 'consider' | 'reject';
    message?: string;
  };
}

export interface NotificationLog {
  id: string;
  candidateId: string;
  channel: NotificationChannel;
  type: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  error?: string;
}

/**
 * Send notification via multiple channels
 */
export const sendNotification = async (payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Validate payload
    if (!payload.candidateName || !payload.candidateId) {
      throw new Error('Candidate name dan ID harus diisi');
    }

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: payload
    });

    if (error) throw error;

    // Log notification
    await logNotification({
      candidateId: payload.candidateId,
      channel: payload.channel,
      type: payload.type,
      status: 'sent',
      sentAt: new Date().toISOString()
    });

    return {
      success: true,
      messageId: data?.messageId
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    
    // Log failed notification
    await logNotification({
      candidateId: payload.candidateId,
      channel: payload.channel,
      type: payload.type,
      status: 'failed',
      sentAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengirim notifikasi'
    };
  }
};

/**
 * Send invitation via email
 */
export const sendInvitationEmail = async (
  candidateName: string,
  candidateEmail: string,
  invitationToken: string,
  role: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const invitationUrl = `${window.location.origin}/candidate?token=${invitationToken}`;
    
    const payload: NotificationPayload = {
      recipientEmail: candidateEmail,
      candidateName,
      candidateId: '', // Will be filled by the function
      channel: 'email',
      type: 'invitation',
      data: {
        invitationToken,
        message: `Anda telah diundang untuk mengikuti assessment untuk posisi ${role}`
      }
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengirim email undangan'
    };
  }
};

/**
 * Send result via email
 */
export const sendResultEmail = async (
  candidateName: string,
  candidateEmail: string,
  scores: { logicScore: number; simulationScore: number; overallScore: number },
  status: 'recommended' | 'consider' | 'reject'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload: NotificationPayload = {
      recipientEmail: candidateEmail,
      candidateName,
      candidateId: '', // Will be filled by the function
      channel: 'email',
      type: 'result',
      data: {
        scores,
        status,
        message: `Hasil assessment Anda telah tersedia`
      }
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error('Error sending result email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengirim email hasil'
    };
  }
};

/**
 * Send result via SMS
 */
export const sendResultSMS = async (
  candidateName: string,
  candidatePhone: string,
  overallScore: number,
  status: 'recommended' | 'consider' | 'reject'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const statusMessage = {
      'recommended': 'Selamat! Anda lolos ke tahap berikutnya',
      'consider': 'Terima kasih telah mengikuti assessment',
      'reject': 'Terima kasih telah mengikuti assessment'
    }[status];

    const payload: NotificationPayload = {
      recipientPhone: candidatePhone,
      candidateName,
      candidateId: '', // Will be filled by the function
      channel: 'sms',
      type: 'result',
      data: {
        status,
        message: `${statusMessage}. Score: ${overallScore}/100`
      }
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error('Error sending result SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengirim SMS hasil'
    };
  }
};

/**
 * Send result via WhatsApp
 */
export const sendResultWhatsApp = async (
  candidateName: string,
  candidatePhone: string,
  scores: { logicScore: number; simulationScore: number; overallScore: number },
  status: 'recommended' | 'consider' | 'reject'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload: NotificationPayload = {
      recipientPhone: candidatePhone,
      candidateName,
      candidateId: '', // Will be filled by the function
      channel: 'whatsapp',
      type: 'result',
      data: {
        scores,
        status,
        message: `Hasil assessment Anda telah tersedia`
      }
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error('Error sending result WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengirim WhatsApp hasil'
    };
  }
};

/**
 * Log notification
 */
const logNotification = async (log: Omit<NotificationLog, 'id'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notification_logs')
      .insert([log]);

    if (error) throw error;
  } catch (error) {
    console.error('Error logging notification:', error);
  }
};

/**
 * Get notification history
 */
export const getNotificationHistory = async (candidateId: string): Promise<NotificationLog[]> => {
  try {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching notification history:', error);
    return [];
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStats = async (): Promise<{
  totalSent: number;
  totalFailed: number;
  byChannel: Record<NotificationChannel, number>;
}> => {
  try {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('channel, status');

    if (error) throw error;

    const stats = {
      totalSent: data?.filter(d => d.status === 'sent').length || 0,
      totalFailed: data?.filter(d => d.status === 'failed').length || 0,
      byChannel: {
        email: data?.filter(d => d.channel === 'email' && d.status === 'sent').length || 0,
        sms: data?.filter(d => d.channel === 'sms' && d.status === 'sent').length || 0,
        whatsapp: data?.filter(d => d.channel === 'whatsapp' && d.status === 'sent').length || 0
      }
    };

    return stats;
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    return {
      totalSent: 0,
      totalFailed: 0,
      byChannel: { email: 0, sms: 0, whatsapp: 0 }
    };
  }
};
