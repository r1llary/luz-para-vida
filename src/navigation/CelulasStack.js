import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MinhasCelulas from '../screens/MinhasCelulas';
import RegistroCelula from '../screens/RegistroCelula';
import DetalheCelula from '../screens/DetalheCelula';
import RegistroMembro from '../screens/RegistroMembro';
import NovaReuniao from '../screens/NovaReuniao';
import DetalheReuniao from '../screens/DetalheReuniao';
import { GOLD_HEADER } from './navigationTheme';

const Stack = createNativeStackNavigator();

export function CelulasStack() {
  return (
    <Stack.Navigator screenOptions={GOLD_HEADER}>
      <Stack.Screen
        name="MinhasCelulas"
        component={MinhasCelulas}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="RegistroCelula" component={RegistroCelula} options={{ title: 'Nova célula' }} />
      <Stack.Screen name="DetalheCelula" component={DetalheCelula} options={{ headerShown: false }} />
      <Stack.Screen name="RegistroMembro" component={RegistroMembro} options={{ title: 'Novo membro' }} />
      <Stack.Screen name="NovaReuniao" component={NovaReuniao} options={{ title: 'Nova reunião' }} />
      <Stack.Screen name="DetalheReuniao" component={DetalheReuniao} options={{ title: 'Reunião' }} />
    </Stack.Navigator>
  );
}
