'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const databases = [
    { name: 'db_production', user: 'prod_user', connections: 5, size: '1.2 GB' },
    { name: 'db_staging', user: 'staging_user', connections: 1, size: '450 MB' },
];

export default function DatabaseView() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Bases de Datos</CardTitle>
                <CardDescription>Gestiona las bases de datos para este servidor.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Nueva Base de Datos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Base de Datos</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="db-name" className="text-right">
                      Nombre de la Base de Datos
                    </Label>
                    <Input id="db-name" placeholder="Nombre de la Base de Datos" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="db-host" className="text-right">
                      Database Host
                    </Label>
                    <Input id="db-host" defaultValue="panel" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Crear Base de Datos</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Conexiones desde</TableHead>
                <TableHead className="text-right">Tamaño</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databases.map((db) => (
                <TableRow key={db.name}>
                  <TableCell className="font-medium">{db.name}</TableCell>
                  <TableCell>{db.user}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">% (Cualquier Host)</Badge>
                  </TableCell>
                  <TableCell className="text-right">{db.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
}
