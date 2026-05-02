import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PerfilStack } from './PerfilStack';
import { CelulasStack } from './CelulasStack';
import { RelatoriosStack } from './RelatoriosStack';
import { APP_BAR_BACKGROUND } from './navigationTheme';

const Tab = createBottomTabNavigator();

const TAB_ACTIVE = '#fff';
const TAB_INACTIVE = 'rgba(255,255,255,0.65)';

function TabIcon({ nameOutline, nameFilled, focused, color, size }) {
  const name = focused ? nameFilled : nameOutline;
  return <Ionicons name={name} size={size ?? 22} color={color} />;
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
          backgroundColor: APP_BAR_BACKGROUND,
          borderTopColor: 'rgba(0,0,0,0.06)',
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
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              nameOutline="person-outline"
              nameFilled="person"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CelulasTab"
        component={CelulasStack}
        options={{
          tabBarLabel: 'Células',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              nameOutline="people-outline"
              nameFilled="people"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RelatoriosTab"
        component={RelatoriosStack}
        options={{
          tabBarLabel: 'Relatórios',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              nameOutline="bar-chart-outline"
              nameFilled="bar-chart"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
