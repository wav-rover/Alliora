"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts/chart"

// Configuration pour les couleurs et labels des barres
const chartConfig = {
  statusCount: {
    label: "Tâches",
    color: "hsl(var(--chart-1))",
  },
}

const colors = {
  pending: "rgba(220, 38, 38 , 0.4)",
  "in progress": "rgba(6, 200, 212, 0.4)",
  finished: "rgba(5, 150, 105, 0.4)",
};

export function ProjectBarChart({ taskStatusData }) {
  const statusOrder = ["pending", "in progress", "finished"];
  const sortedTaskStatusData = taskStatusData.sort((a, b) => {
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des Tâches</CardTitle>
        <CardDescription>Tâches par statut pour ce projet</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sortedTaskStatusData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              {sortedTaskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.status]} />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendance par statut <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage des tâches par statut pour ce projet
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProjectBarChart;