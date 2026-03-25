import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { CelulasProvider } from './src/contexts/CelulasContext';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CelulasProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </CelulasProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
