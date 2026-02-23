'use client';
import { useAuth } from '@/contexts/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { servers as allServers, users as allUsers, nodes as allNodes } from '@/lib/data';
import type { Server } from '@/lib/data';
import { Activity, Cpu, FolderGit, Network } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useMemo } from 'react';
import ResourceUsageChart from '@/components/resource-usage-chart';
import NetworkUsageChart from '@/components/network-usage-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

import { useTranslations } from '@/contexts/translations-context';

export default function DashboardPage() {
  const { role, user } = useAuth();
  const { t } = useTranslations();

  // FOR USER ROLE
  if (role === 'user') {
    const userServers = user ? allUsers.find(u => u.email === user.email)?.assignedServers.map(id => allServers.find(s => s.id === id)).filter(Boolean) as Server[] || [] : [];

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
          title={t('dashboard.welcome', { name: user?.name?.split(' ')[0] || t('dashboard.defaultName') })}
          description={t('dashboard.user.description')}
        />
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>{t('dashboard.user.myServers')}</CardTitle>
            </CardHeader>
            <CardContent>
              {userServers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('dashboard.table.name')}</TableHead>
                      <TableHead>{t('dashboard.table.ipAddress')}</TableHead>
                      <TableHead>{t('dashboard.table.status')}</TableHead>
                      <TableHead className="hidden md:table-cell">{t('dashboard.table.cpu')}</TableHead>
                      <TableHead className="hidden md:table-cell">{t('dashboard.table.memory')}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t('dashboard.table.storage')}</TableHead>
                      <TableHead className="text-right">{t('dashboard.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userServers.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">
                          <a href={`/servers/${server.id}`} className="hover:underline">
                            {server.name}
                          </a>
                        </TableCell>
                        <TableCell>{server.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant={server.status === 'online' ? 'default' : server.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit">
                            <StatusIndicator status={server.status} />
                            {t(`dashboard.status.${server.status}`)}
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
                          <Button asChild variant="ghost" size="sm">
                            <a href={`/servers/${server.id}`}>{t('dashboard.table.view')}</a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">{t('dashboard.user.noServers')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // FOR ADMIN ROLE
  const adminServers = allServers;
  const onlineCount = adminServers.filter(s => s.status === 'online').length;
  const offlineCount = adminServers.filter(s => s.status === 'offline').length;
  const totalServers = adminServers.length;
  const totalUsers = allUsers.length;
  const totalNodes = allNodes.length;
  const totalRepositories = 2; // Mock data as requested

  const avgCpuUsage = totalServers > 0 ? Math.round(adminServers.reduce((acc, s) => acc + s.cpuUsage, 0) / totalServers) : 0;
  const avgMemoryUsage = totalServers > 0 ? Math.round(adminServers.reduce((acc, s) => acc + s.memoryUsage, 0) / totalServers) : 0;
  const avgStorageUsage = totalServers > 0 ? Math.round(adminServers.reduce((acc, s) => acc + s.storageUsage, 0) / totalServers) : 0;

  const aggregatedMetrics = useMemo(() => {
    if (adminServers.length === 0) {
      const firstServerMetrics = allServers[0]?.metrics || [];
      return firstServerMetrics.map(m => ({ ...m, networkIn: 0, networkOut: 0, cpu: 0, memory: 0 }));
    }

    const firstServerMetrics = adminServers[0].metrics;

    return firstServerMetrics.map((_, index) => {
      const time = firstServerMetrics[index].time;
      let totalNetworkIn = 0;
      let totalNetworkOut = 0;

      for (const server of adminServers) {
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
  }, [adminServers]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={t('dashboard.welcome', { name: user?.name?.split(' ')[0] || t('dashboard.defaultName') })}
        description={t('dashboard.admin.description')}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.admin.repositories')}</CardTitle>
              <FolderGit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRepositories}</div>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.admin.online')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{onlineCount}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.serversOperational')}</p>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.admin.offline')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{offlineCount}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.serversNeedAttention')}</p>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
          <Card className="border-0 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.admin.overallHealth')}</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServers > 0 ? `${Math.round((onlineCount / totalServers) * 100)}%` : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.systemUptime')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
            <ResourceUsageChart
              cpuUsage={avgCpuUsage}
              memoryUsage={avgMemoryUsage}
              storageUsage={avgStorageUsage}
              className="border-0"
            />
          </div>
          <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
            <NetworkUsageChart serverMetrics={aggregatedMetrics} className="border-0" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
            <Card className="border-0">
              <CardHeader>
                <CardTitle>{t('dashboard.admin.systemInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t('dashboard.admin.panelVersion')}</p>
                  <p className="font-medium">AetherPanel</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t('dashboard.admin.totalServers')}</p>
                  <p className="font-medium">{totalServers}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t('dashboard.admin.totalUsers')}</p>
                  <p className="font-medium">{totalUsers}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t('dashboard.admin.totalNodes')}</p>
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
