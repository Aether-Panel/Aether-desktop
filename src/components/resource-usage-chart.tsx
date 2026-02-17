'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';

type ResourceUsageChartProps = {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
};

const chartConfig = {
  cpu: { label: 'CPU', color: 'hsl(var(--chart-1))' },
  memory: { label: 'Memory', color: 'hsl(var(--chart-2))' },
  storage: { label: 'Storage', color: 'hsl(var(--chart-3))' },
};

export default function ResourceUsageChart({ cpuUsage, memoryUsage, storageUsage }: ResourceUsageChartProps) {
  const chartData = [
    { name: 'CPU', usage: cpuUsage, fill: 'var(--color-cpu)' },
    { name: 'Memory', usage: memoryUsage, fill: 'var(--color-memory)' },
    { name: 'Storage', usage: storageUsage, fill: 'var(--color-storage)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Overview</CardTitle>
        <CardDescription>Current snapshot of resource utilization.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="usage" hide />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value) => `${value}%`}
                hideLabel
              />}
            />
            <Bar dataKey="usage" layout="vertical" radius={5}>
                <LabelList
                    dataKey="usage"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => `${value}%`}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
