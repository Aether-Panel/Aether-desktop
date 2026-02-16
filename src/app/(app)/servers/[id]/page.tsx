import { servers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, MemoryStick, Network, Terminal, Folder, Settings as SettingsIcon, Users, Database, Archive, Shield, Puzzle } from 'lucide-react';
import AISummary from './ai-summary';
import MetricsCharts from './metrics-charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsoleView from './console-view';
import FileManagerView from './file-manager-view';
import SettingsView from './settings-view';
import UsersView from './users-view';
import DatabaseView from './database-view';
import BackupsView from './backups-view';
import AdminView from './admin-view';
import PluginsView from './plugins-view';

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  const server = servers.find((s) => s.id === params.id);

  if (!server) {
    notFound();
  }

  const StatusIndicator = ({ status }: { status: typeof server.status }) => {
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      pending: 'bg-yellow-500 animate-pulse',
    };
    return <div className={`mr-2 h-3 w-3 rounded-full ${statusClasses[status]}`} />;
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={server.name} description={`Detailed metrics and status for ${server.ipAddress}`} />

      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="console">
            <Terminal className="mr-2 h-4 w-4" />
            Console
          </TabsTrigger>
          <TabsTrigger value="overview">
            <Network className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="files">
            <Folder className="mr-2 h-4 w-4" />
            File Manager
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Base de datos
          </TabsTrigger>
          <TabsTrigger value="backups">
            <Archive className="mr-2 h-4 w-4" />
            Copia de seguridad
          </TabsTrigger>
          <TabsTrigger value="plugins">
            <Puzzle className="mr-2 h-4 w-4" />
            Plugins
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Shield className="mr-2 h-4 w-4" />
            Administración
          </TabsTrigger>
        </TabsList>
        <TabsContent value="console">
          <ConsoleView />
        </TabsContent>
        <TabsContent value="overview" className="mt-6 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={server.status === 'online' ? 'default' : server.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit text-lg">
                  <StatusIndicator status={server.status} />
                  {server.status}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.cpuUsage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.memoryUsage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.storageUsage}%</div>
              </CardContent>
            </Card>
          </div>
          <MetricsCharts serverMetrics={server.metrics} />
          <AISummary initialAlerts={server.alerts} />
        </TabsContent>
        <TabsContent value="files">
          <FileManagerView />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsView />
        </TabsContent>
        <TabsContent value="users">
          <UsersView serverId={server.id} />
        </TabsContent>
        <TabsContent value="database">
          <DatabaseView />
        </TabsContent>
        <TabsContent value="backups">
          <BackupsView />
        </TabsContent>
        <TabsContent value="plugins">
          <PluginsView />
        </TabsContent>
        <TabsContent value="admin">
          <AdminView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
