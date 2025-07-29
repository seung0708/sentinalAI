"use client"

import {useEffect, useState} from "react"

import { TimeRangeSelector } from "@/app/components/users/analytics/TimeRangeSelector"
import { RiskChart } from "@/app/components/users/analytics/RiskChart"
import { ChartPie } from "@/app/components/users/analytics/PieChart"
import { ChartBarHorizontal } from "@/app/components/users/analytics/HorizontalBarChart"

export type RiskSummary = {
  fullMonth: string;
  month: string;
  low: number;
  med: number;
  high: number;
  total: number;
};

function getLastSixMonths(): string[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
  }

  return months;
}

function groupTransactions(transactions: any) {
  const lastSixMonths = getLastSixMonths();
  const grouped: Record<string, { low: number; med: number; high: number }> = {};

  for (const month of lastSixMonths) {
    grouped[month] = { low: 0, med: 0, high: 0 };
  }
  
  for (const tx of transactions) {
    const monthKey = new Date(tx.timestamp).toISOString().slice(0, 7); // 'YYYY-MM'
    if (grouped[monthKey]) {
      if (tx.predicted_risk === 'low') grouped[monthKey].low += 1;
      else if (tx.predicted_risk === 'medium') grouped[monthKey].med += 1;
      else if (tx.predicted_risk === 'high') grouped[monthKey].high += 1;
    }
  }

  return Object.entries(grouped).map(([monthKey, { low, med, high }]) => {
    
    const date = new Date(`${monthKey}-1`);
    return {
      fullMonth: monthKey,
      month: date.toLocaleString('en-US', { month: 'short' }),
      low,
      med,
      high,
      total: low + med + high,
    };
  });
}

export default function Analytics() {
  const [past6months, setPast6months] = useState<RiskSummary[]>([])
  const riskTotals = past6months.reduce((acc, curr: any) => {
    acc.low += curr.low 
    acc.med += curr.med 
    acc.high += curr.high
    return acc
  }, {low: 0, med: 0, high: 0})
  
  useEffect(() => {
    const getTransactions = async () => {
      const response = await fetch('/api/analytics');
      const result = await response.json();
      const grouped = groupTransactions(result);
      setPast6months(grouped);
    };

    getTransactions();

  },[])

  return (
    <div className="w-full">
     
      <div className="my-4 grid lg:grid-cols-3 gap-4">
        <div className="col-span-1">
          <ChartPie riskTotals={riskTotals} />
          
        </div>
        <div className="col-span-2">
          <ChartBarHorizontal past6months={past6months}  />
        </div>
      </div>
      <RiskChart past6months={past6months} />
      
    </div>
  )
}
