import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { PerfilStack } from './PerfilStack';
import { CelulasStack } from './CelulasStack';
import { RelatoriosStack } from './RelatoriosStack';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

const ALL_TABS = [
  {
    name: 'PerfilTab',
    label: 'Perfil',
    icon: 'person',
    iconOutline: 'person-outline',
    component: PerfilStack,
    requiresManage: false,
  },
  {
    name: 'CelulasTab',
    label: 'Células',
    icon: 'grid',
    iconOutline: 'grid-outline',
    component: CelulasStack,
    requiresManage: false,
  },
  {
    name: 'RelatoriosTab',
    label: 'Relatórios',
    icon: 'bar-chart',
    iconOutline: 'bar-chart-outline',
    component: RelatoriosStack,
    requiresManage: true,
  },
];

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const tabPadBottom = Math.max(insets.bottom, 8);
  const { canManage } = useAuth();

  const tabs = ALL_TABS.filter((t) => !t.requiresManage || canManage);

  return (
    <Tab.Navigator
      initialRouteName="CelulasTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A3A6B',
          borderTopColor: 'rgba(255,255,255,0.08)',
          paddingBottom: tabPadBottom,
          paddingTop: 6,
          minHeight: 54 + tabPadBottom,
        },
        tabBarActiveTintColor: '#C9A227',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: { fontWeight: '700', fontSize: 10, letterSpacing: 0.2 },
        tabBarIcon: ({ focused, color }) => {
          const tab = ALL_TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          return (
            <Ionicons
              name={focused ? tab.icon : tab.iconOutline}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}
