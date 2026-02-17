'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/app/providers';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Configuración de la cuenta" description="Administra la configuración de tu perfil, seguridad y más." />

      <div className="space-y-8">
        {/* Configuración */}
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="es">
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">español (España)</SelectItem>
                    <SelectItem value="en">English (US)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Ayúdanos a traducir Aether Panel.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar configuración</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Cambiar detalles de la cuenta */}
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Cambiar detalles de la cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input id="username" defaultValue={user?.name.split(' ')[0].toLowerCase() || 'admin'} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password-details">Confirme la contraseña</Label>
                <Input id="confirm-password-details" type="password" placeholder="Confirme la contraseña" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Cambiar detalles de la cuenta</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Cambiar contraseña */}
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Contraseña antigua</Label>
                <Input id="old-password" type="password" placeholder="Contraseña antigua" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input id="new-password" type="password" placeholder="Nueva contraseña" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password-change">Confirme la contraseña</Label>
                <Input id="confirm-password-change" type="password" placeholder="Confirme la contraseña" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Cambiar contraseña</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Autenticación de dos pasos */}
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Autenticación de dos pasos</CardTitle>
              <CardDescription>
                La autenticación de dos pasos agrega una capa de seguridad adicional a tu cuenta, requiriendo un código especial además de tu contraseña.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Habilitar 2FA</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Clientes de OAuth2 */}
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Clientes de OAuth2</CardTitle>
              <CardDescription>
                Los clientes de OAuth2 listados aquí heredan todos los permisos de sus cuentas.
                Encuentra la documentation de la API <Link href="#" className="text-primary hover:underline">aquí</Link>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground py-4">
                No hay clientes de OAuth2 configurados para esta cuenta.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Crear nuevo cliente OAuth2</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
