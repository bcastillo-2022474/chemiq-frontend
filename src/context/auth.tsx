// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { loginRequest, verifyAuthRequest } from '@/actions/auth';
import type { Credentials, JwtPayload, User } from "@/types/dto";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
  loading: boolean;
  authenticated: boolean;
  user: User | null;
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<JwtPayload>;
}>(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    user: null
  });

  const verifyAuth = async () => {
    const [error, user] = await verifyAuthRequest();

    if (error) {
      setAuthState({
        loading: false,
        authenticated: false,
        user: null
      });
      return null;
    }

    setAuthState({
      loading: false,
      authenticated: true,
      user
    });
    return user
  };

  const login = async (credentials: Credentials) => {
    const [error] = await loginRequest(credentials);
    if (error) {
      return false;
    }
    const claims = await verifyAuth();
    console.log(claims);


    if (!claims) return false;

    if (claims.rol === 'Admin') navigate('/dashboard/stats');
    if (claims.rol === 'Junta') navigate('/juntapage');
    if (claims.rol === 'User') navigate('/portal');

    return true;
  };

  const logout = async () => {
    // Call logout endpoint to clear cookies
    // await ap.post('/api/logout');
    setAuthState({
      loading: false,
      authenticated: false,
      user: null
    });
  };

  useEffect(() => {
    void verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, verifyAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);