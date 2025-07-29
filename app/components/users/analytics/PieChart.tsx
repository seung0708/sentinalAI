"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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

type RiskTotals = {
  low: number;
  med: number;
  high: number;
};

const chartConfig = {
  levels: {
    label: "Risk Levels",
  },
  low: {
    label: 'Low',
  },
  med: {
    label: 'Medium'
  },
  high: {
    label: 'High'
  }
} satisfies ChartConfig



export function ChartPie({riskTotals}: {riskTotals: RiskTotals}) {
    const pieData = [
        { name: chartConfig.low.label, value: riskTotals.low , fill: "#4ADE80" },
        { name: chartConfig.med.label, value: riskTotals.med, fill: "#FBBF24" },
        { name: chartConfig.high.label, value: riskTotals.high, fill: "#F87171" },
    ];
    
    return (
        <Card className="flex flex-col h-full">
        <CardHeader className="items-center pb-0">
            <CardTitle>Risk levels</CardTitle>
            <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
            <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square"
            >
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={pieData} dataKey="value" nameKey="name" />
            </PieChart>
            </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
            </div>
        </CardFooter> */}
        </Card>
    )
}
