'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as React from 'react';
import { useServerConfig, type ServerConfig } from '@/hooks/use-server-config';
import { useSound } from '@/hooks/use-sound';
import { chipsHandle6Sound } from '@/sounds/chips-handle-6';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Server, Network, Loader2, Settings2 } from 'lucide-react';

const formSchema = z.object({
    serverUrl: z
        .string()
        .min(1, { message: 'Domain or IP is required.' })
        .regex(/^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$|^(\d{1,3}\.){3}\d{1,3}$/, {
            message: 'Please enter a valid IP address or domain.',
        }),
    port: z
        .string()
        .min(1, { message: 'Port is required.' })
        .regex(/^\d+$/, { message: 'Port must be a number.' })
        .refine((val) => {
            const portNum = parseInt(val, 10);
            return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
        }, { message: 'Port must be between 1 and 65535.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ServerConfigPage() {
    const { saveConfig, isConfigured } = useServerConfig();
    const { playSound, playClick, playPop } = useSound();
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        const hasPlayed = localStorage.getItem('setup-welcome-sound-played');
        if (!hasPlayed) {
            // Pequeño retraso para asegurar que la página esté lista y mejorar la compatibilidad del navegador
            const timer = setTimeout(() => {
                playSound(chipsHandle6Sound);
                localStorage.setItem('setup-welcome-sound-played', 'true');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [playSound]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serverUrl: '',
            port: '8080',
        },
    });

    async function onSubmit(values: FormValues) {
        setIsSaving(true);
        try {
            const config: ServerConfig = {
                serverUrl: values.serverUrl,
                port: values.port,
            };
            saveConfig(config);
            window.location.href = '/login';
        } finally {
            setIsSaving(false);
        }
    }

    React.useEffect(() => {
        if (isConfigured) {
            window.location.href = '/login';
        }
    }, [isConfigured]);

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 h-[30rem] w-full bg-[radial-gradient(circle_500px_at_50%_200px,#2563eb33,transparent)]"></div>
            </div>

            <div className="w-full max-w-md rounded-xl p-[1px] bg-gradient-to-br from-primary/20 via-accent/50 to-secondary/50">
                <Card className="border-0 bg-card/80 backdrop-blur-lg animate-in fade-in-0 zoom-in-95 duration-500">
                    <CardHeader className="items-center text-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Settings2 className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Server Setup</CardTitle>
                        <CardDescription>
                            Configure the server connection to access the application
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="serverUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Domain or IP</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Network className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="0.0.0.0 or api.example.com"
                                                        {...field}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="port"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Port</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        placeholder="3000"
                                                        {...field}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    size="lg"
                                    type="submit"
                                    className="group relative w-full overflow-hidden text-base py-7 transition-all duration-300 hover:shadow-primary/40 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] bg-primary hover:bg-primary/90"
                                    disabled={isSaving}
                                    onMouseEnter={() => playPop()}
                                    onClick={() => playClick()}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {isSaving ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                Save Configuration
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center">
                        <p className="text-xs text-muted-foreground pt-4 mt-2 border-t border-border/50 w-full">
                            Enter your server details to continue
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}