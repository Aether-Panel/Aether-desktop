'use client';
import { nodes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Cpu, HardDrive, MemoryStick, Server as ServerIcon, CheckCircle, Code, Info, Trash2, Rocket, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function NodeDetailPage({ params }: { params: { id: string } }) {
  const node = nodes.find(n => n.id === params.id);

  if (!node) {
    notFound();
  }

  const [editName, setEditName] = useState(node.name);
  const [editPublicHost, setEditPublicHost] = useState(node.publicHost);
  const [editPublicPort, setEditPublicPort] = useState(String(node.publicPort));
  const [editSftpPort, setEditSftpPort] = useState(String(node.sftpPort));
  const [editUseDifferentHost, setEditUseDifferentHost] = useState(node.useDifferentHost);
  const [editPrivateHost, setEditPrivateHost] = useState(node.privateHost || '');
  const [editPrivatePort, setEditPrivatePort] = useState(String(node.privatePort || '8080'));

  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const { toast } = useToast();

  const onlineServers = node.serversOnNode.filter(s => s.status === 'online').length;
  const offlineServers = node.serversOnNode.length - onlineServers;

  const InfoItem = ({ label, value, children }: { label: string, value?: React.ReactNode, children?: React.ReactNode }) => (
    <div className="flex items-start justify-between text-sm">
        <p className="text-muted-foreground">{label}</p>
        {value ? <p className="font-medium text-right text-wrap">{value}</p> : children}
    </div>
  );

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

  const deployConfigJson = node ? JSON.stringify({
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
        "clientId": `.node_${node.id.split('-')[1]}`,
        "clientSecret": "7bdb03bbfbd44aeda8e2a4fc52035c38",
        "publicKey": ""
      },
      "data": {
        "root": "/var/lib/AetherPanel"
      },
      "sftp": {
        "host": `0.0.0.0:${node.sftpPort}`
      }
    }
  }, null, 2) : '';

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={node.name} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Servidores</CardTitle>
              <ServerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{node.serversOnNode.length}</div>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado de Servidores</CardTitle>
              <ServerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-xl font-bold">{onlineServers} en línea</div>
               <p className="text-xs text-muted-foreground">{offlineServers} fuera de línea</p>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uso de Memoria</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{node.systemInfo.memory.used} MB</div>
              <p className="text-xs text-muted-foreground">de {node.isLocal ? `${node.systemInfo.memory.total} GB` : '∞'}</p>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uso de CPU</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{node.systemInfo.cpu.usage}%</div>
              <p className="text-xs text-muted-foreground">de ∞</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert variant="default" className="border-green-500/50 bg-green-500/10 text-green-200">
        <CheckCircle className="h-4 w-4 !text-green-500" />
        <AlertTitle className="text-green-400">Este nodo está configurado correctamente y en funcionamiento</AlertTitle>
      </Alert>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
              <Card className="border-0">
                  <CardHeader>
                      <CardTitle>Información del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoItem label="Sistema Operativo" value={node.systemInfo.os} />
                          <InfoItem label="Arquitectura de la CPU" value={node.systemInfo.architecture} />
                          <InfoItem label="Versión" value={node.systemInfo.version} />
                          <InfoItem label="Dirección Pública" value={`${node.publicHost}:${node.publicPort}`} />
                          <InfoItem label="Entornos Disponibles">
                              <Badge variant="secondary">
                                  <Code className="mr-2 h-3 w-3" /> Docker
                              </Badge>
                          </InfoItem>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t">
                          <h4 className="md:col-span-2 font-semibold text-base mb-2">General</h4>
                          <InfoItem label="Nombre del Host" value={node.systemInfo.hostname} />
                          <InfoItem label="Plataforma" value={node.systemInfo.platform} />
                          <InfoItem label="Tiempo Activo" value={node.systemInfo.uptime} />
                      </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t">
                          <h4 className="md:col-span-2 font-semibold text-base mb-2">CPU</h4>
                          <InfoItem label="Modelo" value={node.systemInfo.cpu.model} />
                          <InfoItem label="Núcleos Físicos" value={node.systemInfo.cpu.physicalCores} />
                          <InfoItem label="Hilos Lógicos" value={node.systemInfo.cpu.logicalCores} />
                      </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t">
                          <h4 className="md:col-span-2 font-semibold text-base mb-2">Memoria</h4>
                          <InfoItem label="Total" value={`${node.systemInfo.memory.total} GB`} />
                          <InfoItem label="Usado" value={`${node.systemInfo.memory.used} MB`} />
                          <InfoItem label="Libre" value={`${node.systemInfo.memory.free} GB`} />
                      </div>
                  </CardContent>
              </Card>
            </div>

            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
              <Card className="border-0">
                  <CardHeader>
                      <CardTitle>Discos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {node.systemInfo.disks.map((disk, index) => (
                          <div key={index} className="space-y-2">
                             <div className="flex justify-between text-sm">
                                 <p className="font-mono">{disk.path}</p>
                                 <p className="text-muted-foreground">{disk.size}</p>
                             </div>
                             <Progress value={disk.usage} />
                          </div>
                      ))}
                  </CardContent>
              </Card>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
              <Card className="border-0">
                  <CardHeader>
                      <CardTitle>Servidores en este Nodo</CardTitle>
                  </CardHeader>
                  <CardContent>
                      {node.serversOnNode.length > 0 ? (
                          <ul className="space-y-2">
                              {node.serversOnNode.map(server => (
                                  <li key={server.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                      <div>
                                          <p className="font-medium">{server.name}</p>
                                          <p className="text-xs text-muted-foreground">{server.type}</p>
                                      </div>
                                      <Link href={`/servers/${server.id}`}>
                                          <Button variant="ghost" size="sm">Ver</Button>
                                      </Link>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">No hay servidores en este nodo.</p>
                      )}
                  </CardContent>
              </Card>
            </div>
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
              <Card className="border-0">
                  <CardHeader>
                      <CardTitle>Editar Nodo</CardTitle>
                  </CardHeader>
                  <CardContent>
                      {node.isLocal ? (
                          <Alert variant="default">
                              <Info className="h-4 w-4" />
                              <AlertTitle>No se puede editar</AlertTitle>
                              <AlertDescription>
                                  El nodo local no tiene ninguna configuración que se pueda editar. Para cambiar el host mostrado, ajusta la URL maestra del panel en la configuración.
                              </AlertDescription>
                          </Alert>
                      ) : (
                          <div className="space-y-6">
                              <div className="space-y-2">
                                  <Label htmlFor="edit-node-name">Nombre</Label>
                                  <Input id="edit-node-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="edit-public-host">Anfitrión público</Label>
                                  <Input id="edit-public-host" value={editPublicHost} onChange={(e) => setEditPublicHost(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="edit-public-port">Puerto público</Label>
                                  <Input id="edit-public-port" type="number" value={editPublicPort} onChange={(e) => setEditPublicPort(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="edit-sftp-port">Puerto SFTP</Label>
                                  <Input id="edit-sftp-port" type="number" value={editSftpPort} onChange={(e) => setEditSftpPort(e.target.value)} />
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
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4 animate-in fade-in">
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
                              <Button className="w-full">Actualizar Nodo</Button>
                              <Separator />
                              <div className="flex flex-col space-y-2">
                                  <Button variant="destructive" className="w-full">
                                      <Trash2 className="mr-2" />
                                      Borrar Nodo
                                  </Button>
                                  <Button variant="secondary" className="w-full" onClick={() => setIsDeployDialogOpen(true)}>
                                      <Rocket className="mr-2" />
                                      Desplegar Nodo
                                  </Button>
                              </div>
                          </div>
                      )}
                  </CardContent>
              </Card>
            </div>
        </div>
      </div>
      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Deploy Node: {node.name}</DialogTitle>
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
            <Button variant="outline" onClick={() => setIsDeployDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
