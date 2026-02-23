'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TranslationsProvider } from '@/contexts/translations-context';

export type UserRole = 'admin' | 'user';

interface LoginCredentials {
  email: string;
  password?: string;
}

interface AuthContextType {
  role: UserRole | null;
  user: { name: string; email: string; avatar: string } | null;
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
  admin: { name: 'Admin User', email: 'admin@aether.panel', avatar: 'https://picsum.photos/seed/usr-1/40/40' },
  user: { name: 'DevOps Engineer', email: 'devops@aether.panel', avatar: 'https://picsum.photos/seed/usr-2/40/40' },
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let storedRole: UserRole | null = null;
    try {
      storedRole = localStorage.getItem('aether_panel_role') as UserRole;
    } catch (e) {
      console.error('localStorage is not available');
    }

    if (storedRole) {
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const pathname = window.location.pathname;
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (!role && !isAuthPage) {
      window.location.href = '/login';
    }
    if (role && isAuthPage) {
      window.location.href = '/dashboard';
    }
  }, [role, loading]);

  const login = (credentials: LoginCredentials) => {
    setLoading(true);
    let newRole: UserRole | null = null;

    if (credentials.email.toLowerCase() === mockUsers.admin.email) {
      newRole = 'admin';
    } else if (credentials.email.toLowerCase() === mockUsers.user.email) {
      newRole = 'user';
    }

    setTimeout(() => {
      if (newRole) {
        try {
          localStorage.setItem('aether_panel_role', newRole);
          setRole(newRole);
          window.location.href = '/dashboard';
        } catch (e) {
          console.error('localStorage is not available');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid Credentials',
          description: 'Please check your email and password.',
        });
      }
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    try {
      localStorage.removeItem('aether_panel_role');
      setRole(null);
      window.location.href = '/login';
    } catch (e) {
      console.error('localStorage is not available');
    }
  };

  const user = role ? mockUsers[role] : null;

  const value = { role, user, login, logout, loading };

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if ((loading && !isAuthPage) || (!role && !isAuthPage)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Initializing Aether Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationsProvider>
      <AuthProvider>{children}</AuthProvider>
    </TranslationsProvider>
  )
}
