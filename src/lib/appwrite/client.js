import { Client, Account, Databases, Storage } from 'appwrite';
import {
  APPWRITE_ENDPOINT_CONFIG,
  APPWRITE_PROJECT_ID_CONFIG,
  isAppwriteConfigured,
} from './config';

let client = null;
let account = null;
let databases = null;
let storage = null;

function getClient() {
  if (!client) {
    client = new Client();
    client.setEndpoint(APPWRITE_ENDPOINT_CONFIG);
    client.setProject(APPWRITE_PROJECT_ID_CONFIG);
  }
  return client;
}

/**
 * Descarta instâncias do SDK (ex.: após logout) para não reutilizar sessão antiga.
 */
export function resetAppwriteClients() {
  client = null;
  account = null;
  databases = null;
  storage = null;
}

/**
 * Cliente Appwrite. Só deve ser usado quando isAppwriteConfigured() === true.
 */
export function getAppwriteClient() {
  if (!isAppwriteConfigured()) return null;
  return getClient();
}

/**
 * Serviço de conta (login, registro, sessão).
 */
export function getAppwriteAccount() {
  if (!isAppwriteConfigured()) return null;
  if (!account) account = new Account(getClient());
  return account;
}

/**
 * Serviço de banco de dados (collections).
 */
export function getAppwriteDatabases() {
  if (!isAppwriteConfigured()) return null;
  if (!databases) databases = new Databases(getClient());
  return databases;
}

/**
 * Serviço de armazenamento (arquivos, ex.: imagem da célula).
 */
export function getAppwriteStorage() {
  if (!isAppwriteConfigured()) return null;
  if (!storage) storage = new Storage(getClient());
  return storage;
}
