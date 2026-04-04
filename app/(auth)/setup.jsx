import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { updateProfile } from '../../services/api';
import { Colors } from '../../constants/Colors';

const KARNATAKA_SEASONAL_CROPS = [
  { id: 'mango', name: 'Mango (ಮಾವಿನ ಹಣ್ಣು)', emoji: '🥭', description: 'Peak harvest in Kolar / Ramanagara' },
  { id: 'sugarcane', name: 'Sugarcane (ಕಬ್ಬು)', emoji: '🎋', description: 'Major crop in Mandya / Belagavi' },
  { id: 'paddy', name: 'Summer Paddy (ಭತ್ತ)', emoji: '🌾', description: 'Grown in Raichur / Bellary regions' },
  { id: 'chilli', name: 'Byadagi Chilli (ಮೆಣಸಿನಕಾಯಿ)', emoji: '🌶️', description: 'Iconic Haveri region specialty' },
  { id: 'coffee', name: 'Coffee (ಕಾಫಿ)', emoji: '☕', description: 'Harvesting in Chikmagalur / Kodagu' },
  { id: 'ragi', name: 'Ragi (ರಾಗಿ)', emoji: '🌾', description: 'Staple crop of Southern Karnataka' },
  { id: 'onion', name: 'Onion (ಈರುಳ್ಳಿ)', emoji: '🧅', description: 'Grown extensively in Chitradurga' },
];

export default function SetupScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleCrop = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selected.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one crop to personalize your experience.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ growingCrops: selected });
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      Alert.alert('Setup Error', 'Unable to save your preferences. You can update them later in settings.');
      router.replace('/(tabs)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🏷️</Text>
          <Text style={styles.title}>Personalize Your Farm</Text>
          <Text style={styles.subtitle}>
            It's April in Karnataka. What crops are you currently growing or tracking?
          </Text>
        </View>

        <View style={styles.grid}>
          {KARNATAKA_SEASONAL_CROPS.map((crop) => {
            const isSelected = selected.includes(crop.id);
            return (
              <TouchableOpacity
                key={crop.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleCrop(crop.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{crop.emoji}</Text>
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </View>
                <Text style={[styles.cardName, isSelected && styles.cardNameActive]}>
                  {crop.name}
                </Text>
                <Text style={styles.cardDesc}>{crop.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.btn, selected.length === 0 && styles.btnDisabled]} 
          onPress={handleFinish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Start My Journey</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipBtn} 
          onPress={() => router.replace('/(tabs)/dashboard')}
          disabled={loading}
        >
          <Text style={styles.skipText}>I'll do this later</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  emoji: { fontSize: 50, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  grid: { gap: 12, marginBottom: 32 },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardEmoji: { fontSize: 32 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '900' },
  cardName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  cardNameActive: { color: Colors.primary },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  skipBtn: { alignItems: 'center', marginTop: 20 },
  skipText: { color: Colors.textMuted, fontSize: 15, fontWeight: '600' },
});
