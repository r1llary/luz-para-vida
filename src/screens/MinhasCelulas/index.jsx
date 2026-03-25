import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useMinhasCelulasScreen } from './useMinhasCelulasScreen';

export default function MinhasCelulas() {
  const {
    user,
    celulas,
    handleCadastrar,
    confirmSignOut,
    openDetalheCelula,
  } = useMinhasCelulasScreen();

  const renderCelula = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openDetalheCelula(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.cardTitle}>{item.nomeCelula}</Text>
        <Text style={styles.cardSubtitle}>
          {item.dia} • {item.horario}
        </Text>
      </TouchableOpacity>
    ),
    [openDetalheCelula],
  );

  if (celulas.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.userText}>Olá, {user?.nomeCompleto || user?.email}</Text>
          <TouchableOpacity onPress={confirmSignOut}>
            <Text style={styles.sair}>Sair</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Minhas Células</Text>
          <Text style={styles.emptyText}>
            Você não possui Células cadastradas
          </Text>
          <Text style={styles.emptyHint}>
            Toque no botão abaixo para cadastrar sua primeira célula
          </Text>
          <Button title="Cadastrar" onPress={handleCadastrar} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userText}>Olá, {user?.nomeCompleto || user?.email}</Text>
        <TouchableOpacity onPress={confirmSignOut}>
          <Text style={styles.sair}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Minhas Células</Text>
        <Button title="Cadastrar" onPress={handleCadastrar} variant="secondary" />
      </View>
      <FlatList
        data={celulas}
        keyExtractor={(item) => item.id}
        renderItem={renderCelula}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
