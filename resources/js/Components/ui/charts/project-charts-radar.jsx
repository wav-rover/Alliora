"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/charts/chart"

const blueShades = [
    "rgba(59, 130, 246, 0.1)", // Deep Blue
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, tasks, fill } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background px-1 text-xs border border-secondary rounded-md">
          <p>{`${name}: ${tasks} tasks`}</p>
        </div>
      );
    }
    return null;
  };

export function ProjectRadarChart({ taskCountByUser }) {
  const chartConfig = taskCountByUser.reduce((acc, user, index) => {
    acc[user.name] = {
      label: user.name,
      color: blueShades[index % blueShades.length],
    }
    return acc
  }, {})

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-4">
        <CardTitle>Tasks assigned to each team member</CardTitle>
        <CardDescription>
          Showing the number of tasks assigned to each user
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={taskCountByUser}>
              <ChartTooltip content={<CustomTooltip />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              {taskCountByUser.map((entry, index) => (
                <Radar
                  key={entry.name}
                  name={entry.name}
                  dataKey="tasks"
                  stroke={blueShades[index % blueShades.length]}
                  fill={blueShades[index % blueShades.length]}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ProjectRadarChart