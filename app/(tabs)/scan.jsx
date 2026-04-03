import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getQRData } from '../../services/api';
import { Colors } from '../../constants/Colors';
import blockchain from '../../services/blockchain';

const DEMO_BATCHES = {
  'HV-1': {
    crop: 'Tomato', quantity: 500, unit: 'kg', status: 'Verified',
    location: 'Kurnool, AP', harvestDate: '2024-03-15',
    farmerPayout: 30, finalConsumerPrice: 55,
    farmerName: 'Ramesh Reddy',
    farmerStory: '3rd generation farmer growing tomatoes using organic compost. Awarded Best Farmer in district 2023.',
    farmSize: '2 acres',
    farmingMethod: 'Organic',
  },
  'HV-2': {
    crop: 'Potato', quantity: 1000, unit: 'kg', status: 'In Transit',
    location: 'Mahbubnagar, TS', harvestDate: '2024-03-10',
    farmerPayout: 20, finalConsumerPrice: 35,
    farmerName: 'Venkatesh Rao',
    farmerStory: 'Traditional potato farmer using drip irrigation for 15 years. Supplies to local supermarkets.',
    farmSize: '5 acres',
    farmingMethod: 'Modern irrigation',
  },
  'HV-3': {
    crop: 'Onion', quantity: 750, unit: 'kg', status: 'Verified',
    location: 'Guntur, AP', harvestDate: '2024-03-18',
    farmerPayout: 25, finalConsumerPrice: 42,
    farmerName: 'Lakshmi Devi',
    farmerStory: 'Women farmer group leader. Using natural pesticides, reduced costs by 40%.',
    farmSize: '1.5 acres',
    farmingMethod: 'Natural pesticides',
  },
  'HV-4': {
    crop: 'Mango', quantity: 200, unit: 'kg', status: 'Verified',
    location: 'Kanyakumari, TN', harvestDate: '2024-04-01',
    farmerPayout: 80, finalConsumerPrice: 150,
    farmerName: 'Muthuswamy',
    farmerStory: 'Heritage mango orchard with 50-year-old trees. Export quality Alphonso variety.',
    farmSize: '10 acres',
    farmingMethod: 'Traditional',
  },
  'HV-5': {
    crop: 'Rice', quantity: 50, unit: 'quintal', status: 'Verified',
    location: 'Raichur, KA', harvestDate: '2024-02-28',
    farmerPayout: 2000, finalConsumerPrice: 3500,
    farmerName: 'Sharanappa Hiremath',
    farmerStory: 'Paddy specialist using System of Rice Intensification. 30% higher yield with less water.',
    farmSize: '8 acres',
    farmingMethod: 'SRI Method',
  },
};

