'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/providers';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});


export default function LoginPage() {
  const { login, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
  }

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
                  <CardDescription>Sign in to your Aether Panel account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@aether.panel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                        size="lg"
                        type="submit"
                        className="w-full text-base py-6 transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Sign In
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 text-center">
                <div className="text-xs text-muted-foreground">
                    <p>Use <span className="font-semibold text-foreground">admin@aether.panel</span> for admin access.</p>
                    <p>Use <span className="font-semibold text-foreground">devops@aether.panel</span> for user access.</p>
                    <p>(Any password will work)</p>
                </div>
                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Aether Panel. All rights reserved.
                </p>
              </CardFooter>
          </Card>
      </div>
    </div>
  );
}
