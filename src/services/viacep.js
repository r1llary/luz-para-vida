const VIACEP_BASE = 'https://viacep.com.br/ws';

/**
 * @param {string} cepDigits 8 dígitos
 * @returns {Promise<{ logradouro: string, bairro: string, localidade: string, uf: string } | null>}
 */
export async function fetchEnderecoByCep(cepDigits) {
  const cep = String(cepDigits || '').replace(/\D/g, '');
  if (cep.length !== 8) return null;
  const url = `${VIACEP_BASE}/${cep}/json/`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data?.erro) return null;
  return {
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    localidade: data.localidade || '',
    uf: (data.uf || '').toUpperCase(),
  };
}

/**
 * Uma linha de texto para exibir/editar no formulário (rua, bairro, cidade - UF).
 */
export function formatEnderecoFromCep(found) {
  if (!found) return '';
  const rua = (found.logradouro || '').trim();
  const bairro = (found.bairro || '').trim();
  const cidade = (found.localidade || '').trim();
  const uf = (found.uf || '').trim().toUpperCase();
  const partes = [];
  if (rua) partes.push(rua);
  if (bairro) partes.push(bairro);
  if (cidade || uf) {
    partes.push([cidade, uf].filter(Boolean).join(cidade && uf ? ' - ' : ''));
  }
  return partes.join(', ');
}
