import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Text } from 'react-native';

const TabIcon = ({ icon, focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}
    >
      {/* ── Visible Tabs ── */}
      <Tabs.Screen name="dashboard" options={{ title: 'Home',    tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }} />
      <Tabs.Screen name="harvest"   options={{ title: 'Harvest', tabBarIcon: ({ focused }) => <TabIcon icon="🌾" focused={focused} /> }} />
      <Tabs.Screen name="scan"      options={{ title: 'Scan QR', tabBarIcon: ({ focused }) => <TabIcon icon="📷" focused={focused} /> }} />
      <Tabs.Screen name="more"      options={{ title: 'More',    tabBarIcon: ({ focused }) => <TabIcon icon="⋯"  focused={focused} /> }} />
      <Tabs.Screen name="profile"   options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />

      {/* ── Hidden Tabs (navigable but not in tab bar) ── */}
      <Tabs.Screen name="market"  options={{ href: null }} />
      <Tabs.Screen name="ledger"  options={{ href: null }} />
      <Tabs.Screen name="iot"     options={{ href: null }} />
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="gis"     options={{ href: null }} />
    </Tabs>
  );
}
