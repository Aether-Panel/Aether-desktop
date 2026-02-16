'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type Role = {
  name: string;
  description: string;
  permissions: string[];
};

const initialRoles: Role[] = [
  {
    name: 'admin',
    description: 'Acceso total a todas las funciones y configuraciones del panel.',
    permissions: ['Conceder todos los permisos'],
  },
  {
    name: 'user',
    description: 'Acceso básico para iniciar sesión y gestionar su propia cuenta.',
    permissions: ['Iniciar sesión', 'Editar mi cuenta'],
  },
];

const allPermissions = [
    "Conceder todos los permisos",
    "Iniciar sesión",
    "Editar mi cuenta",
    "Administrar mis clientes OAuth2",
    "Editar configuración del panel",
    "Crear nuevos servidores",
    "Ver Nodos",
    "Crear nuevos nodos",
    "Editar nodos existentes",
    "Desplegar nodos",
    "Eliminar nodos",
    "Ver lista de todos los usuarios",
    "Ver información de usuarios",
    "Editar información de usuarios",
    "Ver permisos de usuario",
    "Editar permisos de usuario",
    "Ver plantillas",
    "Crear/Editar/Eliminar plantillas locales",
    "Ver repositorios de plantillas",
    "Añadir repositorios de plantillas",
    "Eliminar repositorios de plantillas",
];

export default function RolesPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New role form state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setNewRolePermissions(prev => 
      checked ? [...prev, permission] : prev.filter(p => p !== permission)
    );
  };

  const handleAddRole = () => {
    if (!newRoleName || !newRoleDescription) return; // Basic validation
    
    const newRole: Role = {
      name: newRoleName,
      description: newRoleDescription,
      permissions: newRolePermissions,
    };

    setRoles(prev => [...prev, newRole]);
    
    // Reset form and close dialog
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRolePermissions([]);
    setIsAddDialogOpen(false);
  };

  if (!isMounted || role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Role Management" description="View details and permissions for each user role.">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Role
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                        Create a new role and assign permissions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="role-name"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., developer"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="role-description" className="text-right pt-2">
                            Description
                        </Label>
                        <Textarea
                            id="role-description"
                            value={newRoleDescription}
                            onChange={(e) => setNewRoleDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="A short description of the role."
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">
                            Permissions
                        </Label>
                        <div className="col-span-3 space-y-2">
                            {allPermissions.map(permission => (
                                <div key={permission} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`perm-${permission.replace(/\s+/g, '-')}`}
                                        onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                                        checked={newRolePermissions.includes(permission)}
                                    />
                                    <label
                                        htmlFor={`perm-${permission.replace(/\s+/g, '-')}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {permission}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleAddRole}>Create Role</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.name}>
                  <TableCell>
                    <Badge variant={role.name === 'admin' ? 'default' : 'secondary'} className="capitalize">{role.name}</Badge>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map(permission => (
                        <Badge key={permission} variant="outline">{permission}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
