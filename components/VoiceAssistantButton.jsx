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
export default function VoiceAssistantButton(props) {
  const { t, i18n } = useTranslation();
  const {
    isActive, setIsActive,
    isProcessing,
    transcript, setTranscript,
    processCommand
  } = useVoiceAssistant();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);

  // Use props from TabBar if available
  const isTabBar = props.isTabBar || !!props.onPress;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      inputRef.current?.blur();
    }
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
    // REMOVED: props.onPress(); - we prevent navigation to avoid the white blank screen
  };

  return (
    <TouchableOpacity 
      onPress={handleToggle}
      style={isTabBar ? [styles.tabContainer, props.style] : styles.outerContainer}
      activeOpacity={0.9}
    >
      {/* Hidden input to anchor the system keyboard for Wispr Flow */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={transcript}
        onChangeText={setTranscript}
        onSubmitEditing={() => processCommand(transcript)}
        autoFocus={false}
        blurOnSubmit={true}
      />

      <Animated.View style={[
        styles.micContainer, 
        isActive && styles.micActive,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <MaterialCommunityIcons 
            name={isActive ? "dots-horizontal" : "microphone"} 
            size={isTabBar ? 34 : 30} 
            color="#fff" 
          />
        )}
      </Animated.View>

      {isActive && (
        <View style={[styles.statusBox, isTabBar && styles.tabStatusBox]}>
          <Text style={styles.statusText}>
             {isProcessing ? t('assistant.processing') : t('assistant.listening') || 'Listening...'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    alignItems: 'center',
    zIndex: 9999,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    marginTop: -22,
  },
  micContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  micActive: {
    backgroundColor: Colors.blue,
    shadowColor: Colors.blue,
  },
  hiddenInput: {
    position: 'absolute',
    left: -1000, // Off-screen to avoid visual interference
    top: 0,
    width: 10,
    height: 10,
    opacity: 0.01,
  },
  statusBox: {
    backgroundColor: '#0a1628cc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    position: 'absolute',
    top: -40,
    width: 130,
    alignItems: 'center',
  },
  tabStatusBox: {
    top: -45,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  }
});
