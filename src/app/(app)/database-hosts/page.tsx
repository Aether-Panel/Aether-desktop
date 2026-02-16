'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

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

export default function DatabaseHostsPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hosts, setHosts] = useState<DatabaseHost[]>(initialHosts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // New host form state
  const [newHostName, setNewHostName] = useState('');
  const [newHostHost, setNewHostHost] = useState('');
  const [newHostPort, setNewHostPort] = useState('3306');
  const [newHostUser, setNewHostUser] = useState('');

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  const handleAddHost = () => {
    if (!newHostName || !newHostHost || !newHostPort || !newHostUser) return; // Basic validation
    
    const newHost: DatabaseHost = {
      id: `host-${hosts.length + 1}`,
      name: newHostName,
      host: newHostHost,
      port: parseInt(newHostPort, 10),
      user: newHostUser,
    };

    setHosts(prev => [...prev, newHost]);
    
    // Reset form and close dialog
    handleDialogChange(false);
  };
  
  const handleDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      // Reset state when closing
      setCurrentStep(1);
      setNewHostName('');
      setNewHostHost('');
      setNewHostPort('3306');
      setNewHostUser('');
    }
  }

  const StepperHeader = () => (
    <DialogHeader>
        <DialogTitle>Add New Database Host</DialogTitle>
        <DialogDescription>
            Step {currentStep} of 2: {currentStep === 1 ? 'Host Details' : 'Connection Credentials'}
        </DialogDescription>
    </DialogHeader>
  );

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
            <DialogContent className="sm:max-w-[425px]">
                <StepperHeader />
                <div className="grid gap-4 py-4">
                    {currentStep === 1 && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="host-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="host-name"
                                    value={newHostName}
                                    onChange={(e) => setNewHostName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g., Local DB"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="host-host" className="text-right">
                                    Host
                                </Label>
                                <Input
                                    id="host-host"
                                    value={newHostHost}
                                    onChange={(e) => setNewHostHost(e.target.value)}
                                    className="col-span-3"
                                    placeholder="127.0.0.1"
                                />
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                         <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="host-port" className="text-right">
                                    Port
                                </Label>
                                <Input
                                    id="host-port"
                                    type="number"
                                    value={newHostPort}
                                    onChange={(e) => setNewHostPort(e.target.value)}
                                    className="col-span-3"
                                    placeholder="3306"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="host-user" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="host-user"
                                    value={newHostUser}
                                    onChange={(e) => setNewHostUser(e.target.value)}
                                    className="col-span-3"
                                    placeholder="root"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="host-password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="host-password"
                                    type="password"
                                    className="col-span-3"
                                    placeholder="Leave blank for none"
                                />
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    {currentStep === 1 && (
                        <>
                            <Button variant="outline" onClick={() => handleDialogChange(false)}>Cancel</Button>
                            <Button onClick={() => setCurrentStep(2)} disabled={!newHostName || !newHostHost}>Next</Button>
                        </>
                    )}
                     {currentStep === 2 && (
                        <>
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                            <Button type="submit" onClick={handleAddHost} disabled={!newHostPort || !newHostUser}>Create Host</Button>
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
