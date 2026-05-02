import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { AppState } from 'react-native';
import { useAuth } from './AuthContext';
import {
  isAppwriteDatabaseConfigured,
  isAppwriteConfigured,
} from '../lib/appwrite';
import {
  listCelulasAppwrite,
  createCelulaAppwrite,
  updateCelulaAppwrite,
  listMembrosByCelulaAppwrite,
  listReunioesByCelulaAppwrite,
  createReuniaoAppwrite,
  deleteMembroAppwrite,
  deleteReuniaoAppwrite,
  getAvatarViewUrl,
  uploadCelulaDestaqueFromUri,
  logAppwriteDatabaseCollections,
  appendCelulaIdToUsuarioAppwrite,
} from '../services/appwrite';
import { syncPermissoesAposLideranca } from '../services/celulaLiderancaSync';
import { registerMembroComContaAppwrite } from '../services/appwrite/membroUsuarioService';

const CelulasContext = createContext(null);

export function CelulasProvider({ children }) {
  const { user, initialCheck } = useAuth();
  const [celulas, setCelulas] = useState([]);
  const [membros, setMembros] = useState([]);
  const [reunioes, setReunioes] = useState([]);
  const [loadingCelulas, setLoadingCelulas] = useState(false);
  const appStateRef = useRef(AppState.currentState);
  const loggedCollectionsRef = useRef(false);
  const celulasRef = useRef([]);

  const loadCelulas = useCallback(async () => {
    if (!user?.id || !isAppwriteDatabaseConfigured()) return;
    setLoadingCelulas(true);
    try {
      const list = await listCelulasAppwrite(user.id);
      setCelulas(list);
    } catch {
      setCelulas([]);
    } finally {
      setLoadingCelulas(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!initialCheck) return;

    if (!user?.id) {
      setCelulas([]);
      setMembros([]);
      setReunioes([]);
      loggedCollectionsRef.current = false;
      return;
    }

    if (!isAppwriteDatabaseConfigured()) return;

    loadCelulas();

    if (
      typeof __DEV__ !== 'undefined' &&
      __DEV__ &&
      !loggedCollectionsRef.current
    ) {
      loggedCollectionsRef.current = true;
      logAppwriteDatabaseCollections();
    }
  }, [user?.id, initialCheck, loadCelulas]);

  useEffect(() => {
    celulasRef.current = celulas;
  }, [celulas]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        next === 'active' &&
        initialCheck &&
        user?.id &&
        isAppwriteDatabaseConfigured()
      ) {
        loadCelulas();
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [initialCheck, user?.id, loadCelulas]);

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
        endereco: celula.endereco ?? '',
        celulaRaiz: celula.celulaRaiz ?? '',
        imagemDestaque: '',
        membros: [],
        liderUserId: user?.id ?? '',
        coLiderUserId: '',
      };
      if (isAppwriteDatabaseConfigured() && user?.id) {
        try {
          const id = await createCelulaAppwrite(user.id, payload);
          if (id) {
            await appendCelulaIdToUsuarioAppwrite(user.id, id);
            let imagemUrl = null;
            const uri = celula.imagemUri;
            if (uri) {
              const fileId = await uploadCelulaDestaqueFromUri(
                uri,
                id,
                user.id,
              );
              if (fileId) {
                await updateCelulaAppwrite(id, { imagemDestaque: fileId });
                imagemUrl = getAvatarViewUrl(fileId) || uri;
              } else {
                imagemUrl = uri;
              }
            }
            const list = await listCelulasAppwrite(user.id);
            setCelulas(list);
            return { id, imagemUrl };
          }
        } catch (_) {
          /* fallback local */
        }
      }
      const nova = {
        id: String(Date.now()),
        ...payload,
        imagemUrl: celula.imagemUri || null,
        createdAt: new Date().toISOString(),
      };
      setCelulas((prev) => [...prev, nova]);
      return { id: nova.id, imagemUrl: nova.imagemUrl };
    },
    [user?.id]
  );

  const addMembro = useCallback(
    async (membro, celulaId) => {
      if (isAppwriteConfigured() && isAppwriteDatabaseConfigured()) {
        const id = await registerMembroComContaAppwrite(celulaId, membro);
        if (!id) {
          throw new Error('Não foi possível cadastrar o membro no servidor.');
        }
        const list = await listMembrosByCelulaAppwrite(celulaId);
        setMembros((prev) => [
          ...prev.filter((m) => m.celulaId !== celulaId),
          ...list,
        ]);
        return id;
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
      const visitantesListaLocal = Array.isArray(dados.visitantesLista)
        ? dados.visitantesLista
        : [];
      const visitantesNum =
        visitantesListaLocal.length > 0
          ? visitantesListaLocal.length
          : Number(dados.visitantes) || 0;
      const novo = {
        id: String(Date.now()),
        celulaId,
        dataReuniao: dados.dataReuniao,
        temaMinistrado: dados.temaMinistrado ?? '',
        textoBase: dados.textoBase ?? '',
        visitantes: visitantesNum,
        visitantesLista: visitantesListaLocal,
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

  const removeMembro = useCallback(
    async (celulaId, membro) => {
      if (isAppwriteDatabaseConfigured()) {
        try {
          await deleteMembroAppwrite(celulaId, membro.id, membro.userId);
          await fetchMembrosForCelula(celulaId);
          return;
        } catch (_) {
          /* fallback estado local */
        }
      }
      setMembros((prev) => prev.filter((m) => m.id !== membro.id));
    },
    [fetchMembrosForCelula],
  );

  const removeReuniao = useCallback(
    async (celulaId, reuniao) => {
      if (isAppwriteDatabaseConfigured()) {
        try {
          await deleteReuniaoAppwrite(celulaId, reuniao.id);
          await fetchReunioesForCelula(celulaId);
          return;
        } catch (_) {
          /* fallback estado local */
        }
      }
      setReunioes((prev) => prev.filter((r) => r.id !== reuniao.id));
    },
    [fetchReunioesForCelula],
  );

  const updateCelulaFields = useCallback(
    async (celulaId, partial) => {
      const prevC = celulasRef.current.find((c) => c.id === celulaId);
      if (!prevC) return;
      const merged = { ...prevC, ...partial };
      if (
        partial.liderUserId !== undefined ||
        partial.coLiderUserId !== undefined
      ) {
        await syncPermissoesAposLideranca(prevC, merged);
      }
      setCelulas((list) =>
        list.map((c) => (c.id === celulaId ? merged : c))
      );
      if (isAppwriteDatabaseConfigured()) {
        try {
          await updateCelulaAppwrite(celulaId, partial);
          await loadCelulas();
        } catch (_) {
          /* mantém estado local */
        }
      }
    },
    [loadCelulas]
  );

  const value = {
    celulas,
    membros,
    reunioes,
    loadingCelulas,
    refreshCelulas: loadCelulas,
    addCelula,
    addMembro,
    addReuniao,
    getMembrosByCelula,
    getReunioesByCelula,
    fetchMembrosForCelula,
    fetchReunioesForCelula,
    updateCelulaFields,
    removeMembro,
    removeReuniao,
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
