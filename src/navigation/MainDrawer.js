import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainTabs } from './MainTabs';
import { CustomDrawerContent } from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '82%',
          maxWidth: 340,
          backgroundColor: '#0D1B38',
        },
        overlayColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <Drawer.Screen name="Principal" component={MainTabs} />
    </Drawer.Navigator>
  );
}
