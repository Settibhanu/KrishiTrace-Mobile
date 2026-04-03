import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import nluService from '../services/nluService';
import ttsService from '../services/ttsService';
import harvestVoiceParser from '../utils/harvestVoiceParser';
import { useTranslation } from 'react-i18next';

/**
 * useVoiceAssistant provides the core logic for the global assistant.
 */
export function useVoiceAssistant() {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');

  const lang = (i18n.language || 'en').split('-')[0];

  const processCommand = useCallback(async (text) => {
    if (!text || text.trim().length < 2) return;

    setIsProcessing(true);
    const result = nluService.classify(text, lang);

    switch (result.intent) {
      case 'NAVIGATE':
        ttsService.speak(t('assistant.navigating', { screen: result.data.path.split('/').pop() }), lang);
        router.push(result.data.path);
        break;

      case 'MARKET_QUERY':
        ttsService.speak(t('assistant.checking_market'), lang);
        router.push('/(tabs)/market');
        break;

      case 'HARVEST_ENTRY':
        const parsed = harvestVoiceParser.parse(text, lang);
        if (parsed.cropType) {
          ttsService.speak(t('assistant.found_harvest', { crop: parsed.cropType }), lang);
          router.push({
            pathname: '/(tabs)/harvest',
            params: { ...parsed, voiceTrigger: 'true' }
          });
        } else {
          router.push('/(tabs)/harvest');
        }
        break;

      default:
        // Optional: Could fall back to chatbot/search
        break;
    }

    setTranscript('');
    setIsActive(false);
    setIsProcessing(false);
  }, [lang, router]);

  // Auto-submit after 1.5s of silence
  useEffect(() => {
    if (isActive && transcript.trim().length > 0) {
      const timer = setTimeout(() => {
        processCommand(transcript);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [transcript, isActive, processCommand]);

  return {
    isActive,
    setIsActive,
    isProcessing,
    transcript,
    setTranscript,
    processCommand,
  };
}
