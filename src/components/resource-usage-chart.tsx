'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type ResourceUsageChartProps = {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
};

const resourceData: {name: string; key: 'cpu' | 'memory' | 'storage'; colorVar: string}[] = [
  { name: 'CPU', key: 'cpu', colorVar: 'hsl(var(--chart-1))' },
  { name: 'Memory', key: 'memory', colorVar: 'hsl(var(--chart-2))' },
  { name: 'Storage', key: 'storage', colorVar: 'hsl(var(--chart-3))' },
];

export default function ResourceUsageChart({ cpuUsage, memoryUsage, storageUsage }: ResourceUsageChartProps) {
    const usages = { cpu: cpuUsage, memory: memoryUsage, storage: storageUsage };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Overview</CardTitle>
        <CardDescription>Current snapshot of resource utilization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {resourceData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-muted-foreground">{item.name}</span>
              <span>{usages[item.key]}%</span>
            </div>
            <div style={{ '--primary': item.colorVar } as React.CSSProperties}>
              <Progress value={usages[item.key]} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
