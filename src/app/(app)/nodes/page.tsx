'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Copy, MoreHorizontal, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { nodes as nodesData } from '@/lib/data';
import type { Node } from '@/lib/data';

export default function NodesPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>(nodesData);
  const [isMounted, setIsMounted] = useState(false);
  const [useDifferentHost, setUseDifferentHost] = useState(false);
  const { toast } = useToast();

  // Edit state
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editName, setEditName] = useState('');
  const [editPublicHost, setEditPublicHost] = useState('');
  const [editPublicPort, setEditPublicPort] = useState('8080');
  const [editSftpPort, setEditSftpPort] = useState('5657');
  const [editUseDifferentHost, setEditUseDifferentHost] = useState(false);
  const [editPrivateHost, setEditPrivateHost] = useState('');
  const [editPrivatePort, setEditPrivatePort] = useState('8080');
  
  // Deploy state
  const [deployingNode, setDeployingNode] = useState<Node | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  useEffect(() => {
    if (editingNode) {
        setEditName(editingNode.name);
        setEditPublicHost(editingNode.publicHost);
        setEditPublicPort(String(editingNode.publicPort));
        setEditSftpPort(String(editingNode.sftpPort));
        setEditUseDifferentHost(editingNode.useDifferentHost);
        setEditPrivateHost(editingNode.privateHost || '');
        setEditPrivatePort(String(editingNode.privatePort || '8080'));
    }
  }, [editingNode]);

  const handleUpdateNode = () => {
    if (!editingNode) return;
    setNodes(nodes.map(n => 
        n.id === editingNode.id 
            ? { 
                ...n, 
                name: editName,
                publicHost: editPublicHost,
                publicPort: parseInt(editPublicPort, 10),
                sftpPort: parseInt(editSftpPort, 10),
                useDifferentHost: editUseDifferentHost,
                privateHost: editUseDifferentHost ? editPrivateHost : undefined,
                privatePort: editUseDifferentHost ? parseInt(editPrivatePort, 10) : undefined,
              } 
            : n
    ));
    setEditingNode(null);
  };

  const StatusIndicator = ({ status }: { status: Node['status'] }) => {
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      deploying: 'bg-yellow-500 animate-pulse',
    };
    return <div className={`mr-2 h-2.5 w-2.5 rounded-full ${statusClasses[status]}`} />;
  };

  const CopyableCode = ({ command }: { command: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        toast({ title: 'Copiado al portapapeles' });
    };

    return (
        <div className="flex items-center gap-2 rounded-md bg-muted p-2 my-2 font-mono text-sm">
            <pre className="flex-grow overflow-x-auto"><code>{command}</code></pre>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar</span>
            </Button>
        </div>
    );
  };

  const deployConfigJson = deployingNode ? JSON.stringify({
    "logs": "/var/log/AetherPanel",
    "web": {
      "host": "0.0.0.0:8080"
    },
    "token": {
      "public": "http://192.168.0.12:8080/auth/publickey"
    },
    "panel": {
      "enable": false
    },
    "daemon": {
      "auth": {
        "url": "http://192.168.0.12:8080/oauth2/token",
        "clientId": `.node_${deployingNode.id.split('-')[1]}`,
        "clientSecret": "7bdb03bbfbd44aeda8e2a4fc52035c38",
        "publicKey": ""
      },
      "data": {
        "root": "/var/lib/AetherPanel"
      },
      "sftp": {
        "host": `0.0.0.0:${deployingNode.sftpPort}`
      }
    }
  }, null, 2) : '';

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
                <Checkbox 
                  id="use-different-host" 
                  checked={useDifferentHost}
                  onCheckedChange={(checked) => setUseDifferentHost(Boolean(checked))}
                />
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
              {useDifferentHost && (
                <div className="grid grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4 animate-in fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="private-host">Anfitrión Privado</Label>
                    <Input id="private-host" placeholder="Anfitrión Privado" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="private-port">Puerto Privado</Label>
                    <Input id="private-port" type="number" defaultValue="8080" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Crear Nodo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
        <Card className="border-0">
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
                    <TableCell className="font-medium">
                      <Link href={`/nodes/${node.id}`} className="hover:underline">
                        {node.name}
                      </Link>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => setTimeout(() => setEditingNode(node))}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeployingNode(node)}>Deploy</DropdownMenuItem>
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
      {/* Edit Node Dialog */}
      <Dialog open={!!editingNode} onOpenChange={(isOpen) => !isOpen && setEditingNode(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Nodo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-node-name">Nombre</Label>
                <Input id="edit-node-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-public-host">Anfitrión público</Label>
                <Input id="edit-public-host" value={editPublicHost} onChange={(e) => setEditPublicHost(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-public-port">Puerto público</Label>
                <Input id="edit-public-port" type="number" value={editPublicPort} onChange={(e) => setEditPublicPort(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sftp-port">Puerto SFTP</Label>
                <Input id="edit-sftp-port" type="number" value={editSftpPort} onChange={(e) => setEditSftpPort(e.target.value)} />
              </div>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox 
                id="edit-use-different-host" 
                checked={editUseDifferentHost}
                onCheckedChange={(checked) => setEditUseDifferentHost(Boolean(checked))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="edit-use-different-host"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Usar un host/puerto diferente para la comunicación entre servidores
                </label>
                <p className="text-sm text-muted-foreground">
                  Esta dirección separada se utiliza cuando el nodo principal necesita comunicarse con el nuevo nodo. Esto es útil por ejemplo cuando los nodos están en la misma red detrás de NAT.
                </p>
              </div>
            </div>
            {editUseDifferentHost && (
              <div className="grid grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label htmlFor="edit-private-host">Anfitrión Privado</Label>
                  <Input id="edit-private-host" value={editPrivateHost} onChange={(e) => setEditPrivateHost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-private-port">Puerto Privado</Label>
                  <Input id="edit-private-port" type="number" value={editPrivatePort} onChange={(e) => setEditPrivatePort(e.target.value)} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNode(null)}>Cancel</Button>
            <Button type="submit" onClick={handleUpdateNode}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Deploy Node Dialog */}
      <Dialog open={!!deployingNode} onOpenChange={(isOpen) => !isOpen && setDeployingNode(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Deploy Node: {deployingNode?.name}</DialogTitle>
            <DialogDescription>
              Sigue estos pasos para configurar y conectar tu nuevo nodo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[70vh] overflow-y-auto pr-4 space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">1</div>
                <div>
                    <h4 className="font-semibold">Paso 1: Instala AetherPanel en el nuevo servidor.</h4>
                    <p className="text-sm text-muted-foreground">Consulta la documentación para más detalles.</p>
                </div>
            </div>
            {/* Step 2 */}
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">2</div>
                <div>
                    <h4 className="font-semibold">Paso 2: Detén el servicio de AetherPanel.</h4>
                    <p className="text-sm text-muted-foreground">Si se inició durante la instalación, ejecuta el siguiente comando:</p>
                    <CopyableCode command="sudo systemctl stop AetherPanel" />
                </div>
            </div>
            {/* Step 3 */}
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">3</div>
                <div>
                    <h4 className="font-semibold">Paso 3: Reemplaza el archivo de configuración.</h4>
                    <p className="text-sm text-muted-foreground">El archivo se encuentra en <code className="bg-muted px-1 rounded-sm">/etc/AetherPanel/config.json</code>. Reemplaza su contenido con lo siguiente:</p>
                    <CopyableCode command={deployConfigJson} />
                </div>
            </div>
            {/* Step 4 */}
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">4</div>
                <div>
                    <h4 className="font-semibold">Paso 4: Habilita y reinicia el servicio.</h4>
                    <p className="text-sm text-muted-foreground">Ejecuta el siguiente comando para completar la configuración:</p>
                     <CopyableCode command="sudo systemctl enable --now AetherPanel" />
                     <p className="mt-4 text-sm font-semibold text-green-500">¡Tu nuevo nodo está configurado y listo para usar!</p>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployingNode(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
