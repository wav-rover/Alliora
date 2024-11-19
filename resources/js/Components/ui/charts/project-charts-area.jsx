import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/charts/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

const chartConfig = {
  finished: {
    label: "Finished",
    color: "hsl(var(--chart-2))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-1))",
  },
}

export function ProjectAreaChart({ tasks }) {
  const [timeRange, setTimeRange] = React.useState("30d") // Valeur par défaut modifiée

  // Regrouper les tâches par date et statut
  const groupedData = tasks.reduce((acc, task) => {
    const date = new Date(task.updated_at).toISOString().split("T")[0]
    if (!acc[date]) {
      acc[date] = { date, finished: 0, inProgress: 0 }
    }
    if (task.status === "finished") {
      acc[date].finished += 1
    } else if (task.status === "in progress") {
      acc[date].inProgress += 1
    }
    return acc
  }, {})

  const chartData = Object.values(groupedData)

  const generateDateRange = (startDate, endDate) => {
    const dates = []
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
  }

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 30
    if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysToSubtract)
    const endDate = new Date()

    const dateRange = generateDateRange(startDate, endDate)
    const dataMap = chartData.reduce((acc, item) => {
      acc[item.date] = item
      return acc
    }, {})

    return dateRange.map((date) => {
      return dataMap[date] || { date, finished: 0, inProgress: 0 }
    })
  }, [chartData, timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Tasks stats</CardTitle>
          <CardDescription>
            Showing finished and in-progress tasks each day
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillFinished" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-finished)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-finished)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillInProgress" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-inProgress)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-inProgress)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="finished"
              type="natural"
              fill="url(#fillFinished)"
              stroke="var(--color-finished)"
              stackId="a"
            />
            <Area
              dataKey="inProgress"
              type="natural"
              fill="url(#fillInProgress)"
              stroke="var(--color-inProgress)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ProjectAreaChart