import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { useEditarCelulaScreen } from './useEditarCelulaScreen';

export default function EditarCelula() {
  const {
    celula,
    nomeCelula,
    setNomeCelula,
    membros,
    reunioes,
    saving,
    onSalvarNome,
    confirmRemoveMembro,
    confirmRemoveReuniao,
    formatDateBr,
    previewImagemUri,
    temRascunhoImagem,
    temImagemSalva,
    savingFoto,
    pickFromLibrary,
    pickFromCamera,
    limparRascunhoImagem,
    onSalvarFotoDestaque,
    confirmRemoverImagemDestaque,
    canEditLideranca,
    liderModalOpen,
    setLiderModalOpen,
    draftLider,
    setDraftLider,
    draftCo,
    setDraftCo,
    opcoesLideranca,
    opcoesCoLider,
    onSaveLideranca,
  } = useEditarCelulaScreen();

  const insets = useSafeAreaInsets();

  if (!celula) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <Text style={styles.empty}>Célula não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Nome da célula</Text>
        <TextInput
          style={styles.input}
          value={nomeCelula}
          onChangeText={setNomeCelula}
          placeholder="Nome"
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={onSalvarNome}
          disabled={saving || savingFoto}
          activeOpacity={0.9}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar nome</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Imagem de destaque</Text>
        <Text style={styles.fieldHint}>
          Opcional — galeria ou câmera. Toque em Salvar imagem após escolher.
        </Text>
        <View style={styles.imagemPreviewWrap}>
          {previewImagemUri ? (
            <Image
              source={{ uri: previewImagemUri }}
              style={styles.imagemPreview}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Text style={styles.imagemPlaceholder}>
              Nenhuma imagem de destaque
            </Text>
          )}
        </View>
        <View style={styles.imagemActions}>
          <TouchableOpacity
            style={styles.imagemBtn}
            onPress={pickFromLibrary}
            disabled={savingFoto}
            accessibilityRole="button"
            accessibilityLabel="Escolher da galeria"
          >
            <Text style={styles.imagemBtnText}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imagemBtn}
            onPress={pickFromCamera}
            disabled={savingFoto}
            accessibilityRole="button"
            accessibilityLabel="Tirar foto"
          >
            <Text style={styles.imagemBtnText}>Câmera</Text>
          </TouchableOpacity>
          {temRascunhoImagem ? (
            <TouchableOpacity
              style={[styles.imagemBtn, styles.imagemBtnDanger]}
              onPress={limparRascunhoImagem}
              disabled={savingFoto}
              accessibilityRole="button"
              accessibilityLabel="Descartar imagem selecionada"
            >
              <Text style={[styles.imagemBtnText, styles.imagemBtnDangerText]}>
                Descartar
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {temRascunhoImagem ? (
          <TouchableOpacity
            style={styles.saveFotoBtn}
            onPress={onSalvarFotoDestaque}
            disabled={savingFoto}
            activeOpacity={0.9}
          >
            {savingFoto ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveFotoBtnText}>Salvar imagem</Text>
            )}
          </TouchableOpacity>
        ) : null}
        {temImagemSalva && !temRascunhoImagem ? (
          <TouchableOpacity
            style={styles.removeDestaqueBtn}
            onPress={confirmRemoverImagemDestaque}
            disabled={savingFoto}
            accessibilityRole="button"
            accessibilityLabel="Remover imagem de destaque"
          >
            <Text style={styles.removeDestaqueText}>
              Remover imagem de destaque
            </Text>
          </TouchableOpacity>
        ) : null}

        {canEditLideranca ? (
          <>
            <Text style={styles.label}>Liderança</Text>
            <Text style={styles.fieldHint}>
              Líder e co-líder — entre você e membros com usuário no app.
            </Text>
            <TouchableOpacity
              style={styles.liderancaLink}
              onPress={() => setLiderModalOpen(true)}
              disabled={saving || savingFoto}
              accessibilityRole="button"
              accessibilityLabel="Alterar líder e co-líder"
            >
              <Text style={styles.liderancaLinkText}>Alterar liderança</Text>
            </TouchableOpacity>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Membros</Text>
        <View style={styles.divider} />
        {membros.length === 0 ? (
          <Text style={styles.empty}>Nenhum membro.</Text>
        ) : (
          membros.map((m) => (
            <View key={m.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowText}>{m.nomeCompleto}</Text>
                {m.email ? (
                  <Text style={styles.rowSub}>{m.email}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => confirmRemoveMembro(m)}
                accessibilityLabel={`Remover ${m.nomeCompleto}`}
              >
                <Text style={styles.removeBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Reuniões</Text>
        <View style={styles.divider} />
        {reunioes.length === 0 ? (
          <Text style={styles.empty}>Nenhuma reunião.</Text>
        ) : (
          reunioes.map((r) => (
            <View key={r.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowText}>
                  {formatDateBr(r.dataReuniao || r.data) ||
                    r.dataReuniao ||
                    r.data ||
                    '—'}
                </Text>
                <Text style={styles.rowSub} numberOfLines={2}>
                  {r.temaMinistrado || '—'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => confirmRemoveReuniao(r)}
                accessibilityLabel="Excluir reunião"
              >
                <Text style={styles.removeBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={liderModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setLiderModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLiderModalOpen(false)}
        >
          <Pressable
            style={[
              styles.modalCard,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Líder e co-líder</Text>
            <Text style={styles.modalHint}>
              Escolha entre você e os membros que já têm usuário (campo userId).
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>Líder</Text>
              {opcoesLideranca.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.modalOption,
                    draftLider === o.id && styles.modalOptionOn,
                  ]}
                  onPress={() => setDraftLider(o.id)}
                >
                  <Text style={styles.modalOptionText}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>Co-líder</Text>
              <TouchableOpacity
                style={[styles.modalOption, !draftCo && styles.modalOptionOn]}
                onPress={() => setDraftCo('')}
              >
                <Text style={styles.modalOptionText}>Nenhum</Text>
              </TouchableOpacity>
              {opcoesCoLider.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.modalOption,
                    draftCo === o.id && styles.modalOptionOn,
                  ]}
                  onPress={() => setDraftCo(o.id)}
                >
                  <Text style={styles.modalOptionText}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setLiderModalOpen(false)}
                style={styles.modalBtnPad}
              >
                <Text style={styles.liderancaBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSaveLideranca}
                style={styles.modalBtnPad}
              >
                <Text style={styles.liderancaBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
