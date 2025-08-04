// lib/api/authService.ts
interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  profileId: number;
  salesGroupId: number | null;
  status: string;
}

interface LoginResponse {
  access_token: string;
  user: AuthUser;
  expires_in: string;
}

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

class AuthService {
  private baseUrl: string;
  private token: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Recuperar datos del localStorage si está disponible
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      this.user = userData ? JSON.parse(userData) : null;
    }
  }

  /**
   * Realizar login con la API de PriceFlowFX
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Error de autenticación');
      }

      const data: LoginResponse = await response.json();

      // Guardar en memoria y localStorage
      this.token = data.access_token;
      this.user = data.user;

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<AuthUser> {
    if (!this.token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Sesión expirada');
        }
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Error al obtener perfil');
      }

      const user: AuthUser = await response.json();
      this.user = user;

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(this.user));
      }

      return user;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.token = null;
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Obtener usuario actual
   */
  getUser(): AuthUser | null {
    return this.user;
  }

  /**
   * Validar token con el servidor
   */
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Realizar petición autenticada genérica
   */
  async authenticatedRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error('No hay token de autenticación');
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Sesión expirada');
        }
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en petición autenticada:', error);
      throw error;
    }
  }

  /**
   * Mapear usuarios mock a usuarios reales
   * Esta función es temporal para migrar de usuarios mock a tu API
   */
  mapMockUserToApiUser(mockEmail: string): LoginCredentials | null {
    const mockToApiMapping: Record<string, LoginCredentials> = {
      'trading@forex.com': { username: 'trader01', password: 'trader123!' },
      'sales@forex.com': { username: 'sales01', password: 'sales123!' },
      'middle@forex.com': { username: 'manager01', password: 'manager123!' },
      'admin@forex.com': { username: 'admin', password: 'admin123!' },
    };

    return mockToApiMapping[mockEmail] || null;
  }
}

// Exportar una instancia singleton
export const authService = new AuthService();
export default authService;