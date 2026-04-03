import * as Speech from 'expo-speech';

/**
 * ttsService handles all spoken feedback in the app.
 */
const ttsService = {
  /**
   * Speak a message in the specified language.
   * @param {string} text 
   * @param {string} lang e.g., 'en', 'hi', 'te', 'kn', 'ta'
   */
  speak: async (text, lang = 'en') => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      // Map app codes to BCP 47 language tags
      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
      };

      await Speech.speak(text, {
        language: langMap[lang] || 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('TTS Service Error:', error);
    }
  },

  /**
   * Stop any current speech.
   */
  stop: async () => {
    await Speech.stop();
  }
};

export default ttsService;
