import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isAppwriteDatabaseConfigured } from '../lib/appwrite';
import {
  listCelulasAppwrite,
  createCelulaAppwrite,
  listMembrosByCelulaAppwrite,
  createMembroAppwrite,
  getRelatorioAppwrite,
  saveRelatorioAppwrite,
} from '../services/appwrite';

const CelulasContext = createContext(null);

export function CelulasProvider({ children }) {
  const { user } = useAuth();
  const [celulas, setCelulas] = useState([]);
  const [membros, setMembros] = useState([]);
  const [loadingCelulas, setLoadingCelulas] = useState(false);

  useEffect(() => {
    if (!isAppwriteDatabaseConfigured() || !user?.id) return;
    setLoadingCelulas(true);
    listCelulasAppwrite(user.id)
      .then(setCelulas)
      .catch(() => setCelulas([]))
      .finally(() => setLoadingCelulas(false));
  }, [user?.id]);

  const fetchMembrosForCelula = useCallback(async (celulaId) => {
    if (!isAppwriteDatabaseConfigured() || !celulaId) return;
    const list = await listMembrosByCelulaAppwrite(celulaId);
    setMembros((prev) => [
      ...prev.filter((m) => m.celulaId !== celulaId),
      ...list,
    ]);
  }, []);

  const addCelula = useCallback(
    async (celula) => {
      if (isAppwriteDatabaseConfigured() && user?.id) {
        try {
          const id = await createCelulaAppwrite(user.id, celula);
          if (id) {
            const list = await listCelulasAppwrite(user.id);
            setCelulas(list);
            return id;
          }
        } catch (_) {
          /* fallback local abaixo */
        }
      }
      const nova = {
        id: String(Date.now()),
        ...celula,
        createdAt: new Date().toISOString(),
      };
      setCelulas((prev) => [...prev, nova]);
      return nova.id;
    },
    [user?.id]
  );

  const addMembro = useCallback(
    async (membro, celulaId) => {
      if (isAppwriteDatabaseConfigured()) {
        try {
          const id = await createMembroAppwrite(celulaId, membro);
          if (id) {
            const list = await listMembrosByCelulaAppwrite(celulaId);
            setMembros((prev) => [
              ...prev.filter((m) => m.celulaId !== celulaId),
              ...list,
            ]);
            return id;
          }
        } catch (_) {
          /* fallback local */
        }
      }
      const novo = {
        id: String(Date.now()),
        celulaId,
        ...membro,
        createdAt: new Date().toISOString(),
      };
      setMembros((prev) => [...prev, novo]);
      return novo.id;
    },
    []
  );

  const getMembrosByCelula = useCallback(
    (celulaId) => membros.filter((m) => m.celulaId === celulaId),
    [membros]
  );

  const updateRelatorio = useCallback(async (celulaId, dados) => {
    if (isAppwriteDatabaseConfigured()) {
      try {
        await saveRelatorioAppwrite(celulaId, dados);
        return;
      } catch (_) {
        /* fallback estado local */
      }
    }
    setCelulas((prev) =>
      prev.map((c) =>
        c.id === celulaId
          ? { ...c, relatorio: dados, relatorioAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const loadRelatorioForCelula = useCallback(async (celulaId) => {
    if (!isAppwriteDatabaseConfigured()) return null;
    return getRelatorioAppwrite(celulaId);
  }, []);

  const value = {
    celulas,
    membros,
    loadingCelulas,
    addCelula,
    addMembro,
    getMembrosByCelula,
    updateRelatorio,
    fetchMembrosForCelula,
    loadRelatorioForCelula,
  };

  return (
    <CelulasContext.Provider value={value}>{children}</CelulasContext.Provider>
  );
}

export function useCelulas() {
  const context = useContext(CelulasContext);
  if (!context) {
    throw new Error('useCelulas deve ser usado dentro de CelulasProvider');
  }
  return context;
}
