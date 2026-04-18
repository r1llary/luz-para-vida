import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditarPerfil from '../screens/EditarPerfil';
import { GOLD_HEADER } from './navigationTheme';

const Stack = createNativeStackNavigator();

export function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={GOLD_HEADER}>
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ title: 'Meu perfil' }} />
    </Stack.Navigator>
  );
}
