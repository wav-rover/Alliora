import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SimpleCalendar = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    const days = []
    
    // Previous month days
    for (let i = firstDay.getDay(); i > 0; i--) {
      days.push({
        date: daysInPrevMonth - i + 1,
        isCurrentMonth: false,
        tasks: []
      })
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i)
      const dayTasks = tasks?.filter(task => {
        const start = new Date(task.start_date)
        const end = new Date(task.end_date)
        return currentDate >= start && currentDate <= end
      }) || []
      
      days.push({
        date: i,
        isCurrentMonth: true,
        tasks: dayTasks
      })
    }
    
    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        tasks: []
      })
    }
    
    return days
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  
  const taskColors = [
    'bg-cyan-200 text-black',
    'bg-blue-200 text-blue-900',
    'bg-green-200 text-green-900',
    'bg-yellow-200 text-yellow-900',
    'bg-purple-200 text-purple-900',
    'bg-red-200 text-red-900',
    'bg-pink-200 text-pink-900',
    'bg-indigo-200 text-indigo-900',
    // Add more colors if needed
  ]

  const taskColorMap = new Map()

  const getColorForTask = (task) => {
    if (!taskColorMap.has(task.id)) {
      const index = taskColorMap.size % taskColors.length
      taskColorMap.set(task.id, taskColors[index])
    }
    return taskColorMap.get(task.id)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="px-2 py-3 text-sm font-medium text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "min-h-16 p-2 border-b border-r relative",
                !day.isCurrentMonth && "bg-muted/5"
              )}
            >
              <span className={cn(
                "text-sm",
                !day.isCurrentMonth && "text-muted-foreground",
                "block mb-1"
              )}>
                {day.date}
              </span>
              <div className="space-y-1">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "text-xs rounded px-1 py-0.5 truncate",
                      getColorForTask(task)
                    )}
                    title={task.name}
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SimpleCalendar