'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Fragment } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Info, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type DatabaseHost = {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
};

const initialHosts: DatabaseHost[] = [
    { id: 'host-1', name: 'Panel Local', host: '127.0.0.1', port: 3306, user: 'root' }
];

const stepTitles = ['Credenciales', 'Instrucciones', 'Configuración'];

const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => (
    <div className="flex items-start justify-between px-4 py-2">
        {steps.map((step, index) => (
            <Fragment key={step}>
                <div className="flex flex-col items-center gap-2 w-24 text-center">
                    <div
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300",
                            currentStep > index + 1 ? "bg-primary text-primary-foreground" :
                            currentStep === index + 1 ? "border-2 border-primary text-primary" : "bg-muted text-muted-foreground"
                        )}
                    >
                        {currentStep > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
                    </div>
                    <p className={cn(
                        "text-xs transition-colors duration-300",
                        currentStep === index + 1 ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>{step}</p>
                </div>
                {index < steps.length - 1 && (
                    <div className={cn(
                        "flex-1 h-0.5 mt-4 transition-colors duration-300",
                        currentStep > index + 1 ? "bg-primary" : "bg-border"
                    )} />
                )}
            </Fragment>
        ))}
    </div>
);


export default function DatabaseHostsPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hosts, setHosts] = useState<DatabaseHost[]>(initialHosts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // New host form state
  const [newHostName, setNewHostName] = useState('');
  const [newHostHost, setNewHostHost] = useState('0.0.0.0');
  const [newHostPort, setNewHostPort] = useState('3306');
  const [newHostUser, setNewHostUser] = useState('root');
  const [newHostPassword, setNewHostPassword] = useState('');
  const [newHostMaxDatabases, setNewHostMaxDatabases] = useState('0');

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  const handleAddHost = () => {
    if (!newHostName || !newHostHost || !newHostPort || !newHostUser) return;
    
    const newHost: DatabaseHost = {
      id: `host-${hosts.length + 1}`,
      name: newHostName,
      host: newHostHost,
      port: parseInt(newHostPort, 10),
      user: newHostUser,
    };

    setHosts(prev => [...prev, newHost]);
    
    handleDialogChange(false);
  };
  
  const handleDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setCurrentStep(1);
        setNewHostName('');
        setNewHostHost('0.0.0.0');
        setNewHostPort('3306');
        setNewHostUser('root');
        setNewHostPassword('');
        setNewHostMaxDatabases('0');
      }, 300); // Delay reset to allow for closing animation
    }
  }

  const CopyableCode = ({ command }: { command: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        toast({ title: 'Comando copiado al portapapeles' });
    };

    return (
        <div className="flex items-center gap-2 rounded-md bg-muted p-2 font-mono text-sm">
            <pre className="flex-grow overflow-x-auto"><code>{command}</code></pre>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar</span>
            </Button>
        </div>
    );
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
      <PageHeader title="Database Hosts" description="Manage all database host connections.">
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Host
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add New Database Host</DialogTitle>
                    <DialogDescription>
                        Follow the steps to connect a new database host.
                    </DialogDescription>
                </DialogHeader>

                <Stepper currentStep={currentStep} steps={stepTitles} />

                <div key={currentStep} className="py-4 max-h-[60vh] overflow-y-auto px-1 animate-in fade-in-50 duration-500">
                    {currentStep === 1 && (
                         <div className="space-y-6 px-4">
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Información</AlertTitle>
                                <AlertDescription>
                                    Actualmente, solo se admiten bases de datos MySQL/MariaDB para database hosts.
                                    <br/>
                                    ¿El panel y la base de datos no están en el mismo servidor? Asegúrate de permitir acceso externo.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="host-user">Username</Label>
                                <Input
                                    id="host-user"
                                    value={newHostUser}
                                    onChange={(e) => setNewHostUser(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">El nombre de usuario de una cuenta que tenga permisos suficientes para crear nuevos usuarios y bases de datos en el sistema.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="host-password">Password</Label>
                                <Input
                                    id="host-password"
                                    type="password"
                                    value={newHostPassword}
                                    onChange={(e) => setNewHostPassword(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">La contraseña para el usuario de la base de datos.</p>
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                         <div className="space-y-6 px-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Instrucciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold">Database User</h4>
                                        <p className="text-sm text-muted-foreground">Usa <code className="bg-muted px-1 rounded">mysql -u root -p</code> para acceder al CLI de mysql.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Comando para crear el usuario</h4>
                                        <CopyableCode command={"CREATE USER 'aetheruser'@'127.0.0.1' IDENTIFIED BY 'password';"} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Comando para asignar permisos</h4>
                                        <CopyableCode command={"GRANT ALL PRIVILEGES ON *.* TO 'aetheruser'@'127.0.0.1' WITH GRANT OPTION;"} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Para salir del CLI de mysql ejecuta <code className="bg-muted px-1 rounded">exit</code>.</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Acceso Externo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Es probable que necesites permitir acceso externo a esta instancia de MySQL. Localiza tu archivo <code className="bg-muted px-1 rounded">my.cnf</code> (puedes usar <code className="bg-muted px-1 rounded">find /etc -iname my.cnf</code>).
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Abre <code className="bg-muted px-1 rounded">my.cnf</code>, agrega el texto de abajo al final del archivo y guárdalo:
                                    </p>
                                    <CopyableCode command={"[mysqld]\nbind-address=0.0.0.0"} />
                                    <p className="text-sm text-muted-foreground">
                                        Reinicia MySQL/MariaDB para aplicar los cambios. Asegúrate de permitir el puerto de MySQL (por defecto 3306) en tu firewall.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div className="grid grid-cols-2 gap-6 px-4">
                             <div className="space-y-2">
                                <Label htmlFor="host-name">Nombre del Host</Label>
                                <Input
                                    id="host-name"
                                    value={newHostName}
                                    onChange={(e) => setNewHostName(e.target.value)}
                                    placeholder="e.g., Local DB"
                                />
                                <p className="text-sm text-muted-foreground">Un nombre único para identificar este host en el panel.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="host-host">Host de Conexión</Label>
                                <Input
                                    id="host-host"
                                    value={newHostHost}
                                    onChange={(e) => setNewHostHost(e.target.value)}
                                />
                                 <p className="text-sm text-muted-foreground">La dirección IP o nombre de dominio que debe usarse al intentar conectarse a este host MySQL desde este Panel.</p>
                            </div>
                           <div className="space-y-2">
                                <Label htmlFor="host-port">Puerto</Label>
                                <Input
                                    id="host-port"
                                    type="number"
                                    value={newHostPort}
                                    onChange={(e) => setNewHostPort(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">El puerto en el que se está ejecutando MySQL para este host.</p>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="host-max-db">Límite de Bases de Datos</Label>
                                <Input
                                    id="host-max-db"
                                    type="number"
                                    value={newHostMaxDatabases}
                                    onChange={(e) => setNewHostMaxDatabases(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">Número máximo de bases de datos. Dejar en blanco o 0 para ilimitado.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Nodos Vinculados</Label>
                                <Select disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ninguno" />
                                    </SelectTrigger>
                                </Select>
                                <p className="text-sm text-muted-foreground">Esta configuración solo establece este database host como predeterminado.</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {currentStep === 1 && (
                        <>
                            <Button variant="outline" onClick={() => handleDialogChange(false)}>Cancel</Button>
                            <Button onClick={() => setCurrentStep(2)} disabled={!newHostUser}>Next</Button>
                        </>
                    )}
                     {currentStep === 2 && (
                        <>
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                            <Button onClick={() => setCurrentStep(3)}>Next</Button>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                            <Button type="submit" onClick={handleAddHost} disabled={!newHostName || !newHostHost}>Create Host</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Hosts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts.map((host) => (
                <TableRow key={host.id}>
                  <TableCell className="font-medium">{host.name}</TableCell>
                  <TableCell>{host.host}</TableCell>
                  <TableCell>{host.port}</TableCell>
                  <TableCell>{host.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
