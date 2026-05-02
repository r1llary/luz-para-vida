/**
 * Células que o usuário pode usar em relatórios: é líder/dono ou pertence à rede
 * (campo `celulaRaiz` aponta para uma célula em que o usuário é líder ou dono).
 */
export function filterCelulasParaRelatorio(celulas, userId) {
  if (!userId || !Array.isArray(celulas)) return [];
  const idsOndeLideraOuDono = new Set(
    celulas
      .filter(
        (c) =>
          c.liderUserId === userId ||
          c.userId === userId
      )
      .map((c) => c.id)
  );
  return celulas.filter((c) => {
    if (c.liderUserId === userId || c.userId === userId) return true;
    const raiz = c.celulaRaiz != null ? String(c.celulaRaiz).trim() : '';
    if (!raiz) return false;
    return idsOndeLideraOuDono.has(raiz);
  });
}
