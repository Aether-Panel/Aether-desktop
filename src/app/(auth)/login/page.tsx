'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/providers';
import { Logo } from '@/components/logo';
import { Shield, User, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl" />
      </div>
      
      {/* Login Card with Gradient Border */}
      <div className="relative z-10 w-full max-w-md rounded-xl p-[1px] bg-gradient-to-br from-primary/20 via-primary/50 to-accent/50">
          <Card className="border-0 bg-card/80 backdrop-blur-lg">
              <CardHeader className="items-center text-center space-y-4">
                  <Logo className="mb-2" />
                  <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                  <CardDescription>Select your role to continue to Aether Panel</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                  <Button
                      size="lg"
                      className="w-full text-base py-6 transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg"
                      onClick={() => login('admin')}
                      disabled={loading}
                  >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Shield className="mr-2 h-5 w-5" />}
                      Sign In as Administrator
                  </Button>
                  <Button
                      size="lg"
                      variant="secondary"
                      className="w-full text-base py-6"
                      onClick={() => login('user')}
                      disabled={loading}
                  >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <User className="mr-2 h-5 w-5" />}
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
    </div>
  );
}
