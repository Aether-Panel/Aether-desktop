'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

type ResourceUsageChartProps = {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  className?: string;
};

const chartConfig = {
  cpu: { label: 'CPU', color: 'hsl(var(--chart-1))', icon: Cpu },
  memory: { label: 'Memory', color: 'hsl(var(--chart-2))', icon: MemoryStick },
  storage: { label: 'Storage', color: 'hsl(var(--chart-3))', icon: HardDrive },
} satisfies ChartConfig;

const SingleGauge = ({ name, value }: { name: 'cpu' | 'memory' | 'storage', value: number }) => {
  const config = chartConfig[name];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-4">
      <ChartContainer
        config={chartConfig}
        className="relative mx-auto aspect-square h-[150px] w-[150px]"
      >
        <RadialBarChart
          startAngle={180}
          endAngle={0}
          innerRadius="80%"
          outerRadius="100%"
          barSize={12}
          data={[{ name, value, fill: `var(--color-${name})` }]}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            dataKey="value"
            tick={false}
          />
          <RadialBar
            dataKey="value"
            background={{ fill: 'hsl(var(--muted))' }}
            round
            cornerRadius={6}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-4xl font-bold tracking-tighter text-foreground">
                {value}
                <span className="text-lg font-medium text-muted-foreground">%</span>
            </span>
        </div>
      </ChartContainer>
      <div className="flex items-center gap-2 text-center text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        {config.label}
      </div>
    </div>
  )
}

export default function ResourceUsageChart({ cpuUsage, memoryUsage, storageUsage, className }: ResourceUsageChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Resource Overview</CardTitle>
        <CardDescription>Current snapshot of resource utilization.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-around items-center p-6 pt-2">
        <SingleGauge name="cpu" value={cpuUsage} />
        <SingleGauge name="memory" value={memoryUsage} />
        <SingleGauge name="storage" value={storageUsage} />
      </CardContent>
    </Card>
  );
}
