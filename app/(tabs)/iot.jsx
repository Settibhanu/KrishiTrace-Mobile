import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getIoTReadings } from '../../services/api';

const ReadingCard = ({ item }) => {
  const isAlert = item.alert;
  
  return (
    <View style={[styles.card, isAlert && styles.alertCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chip" size={24} color={isAlert ? "#ef4444" : "#4ade80"} />
          <Text style={styles.nodeId}>Sensor Node {item._id.slice(-4).toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>

      <View style={styles.readingRow}>
        <View style={styles.sensorBox}>
          <Text style={styles.sensorLabel}>TEMPERATURE</Text>
          <Text style={[styles.sensorValue, isAlert && styles.alertText]}>
            {item.temperature !== null ? `${item.temperature.toFixed(1)}°C` : 'N/A'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.sensorBox}>
          <Text style={styles.sensorLabel}>HUMIDITY</Text>
          <Text style={[styles.sensorValue, isAlert && styles.alertText]}>
            {item.humidity !== null ? `${item.humidity.toFixed(1)}%` : 'N/A'}
          </Text>
        </View>
      </View>

      {isAlert && (
        <View style={styles.alertContainer}>
          <MaterialCommunityIcons name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.alertMessage}>{item.alertMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default function IoTSensorData() {
  const [readings, setReadings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const response = await getIoTReadings();
      setReadings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching IoT readings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>IoT Sensor Data</Text>
        <Text style={styles.subtitle}>Real-time farm environment monitoring</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#4ade80" />}
      >
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{readings.length}</Text>
            <Text style={styles.statLabel}>Total Readings</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{readings.filter(r => r.alert).length}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
        </View>

        {readings.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="database-off" size={64} color="#334155" />
            <Text style={styles.emptyText}>No sensor data received yet</Text>
          </View>
        ) : (
          readings.map((item) => (
            <ReadingCard key={item._id} item={item} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc' },
  subtitle: { fontSize: 16, color: '#94a3b8', marginTop: 4 },
  scrollContent: { padding: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: '#1e293b', width: '48%', padding: 16, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4ade80' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  alertCard: { borderColor: '#ef4444', backgroundColor: '#1e1b1b' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconContainer: { flexDirection: 'row', alignItems: 'center' },
  nodeId: { color: '#f8fafc', fontSize: 16, fontWeight: '600', marginLeft: 10 },
  timestamp: { color: '#94a3b8', fontSize: 12 },
  readingRow: { flexDirection: 'row', alignItems: 'center' },
  sensorBox: { flex: 1, alignItems: 'center' },
  sensorLabel: { color: '#94a3b8', fontSize: 10, letterSpacing: 1 },
  sensorValue: { color: '#f8fafc', fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  divider: { width: 1, height: 40, backgroundColor: '#334155' },
  alertContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8 },
  alertMessage: { color: '#ef4444', fontSize: 12, marginLeft: 8 },
  alertText: { color: '#ef4444' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94a3b8', marginTop: 16, fontSize: 16 }
});
