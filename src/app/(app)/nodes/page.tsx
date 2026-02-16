'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

type Node = {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'deploying';
};

const initialNodes: Node[] = [
    { id: 'node-1', name: 'US-East-1', location: 'N. Virginia, USA', status: 'online' },
    { id: 'node-2', name: 'EU-West-1', location: 'Ireland', status: 'online' },
    { id: 'node-3', name: 'AP-South-1', location: 'Mumbai, India', status: 'offline' },
];


export default function NodesPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  const StatusIndicator = ({ status }: { status: Node['status'] }) => {
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      deploying: 'bg-yellow-500 animate-pulse',
    };
    return <div className={`mr-2 h-2.5 w-2.5 rounded-full ${statusClasses[status]}`} />;
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
      <PageHeader title="Node Management" description="Manage all deployment nodes for your servers.">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Add Node
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nodo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="node-name">Nombre</Label>
                  <Input id="node-name" placeholder="Nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="public-host">Anfitrión público</Label>
                  <Input id="public-host" placeholder="Anfitrión público" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="public-port">Puerto público</Label>
                  <Input id="public-port" type="number" defaultValue="8080" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sftp-port">Puerto SFTP</Label>
                  <Input id="sftp-port" type="number" defaultValue="5657" />
                </div>
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="use-different-host" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="use-different-host"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Usar un host/puerto diferente para la comunicación entre servidores
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Esta dirección separada se utiliza cuando el nodo principal necesita comunicarse con el nuevo nodo. Esto es útil por ejemplo cuando los nodos están en la misma red detrás de NAT.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Nodo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>All Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>{node.location}</TableCell>
                  <TableCell>
                    <Badge variant={node.status === 'online' ? 'default' : node.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit">
                      <StatusIndicator status={node.status} />
                      {node.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Deploy</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
