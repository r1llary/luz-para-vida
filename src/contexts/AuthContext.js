import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { isAppwriteConfigured } from '../lib/appwrite';
import {
  signInWithAppwrite,
  signUpWithAppwrite,
  signOutFromAppwrite,
  getCurrentUserFromAppwrite,
  restoreAppwriteSessionFromStorage,
} from '../services/appwrite';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialCheck, setInitialCheck] = useState(!isAppwriteConfigured());

  useEffect(() => {
    if (!isAppwriteConfigured()) {
      setInitialCheck(true);
      return;
    }
    restoreAppwriteSessionFromStorage();
    getCurrentUserFromAppwrite()
      .then((u) => {
        setUser(u || null);
      })
      .catch(() => setUser(null))
      .finally(() => setInitialCheck(true));
  }, []);

  const signIn = useCallback(async (email, senha) => {
    setLoading(true);
    try {
      if (isAppwriteConfigured()) {
        const u = await signInWithAppwrite(email, senha);
        if (u) {
          setUser(u);
          return { success: true };
        }
        return { success: false, error: 'Não foi possível entrar.' };
      }
      setUser({
        id: '1',
        nomeCompleto: 'Usuário',
        email,
        permissao: 'membro',
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message || 'Erro ao entrar.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (profile) => {
    setLoading(true);
    try {
      if (isAppwriteConfigured()) {
        try {
          const u = await signUpWithAppwrite(profile);
          if (u) {
            setUser(u);
            return { success: true };
          }
          return { success: false, error: 'Não foi possível cadastrar.' };
        } catch (error) {
          return {
            success: false,
            error: error?.message || 'Erro ao cadastrar.',
          };
        }
      }
      setUser({
        id: '1',
        nomeCompleto: profile.nomeCompleto,
        email: profile.email,
        dataNascimento: profile.dataNascimento,
        endereco: profile.endereco,
        fotoPerfilUrl: profile.fotoUri || null,
        permissao: 'membro',
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message || 'Erro ao cadastrar.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isAppwriteConfigured()) {
      try {
        await signOutFromAppwrite();
      } catch (_) {
        /* noop */
      }
    }
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    initialCheck,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
