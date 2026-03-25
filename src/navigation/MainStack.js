import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MinhasCelulas from '../screens/MinhasCelulas';
import RegistroCelula from '../screens/RegistroCelula';
import DetalheCelula from '../screens/DetalheCelula';
import RegistroMembro from '../screens/RegistroMembro';
import Relatorio from '../screens/Relatorio';

const Stack = createNativeStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="MinhasCelulas"
        component={MinhasCelulas}
        options={{ title: 'Minhas Células' }}
      />
      <Stack.Screen
        name="RegistroCelula"
        component={RegistroCelula}
        options={{ title: 'Registro de Célula' }}
      />
      <Stack.Screen
        name="DetalheCelula"
        component={DetalheCelula}
        options={{ title: 'Célula' }}
      />
      <Stack.Screen
        name="RegistroMembro"
        component={RegistroMembro}
        options={{ title: 'Registro de Membro' }}
      />
      <Stack.Screen
        name="Relatorio"
        component={Relatorio}
        options={{ title: 'Relatório' }}
      />
    </Stack.Navigator>
  );
}
