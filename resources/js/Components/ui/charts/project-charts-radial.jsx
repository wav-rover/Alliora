import { TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/charts/chart";

const generateBlueShade = (index) => {
    const blueShades = [
    'rgba(30, 58, 138, 0.4)',  // Bright Blue
    'rgba(37, 99, 235, 0.4)',  // Medium Blue
    'rgba(59, 130, 246, 0.4)', // Deep Blue
    'rgba(96, 165, 250, 0.4)', // Light Blue
    'rgba(147, 197, 253, 0.4)' // Pale Blue
  ];return blueShades[index % blueShades.length];
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { listName, tasks, fill } = payload[0].payload;
    return (
      <div className="flex items-center gap-1 custom-tooltip bg-background px-1 text-xs border border-secondary rounded-md">
        <p className="h-2 w-2 rounded-full" style={{ backgroundColor: fill }}></p>
        <p>{`${listName}: ${tasks}`}</p>
      </div>
    );
  }
  return null;
};

export function ProjectRadialChart({ taskCounts }) {
  const chartData = taskCounts.map((list, index) => ({
    listName: list.name,
    tasks: list.count,
    fill: generateBlueShade(index),
  }));

  const chartConfig = {
    tasks: {
      label: "Tasks",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Tasks in each list</CardTitle>
        <CardDescription>Project Tasks Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
            <Tooltip
              cursor={true}
              content={<CustomTooltip />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="tasks" label={{ fill: '#fff' }}/>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}