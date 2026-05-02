import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MinhasCelulas from '../screens/MinhasCelulas';
import DetalheCelula from '../screens/DetalheCelula';
import RegistroMembro from '../screens/RegistroMembro';
import NovaReuniao from '../screens/NovaReuniao';
import DetalheReuniao from '../screens/DetalheReuniao';
import EditarCelula from '../screens/EditarCelula';
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
      <Stack.Screen name="DetalheCelula" component={DetalheCelula} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditarCelula"
        component={EditarCelula}
        options={{ title: 'Editar célula' }}
      />
      <Stack.Screen name="RegistroMembro" component={RegistroMembro} options={{ title: 'Novo membro' }} />
      <Stack.Screen name="NovaReuniao" component={NovaReuniao} options={{ title: 'Nova reunião' }} />
      <Stack.Screen name="DetalheReuniao" component={DetalheReuniao} options={{ title: 'Reunião' }} />
    </Stack.Navigator>
  );
}
