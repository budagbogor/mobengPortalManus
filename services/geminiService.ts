
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Sender, AnalysisResult, AssessmentScores, CandidateProfile, BigFiveTraits } from "../types";
import { getActiveApiKey, updateApiKeyMetadata } from "./apiKeyManager";

/**
 * Get or create Gemini AI instance with current API key
 */
const getGeminiInstance = () => {
  const apiKey = getActiveApiKey();
  
  if (!apiKey) {
    throw new Error('API Key Gemini belum dikonfigurasi. Silakan atur API Key di Pengaturan.');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const sendMessageToGemini = async (
  history: Message[],
  latestUserMessage: string,
  systemInstruction: string 
): Promise<{ text: string; analysis: AnalysisResult | null }> => {
  try {
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
    updateApiKeyMetadata(getActiveApiKey() || '', { lastUsed: new Date().toISOString() });

    return { text: cleanText, analysis };
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('API Key tidak valid. Silakan periksa kembali di Pengaturan.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Terlalu banyak request. Silakan coba lagi dalam beberapa saat.');
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
  try {
    const ai = getGeminiInstance();
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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
  try {
    const ai = getGeminiInstance();
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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
