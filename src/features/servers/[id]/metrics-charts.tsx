'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Server } from '@/lib/data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useTranslations } from '@/contexts/translations-context';

type MetricsChartsProps = {
  serverMetrics: Server['metrics'];
  className?: string;
};

export default function MetricsCharts({ serverMetrics, className }: MetricsChartsProps) {
  const { t } = useTranslations();

  const chartConfig = {
    cpu: { label: t('dashboard.table.cpu'), color: 'hsl(var(--chart-1))' },
    memory: { label: t('dashboard.table.memory'), color: 'hsl(var(--chart-2))' },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('servers.cpuMemoryChart.title')}</CardTitle>
        <CardDescription>{t('servers.cpuMemoryChart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={serverMetrics}>
            <defs>
              <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cpu)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-cpu)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-memory)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-memory)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="cpu"
              type="natural"
              fill="url(#fillCpu)"
              stroke="var(--color-cpu)"
              stackId="a"
            />
            <Area
              dataKey="memory"
              type="natural"
              fill="url(#fillMemory)"
              stroke="var(--color-memory)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
