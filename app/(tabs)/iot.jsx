import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getIoTReadings } from '../../services/api';
import { Colors } from '../../constants/Colors';

const ReadingCard = ({ item }) => {
  const hasAlert = item.alert;
  const alertColor = item.alertType === 'temperature' ? Colors.error : Colors.warning;

  return (
    <View style={[styles.card, hasAlert && { borderColor: alertColor }]}>
      {hasAlert && (
        <View style={[styles.alertBanner, { backgroundColor: alertColor + '22' }]}>
          <Text style={[styles.alertText, { color: alertColor }]}>
            ⚠️ {item.alertMessage}
          </Text>
        </View>
      )}
      <View style={styles.readingRow}>
        {/* Temperature */}
        <View style={styles.sensorBox}>
          <Text style={styles.sensorIcon}>🌡️</Text>
          <Text style={[styles.sensorValue, {
            color: item.alertType === 'temperature' ? Colors.error : Colors.textPrimary,
          }]}>
            {item.temperature != null ? `${item.temperature}°C` : '—'}
          </Text>
          <Text style={styles.sensorLabel}>Temperature</Text>
        </View>

        <View style={styles.sensorDivider} />

        {/* Humidity */}
        <View style={styles.sensorBox}>
          <Text style={styles.sensorIcon}>💧</Text>
          <Text style={[styles.sensorValue, {
            color: item.alertType === 'humidity' ? Colors.error : Colors.textPrimary,
          }]}>
            {item.humidity != null ? `${item.humidity}%` : '—'}
          </Text>
          <Text style={styles.sensorLabel}>Humidity</Text>
        </View>

        <View style={styles.sensorDivider} />

        {/* Intrusion */}
        <View style={styles.sensorBox}>
          <Text style={styles.sensorIcon}>🐗</Text>
          <Text style={[styles.sensorValue, {
            color: item.animalDetected ? Colors.error : Colors.success,
          }]}>
            {item.animalDetected ? 'ALERT' : 'SAFE'}
          </Text>
          <Text style={styles.sensorLabel}>Perimeter</Text>
        </View>
      </View>

      <Text style={styles.timestamp}>
        🕒 {item.timestamp ? new Date(item.timestamp).toLocaleString('en-IN') : '—'}
      </Text>
    </View>
  );
};

export default function IoTScreen() {
  const router = useRouter();
  const [readings, setReadings]   = useState([]);
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getIoTReadings();
      const data = res.data?.data || res.data || [];
      setReadings(Array.isArray(data) ? data : []);
      setAlerts(Array.isArray(data) ? data.filter(r => r.alert) : []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📡 IoT Sensor Data</Text>
        <Text style={styles.subtitle}>Temperature & humidity monitoring</Text>
      </View>

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <View style={styles.alertSummary}>
          <Text style={styles.alertSummaryText}>
            ⚠️ {alerts.length} active alert{alerts.length > 1 ? 's' : ''} — check readings below
          </Text>
        </View>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{readings.length}</Text>
          <Text style={styles.statLabel}>Total Readings</Text>
        </View>
        <View style={[styles.statBox, { borderColor: Colors.error }]}>
          <Text style={[styles.statValue, { color: Colors.error }]}>{alerts.length}</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
        <View style={[styles.statBox, { borderColor: Colors.success }]}>
          <Text style={[styles.statValue, { color: Colors.success }]}>{readings.length - alerts.length}</Text>
          <Text style={styles.statLabel}>Normal</Text>
        </View>
      </View>

      <FlatList
        data={readings}
        keyExtractor={(item, i) => item._id || String(i)}
        renderItem={({ item }) => <ReadingCard item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📡</Text>
            <Text style={styles.emptyText}>No IoT readings yet.</Text>
            <Text style={styles.emptySubText}>Connect sensors to your shipments to start monitoring.</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn:  { marginBottom: 6 },
  backText: { color: Colors.primary, fontSize: 16 },
  title:    { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },

  alertSummary: {
    margin: 16, backgroundColor: Colors.error + '20', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: Colors.error + '44',
  },
  alertSummaryText: { color: Colors.error, fontWeight: '700', fontSize: 13 },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 4 },
  statBox:  {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },

  card: {
    backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: Colors.border,
  },
  alertBanner:  { borderRadius: 8, padding: 10, marginBottom: 12 },
  alertText:    { fontWeight: '700', fontSize: 13 },
  readingRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sensorBox:    { alignItems: 'center', flex: 1 },
  sensorIcon:   { fontSize: 28, marginBottom: 4 },
  sensorValue:  { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  sensorLabel:  { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  sensorDivider:{ width: 1, backgroundColor: Colors.border, marginHorizontal: 4 },
  timestamp:    { color: Colors.textMuted, fontSize: 11, textAlign: 'center' },

  empty:       { alignItems: 'center', paddingTop: 80 },
  emptyText:   { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: 12 },
  emptySubText:{ color: Colors.textSecondary, fontSize: 14, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
});