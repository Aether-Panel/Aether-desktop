'use client';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { servers as allServers, users as allUsers } from '@/lib/data';
import type { Server } from '@/lib/data';
import { Activity, ArrowUpRight, Cpu, HardDrive, MemoryStick, Server as ServerIcon } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/page-header';

export default function DashboardPage() {
  const { role, user } = useAuth();

  const userServers = role === 'admin'
    ? allServers
    : allUsers.find(u => u.email === user?.email)?.assignedServers.map(id => allServers.find(s => s.id === id)).filter(Boolean) as Server[] || [];

  const onlineCount = userServers.filter(s => s.status === 'online').length;
  const offlineCount = userServers.filter(s => s.status === 'offline').length;
  const totalServers = userServers.length;

  const StatusIndicator = ({ status }: { status: Server['status'] }) => {
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      pending: 'bg-yellow-500 animate-pulse',
    };
    return <div className={`mr-2 h-2.5 w-2.5 rounded-full ${statusClasses[status]}`} />;
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}!`}
        description="Here's a quick overview of your server landscape."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <ServerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServers}</div>
            <p className="text-xs text-muted-foreground">Managed servers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{onlineCount}</div>
            <p className="text-xs text-muted-foreground">Servers are operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{offlineCount}</div>
            <p className="text-xs text-muted-foreground">Servers need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServers > 0 ? `${Math.round((onlineCount / totalServers) * 100)}%` : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">System uptime percentage</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">CPU</TableHead>
                <TableHead className="hidden md:table-cell">Memory</TableHead>
                <TableHead className="hidden lg:table-cell">Storage</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userServers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell className="font-medium">
                    <Link href={`/servers/${server.id}`} className="hover:underline">
                      {server.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={server.status === 'online' ? 'default' : server.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit">
                      <StatusIndicator status={server.status} />
                      {server.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={server.cpuUsage} className="h-2 w-20" />
                      <span>{server.cpuUsage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={server.memoryUsage} className="h-2 w-20" />
                      <span>{server.memoryUsage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={server.storageUsage} className="h-2 w-20" />
                      <span>{server.storageUsage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/servers/${server.id}`} className="text-primary hover:underline">
                      View
                    </Link>
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
