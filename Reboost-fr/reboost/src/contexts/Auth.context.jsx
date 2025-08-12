import {
  createContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import useSWRMutation from 'swr/mutation';
import * as api from '../api';
import useSWR from 'swr';
import { mutate } from 'swr';

export const JWT_TOKEN_KEY = 'jwtToken';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));

  // Fetch the current user data only if we have a token
  const {
    data: gebruikerRaw,
    loading: userLoading,
    error: userError,
  } = useSWR(token ? 'gebruikers/me' : null, api.getById);

const gebruiker = useMemo(() => {
  if (!gebruikerRaw) return null;
  try {
    const parsedRoles =
      typeof gebruikerRaw.roles === 'string'
        ? JSON.parse(gebruikerRaw.roles)
        : gebruikerRaw.roles ?? [];


    return {
      ...gebruikerRaw,
      roles: parsedRoles,
    };
  } catch (err) {
    console.error('Error parsing roles:', err);
    return {
      ...gebruikerRaw,
      roles: [],
    };
  }
}, [gebruikerRaw]);


  const {
    isMutating: loginLoading,
    error: loginError,
    trigger: doLogin,
  } = useSWRMutation('sessions', api.post);

  const {
    isMutating: registerLoading,
    error: registerError,
    trigger: doRegister,
  } = useSWRMutation('gebruikers', api.post);

  const setSession = useCallback(
    (token) => {
      setToken(token);
      localStorage.setItem(JWT_TOKEN_KEY, token);
    },
    [],
  );

  const login = useCallback(
    async (naam, wachtwoord) => {
      try {
        const result = await doLogin({
          naam,
          wachtwoord,
        });
        
   
        if (result.error) {
    
          console.error("Login error:", result.error);
          return false;
        }
        
      
        const { token } = result;
        setSession(token);
        return true;
      } catch (error) {
    
        console.error("Unexpected login error:", error);
        return false;
      }
    },
    [doLogin, setSession],
  );

  const register = useCallback(
    async (data) => {
      try {
        const { token } = await doRegister(data);
        setSession(token);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doRegister, setSession],
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(JWT_TOKEN_KEY);
    mutate('gebruikers/me', null, false);
  }, []);

  const value = useMemo(
    () => ({
      gebruiker,
      error: loginError || userError || registerError,
      loading: loginLoading || userLoading || registerLoading,
      isAuthed: Boolean(token),
      ready: !userLoading,
      roles: gebruiker?.roles ?? [],
      login,
      logout,
      register,
    }),
    [
      token,
      gebruiker,
      loginError,
      loginLoading,
      userError,
      userLoading,
      registerError,
      registerLoading,
      login,
      logout,
      register,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
