'use client';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { servers as allServers, users as allUsers, nodes as allNodes } from '@/lib/data';
import type { Server } from '@/lib/data';
import { Activity, Cpu, Server as ServerIcon, Users, Network, FolderGit } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useMemo } from 'react';
import ResourceUsageChart from '@/components/resource-usage-chart';
import NetworkUsageChart from '@/components/network-usage-chart';

export default function DashboardPage() {
  const { role, user } = useAuth();

  const userServers = role === 'admin'
    ? allServers
    : allUsers.find(u => u.email === user?.email)?.assignedServers.map(id => allServers.find(s => s.id === id)).filter(Boolean) as Server[] || [];

  const onlineCount = userServers.filter(s => s.status === 'online').length;
  const offlineCount = userServers.filter(s => s.status === 'offline').length;
  const totalServers = userServers.length;

  const totalUsers = allUsers.length;
  const totalNodes = allNodes.length;
  const totalRepositories = 2; // Mock data as requested

  const avgCpuUsage = totalServers > 0 ? Math.round(userServers.reduce((acc, s) => acc + s.cpuUsage, 0) / totalServers) : 0;
  const avgMemoryUsage = totalServers > 0 ? Math.round(userServers.reduce((acc, s) => acc + s.memoryUsage, 0) / totalServers) : 0;
  const avgStorageUsage = totalServers > 0 ? Math.round(userServers.reduce((acc, s) => acc + s.storageUsage, 0) / totalServers) : 0;

  const aggregatedMetrics = useMemo(() => {
    if (userServers.length === 0) {
      const firstServerMetrics = allServers[0]?.metrics || [];
      return firstServerMetrics.map(m => ({ ...m, networkIn: 0, networkOut: 0, cpu: 0, memory: 0 }));
    }

    const firstServerMetrics = userServers[0].metrics;

    return firstServerMetrics.map((_, index) => {
      const time = firstServerMetrics[index].time;
      let totalNetworkIn = 0;
      let totalNetworkOut = 0;

      for (const server of userServers) {
        if (server.metrics[index]) {
          totalNetworkIn += server.metrics[index].networkIn;
          totalNetworkOut += server.metrics[index].networkOut;
        }
      }

      return {
        time,
        networkIn: Math.round(totalNetworkIn),
        networkOut: Math.round(totalNetworkOut),
        cpu: 0,
        memory: 0,
      };
    });
  }, [userServers]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}!`}
        description="Here's a quick overview of your server landscape."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repositorios</CardTitle>
            <FolderGit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRepositories}</div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <ResourceUsageChart 
              cpuUsage={avgCpuUsage} 
              memoryUsage={avgMemoryUsage} 
              storageUsage={avgStorageUsage} 
            />
            <NetworkUsageChart serverMetrics={aggregatedMetrics} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/60 via-accent/50 to-secondary/60">
            <Card className="border-0">
                <CardHeader>
                    <CardTitle>Información del sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Versión del panel</p>
                        <p className="font-medium">AetherPanel</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Total de servidores</p>
                        <p className="font-medium">{totalServers}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Total de usuarios</p>
                        <p className="font-medium">{totalUsers}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Total de nodos</p>
                        <p className="font-medium">{totalNodes}</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
