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

export default function SettingsPage() {
    const { role } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    
    // State for form fields
    const [companyName, setCompanyName] = useState('Aether Panel');
    const [baseUrl, setBaseUrl] = useState('http://localhost:8080');
    const [allowRegistration, setAllowRegistration] = useState(true);

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
            
            {/* General Settings Card */}
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle>Configuración General</CardTitle>
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
                         <div className="flex justify-end">
                            <Button>Guardar configuración del panel</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Discord Notifications Card */}
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle>Notificaciones Discord</CardTitle>
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
                        <div className="flex justify-between items-center">
                            <Button variant="secondary">Probar Webhook Discord</Button>
                            <Button>Guardar configuración del panel</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Email Settings Card */}
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle>Configuración del correo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="mail-provider">Proveedor de e-mail</Label>
                            <Select>
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

                        <div className="text-center text-muted-foreground py-6">
                            <p>Selecciona un proveedor de correo electrónico para ver las opciones de configuración</p>
                        </div>
                        
                        <Separator />

                        <div className="flex justify-between items-center">
                            <Button variant="secondary">Email de prueba</Button>
                            <Button>Guardar configuración del correo electrónico</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}