'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield } from 'lucide-react';

export default function AdminView() {
  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <CardTitle>Administración</CardTitle>
          </div>
          <CardDescription>
              Realiza acciones administrativas críticas. Estas operaciones pueden afectar la configuración y los datos del servidor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <h3 className="font-medium">Editar Definición del Servidor</h3>
                  <p className="text-sm text-muted-foreground">
                      Modifica los detalles fundamentales del servidor.
                  </p>
              </div>
              <Button variant="outline">Editar Definición</Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <h3 className="font-medium">Estado de la Instalación</h3>
                  <p className="text-sm text-muted-foreground">
                      Dispara el proceso de instalación o reinstalación del servidor.
                  </p>
              </div>
              <Button>Instalar</Button>
          </div>

           <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <div>
                  <h3 className="font-medium text-destructive">Eliminar Servidor</h3>
                  <p className="text-sm text-muted-foreground">
                      Esta acción es permanente. Se borrarán todos los archivos y datos del servidor.
                  </p>
              </div>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="destructive">Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el servidor y todos sus datos de la plataforma.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction>Sí, eliminar servidor</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
