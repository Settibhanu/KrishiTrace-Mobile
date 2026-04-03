import React, { useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Dimensions, Platform, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

/**
 * VoiceAssistantButton is a global floating UI component.
 */
export default function VoiceAssistantButton() {
  const { t, i18n } = useTranslation();
  const {
    isActive, setIsActive,
    isProcessing,
    transcript, setTranscript,
    processCommand
  } = useVoiceAssistant();

  const widthAnim = useRef(new Animated.Value(60)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: isActive ? width * 0.75 : 60,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();

    if (isActive) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      inputRef.current?.blur();
    }
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleSubmit = () => {
    processCommand(transcript);
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View style={[styles.container, { width: widthAnim }]}>
        
        {isActive && !isProcessing && (
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={t('assistant.placeholder') || "Speak via Wispr Flow..."}
            placeholderTextColor={Colors.textMuted}
            value={transcript}
            onChangeText={setTranscript}
            onSubmitEditing={handleSubmit}
            autoFocus={true}
          />
        )}

        {isProcessing && (
          <View style={styles.processing}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.processingText}>{t('assistant.processing') || "Parsing..."}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.micBtn, isActive && styles.micBtnActive]} 
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name={isActive ? "close" : "microphone"} 
            size={28} 
            color={isActive ? Colors.textPrimary : "#fff"} 
          />
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 90, // Above tab bar
    left: 20,
    right: 20,
    alignItems: 'flex-start',
    zIndex: 9999,
  },
  container: {
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.bgCard,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  micBtnActive: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  processing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '700',
  }
});
