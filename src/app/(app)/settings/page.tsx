'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Mail } from 'lucide-react';


export default function SettingsPage() {
    const { role } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    
    // State for form fields
    const [companyName, setCompanyName] = useState('Aether Panel');
    const [baseUrl, setBaseUrl] = useState('http://localhost:8080');
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [mailProvider, setMailProvider] = useState('');

    useEffect(() => {
        setIsMounted(true);
        if (role && role !== 'admin') {
          router.push('/dashboard');
        }
    }, [role, router]);
    
    if (!isMounted || role !== 'admin') {
        return (
            <div className="flex h-full items-center justify-center">
              <p>Loading...</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Configuración del Panel" description="Administra la configuración global de tu instancia de Aether Panel." />
            
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">
                        <Settings className="mr-2 h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="discord">
                        <Bell className="mr-2 h-4 w-4" />
                        Notificaciones Discord
                    </TabsTrigger>
                    <TabsTrigger value="mail">
                        <Mail className="mr-2 h-4 w-4" />
                        Correo
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
                        <Card className="border-0">
                            <CardHeader>
                                <CardTitle>Configuración General</CardTitle>
                                <CardDescription>Ajusta la configuración principal de la aplicación.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="base-url">URL Principal</Label>
                                    <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
                                    <p className="text-sm text-muted-foreground">El enlace desde el cual accederás al panel de control siguiendo el siguiente formato: http://localhost:8080</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company-name">Nombre de la empresa</Label>
                                    <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label htmlFor="allow-registration" className="font-medium">Permitir que los usuarios se puedan registrar</Label>
                                        <p className="text-sm text-muted-foreground max-w-prose mt-1">
                                            Los usuarios autorregistrados no pueden realizar ninguna acción hasta que se les otorguen permisos. Deshabilitar esto solo impide el registro directo, las invitaciones a un servidor y la página de Usuarios no se ven afectadas.
                                        </p>
                                    </div>
                                    <Switch id="allow-registration" checked={allowRegistration} onCheckedChange={setAllowRegistration} />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button>Guardar configuración</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="discord">
                    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
                        <Card className="border-0">
                            <CardHeader>
                                <CardTitle>Notificaciones Discord</CardTitle>
                                <CardDescription>Conecta webhooks de Discord para recibir alertas y notificaciones del sistema.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="webhook-alerts">Webhook de Discord - Alertas de Servidores</Label>
                                    <Input id="webhook-alerts" placeholder="Webhook de Discord - Alertas de Servidores" />
                                    <p className="text-sm text-muted-foreground">URL del webhook de Discord para recibir alertas de servidores (online/offline, uso de recursos, backups, etc.)</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="webhook-reports">Webhook de Discord - Informes del Sistema</Label>
                                    <Input id="webhook-reports" placeholder="Webhook de Discord - Informes del Sistema" />
                                    <p className="text-sm text-muted-foreground">URL del webhook de Discord para recibir informes periódicos del estado completo del sistema</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="webhook-status">Webhook de Discord - Estado del Nodo</Label>
                                    <Input id="webhook-status" placeholder="Webhook de Discord - Estado del Nodo" />
                                    <p className="text-sm text-muted-foreground">URL del webhook de Discord para recibir información sobre el estado del nodo/nodos</p>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <Button variant="secondary">Probar Webhook</Button>
                                    <Button>Guardar configuración</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="mail">
                     <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
                        <Card className="border-0">
                            <CardHeader>
                                <CardTitle>Configuración del correo</CardTitle>
                                <CardDescription>Configura un proveedor para enviar correos transaccionales.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="mail-provider">Proveedor de e-mail</Label>
                                    <Select onValueChange={setMailProvider}>
                                        <SelectTrigger id="mail-provider">
                                            <SelectValue placeholder="Selecciona un proveedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="smtp">SMTP</SelectItem>
                                            <SelectItem value="mailgun">Mailgun</SelectItem>
                                            <SelectItem value="mailjet">Mailjet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">Selecciona el proveedor de correo electrónico que deseas usar para enviar emails desde el panel</p>
                                </div>

                                {!mailProvider && (
                                    <div className="text-center text-muted-foreground py-6">
                                        <p>Selecciona un proveedor de correo electrónico para ver las opciones de configuración</p>
                                    </div>
                                )}

                                {mailProvider === 'smtp' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label htmlFor="smtp-from">Dirección del remitente</Label>
                                            <Input id="smtp-from" placeholder="no-reply@aether.panel" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="smtp-host">Host</Label>
                                            <Input id="smtp-host" placeholder="smtp.example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="smtp-user">Usuario</Label>
                                            <Input id="smtp-user" placeholder="Usuario SMTP" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="smtp-pass">Contraseña</Label>
                                            <Input id="smtp-pass" type="password" placeholder="••••••••" />
                                        </div>
                                    </div>
                                )}

                                {mailProvider === 'mailgun' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label htmlFor="mailgun-domain">Dominio</Label>
                                            <Input id="mailgun-domain" placeholder="mg.example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mailgun-from">Dirección del remitente</Label>
                                            <Input id="mailgun-from" placeholder="no-reply@aether.panel" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="mailgun-key">Clave API</Label>
                                            <Input id="mailgun-key" type="password" placeholder="••••••••" />
                                        </div>
                                    </div>
                                )}

                                {mailProvider === 'mailjet' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label htmlFor="mailjet-domain">Dominio</Label>
                                            <Input id="mailjet-domain" placeholder="example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mailjet-from">Dirección del remitente</Label>
                                            <Input id="mailjet-from" placeholder="no-reply@aether.panel" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="mailjet-key">Clave API</Label>
                                            <Input id="mailjet-key" type="password" placeholder="••••••••" />
                                        </div>
                                    </div>
                                )}
                                
                                {mailProvider && (
                                  <>
                                    <Separator className="mt-6" />
                                    <div className="flex justify-between items-center pt-4">
                                        <Button variant="secondary">Email de prueba</Button>
                                        <Button>Guardar configuración</Button>
                                    </div>
                                  </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
