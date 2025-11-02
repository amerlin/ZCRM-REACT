import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthResponse } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasAdministrativeGrants: boolean;
  login: (profile: AuthResponse, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('basicAuthentication');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        setUser({
          userId: authData.userId,
          userName: authData.userName,
          personName: authData.personName,
          personSurname: authData.personSurname,
          aliasName: authData.aliasName,
          email: authData.email,
          hasAdministrativeGrants: authData.hasAdministrativeGrants === true || authData.hasAdministrativeGrants === 'true',
          isTeamMember: authData.isTeamMember === true || authData.isTeamMember === 'true',
          bearerToken: authData.token,
          lastAccessDate: authData.lastAccessDate
        });
      }
    } catch (error) {
      console.error('Failed to parse auth data', error);
      localStorage.removeItem('basicAuthentication');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((profile: AuthResponse, rememberMe: boolean) => {
    const userData: User = {
      userId: profile.profileId,
      userName: profile.userName,
      personName: profile.personName,
      personSurname: profile.personSurname,
      aliasName: profile.aliasName,
      email: profile.email,
      hasAdministrativeGrants: profile.hasAdministrativeGrants?.toUpperCase() === 'TRUE',
      isTeamMember: profile.isTeamMember?.toUpperCase() === 'TRUE',
      bearerToken: profile.access_token,
      lastAccessDate: profile.lastAccessDate || new Date().toISOString()
    };

    setUser(userData);

    if (rememberMe) {
      const forStorage = {
        userId: userData.userId,
        userName: userData.userName,
        personName: userData.personName,
        personSurname: userData.personSurname,
        aliasName: userData.aliasName,
        email: userData.email,
        hasAdministrativeGrants: userData.hasAdministrativeGrants,
        isTeamMember: userData.isTeamMember,
        token: userData.bearerToken,
        lastAccessDate: userData.lastAccessDate
      };
      localStorage.setItem('basicAuthentication', JSON.stringify(forStorage));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('basicAuthentication');
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    hasAdministrativeGrants: user?.hasAdministrativeGrants || false,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
