import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { getReports } from '../../services/api';
import { Colors } from '../../constants/Colors';

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const CropRow = ({ item }) => {
  const rate = item.count > 0 ? ((item.compliantCount / item.count) * 100).toFixed(0) : 0;
  const color = rate >= 80 ? Colors.success : rate >= 50 ? Colors.gold : Colors.error;
  return (
    <View style={styles.cropRow}>
      <Text style={styles.cropName}>{item._id || 'Unknown'}</Text>
      <View style={styles.cropStats}>
        <Text style={styles.cropCount}>{item.count} {t?.('reports.records') || 'records'}</Text>
        <View style={[styles.rateBadge, { backgroundColor: color + '22' }]}>
          <Text style={[styles.rateText, { color }]}>{rate}%</Text>
        </View>
      </View>
    </View>
  );
};

export default function ReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      // /api/reports/summary requires fpo_admin/operator role
      // For other roles, fall back to fair-prices report
      const res = await getReports();
      setData(res.data);
    } catch (err) {
      if (err?.response?.status === 403) {
        setData({ restricted: true });
      }
    }
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
        <Text style={styles.title}>📊 {t('reports.title')}</Text>
        <Text style={styles.subtitle}>{t('reports.subtitle')}</Text>
      </View>

      {data?.restricted ? (
        <View style={styles.restrictedCard}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>🔒</Text>
          <Text style={styles.restrictedTitle}>{t('reports.req_title')}</Text>
          <Text style={styles.restrictedText}>
            {t('reports.req_sub')}
          </Text>
          <View style={styles.demoBox}>
            <Text style={styles.demoLabel}>{t('reports.demo_title')}</Text>
            <Text style={styles.demoCredentials}>{t('reports.demo_cred')}</Text>
          </View>
        </View>
      ) : data ? (
        <>
          {/* Summary Stats */}
          <Text style={styles.sectionLabel}>{t('reports.summary')}</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="📦" label={t('reports.total')}    value={data.total ?? '—'}             color={Colors.blue}    />
            <StatCard icon="✅" label={t('reports.compliant')} value={data.compliant ?? '—'}          color={Colors.success} />
            <StatCard icon="⚠️" label={t('reports.violations')} value={data.violations ?? '—'}         color={Colors.error}   />
            <StatCard icon="📈" label={t('reports.rate')}       value={`${data.complianceRate ?? 0}%`} color={Colors.gold}    />
          </View>

          {data.total > 0 && (
            <>
              <Text style={styles.sectionLabel}>{t('reports.overall')}</Text>
              <View style={styles.barCard}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, {
                    width: `${data.complianceRate || 0}%`,
                    backgroundColor: parseFloat(data.complianceRate) >= 80 ? Colors.success : Colors.gold,
                  }]} />
                </View>
                <Text style={styles.barText}>{data.complianceRate}% {t('reports.rate_sub')}</Text>
              </View>
            </>
          )}

          {data.byCrop?.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>{t('reports.by_crop')}</Text>
              <View style={styles.cropCard}>
                {data.byCrop.map((item, i) => (
                  <CropRow key={item._id || i} item={item} t={t} />
                ))}
              </View>
            </>
          )}

          {/* Violations */}
          {data.violationsList?.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>{t('reports.recent_viol')}</Text>
              {data.violationsList.slice(0, 5).map((v, i) => (
                <View key={v._id || i} style={[styles.violCard]}>
                  <Text style={styles.violCrop}>{v.cropType}</Text>
                  <Text style={styles.violMeta}>
                    ₹{v.payoutBreakdown?.farmerPayout}/kg · {v.farmerName || 'Unknown'}
                  </Text>
                  <Text style={styles.violDate}>
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-IN') : '—'}
                  </Text>
                </View>
              ))}
            </>
          )}
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>📊</Text>
          <Text style={styles.emptyText}>{t('reports.empty')}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { paddingBottom: 60 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 20,
  },
  backBtn:  { marginBottom: 6 },
  backText: { color: Colors.primary, fontSize: 16 },
  title:    { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },

  sectionLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, paddingHorizontal: 16, marginBottom: 10 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 24 },
  statCard:  {
    width: '47%', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statIcon:  { fontSize: 28, marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },

  barCard: { marginHorizontal: 16, marginBottom: 24 },
  barBg:   { height: 14, backgroundColor: Colors.bgInput, borderRadius: 99, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: '100%', borderRadius: 99 },
  barText: { color: Colors.textSecondary, fontSize: 13 },

  cropCard: { marginHorizontal: 16, backgroundColor: Colors.bgCard, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 24 },
  cropRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cropName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', textTransform: 'capitalize' },
  cropStats:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cropCount:    { color: Colors.textSecondary, fontSize: 12 },
  rateBadge:    { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  rateText:     { fontSize: 13, fontWeight: '700' },

  violCard:  { marginHorizontal: 16, backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.error + '44', marginBottom: 8 },
  violCrop:  { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', textTransform: 'capitalize' },
  violMeta:  { color: Colors.error, fontSize: 13, marginTop: 2 },
  violDate:  { color: Colors.textMuted, fontSize: 11, marginTop: 4 },

  restrictedCard: { margin: 20, backgroundColor: Colors.bgCard, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  restrictedTitle:{ color: Colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  restrictedText: { color: Colors.textSecondary, fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  demoBox:        { marginTop: 20, backgroundColor: Colors.primary + '15', borderRadius: 12, padding: 16, width: '100%', borderWidth: 1, borderColor: Colors.primary + '44' },
  demoLabel:      { color: Colors.primary, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  demoCredentials:{ color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  empty:     { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: 12 },
});
