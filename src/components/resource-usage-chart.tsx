'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts';

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
    { name: 'CPU', usage: cpuUsage },
    { name: 'Memory', usage: memoryUsage },
    { name: 'Storage', usage: storageUsage },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Overview</CardTitle>
        <CardDescription>Current snapshot of resource utilization.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 50 }}
          >
            <defs>
              <linearGradient id="fillCPU" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="var(--color-cpu)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-cpu)"
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient id="fillMemory" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="var(--color-memory)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-memory)"
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient id="fillStorage" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="var(--color-storage)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-storage)"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>

            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={70}
              className="fill-muted-foreground text-sm font-medium"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="usage" layout="vertical" radius={5} barSize={24}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={`url(#fill${entry.name})`} />
              ))}
              <LabelList
                dataKey="usage"
                position="right"
                offset={8}
                className="fill-foreground font-semibold"
                fontSize={14}
                formatter={(value: number) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
