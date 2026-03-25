import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useDetalheCelulaScreen } from './useDetalheCelulaScreen';

export default function DetalheCelula() {
  const {
    celula,
    membros,
    openRelatorio,
    openRegistroMembro,
  } = useDetalheCelulaScreen();

  const renderMembro = useCallback(
    ({ item }) => (
      <View style={styles.membroCard}>
        <Text style={styles.membroNome}>{item.nomeCompleto}</Text>
        {item.email ? (
          <Text style={styles.membroEmail}>{item.email}</Text>
        ) : null}
      </View>
    ),
    [],
  );

  if (!celula) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Célula não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nome}>{celula.nomeCelula}</Text>
        <Text style={styles.diaHorario}>
          {celula.dia} • {celula.horario}
        </Text>
        {celula.local ? (
          <Text style={styles.local}>{celula.local}</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Membros</Text>
          <Button
            title="Cadastrar Membro"
            onPress={openRegistroMembro}
            variant="secondary"
          />
        </View>
        {membros.length === 0 ? (
          <Text style={styles.empty}>Nenhum membro cadastrado.</Text>
        ) : (
          <FlatList
            data={membros}
            keyExtractor={(item) => item.id}
            renderItem={renderMembro}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Button title="RELATÓRIO" onPress={openRelatorio} />
      </View>
    </View>
  );
}
