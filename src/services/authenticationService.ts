import httpClient from '../config/httpClient';
import type { AuthResponse } from '../types/auth.types';

export const authenticationService = {
  async signIn(userName: string, password: string): Promise<AuthResponse> {
  const data = `grant_type=password&username=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`;
    
    const response = await httpClient.post<AuthResponse>('/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  },

  async signOut(): Promise<void> {
    // Logout is handled by AuthContext
    return Promise.resolve();
  }
};
