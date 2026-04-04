import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/Colors';

const SAMPLE_BATCHES = [
  {
    id: 'HV-1',
    cropType: 'Tomato',
    quantity: 500,
    unit: 'kg',
    status: 'Verified',
    location: 'Kurnool, AP',
    harvestDate: '2024-03-15',
    farmerPayout: 30,
    finalConsumerPrice: 55,
    farmerName: 'Ramesh Reddy',
    farmerStory: '3rd generation farmer growing tomatoes using organic compost. Awarded Best Farmer in district 2023.',
    farmSize: '2 acres',
    farmingMethod: 'Organic',
  },
  {
    id: 'HV-2',
    cropType: 'Potato',
    quantity: 1000,
    unit: 'kg',
    status: 'In Transit',
    location: 'Mahbubnagar, TS',
    harvestDate: '2024-03-10',
    farmerPayout: 20,
    finalConsumerPrice: 35,
    farmerName: 'Venkatesh Rao',
    farmerStory: 'Traditional potato farmer using drip irrigation for 15 years. Supplies to local supermarkets.',
    farmSize: '5 acres',
    farmingMethod: 'Modern irrigation',
  },
  {
    id: 'HV-3',
    cropType: 'Onion',
    quantity: 750,
    unit: 'kg',
    status: 'Verified',
    location: 'Guntur, AP',
    harvestDate: '2024-03-18',
    farmerPayout: 25,
    finalConsumerPrice: 42,
    farmerName: 'Lakshmi Devi',
    farmerStory: 'Women farmer group leader. Using natural pesticides, reduced costs by 40%.',
    farmSize: '1.5 acres',
    farmingMethod: 'Natural pesticides',
  },
  {
    id: 'HV-4',
    cropType: 'Mango',
    quantity: 200,
    unit: 'kg',
    status: 'Verified',
    location: 'Kanyakumari, TN',
    harvestDate: '2024-04-01',
    farmerPayout: 80,
    finalConsumerPrice: 150,
    farmerName: 'Muthuswamy',
    farmerStory: 'Heritage mango orchard with 50-year-old trees. Export quality Alphonso variety.',
    farmSize: '10 acres',
    farmingMethod: 'Traditional',
  },
  {
    id: 'HV-5',
    cropType: 'Rice',
    quantity: 50,
    unit: 'quintal',
    status: 'Verified',
    location: 'Raichur, KA',
    harvestDate: '2024-02-28',
    farmerPayout: 2000,
    finalConsumerPrice: 3500,
    farmerName: 'Sharanappa Hiremath',
    farmerStory: 'Paddy specialist using System of Rice Intensification. 30% higher yield with less water.',
    farmSize: '8 acres',
    farmingMethod: 'SRI Method',
  },
];

export default function QRGeneratorScreen() {
  const { t } = useTranslation();
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('qr.title')}</Text>
        <Text style={styles.subtitle}>
          {t('qr.subtitle')}
        </Text>
      </View>

      <ScrollView contentContainer={styles.content}>
        <Text style={styles.sectionTitle}>{t('qr.sample_title')}</Text>
        <Text style={styles.sectionDesc}>
          {t('qr.sample_sub')}
        </Text>

        {SAMPLE_BATCHES.map((batch) => (
          <TouchableOpacity
            key={batch.id}
            style={styles.batchCard}
            onPress={() => handleBatchSelect(batch)}
          >
            <View style={styles.batchHeader}>
              <View style={styles.cropIconContainer}>
                <Text style={styles.cropIcon}>
                  {getCropEmoji(batch.cropType)}
                </Text>
              </View>
              <View style={styles.batchInfo}>
                <Text style={styles.batchId}>{batch.id}</Text>
                <Text style={styles.batchCrop}>{batch.cropType}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{batch.status}</Text>
              </View>
            </View>
            <View style={styles.batchDetails}>
              <Text style={styles.detailText}>
                📍 {batch.location}
              </Text>
              <Text style={styles.detailText}>
                ⚖️ {batch.quantity} {batch.unit}
              </Text>
              <Text style={styles.detailText}>
                📅 {new Date(batch.harvestDate).toDateString()}
              </Text>
            </View>
            <View style={styles.generateBtn}>
              <Text style={styles.generateBtnText}>{t('qr.gen_btn')} →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedBatch}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedBatch(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBatch && (
              <>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedBatch(null)}
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>{t('qr.modal_title')}</Text>
                <Text style={styles.modalSubtitle}>
                  {t('qr.batch_info')}: {selectedBatch.id}
                </Text>

                <View style={styles.qrContainer}>
                  <QRCode
                    value={selectedBatch.id}
                    size={200}
                    backgroundColor="white"
                    color="black"
                  />
                </View>

                <View style={styles.qrDataInfo}>
                  <Text style={styles.dataLabel}>{t('qr.modal_sub')}</Text>
                  <Text style={styles.dataValue}>{selectedBatch.id}</Text>
                </View>

                <View style={styles.traceInfo}>
                  <Text style={styles.traceTitle}>When scanned, shows:</Text>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>🌾 Crop:</Text>
                    <Text style={styles.traceValue}>{selectedBatch.cropType}</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>⚖️ Quantity:</Text>
                    <Text style={styles.traceValue}>{selectedBatch.quantity} {selectedBatch.unit}</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>📍 Location:</Text>
                    <Text style={styles.traceValue}>{selectedBatch.location}</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>📅 Harvest:</Text>
                    <Text style={styles.traceValue}>{new Date(selectedBatch.harvestDate).toDateString()}</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>💰 Farmer Payout:</Text>
                    <Text style={styles.traceValue}>₹{selectedBatch.farmerPayout}/kg</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>🏷️ Consumer Price:</Text>
                    <Text style={styles.traceValue}>₹{selectedBatch.finalConsumerPrice}/kg</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>🌡️ IoT Temp:</Text>
                    <Text style={styles.traceValue}>{selectedBatch.iot?.temperature ?? '28'}°C</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>💧 IoT Humidity:</Text>
                    <Text style={styles.traceValue}>{selectedBatch.iot?.humidity ?? '65'}%</Text>
                  </View>
                  <View style={styles.traceRow}>
                    <Text style={styles.traceLabel}>⛓️ Blockchain:</Text>
                    <Text style={styles.traceValue}>✓ Verified</Text>
                  </View>
                </View>

                <Text style={styles.scanHint}>
                  📱 Scan this QR using the KrishiTrace Scan tab to see full traceability details
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getCropEmoji(crop) {
  const emojis = {
    Tomato: '🍅',
    Potato: '🥔',
    Onion: '🧅',
    Mango: '🥭',
    Rice: '🌾',
    Wheat: '🌾',
    Maize: '🌽',
    Banana: '🍌',
    Sugarcane: '🎋',
  };
  return emojis[crop] || '🌱';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  batchCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 24,
  },
  batchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  batchId: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  batchCrop: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  batchDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  generateBtn: {
    backgroundColor: Colors.primary + '15',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  qrDataInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dataLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'monospace',
  },
  traceInfo: {
    width: '100%',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  traceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  traceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  traceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  traceValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  scanHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});