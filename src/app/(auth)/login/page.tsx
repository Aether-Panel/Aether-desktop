'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/providers';
import { Logo } from '@/components/logo';
import { Shield, User } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" />
          <CardTitle className="text-2xl">Welcome to Aether Panel</CardTitle>
          <CardDescription>Select your role to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => login('admin')}
            disabled={loading}
          >
            <Shield className="mr-2 h-5 w-5" />
            Sign In as Administrator
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            onClick={() => login('user')}
            disabled={loading}
          >
            <User className="mr-2 h-5 w-5" />
            Sign In as User
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aether Panel. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
