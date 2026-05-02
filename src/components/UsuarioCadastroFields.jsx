import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from './Inputs';
import { styles as regStyles } from '../screens/RegistroUsuario/styles';

/**
 * Campos compartilhados entre cadastro de usuário e cadastro de membro como usuário.
 */
export function UsuarioCadastroFields({
  control,
  errors,
  maskDateDMY,
  onCepChangeText,
  onCepFilled,
  cepLookupLoading,
  omitSenha = false,
  showCpfRg = false,
  showTelefone = false,
}) {
  return (
    <>
      <Controller
        control={control}
        name="nomeCompleto"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="Nome completo"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.nomeCompleto?.message}
            autoComplete="name"
            textContentType="name"
          />
        )}
      />
      <Controller
        control={control}
        name="dataNascimento"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="Data de nascimento (DD/MM/AAAA)"
            value={value}
            onChangeText={(t) => onChange(maskDateDMY(t))}
            onBlur={onBlur}
            error={errors.dataNascimento?.message}
            keyboardType="number-pad"
            maxLength={10}
          />
        )}
      />

      {showCpfRg ? (
        <Controller
          control={control}
          name="cpfRg"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              placeholder="CPF ou RG (opcional)"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      ) : null}

      <Text style={regStyles.sectionLabel}>Endereço</Text>
      <Text style={regStyles.fieldHint}>
        Informe o CEP; o endereço será preenchido automaticamente. Ajuste o texto
        se necessário e informe número e complemento.
      </Text>

      <Controller
        control={control}
        name="cep"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="CEP"
            value={value}
            onChangeText={(t) => onCepChangeText(t, onChange)}
            onBlur={() => {
              onBlur();
              onCepFilled();
            }}
            error={errors.cep?.message}
            keyboardType="number-pad"
            maxLength={9}
          />
        )}
      />
      {cepLookupLoading ? (
        <View style={regStyles.cepLoading}>
          <ActivityIndicator color="#475569" size="small" />
          <Text style={[regStyles.cepLoadingText, { marginLeft: 8 }]}>
            Buscando endereço…
          </Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="enderecoBase"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="Endereço (preenchido pelo CEP)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.enderecoBase?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="numero"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="Número"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.numero?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="complemento"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="Complemento (opcional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="auth"
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
        )}
      />

      {showTelefone ? (
        <Controller
          control={control}
          name="telefone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              placeholder="Telefone (com DDD)"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.telefone?.message}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          )}
        />
      ) : null}

      {!omitSenha ? (
        <>
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="auth"
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.senha?.message}
                passwordToggle
                secureTextEntry
                autoComplete="password-new"
                textContentType="newPassword"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmarSenha"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="auth"
                placeholder="Confirmar senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmarSenha?.message}
                passwordToggle
                secureTextEntry
                autoComplete="password-new"
                textContentType="newPassword"
              />
            )}
          />
        </>
      ) : null}
    </>
  );
}
