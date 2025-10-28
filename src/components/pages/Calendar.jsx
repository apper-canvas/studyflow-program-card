import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isSameDay
} from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { classService } from "@/services/api/classService"
import { assignmentService } from "@/services/api/assignmentService"
import { cn } from "@/utils/cn"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [classes, setClasses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [view, setView] = useState("month") // month or week

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [classesData, assignmentsData] = await Promise.all([
        classService.getAll(),
        assignmentService.getAll()
      ])
      
      setClasses(classesData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError("Failed to load calendar data")
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  const getAssignmentsForDay = (date) => {
    return assignments.filter(assignment => 
      isSameDay(parseISO(assignment.dueDate), date)
    )
  }

  const getClassesForDay = (date) => {
    const dayOfWeek = format(date, "EEEE")
    return classes.filter(classItem => 
      classItem.schedule?.some(schedule => schedule.dayOfWeek === dayOfWeek)
    )
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    )
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const days = getDaysInMonth()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">View your classes and assignment due dates</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setView(view === "month" ? "week" : "month")}>
            <ApperIcon name={view === "month" ? "Calendar" : "CalendarDays"} className="w-4 h-4 mr-2" />
            {view === "month" ? "Week View" : "Month View"}
          </Button>
        </div>
      </motion.div>

      {/* Calendar Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayAssignments = getAssignmentsForDay(day)
            const dayClasses = getClassesForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isDayToday = isToday(day)

            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={cn(
                  "min-h-[120px] p-2 border border-gray-100 hover:bg-gray-50 transition-colors",
                  !isCurrentMonth && "text-gray-400 bg-gray-50",
                  isDayToday && "bg-indigo-50 border-indigo-200"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isDayToday && "text-indigo-700"
                )}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {/* Class Schedule */}
                  {dayClasses.slice(0, 2).map(classItem => {
                    const schedule = classItem.schedule.find(s => s.dayOfWeek === format(day, "EEEE"))
                    return (
                      <div
                        key={classItem.Id}
                        className="text-xs p-1 rounded truncate"
                        style={{ 
                          backgroundColor: classItem.color + "20",
                          color: classItem.color,
                          borderLeft: `3px solid ${classItem.color}`
                        }}
                      >
                        {schedule?.startTime} {classItem.code}
                      </div>
                    )
                  })}

                  {/* Assignments */}
                  {dayAssignments.slice(0, 2).map(assignment => {
                    const assignmentClass = classes.find(c => c.Id === assignment.classId)
                    return (
                      <div
                        key={assignment.Id}
                        className={cn(
                          "text-xs p-1 rounded truncate border-l-3",
                          assignment.completed 
                            ? "bg-green-50 text-green-700 border-green-500" 
                            : assignment.priority
                            ? "bg-amber-50 text-amber-700 border-amber-500"
                            : "bg-blue-50 text-blue-700 border-blue-500"
                        )}
                      >
                        <ApperIcon 
                          name={assignment.completed ? "CheckCircle" : "FileText"} 
                          className="w-3 h-3 inline mr-1" 
                        />
                        {assignment.title}
                      </div>
                    )
                  })}

                  {/* Show more indicator */}
                  {(dayClasses.length + dayAssignments.length) > 4 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{(dayClasses.length + dayAssignments.length) - 4} more
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-indigo-200 border-l-4 border-indigo-600 rounded-sm"></div>
            <span>Class Schedule</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-200 border-l-4 border-blue-600 rounded-sm"></div>
            <span>Assignment Due</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-200 border-l-4 border-amber-600 rounded-sm"></div>
            <span>Priority Assignment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 border-l-4 border-green-600 rounded-sm"></div>
            <span>Completed</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Calendar