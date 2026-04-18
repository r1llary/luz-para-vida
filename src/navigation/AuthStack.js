import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import RegistroUsuario from '../screens/RegistroUsuario';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#CDAA6D' },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="RegistroUsuario" component={RegistroUsuario} />
    </Stack.Navigator>
  );
}
