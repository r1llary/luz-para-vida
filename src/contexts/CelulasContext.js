import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isAppwriteDatabaseConfigured } from '../lib/appwrite';
import {
  listAllCelulasAppwrite,
  listCelulasAppwrite,
  listCelulasByIdsAppwrite,
  listMembrosByEmailAppwrite,
  createCelulaAppwrite,
  listMembrosByCelulaAppwrite,
  createMembroAppwrite,
  listReunioesByCelulaAppwrite,
  createReuniaoAppwrite,
} from '../services/appwrite';

const CelulasContext = createContext(null);

export function CelulasProvider({ children }) {
  const { user, isAdmin, isMembro } = useAuth();
  const [celulas, setCelulas] = useState([]);
  const [membros, setMembros] = useState([]);
  const [reunioes, setReunioes] = useState([]);
  const [loadingCelulas, setLoadingCelulas] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setCelulas([]);
      setMembros([]);
      setReunioes([]);
      return;
    }
    if (!isAppwriteDatabaseConfigured()) return;
    setLoadingCelulas(true);
    let fetchPromise;
    if (isAdmin) {
      fetchPromise = listAllCelulasAppwrite();
    } else if (isMembro && user.email) {
      fetchPromise = listMembrosByEmailAppwrite(user.email).then((membros) => {
        const ids = [...new Set(membros.map((m) => m.celulaId).filter(Boolean))];
        return ids.length ? listCelulasByIdsAppwrite(ids) : [];
      });
    } else {
      fetchPromise = listCelulasAppwrite(user.id);
    }
    fetchPromise
      .then(setCelulas)
      .catch(() => setCelulas([]))
      .finally(() => setLoadingCelulas(false));
  }, [user?.id, user?.email, isAdmin, isMembro]);

  const fetchMembrosForCelula = useCallback(async (celulaId) => {
    if (!isAppwriteDatabaseConfigured() || !celulaId) return;
    const list = await listMembrosByCelulaAppwrite(celulaId);
    setMembros((prev) => [
      ...prev.filter((m) => m.celulaId !== celulaId),
      ...list,
    ]);
  }, []);

  const fetchReunioesForCelula = useCallback(async (celulaId) => {
    if (!celulaId) return;
    if (!isAppwriteDatabaseConfigured()) return;
    try {
      const list = await listReunioesByCelulaAppwrite(celulaId);
      setReunioes((prev) => [
        ...prev.filter((r) => r.celulaId !== celulaId),
        ...list,
      ]);
    } catch (_) {
      /* noop */
    }
  }, []);

  const addCelula = useCallback(
    async (celula) => {
      const payload = {
        nomeCelula: celula.nomeCelula ?? '',
        dia: celula.dia ?? '',
        horario: celula.horario ?? '',
        local: celula.local ?? '',
        imagemUrl: celula.imagemUrl ?? '',
        endereco: celula.endereco ?? '',
        celulaRaiz: celula.celulaRaiz ?? '',
        temaMinistrado: celula.temaMinistrado ?? '',
        textoBase: celula.textoBase ?? '',
        visitantes: Number(celula.visitantes) || 0,
        membrosPresentes: Number(celula.membrosPresentes) || 0,
      };
      if (isAppwriteDatabaseConfigured() && user?.id) {
        try {
          const id = await createCelulaAppwrite(user.id, payload);
          if (id) {
            const list = await listCelulasAppwrite(user.id);
            setCelulas(list);
            return id;
          }
        } catch (_) {
          /* fallback local */
        }
      }
      const nova = {
        id: String(Date.now()),
        ...payload,
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

  const addReuniao = useCallback(
    async (celulaId, dados) => {
      if (isAppwriteDatabaseConfigured()) {
        try {
          const id = await createReuniaoAppwrite(celulaId, dados);
          if (id) {
            await fetchReunioesForCelula(celulaId);
            return id;
          }
        } catch (_) {
          /* fallback local */
        }
      }
      const idsLocal = Array.isArray(dados.membrosPresentesIds)
        ? dados.membrosPresentesIds.filter(Boolean)
        : [];
      const membrosCountLocal =
        idsLocal.length > 0
          ? idsLocal.length
          : Number(dados.membrosPresentes) || 0;
      const novo = {
        id: String(Date.now()),
        celulaId,
        dataReuniao: dados.dataReuniao,
        temaMinistrado: dados.temaMinistrado ?? '',
        textoBase: dados.textoBase ?? '',
        visitantes: Number(dados.visitantes) || 0,
        membrosPresentes: membrosCountLocal,
        membrosPresentesIds: idsLocal,
        createdAt: new Date().toISOString(),
      };
      setReunioes((prev) => [...prev, novo]);
      return novo.id;
    },
    [fetchReunioesForCelula]
  );

  const getMembrosByCelula = useCallback(
    (celulaId) => membros.filter((m) => m.celulaId === celulaId),
    [membros]
  );

  const getReunioesByCelula = useCallback(
    (celulaId) =>
      reunioes
        .filter((r) => r.celulaId === celulaId)
        .sort((a, b) =>
          String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
        ),
    [reunioes]
  );

  const value = {
    celulas,
    membros,
    reunioes,
    loadingCelulas,
    addCelula,
    addMembro,
    addReuniao,
    getMembrosByCelula,
    getReunioesByCelula,
    fetchMembrosForCelula,
    fetchReunioesForCelula,
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
