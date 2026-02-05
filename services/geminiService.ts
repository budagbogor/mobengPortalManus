
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Sender, AnalysisResult, AssessmentScores, CandidateProfile, BigFiveTraits } from "../types";
import { getActiveApiKey, updateApiKeyMetadata } from "./apiKeyManager";

/**
 * API Provider Type
 */
export type APIProvider = 'gemini' | 'openrouter';

/**
 * Get current API provider and key
 */
export const getAPIProvider = (): { provider: APIProvider; key: string } => {
  const geminiKey = getActiveApiKey();
  
  if (geminiKey) {
    return { provider: 'gemini', key: geminiKey };
  }
  
  // Fallback to OpenRouter
  const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
  return { provider: 'openrouter', key: openrouterKey };
};

/**
 * Get or create Gemini AI instance with current API key
 */
const getGeminiInstance = () => {
  const apiKey = getActiveApiKey();
  
  if (!apiKey) {
    throw new Error('API Key Gemini belum dikonfigurasi. Menggunakan fallback OpenRouter.');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Send message to OpenRouter API
 */
const sendMessageToOpenRouter = async (
  history: Message[],
  latestUserMessage: string,
  systemInstruction: string
): Promise<{ text: string; analysis: AnalysisResult | null }> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
  
  try {
    const messages = [
      ...history.map(msg => ({
        role: msg.sender === Sender.USER ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: latestUserMessage }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Mobeng Recruitment Portal'
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [
          { role: 'system', content: systemInstruction },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    // Extract JSON analysis if present
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    let analysis: AnalysisResult | null = null;
    let cleanText = responseText;

    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[1]);
        cleanText = responseText.replace(/```json[\s\S]*?```/g, '').trim();
      } catch (e) {
        console.error('Failed to parse JSON analysis:', e);
      }
    }

    return { text: cleanText, analysis };
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    throw error;
  }
};

export const sendMessageToGemini = async (
  history: Message[],
  latestUserMessage: string,
  systemInstruction: string 
): Promise<{ text: string; analysis: AnalysisResult | null }> => {
  const { provider, key } = getAPIProvider();

  try {
    if (provider === 'openrouter') {
      return await sendMessageToOpenRouter(history, latestUserMessage, systemInstruction);
    }

    // Use Gemini
    const ai = getGeminiInstance();
    
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction
    });

    // Convert history to Gemini format
    const contents = history.map(msg => ({
      role: msg.sender === Sender.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add latest message
    contents.push({
      role: 'user',
      parts: [{ text: latestUserMessage }]
    });

    const result = await model.generateContent({
      contents: contents
    });

    const responseText = result.response.text();
    
    // Extract JSON analysis if present
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    let analysis: AnalysisResult | null = null;
    let cleanText = responseText;

    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[1]);
        cleanText = responseText.replace(/```json[\s\S]*?```/g, '').trim();
      } catch (e) {
        console.error('Failed to parse JSON analysis:', e);
      }
    }

    // Update API key metadata
    updateApiKeyMetadata(key, { lastUsed: new Date().toISOString() });

    return { text: cleanText, analysis };
  } catch (error) {
    console.error('Error sending message:', error);
    
    // If Gemini fails, try OpenRouter
    if (provider === 'gemini') {
      console.log('Gemini failed, falling back to OpenRouter...');
      try {
        return await sendMessageToOpenRouter(history, latestUserMessage, systemInstruction);
      } catch (fallbackError) {
        console.error('OpenRouter fallback also failed:', fallbackError);
        throw new Error('Kedua AI provider gagal. Silakan coba lagi nanti.');
      }
    }
    
    throw error;
  }
};

export const generateFinalSummary = async (
  profile: CandidateProfile,
  scores: AssessmentScores,
  feedback: string,
  roleLabel: string
): Promise<{ summary: string; recommendation: string }> => {
  const { provider } = getAPIProvider();

  try {
    const prompt = `
    Berdasarkan data kandidat berikut, buatlah ringkasan profesional dan rekomendasi:

    **Profil Kandidat:**
    - Nama: ${profile.name}
    - Jurusan: ${profile.major}
    - Posisi: ${roleLabel}

    **Skor Assessment:**
    - Logic Score: ${scores.logicScore}/100
    - Simulation Score: ${scores.simulationScore}/100
    - Overall Score: ${scores.overallScore}/100

    **Feedback dari Simulasi:**
    ${feedback}

    Berikan:
    1. Ringkasan singkat (2-3 kalimat) tentang performa kandidat
    2. Rekomendasi: "RECOMMENDED", "CONSIDER", atau "REJECT"

    Format response sebagai JSON:
    {
      "summary": "...",
      "recommendation": "RECOMMENDED|CONSIDER|REJECT"
    }
    `;

    let responseText: string;

    if (provider === 'openrouter') {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Mobeng Recruitment Portal'
        },
        body: JSON.stringify({
          model: 'google/gemma-3-27b-it:free',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('OpenRouter API error');
      }

      const data = await response.json();
      responseText = data.choices[0].message.content;
    } else {
      const ai = getGeminiInstance();
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    }

    try {
      const parsed = JSON.parse(responseText);
      return {
        summary: parsed.summary || 'Tidak ada ringkasan',
        recommendation: parsed.recommendation || 'CONSIDER'
      };
    } catch (e) {
      // Fallback if JSON parsing fails
      return {
        summary: responseText,
        recommendation: scores.overallScore >= 70 ? 'RECOMMENDED' : scores.overallScore >= 50 ? 'CONSIDER' : 'REJECT'
      };
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Fallback response
    return {
      summary: 'Tidak dapat membuat ringkasan. Silakan coba lagi.',
      recommendation: scores.overallScore >= 70 ? 'RECOMMENDED' : scores.overallScore >= 50 ? 'CONSIDER' : 'REJECT'
    };
  }
};

export const analyzePerformance = async (
  feedback: string,
  scores: AssessmentScores
): Promise<BigFiveTraits> => {
  const { provider } = getAPIProvider();

  try {
    const prompt = `
    Analisis feedback simulasi berikut dan berikan skor Big Five Personality Traits (0-100):

    Feedback: ${feedback}
    Logic Score: ${scores.logicScore}/100
    Simulation Score: ${scores.simulationScore}/100

    Berikan response sebagai JSON dengan format:
    {
      "openness": 0-100,
      "conscientiousness": 0-100,
      "extraversion": 0-100,
      "agreeableness": 0-100,
      "neuroticism": 0-100
    }
    `;

    let responseText: string;

    if (provider === 'openrouter') {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Mobeng Recruitment Portal'
        },
        body: JSON.stringify({
          model: 'google/gemma-3-27b-it:free',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('OpenRouter API error');
      }

      const data = await response.json();
      responseText = data.choices[0].message.content;
    } else {
      const ai = getGeminiInstance();
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      // Fallback traits
      return {
        openness: 50,
        conscientiousness: scores.logicScore,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50
      };
    }
  } catch (error) {
    console.error('Error analyzing performance:', error);
    
    // Fallback traits
    return {
      openness: 50,
      conscientiousness: scores.logicScore,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    };
  }
};
