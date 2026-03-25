import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { registroCelulaSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';

export function useRegistroCelulaScreen() {
  const navigation = useNavigation();
  const { addCelula } = useCelulas();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroCelulaSchema),
    defaultValues: {
      nomeCelula: '',
      local: '',
      endereco: '',
      dia: '',
      horario: '',
      celulaRaiz: '',
      temaMinistrado: '',
      textoBase: '',
      visitantes: 0,
      membrosPresentes: 0,
    },
  });

  const onSubmit = (data) => {
    const id = addCelula(data);
    navigation.replace('DetalheCelula', {
      celula: { id, ...data },
    });
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
}
