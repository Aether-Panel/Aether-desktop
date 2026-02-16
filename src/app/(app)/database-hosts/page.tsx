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
    setNewHostName('');
    setNewHostHost('');
    setNewHostPort('3306');
    setNewHostUser('');
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
      <PageHeader title="Database Hosts" description="Manage all database host connections.">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Host
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Database Host</DialogTitle>
                    <DialogDescription>
                        Configure a new MySQL database host.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleAddHost}>Create Host</Button>
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