const getDemoBatch = (id) => {
  if (DEMO_BATCHES[id]) return DEMO_BATCHES[id];
  if (id.match(/^HV-\d+$/)) {
    const crops = ['Tomato', 'Potato', 'Onion', 'Rice', 'Wheat', 'Maize', 'Mango', 'Banana'];
    const locations = ['Kurnool, AP', 'Hyderabad, TS', 'Guntur, AP', 'Raichur, KA', 'Madurai, TN'];
    const farmers = ['Ramesh Reddy', 'Venkatesh Rao', 'Lakshmi Devi', 'Muthuswamy', 'Sharanappa'];
    return {
      crop: crops[Math.floor(Math.random() * crops.length)],
      quantity: Math.floor(Math.random() * 500) + 100,
      unit: 'kg',
      status: 'Verified',
      location: locations[Math.floor(Math.random() * locations.length)],
      harvestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      farmerPayout: Math.floor(Math.random() * 50) + 20,
      finalConsumerPrice: Math.floor(Math.random() * 80) + 40,
      farmerName: farmers[Math.floor(Math.random() * farmers.length)],
      farmerStory: 'Experienced local farmer with generations of farming knowledge.',
      farmSize: Math.floor(Math.random() * 5 + 1) + ' acres',
      farmingMethod: 'Traditional',
    };
  }
  return null;
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [chainStatus, setChainStatus] = useState(null);

  useEffect(() => {
    blockchain.getChainStats().then(setChainStatus).catch(() => {});
  }, []);

  const handleBarcode = async ({ data }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    setScanning(false);

    const id = data.includes('/') ? data.split('/').pop() : data;

    const demoBatch = getDemoBatch(id);
    if (demoBatch) {
      const now = new Date().toISOString();
      setResult({
        ...demoBatch,
        ledger: { hash: id.slice(0, 8) + '...', timestamp: now, verifiedBy: 'KrishiTrace Authority' },
        iot: { temperature: Math.floor(Math.random() * 15) + 15, humidity: Math.floor(Math.random() * 30) + 50 },
      });
      setLoading(false);
      return;
    }

    try {
      const res = await getQRData(id);
      setResult(res.data?.data || res.data);
    } catch (err) {
      Alert.alert(
        'QR Error',
        err?.response?.status === 404
          ? 'Batch not found. This QR may not be from KrishiTrace.'
          : 'Failed to fetch trace data. Check your internet connection.',
        [{ text: 'OK', onPress: () => setScanned(false) }],
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <View style={styles.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.heroIcon}>📷</Text>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSubtitle}>KrishiTrace needs camera access to scan QR codes on harvest batches.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (result) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultIcon}>✅</Text>
          <Text style={styles.resultTitle}>Trace Found</Text>
          <Text style={styles.resultSubtitle}>Supply chain verified in KrishiTrace records</Text>
        </View>

        {chainStatus && (
          <View style={[
            styles.chainBanner,
            {
              backgroundColor: chainStatus.isValid ? Colors.success + '15' : Colors.error + '15',
              borderColor: chainStatus.isValid ? Colors.success + '40' : Colors.error + '40',
            },
          ]}
          >
            <Text style={styles.chainIcon}>{chainStatus.isValid ? '✅' : '❌'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.chainTitle, { color: chainStatus.isValid ? Colors.success : Colors.error }]}>
                {chainStatus.isValid ? 'Blockchain Verified' : 'Chain Integrity Broken'}
              </Text>
              <Text style={styles.chainSub}>
                {chainStatus.totalBlocks} blocks · {chainStatus.harvestBlocks} harvests on chain
              </Text>
            </View>
          </View>
        )}

        <Section title="Crop Information">
          <Row label="Crop" value={result.cropType || result.crop || '—'} />
          <Row label="Quantity" value={`${result.quantity || '—'} ${result.unit || 'kg'}`} />
          <Row label="Status" value={result.status || '—'} highlight />
        </Section>

        <Section title="Origin">
          <Row label="Location" value={result.location || '—'} />
          <Row label="Harvest Date" value={result.harvestDate ? new Date(result.harvestDate).toDateString() : '—'} />
        </Section>

        {result.farmerName && (
          <Section title="Farmer Information">
            <Row label="Farmer" value={result.farmerName || '—'} />
            <Row label="Farm Size" value={result.farmSize || '—'} />
            <Row label="Method" value={result.farmingMethod || '—'} />
            {result.farmerStory && (
              <View style={[styles.farmerStoryBox, { marginTop: 8 }]}>
                <Text style={styles.farmerStoryLabel}>📖 Story</Text>
                <Text style={styles.farmerStoryText}>{result.farmerStory}</Text>
              </View>
            )}
          </Section>
        )}

        {result.ledger && (
          <Section title="Ledger">
            <Row label="Block Hash" value={result.ledger.hash || '—'} mono />
            <Row label="Timestamp" value={result.ledger.timestamp ? new Date(result.ledger.timestamp).toLocaleString() : '—'} />
            <Row label="Verified By" value={result.ledger.verifiedBy || '—'} />
          </Section>
        )}

        {result.iot && (
          <Section title="IoT Sensor Data">
            <Row label="Temperature" value={result.iot.temperature ? `${result.iot.temperature}°C` : '—'} />
            <Row label="Humidity" value={result.iot.humidity ? `${result.iot.humidity}%` : '—'} />
          </Section>
        )}

        <TouchableOpacity
          style={styles.scanAgainBtn}
          onPress={() => { setResult(null); setScanned(false); setScanning(true); }}
        >
          <Text style={styles.scanAgainText}>Scan Another QR</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (scanning) {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcode}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>Point camera at a KrishiTrace QR code</Text>
        </View>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.scanHint}>Fetching trace data...</Text>
          </View>
        )}
        <TouchableOpacity style={styles.cancelScanBtn} onPress={() => setScanning(false)}>
          <Text style={styles.cancelScanText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.heroIcon}>📷</Text>
      <Text style={styles.scanTitle}>QR Trace Scanner</Text>
      <Text style={styles.scanSubtitle}>
        Scan any KrishiTrace QR code to view the full farm-to-table supply chain trace.
      </Text>
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Farmer tip</Text>
        <Text style={styles.tipText}>
          Use this at mandi pickup or delivery time to quickly confirm crop history and trust.
        </Text>
      </View>
      <TouchableOpacity style={styles.startBtn} onPress={() => setScanning(true)}>
        <Text style={styles.startBtnText}>Start Scanning</Text>
      </TouchableOpacity>
    </View>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Row = ({ label, value, highlight, mono }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text
      style={[
        styles.rowValue,
        highlight && { color: Colors.primary },
        mono && { fontFamily: 'monospace', fontSize: 11 },
      ]}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg, padding: 32 },
  resultContent: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  heroIcon: { fontSize: 80, marginBottom: 8 },
  permTitle: { color: Colors.textPrimary, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  permSubtitle: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  permBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  scanTitle: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  scanSubtitle: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 22, marginBottom: 20 },
  tipCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 22,
  },
  tipTitle: { color: Colors.primary, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  tipText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 4 },
  startBtn: { backgroundColor: Colors.primary, paddingHorizontal: 48, paddingVertical: 16, borderRadius: 14 },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 240,
    height: 240,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  scanHint: { color: '#fff', fontWeight: '600', textAlign: 'center', marginTop: 8 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' },
  cancelScanBtn: { position: 'absolute', top: 56, right: 20, backgroundColor: '#00000088', borderRadius: 20, padding: 10 },
  cancelScanText: { color: '#fff', fontWeight: '700' },
  resultHeader: { alignItems: 'center', marginBottom: 28 },
  resultIcon: { fontSize: 52, marginBottom: 8 },
  resultTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  resultSubtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  sectionCard: { backgroundColor: Colors.bgCard, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', paddingBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { color: Colors.textSecondary, fontSize: 13, flex: 1 },
  rowValue: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600', flex: 2, textAlign: 'right', flexWrap: 'wrap' },
  farmerStoryBox: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  farmerStoryLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', marginBottom: 4 },
  farmerStoryText: { color: Colors.textSecondary, fontSize: 11, lineHeight: 16 },
  scanAgainBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  scanAgainText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  chainBanner: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 20 },
  chainIcon: { fontSize: 24, marginRight: 10 },
  chainTitle: { fontSize: 15, fontWeight: '700' },
  chainSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
});
