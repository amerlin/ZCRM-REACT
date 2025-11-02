export interface User {
  userId: string;
  userName: string;
  personName: string;
  personSurname: string;
  aliasName: string;
  email: string;
  hasAdministrativeGrants: boolean;
  isTeamMember: boolean;
  bearerToken: string;
  lastAccessDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  userName: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  profileId: string;
  userName: string;
  personName: string;
  personSurname: string;
  aliasName: string;
  email: string;
  hasAdministrativeGrants: string;
  isTeamMember: string;
  access_token: string;
  lastAccessDate?: string;
}
