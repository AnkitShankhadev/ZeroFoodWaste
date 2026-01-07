import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

type AppRole = "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN";

interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  totalPoints?: number;
  phone?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (
    name: string,
    email: string,
    password: string,
    role: AppRole,
    location?: any,
    phone?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ error: Error | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.getMe();
          if (response.success && response.data.user) {
            setUser(response.data.user);
          } else {
            // Invalid token, remove it
            setToken(null);
          }
        } catch (error) {
          console.error("Failed to load user:", error);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const signUp = async (
    name: string,
    email: string,
    password: string,
    role: AppRole,
    location?: any,
    phone?: string
  ): Promise<{ error: Error | null }> => {
    try {
      const response = await api.register({
        name,
        email,
        password,
        role,
        location,
        phone,
      });

      if (response.success && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { error: null };
      }

      return { error: new Error("Registration failed") };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error : new Error("Registration failed"),
      };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {
    try {
      const response = await api.login(email, password);

      if (response.success && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { error: null };
      }

      return { error: new Error("Login failed") };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error : new Error("Invalid credentials"),
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ error: Error | null }> => {
    try {
      const response = await api.updatePassword(currentPassword, newPassword);

      if (response.success && response.token) {
        setToken(response.token);
        return { error: null };
      }

      return { error: new Error("Password update failed") };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error : new Error("Password update failed"),
      };
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await api.getMe();
      if (response.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        updatePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
