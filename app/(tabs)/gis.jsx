import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getGISData, getHarvests } from '../../services/api';
import { Colors } from '../../constants/Colors';

// Simple visual farm location card (no Google Maps key needed)
const FarmCard = ({ item }) => (
  <View style={styles.farmCard}>
    <View style={styles.farmDot} />
    <View style={styles.farmInfo}>
      <Text style={styles.farmCrop}>{item.cropType || item.crop || 'Crop'}</Text>
      <Text style={styles.farmAddress}>
        📍 {item.farmAddress || item.location || 'Location not set'}
      </Text>
      {item.farmLocation?.coordinates && (
        <Text style={styles.farmCoords}>
          🌐 {item.farmLocation.coordinates[1]?.toFixed(4)}, {item.farmLocation.coordinates[0]?.toFixed(4)}
        </Text>
      )}
    </View>
    <View style={[styles.statusDot, {
      backgroundColor: item.status === 'delivered' ? Colors.success :
                       item.status === 'in_transit' ? Colors.gold : Colors.blue,
    }]} />
  </View>
);

export default function GISScreen() {
  const router = useRouter();
  const [farms, setFarms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      // Try GIS endpoint, fall back to harvest records (they have farmAddress)
      const [gisRes, harvestRes] = await Promise.allSettled([
        getGISData(),
        getHarvests(),
      ]);

      let data = [];
      if (gisRes.status === 'fulfilled') {
        data = gisRes.value.data?.data || gisRes.value.data || [];
      }
      if (!data.length && harvestRes.status === 'fulfilled') {
        data = harvestRes.value.data?.data || harvestRes.value.data || [];
      }
      setFarms(data);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  // Group by location
  const locationGroups = farms.reduce((acc, farm) => {
    const loc = farm.farmAddress || farm.location || 'Unknown';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🗺️ GIS Farm Tracker</Text>
        <Text style={styles.subtitle}>Geographic farm & shipment locations</Text>
      </View>

      {/* Visual Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapBg}>🌍</Text>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapTitle}>Farm Location Map</Text>
          <Text style={styles.mapSubtitle}>{farms.length} farms tracked</Text>
          {/* Simulated farm pins */}
          <View style={styles.pinsRow}>
            {Object.entries(locationGroups).slice(0, 4).map(([loc, count]) => (
              <View key={loc} style={styles.pin}>
                <Text style={styles.pinEmoji}>📍</Text>
                <Text style={styles.pinLabel} numberOfLines={1}>{loc.split(',')[0]}</Text>
                <Text style={styles.pinCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Location Summary */}
      {Object.keys(locationGroups).length > 0 && (
        <>
          <Text style={styles.sectionLabel}>FARM LOCATIONS</Text>
          <View style={styles.locationsCard}>
            {Object.entries(locationGroups).map(([loc, count]) => (
              <View key={loc} style={styles.locRow}>
                <Text style={styles.locIcon}>📍</Text>
                <Text style={styles.locName}>{loc}</Text>
                <Text style={styles.locCount}>{count} batch{count > 1 ? 'es' : ''}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* All Records */}
      {farms.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>ALL FARM RECORDS</Text>
          {farms.map((item, i) => (
            <FarmCard key={item._id || i} item={item} />
          ))}
        </>
      )}

      {farms.length === 0 && (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>🗺️</Text>
          <Text style={styles.emptyText}>No farm locations yet.</Text>
          <Text style={styles.emptySubText}>
            Add your farm address during registration or when logging a harvest.
          </Text>
        </View>
      )}

      {/* Note */}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          💡 Full interactive map with satellite view available in the KrishiTrace Web App at krishitrace-one.vercel.app
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { paddingBottom: 60 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 16,
  },
  backBtn:  { marginBottom: 6 },
  backText: { color: Colors.primary, fontSize: 16 },
  title:    { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },

  // Map Placeholder
  mapPlaceholder: {
    marginHorizontal: 16, height: 200, borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#0d2137', marginBottom: 24, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  mapBg:      { position: 'absolute', fontSize: 120, opacity: 0.1 },
  mapOverlay: { width: '100%', alignItems: 'center', padding: 16 },
  mapTitle:   { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  mapSubtitle:{ color: Colors.primary, fontSize: 13, marginTop: 4, marginBottom: 16 },
  pinsRow:    { flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  pin:        { alignItems: 'center', backgroundColor: Colors.bgCard + 'cc', borderRadius: 12, padding: 8, minWidth: 64 },
  pinEmoji:   { fontSize: 20 },
  pinLabel:   { color: Colors.textSecondary, fontSize: 10, marginTop: 2, maxWidth: 60 },
  pinCount:   { color: Colors.primary, fontSize: 13, fontWeight: '700' },

  sectionLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, paddingHorizontal: 16, marginBottom: 10 },

  locationsCard: { marginHorizontal: 16, backgroundColor: Colors.bgCard, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 24 },
  locRow:   { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  locIcon:  { fontSize: 18, marginRight: 10 },
  locName:  { flex: 1, color: Colors.textPrimary, fontSize: 14 },
  locCount: { color: Colors.primary, fontSize: 13, fontWeight: '600' },

  farmCard: {
    marginHorizontal: 16, backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center',
  },
  farmDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, marginRight: 12 },
  farmInfo:   { flex: 1 },
  farmCrop:   { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', textTransform: 'capitalize' },
  farmAddress:{ color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  farmCoords: { color: Colors.textMuted, fontSize: 11, marginTop: 2, fontFamily: 'monospace' },
  statusDot:  { width: 8, height: 8, borderRadius: 4 },

  empty:       { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  emptyText:   { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: 12 },
  emptySubText:{ color: Colors.textSecondary, fontSize: 14, marginTop: 6, textAlign: 'center' },

  noteBox:  { margin: 16, backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border },
  noteText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
});
