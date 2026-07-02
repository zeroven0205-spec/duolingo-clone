/**
 * Web Speech API based pronunciation evaluation
 *
 * Uses the browser's native Web Speech API for speech recognition.
 * Falls back gracefully if the API is not available.
 */

export interface Speech评估结果 {
  score: number; // 0-100
  transcript: string;
  feedback: string;
  isGood: boolean;
}

export interface Speech评估选项 {
  expectedText: string;
  language?: string; // BCP-47 language tag, e.g., "en-US", "es-ES"
  continuous?: boolean;
}

/**
 * Check if Web Speech API is available in the current browser
 */
export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window
  );
}

/**
 * Calculate similarity between two strings (Levenshtein-based)
 * Returns a value between 0 and 1
 */
export function 计算文本相似度(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const maxLen = Math.max(s1.length, s2.length);
  return 1 - matrix[s1.length][s2.length] / maxLen;
}

/**
 * Get feedback message based on score
 */
export function 获取反馈(score: number): { feedback: string; isGood: boolean } {
  if (score >= 90) {
    return { feedback: "Excellent! 🎉 Your pronunciation is perfect!", isGood: true };
  } else if (score >= 80) {
    return { feedback: "Great job! 👍 Almost there!", isGood: true };
  } else if (score >= 70) {
    return { feedback: "Good effort! 💪 Keep practicing.", isGood: true };
  } else if (score >= 50) {
    return { feedback: "Getting there... 🔄 Try again slowly.", isGood: false };
  } else {
    return { feedback: "Keep practicing! 📚 Listen and repeat.", isGood: false };
  }
}

/**
 * Create a speech recognition instance
 */
export function createSpeechRecognition(
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  language: string = "en-US"
): any {
  if (!isSpeechRecognitionAvailable()) {
    onError("Speech recognition not available in this browser");
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error);
  };

  return recognition;
}

/**
 * Start speech recognition for pronunciation evaluation
 * Returns a promise that resolves with the evaluation result
 */
export async function 评估发音(
  expectedText: string,
  language: string = "en-US"
): Promise<Speech评估结果> {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionAvailable()) {
      reject(new Error("Speech recognition not available"));
      return;
    }

    const recognition = createSpeechRecognition(
      (transcript) => {
        const similarity = 计算文本相似度(expectedText, transcript);
        const score = Math.round(similarity * 100);
        const { feedback, isGood } = 获取反馈(score);

        resolve({
          score,
          transcript,
          feedback,
          isGood,
        });
      },
      (error) => {
        reject(new Error(`Speech recognition error: ${error}`));
      },
      language
    );

    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        reject(new Error("Failed to start speech recognition"));
      }
    }
  });
}

/**
 * For server-side evaluation (when speech recording is sent as audio)
 * This would integrate with a proper speech-to-text API
 */
export async function 评估音频发音(
  expectedText: string,
  audioBlob: Blob,
  language: string = "en-US"
): Promise<Speech评估结果> {
  // In a production app, this would:
  // 1. Convert blob to audio buffer
  // 2. Send to a speech-to-text API (e.g., Whisper, Google Speech-to-Text)
  // 3. Compare the transcript with expected text
  // 4. Return evaluation result

  // For now, return a placeholder that requires client-side Web Speech API
  throw new Error(
    "Server-side audio evaluation requires a speech-to-text API integration"
  );
}

/**
 * Web Speech API type augmentations
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
