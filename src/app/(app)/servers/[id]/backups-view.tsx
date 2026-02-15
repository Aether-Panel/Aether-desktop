'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// This is mock data. In a real application, you'd fetch this from your server.
const initialBackups: any[] = [];

export default function BackupsView() {
  const [backupsList, setBackupsList] = useState(initialBackups);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Copia de seguridad</CardTitle>
            <CardDescription>{backupsList.length} backups</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Crear copia de seguridad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear copia de seguridad</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="backup-name" className="text-right">
                    Nombre
                  </Label>
                  <Input id="backup-name" placeholder="Nombre de la copia de seguridad" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Crear copia de seguridad</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {backupsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
            <Archive className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No hay copias de seguridad</h3>
            <p className="text-muted-foreground">Crea tu primer backup para comenzar.</p>
          </div>
        ) : (
          // In a real app, you would map over `backupsList` and render a table or list here.
          <p>Tabla de backups...</p>
        )}
      </CardContent>
    </Card>
  );
}
