"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { RiskSummary } from "@/app/(users)/analytics/page"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig



export function ChartBarHorizontal({past6months}: {past6months: RiskSummary[]}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Total Transactions</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig} className="">
          <BarChart
            accessibilityLayer
            data={past6months}
            layout="vertical"
            margin={{
              left: -20,
            }}

          >
            <XAxis type="number" dataKey="total" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Showing total visitors for the last 6 months
        </div>
        <div className="text-muted-foreground leading-none">
          
        </div>
      </CardFooter>
    </Card>
  )
}
