'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'user';

interface AuthContextType {
  role: UserRole | null;
  user: { name: string; email: string; avatar: string } | null;
  login: (role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
  admin: { name: 'Admin User', email: 'admin@aether.panel', avatar: 'https://picsum.photos/seed/admin-user/40/40' },
  user: { name: 'Standard User', email: 'user@aether.panel', avatar: 'https://picsum.photos/seed/standard-user/40/40' },
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
    if (!loading) {
      const isAuthPage = pathname === '/login';
      if (!role && !isAuthPage) {
        router.push('/login');
      }
      if (role && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [role, loading, pathname, router]);

  const login = (newRole: UserRole) => {
    try {
      localStorage.setItem('aether_panel_role', newRole);
      setRole(newRole);
      router.push('/dashboard');
    } catch (e) {
      console.error('localStorage is not available');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('aether_panel_role');
      setRole(null);
      router.push('/login');
    } catch (e) {
      console.error('localStorage is not available');
    }
  };

  const user = role ? mockUsers[role] : null;

  const value = { role, user, login, logout, loading };

  const isAuthPage = pathname === '/login';

  if (loading || (!role && !isAuthPage)) {
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

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
