import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RelatoriosLista from '../screens/RelatoriosLista';
import Relatorio from '../screens/Relatorio';
import { GOLD_HEADER } from './navigationTheme';

const Stack = createNativeStackNavigator();

export function RelatoriosStack() {
  return (
    <Stack.Navigator screenOptions={GOLD_HEADER}>
      <Stack.Screen name="RelatoriosLista" component={RelatoriosLista} options={{ headerShown: false }} />
      <Stack.Screen name="Relatorio" component={Relatorio} options={{ title: 'Relatório mensal' }} />
    </Stack.Navigator>
  );
}
