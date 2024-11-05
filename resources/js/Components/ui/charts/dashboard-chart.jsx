import React, { useEffect, useState } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/charts/chart"
import { TrendingUp } from "lucide-react"
import { TrendingDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export function DashboardChart({ projects }) {
  const [chartData, setChartData] = useState([]);
  const [currentMonthProjects, setCurrentMonthProjects] = useState(0);
  const [previousMonthProjects, setPreviousMonthProjects] = useState(0);

  useEffect(() => {
    // Process the projects data to get the number of projects created each month
    const processChartData = () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const projectCounts = projects.reduce((acc, project) => {
        const month = format(parseISO(project.created_at), 'MMMM');
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const today = new Date();
      const currentMonthName = format(today, 'MMMM');
      const previousMonthName = format(subMonths(today, 1), 'MMMM');
      setCurrentMonthProjects(projectCounts[currentMonthName] || 0);
      setPreviousMonthProjects(projectCounts[previousMonthName] || 0);

      const lastFiveMonths = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(today, i);
        const monthName = format(monthDate, 'MMMM');
        lastFiveMonths.push({
          month: monthName,
          projects: projectCounts[monthName] || 0,
        });
      }

      setChartData(lastFiveMonths);
    };

    processChartData();
  }, [projects]);

  const chartConfig = {
    // Your chart configuration here
  };

  // Define the colors
  const lineColor = 'hsl(221.2, 83.2%, 53.3%)'; // --chart-1
  const dotColor = 'hsl(212, 95%, 68%)'; // --chart-2

  // Function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentMonthProjects = payload[0].value;
      const previousMonthProjects = payload[0].payload.previousProjects || 0;
      const percentageChange = calculatePercentageChange(currentMonthProjects, previousMonthProjects);

      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', padding: '10px', borderRadius: '5px', color: '#fff' }}>
          <p className="label">{`${label} : ${currentMonthProjects} projects`}</p>
          <p className="label">{`Change: ${percentageChange.toFixed(2)}%`}</p>
        </div>
      );
    }

    return null;
  };

  const actualPercentage = calculatePercentageChange(currentMonthProjects, previousMonthProjects);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <p className='text-sm'>Your projects creation</p>
        <div className='flex items-center'>
          {actualPercentage > 0 ? (
            <>
            <TrendingUp className='h-5 text-emerald-600' />
            <p className='text-xs text-emerald-600'>{actualPercentage.toFixed(2)}%</p>
            </>
          ) : (
            <>
            <TrendingDown className='h-5 text-red-600' />
            <p className='text-xs text-red-600'>{actualPercentage.toFixed(2)}%</p>
            </>
          )}
          
        </div>
      </div>
      <ChartContainer className="h-52 -mt-4 w-full" config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData.map((data, index) => ({
            ...data,
            previousProjects: index > 0 ? chartData[index - 1].projects : 0,
          }))}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <defs>
            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="projects"
            stroke={lineColor}
            fillOpacity={1}
            fill="url(#colorProjects)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export default DashboardChart;