import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditarPerfil from '../screens/EditarPerfil';
import { GOLD_HEADER } from './navigationTheme';

const Stack = createNativeStackNavigator();

function MenuButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.menuBtn}
      accessibilityRole="button"
      accessibilityLabel="Abrir menu"
    >
      <View style={styles.bar} />
      <View style={styles.bar} />
      <View style={styles.bar} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuBtn: { padding: 8, marginLeft: 2 },
  bar: {
    width: 22,
    height: 2.5,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginVertical: 2.5,
  },
});

export function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={GOLD_HEADER}>
      <Stack.Screen
        name="EditarPerfil"
        component={EditarPerfil}
        options={({ navigation }) => ({
          title: 'Meu perfil',
          headerLeft: () => <MenuButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
