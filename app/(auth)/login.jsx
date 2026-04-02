import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/api';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Missing Fields', 'Please enter mobile number and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(mobile.trim(), password);
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        await AsyncStorage.setItem('krishitrace_token', token);
        await AsyncStorage.setItem('krishitrace_mobile', mobile.trim());
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to connect. Check your internet.';
      Alert.alert('Login Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo / Brand */}
        <View style={styles.brandArea}>
          <Text style={styles.logo}>🌾</Text>
          <Text style={styles.brandName}>KrishiTrace</Text>
          <Text style={styles.tagline}>Farm-to-Table Transparency</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your farmer account</Text>

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="9000000001"
            placeholderTextColor={Colors.textMuted}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkAccent}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer — demo credentials hint */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo Credentials</Text>
          <Text style={styles.demoText}>Mobile: 9000000001</Text>
          <Text style={styles.demoText}>Password: demo1234</Text>
        </View>

        <Text style={styles.footer}>Connecting to krishitrace-one.vercel.app</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },

  brandArea: { alignItems: 'center', marginBottom: 36 },
  logo:      { fontSize: 64, marginBottom: 8 },
  brandName: { fontSize: 32, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
  tagline:   { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  title:    { fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },

  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },

  linkBtn:    { alignItems: 'center', marginTop: 16 },
  linkText:   { color: Colors.textSecondary, fontSize: 14 },
  linkAccent: { color: Colors.primary, fontWeight: '600' },

  demoBox: {
    marginTop: 20,
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  demoTitle: { color: Colors.primary, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  demoText:  { color: Colors.textSecondary, fontSize: 12 },

  footer: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 16 },
});
