import axios from 'axios';
import { normalizeApiError } from './apiError';

const AUTH_STORAGE_KEY = 'transact_auth';

let unauthorizedHandler = null;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use((config) => {
  const authState = getStoredAuthState();

  config.headers['X-Correlation-ID'] = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  if (authState?.token) {
    config.headers.Authorization = `Bearer ${authState.token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    emitApiSignal(response);
    return response;
  },
  (error) => {
    error.normalized = normalizeApiError(error);
    if (error.response) {
      emitApiSignal(error.response);
    }

    if (error.normalized.isUnauthorized && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function emitApiSignal(response) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('transact:api-signal', {
      detail: {
        status: response.status,
        url: response.config?.url || '',
        method: response.config?.method || 'get',
        correlationId: response.headers?.['x-correlation-id'] || '',
        timestamp: new Date().toISOString()
      }
    })
  );
}

export function getStoredAuthState() {
  const rawAuthState = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawAuthState) {
    return null;
  }

  try {
    return JSON.parse(rawAuthState);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function persistAuthState(authState) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

export function clearStoredAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export default axiosClient;
