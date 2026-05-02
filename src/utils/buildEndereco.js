import { onlyDigits, maskCEP } from './brFormat';

/**
 * Monta uma única linha de endereço para o documento Appwrite (campo string).
 * enderecoBase: linha obtida pelo CEP (logradouro, bairro, cidade - UF).
 */
export function buildEnderecoString({
  enderecoBase,
  numero,
  complemento,
  cep,
}) {
  const base = (enderecoBase || '').trim();
  const num = (numero || '').trim();
  const comp = (complemento || '').trim();
  const principal = comp ? `${base}, ${num} - ${comp}` : `${base}, ${num}`;
  const d = onlyDigits(cep);
  const cepFmt = d.length === 8 ? maskCEP(d) : '';
  return cepFmt ? `${principal} - CEP ${cepFmt}` : principal;
}
