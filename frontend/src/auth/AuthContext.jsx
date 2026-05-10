import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearStoredAuthState,
  getStoredAuthState,
  persistAuthState,
  setUnauthorizedHandler
} from '../api/axiosClient';
import { loginUser, registerUser } from '../api/authApi';
import { getApiErrorMessage } from '../api/transactionsApi';

export const AuthContext = createContext(null);

function toAuthState(response) {
  return {
    token: response.token,
    username: response.username,
    role: response.role
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => getStoredAuthState());
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const clearAuth = useCallback(() => {
    clearStoredAuthState();
    setAuthState(null);
  }, []);

  const logout = useCallback(
    ({ redirect = true } = {}) => {
      clearAuth();
      if (redirect) {
        navigate('/login', { replace: true });
      }
    },
    [clearAuth, navigate]
  );

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout({ redirect: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const persistAuthenticatedUser = useCallback(
    (response) => {
      const nextAuthState = toAuthState(response);
      persistAuthState(nextAuthState);
      setAuthState(nextAuthState);
      setAuthError('');
      navigate('/dashboard', { replace: true });
    },
    [navigate]
  );

  const login = useCallback(
    async (credentials) => {
      setIsAuthenticating(true);
      setAuthError('');

      try {
        const response = await loginUser(credentials);
        persistAuthenticatedUser(response);
        return true;
      } catch (error) {
        setAuthError(getApiErrorMessage(error));
        return false;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistAuthenticatedUser]
  );

  const register = useCallback(
    async (registration) => {
      setIsAuthenticating(true);
      setAuthError('');

      try {
        const response = await registerUser(registration);
        persistAuthenticatedUser(response);
        return true;
      } catch (error) {
        setAuthError(getApiErrorMessage(error));
        return false;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistAuthenticatedUser]
  );

  const value = useMemo(
    () => ({
      token: authState?.token || null,
      username: authState?.username || '',
      role: authState?.role || '',
      user: authState,
      isAuthenticated: Boolean(authState?.token),
      isAuthenticating,
      authError,
      login,
      register,
      logout,
      clearAuthError: () => setAuthError('')
    }),
    [authError, authState, isAuthenticating, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
