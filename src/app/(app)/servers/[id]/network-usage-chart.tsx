'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Server } from '@/lib/data';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type NetworkUsageChartProps = {
  serverMetrics: Server['metrics'];
};

const chartConfig = {
  networkIn: { label: 'Download', color: 'hsl(var(--chart-4))' },
  networkOut: { label: 'Upload', color: 'hsl(var(--chart-5))' },
};

export default function NetworkUsageChart({ serverMetrics }: NetworkUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Traffic</CardTitle>
        <CardDescription>Inbound and outbound traffic for the last 30 minutes (KB/s).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={serverMetrics}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                indicator="line"
                formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: chartConfig[name as keyof typeof chartConfig].color}}></div>
                        <span>{`${chartConfig[name as keyof typeof chartConfig].label}: ${value} KB/s`}</span>
                    </div>
                )}
                />}
            />
            <Line
              dataKey="networkIn"
              type="natural"
              stroke="var(--color-networkIn)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="networkOut"
              type="natural"
              stroke="var(--color-networkOut)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
