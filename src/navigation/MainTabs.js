import React from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PerfilStack } from './PerfilStack';
import { CelulasStack } from './CelulasStack';
import { RelatoriosStack } from './RelatoriosStack';

const Tab = createBottomTabNavigator();

const GOLD = '#CDAA6D';
const TAB_ACTIVE = '#fff';
const TAB_INACTIVE = 'rgba(255,255,255,0.65)';

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.75 }}>{emoji}</Text>
  );
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const tabPadBottom = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      initialRouteName="CelulasTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: GOLD,
          borderTopColor: 'rgba(0,0,0,0.08)',
          paddingBottom: tabPadBottom,
          paddingTop: 6,
          minHeight: 52 + tabPadBottom,
        },
        tabBarActiveTintColor: TAB_ACTIVE,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="PerfilTab"
        component={PerfilStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CelulasTab"
        component={CelulasStack}
        options={{
          tabBarLabel: 'Células',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="RelatoriosTab"
        component={RelatoriosStack}
        options={{
          tabBarLabel: 'Relatórios',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
