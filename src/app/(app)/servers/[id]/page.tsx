'use client';

import { servers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, MemoryStick, Network, Terminal, Folder, Settings as SettingsIcon, Users, Database, Archive, Shield, Puzzle, Play, RefreshCw, Square, ShieldAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsoleView from './console-view';
import FileManagerView from './file-manager-view';
import SettingsView from './settings-view';
import UsersView from './users-view';
import DatabaseView from './database-view';
import BackupsView from './backups-view';
import AdminView from './admin-view';
import PluginsView from './plugins-view';
import { ServerAddress } from './server-address';
import MetricsCharts from './metrics-charts';
import NetworkUsageChart from './network-usage-chart';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/contexts/translations-context';

type LogEntry = {
  time: string;
  message: string;
};

const initialLogMessages = [
    "Starting up server...",
    "Connecting to database on port 5432.",
    "Database connection successful.",
    "Listening on port 3000.",
    "GET /api/health 200 OK",
    "GET /static/main.css 200 OK",
    "POST /api/login 200 OK",
    "User 'admin' logged in from 127.0.0.1",
    "GET /dashboard 200 OK",
    "[WARN] High memory usage detected: 85%",
    "Running scheduled job: clean_temp_files",
    "Job 'clean_temp_files' completed in 150ms.",
    "GET /api/users/1 200 OK",
    "[ERROR] Unhandled exception in worker thread: TypeError: Cannot read properties of undefined (reading 'name')",
    "Restarting worker thread...",
    "Worker thread restarted successfully."
];

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  const server = servers.find((s) => s.id === params.id);
  const [activeTab, setActiveTab] = useState('console');
  const { t } = useTranslations();
  
  const serverTabs = [
    { value: 'console', label: t('servers.detail.tabs.console'), icon: Terminal },
    { value: 'overview', label: t('servers.detail.tabs.overview'), icon: Network },
    { value: 'files', label: t('servers.detail.tabs.files'), icon: Folder },
    { value: 'settings', label: t('servers.detail.tabs.settings'), icon: SettingsIcon },
    { value: 'users', label: t('servers.detail.tabs.users'), icon: Users },
    { value: 'database', label: t('servers.detail.tabs.database'), icon: Database },
    { value: 'backups', label: t('servers.detail.tabs.backups'), icon: Archive },
    { value: 'plugins', label: t('servers.detail.tabs.plugins'), icon: Puzzle },
    { value: 'admin', label: t('servers.detail.tabs.admin'), icon: Shield },
  ];
  
  // State lifted from ConsoleView
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showKill, setShowKill] = useState(false);

  useEffect(() => {
    const now = Date.now();
    // Stagger the initial log times to make them look more realistic
    setLogs(initialLogMessages.map((message, index) => ({
        time: new Date(now - (initialLogMessages.length - index) * 1500).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message,
    })));
  }, []);

  const addLog = (message: string) => {
      setLogs(prevLogs => [...prevLogs, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), message }]);
  };

  const handleStopClick = () => {
    setShowKill(true);
    addLog('> Stop signal sent. If the server does not stop, you can force kill it.');
  };

  const handleKillClick = () => {
    setShowKill(false);
    addLog('> Kill signal sent. Server is being forcefully terminated.');
  };

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

  const serverActions = (
      <div className="flex items-center gap-2">
          <Button size="sm" variant="default">
              <Play className="mr-2 h-4 w-4" />
              {t('servers.detail.start')}
          </Button>
          <Button size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('servers.detail.restart')}
          </Button>
          {!showKill ? (
            <Button size="sm" variant="outline" onClick={handleStopClick}>
                <Square className="mr-2 h-4 w-4" />
                {t('servers.detail.stop')}
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={handleKillClick}>
                <ShieldAlert className="mr-2 h-4 w-4" />
                {t('servers.detail.forceStop')}
            </Button>
          )}
      </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={server.name} />
      <div className="flex flex-col gap-4 -mt-4">
        <div className="flex items-center gap-4">
          <ServerAddress ip={server.ipAddress} port={server.port} />
          <p className="text-sm text-muted-foreground">
            {t('servers.detail.description')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            {serverActions}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger>
              <SelectValue placeholder={t('servers.detail.selectPage')} />
            </SelectTrigger>
            <SelectContent>
              {serverTabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="hidden md:block">
          <div className="w-full overflow-x-auto md:overflow-visible">
            <TabsList className="w-max md:grid md:w-full md:grid-cols-9">
              {serverTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <TabsContent value="console">
          <ConsoleView logs={logs} addLog={addLog} />
        </TabsContent>
        <TabsContent value="overview" className="mt-6 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50 h-full">
              <Card className="border-0 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('servers.detail.overview.status')}</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant={server.status === 'online' ? 'default' : server.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit text-lg">
                    <StatusIndicator status={server.status} />
                    {t(`dashboard.status.${server.status}`)}
                  </Badge>
                </CardContent>
              </Card>
            </div>
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50 h-full">
              <Card className="border-0 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('servers.detail.overview.cpuUsage')}</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{server.cpuUsage}%</div>
                </CardContent>
              </Card>
            </div>
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50 h-full">
              <Card className="border-0 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('servers.detail.overview.memoryUsage')}</CardTitle>
                  <MemoryStick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{server.memoryUsage}%</div>
                </CardContent>
              </Card>
            </div>
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50 h-full">
              <Card className="border-0 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('servers.detail.overview.storageUsage')}</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{server.storageUsage}%</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
              <MetricsCharts serverMetrics={server.metrics} className="border-0" />
            </div>
            <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
              <NetworkUsageChart serverMetrics={server.metrics} className="border-0" />
            </div>
          </div>
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
