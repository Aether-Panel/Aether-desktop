export type Server = {
  id: string;
  name: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'pending';
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  metrics: { time: string; cpu: number; memory: number; network: number }[];
  alerts: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  assignedServers: string[]; // array of server IDs
};

const generateMetrics = () => {
  const metrics = [];
  for (let i = 29; i >= 0; i--) {
    const time = new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    metrics.push({
      time,
      cpu: Math.floor(Math.random() * 80) + 10,
      memory: Math.floor(Math.random() * 70) + 20,
      network: Math.floor(Math.random() * 50) + 5,
    });
  }
  return metrics;
};

export const servers: Server[] = [
  { id: 'srv-1', name: 'Production Web Server', ipAddress: '192.168.1.101', status: 'online', cpuUsage: 75, memoryUsage: 60, storageUsage: 85, metrics: generateMetrics(), alerts: ['[Error] High CPU usage detected on core 3. Process `worker.js` consuming 98% CPU.', 'CRITICAL: Memory usage exceeds 90% threshold. Swap space is being used.'] },
  { id: 'srv-2', name: 'Staging Database', ipAddress: '192.168.1.102', status: 'online', cpuUsage: 40, memoryUsage: 85, storageUsage: 70, metrics: generateMetrics(), alerts: [] },
  { id: 'srv-3', name: 'Analytics Engine', ipAddress: '192.168.1.103', status: 'offline', cpuUsage: 0, memoryUsage: 0, storageUsage: 95, metrics: generateMetrics().map(m => ({...m, cpu: 0, memory: 0, network: 0})), alerts: ['ALERT: Server is unreachable. Ping failed. Last seen 1 hour ago.'] },
  { id: 'srv-4', name: 'Cache-01 (Redis)', ipAddress: '192.168.1.104', status: 'pending', cpuUsage: 10, memoryUsage: 30, storageUsage: 20, metrics: generateMetrics(), alerts: [] },
  { id: 'srv-5', name: 'Internal API Gateway', ipAddress: '192.168.1.105', status: 'online', cpuUsage: 25, memoryUsage: 45, storageUsage: 50, metrics: generateMetrics(), alerts: ['[Warning] API latency for endpoint /v1/users has increased by 50ms.'] },
  { id: 'srv-6', name: 'Logging Service (ELK)', ipAddress: '192.168.1.106', status: 'online', cpuUsage: 55, memoryUsage: 70, storageUsage: 80, metrics: generateMetrics(), alerts: [] },
];

export const users: User[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@aether.panel', role: 'admin', avatar: 'https://picsum.photos/seed/usr-1/40/40', assignedServers: servers.map(s => s.id) },
  { id: 'usr-2', name: 'DevOps Engineer', email: 'devops@aether.panel', role: 'user', avatar: 'https://picsum.photos/seed/usr-2/40/40', assignedServers: ['srv-1', 'srv-2', 'srv-5'] },
  { id: 'usr-3', name: 'Data Analyst', email: 'analyst@aether.panel', role: 'user', avatar: 'https://picsum.photos/seed/usr-3/40/40', assignedServers: ['srv-3'] },
  { id: 'usr-4', name: 'Support Specialist', email: 'support@aether.panel', role: 'user', avatar: 'https://picsum.photos/seed/usr-4/40/40', assignedServers: ['srv-1', 'srv-4'] },
];
