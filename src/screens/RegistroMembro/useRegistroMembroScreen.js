import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registroMembroSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';

export function useRegistroMembroScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celulaId = params?.celulaId;
  const { addMembro } = useCelulas();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroMembroSchema),
    defaultValues: {
      nomeCompleto: '',
      cpfRg: '',
      email: '',
      telefone: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      data: '',
    },
  });

  const onSubmit = (data) => {
    addMembro(data, celulaId);
    navigation.goBack();
  };

  return {
    celulaId,
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
}
