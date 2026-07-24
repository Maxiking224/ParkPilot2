import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#276EF1',
        tabBarInactiveTintColor: '#94A3B8',

        tabBarStyle: {
          height: 66 + insets.bottom,
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 9),
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E7EDF3',
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Start',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="offer"
        options={{
          title: 'Anbieten',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="car"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Karte',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="map-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}