import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useRegistroUsuarioScreen } from './useRegistroUsuarioScreen';

export default function RegistroUsuario() {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    goToLogin,
    fotoUri,
    pickFoto,
    clearFoto,
  } = useRegistroUsuarioScreen();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>REGISTRO DE USUÁRIO</Text>

        <View style={styles.fotoSection}>
          <Text style={styles.fotoLabel}>Foto de perfil</Text>
          <Text style={styles.fotoHint}>Opcional — toque para escolher da galeria</Text>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
          ) : (
            <View style={[styles.fotoPreview, { opacity: 0.5 }]} />
          )}
          <View style={styles.fotoActions}>
            <TouchableOpacity style={styles.fotoBtn} onPress={pickFoto}>
              <Text style={styles.fotoBtnText}>
                {fotoUri ? 'Trocar foto' : 'Escolher foto'}
              </Text>
            </TouchableOpacity>
            {fotoUri ? (
              <TouchableOpacity
                style={[styles.fotoBtn, styles.fotoBtnOutline]}
                onPress={clearFoto}
              >
                <Text style={styles.fotoRemoveLabel}>Remover</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <Text style={styles.permissaoHint}>
          Permissão: membro (padrão). Valores admin e lider podem ser definidos no
          Appwrite ao editar o perfil.
        </Text>

        <Controller
          control={control}
          name="nomeCompleto"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nome completo"
              placeholder="Nome completo"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.nomeCompleto?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="dataNascimento"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Data de nascimento"
              placeholder="AAAA-MM-DD"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.dataNascimento?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endereco"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Endereço"
              placeholder="Rua, número, bairro, cidade"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.endereco?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Senha"
              placeholder="Senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.senha?.message}
              secureTextEntry
            />
          )}
        />
        <Controller
          control={control}
          name="confirmarSenha"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirmar senha"
              placeholder="Confirmar senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmarSenha?.message}
              secureTextEntry
            />
          )}
        />

        {errors.root?.message ? (
          <Text style={styles.errorRoot}>{errors.root.message}</Text>
        ) : null}

        <Button
          title="Cadastrar"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />

        <TouchableOpacity style={styles.link} onPress={goToLogin}>
          <Text style={styles.linkText}>Já tem uma conta? </Text>
          <Text style={styles.linkBold}>ENTRE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
