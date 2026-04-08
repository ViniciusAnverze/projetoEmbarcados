import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="atracoes"
        options={{
          title: 'Atrações',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="place" color={color} />,
        }}
      />
      <Tabs.Screen
        name="interesses"
        options={{
          title: 'Interesses',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="star" color={color} />,
        }}
      />
      <Tabs.Screen
        name="passes"
        options={{
          title: 'Passes',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="badge" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="receipt" color={color} />,
        }}
      />
    </Tabs>
  );
}
