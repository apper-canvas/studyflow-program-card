import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, isToday, parseISO, differenceInDays } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import QuickStats from "@/components/molecules/QuickStats"
import AssignmentCard from "@/components/molecules/AssignmentCard"
import { classService } from "@/services/api/classService"
import { assignmentService } from "@/services/api/assignmentService"
import { toast } from "react-toastify"

const Dashboard = () => {
  const [classes, setClasses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (assignmentId, completed) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId)
      await assignmentService.update(assignmentId, {
        ...assignment,
        completed,
        completedDate: completed ? new Date().toISOString() : null
      })
      
      setAssignments(assignments.map(a => 
        a.Id === assignmentId 
          ? { ...a, completed, completedDate: completed ? new Date().toISOString() : null }
          : a
      ))
      
      toast.success(completed ? "Assignment marked as complete!" : "Assignment marked as incomplete")
    } catch (error) {
      toast.error("Failed to update assignment")
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate stats
  const upcomingAssignments = assignments.filter(a => 
    !a.completed && differenceInDays(parseISO(a.dueDate), new Date()) >= 0
  ).length

  const completedToday = assignments.filter(a => 
    a.completed && a.completedDate && isToday(parseISO(a.completedDate))
  ).length

  const averageGrade = classes.length > 0 
    ? Math.round(classes.reduce((acc, c) => acc + (c.currentGrade || 0), 0) / classes.length)
    : 0

  const stats = {
    totalClasses: classes.length,
    upcomingAssignments,
    completedToday,
    averageGrade
  }

  // Get today's classes
  const today = new Date()
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" })
  const todaysClasses = classes.filter(c => 
    c.schedule?.some(s => s.dayOfWeek === dayOfWeek)
  )

  // Get upcoming assignments (next 7 days)
  const upcomingAssignmentsList = assignments
    .filter(a => !a.completed && differenceInDays(parseISO(a.dueDate), new Date()) <= 7 && differenceInDays(parseISO(a.dueDate), new Date()) >= 0)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const getClassById = (id) => classes.find(c => c.Id === id)

  if (classes.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StudyFlow</h1>
            <p className="text-gray-600">Let's get you organized and ready to succeed!</p>
          </motion.div>
          
          <Empty 
            type="classes"
            onAction={() => window.location.href = "/classes"}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Good morning! Ready to learn?
        </h1>
        <p className="text-gray-600">Here's what's happening with your studies today.</p>
      </motion.div>

      <QuickStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-indigo-600" />
              Today's Classes
            </h2>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/classes"}>
              View All
            </Button>
          </div>

          {todaysClasses.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Coffee" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No classes today. Time to catch up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysClasses.map((classItem, index) => {
                const todaySchedule = classItem.schedule.find(s => s.dayOfWeek === dayOfWeek)
                return (
                  <motion.div
                    key={classItem.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: classItem.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">{classItem.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {todaySchedule?.startTime} - {todaySchedule?.endTime}
                      </p>
                      {todaySchedule?.location && (
                        <p className="text-xs text-gray-500">{todaySchedule.location}</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Assignments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-indigo-600" />
              Upcoming Assignments
            </h2>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/assignments"}>
              View All
            </Button>
          </div>

          {upcomingAssignmentsList.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-500">All caught up! No assignments due soon.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignmentsList.map((assignment, index) => (
                <motion.div
                  key={assignment.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AssignmentCard
                    assignment={assignment}
                    classItem={getClassById(assignment.classId)}
                    onToggleComplete={handleToggleComplete}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-0"
            onClick={() => window.location.href = "/classes"}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Class
          </Button>
          <Button
            variant="secondary"
            className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-0"
            onClick={() => window.location.href = "/assignments"}
          >
            <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
            Add Assignment
          </Button>
          <Button
            variant="secondary"
            className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-0"
            onClick={() => window.location.href = "/calendar"}
          >
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard