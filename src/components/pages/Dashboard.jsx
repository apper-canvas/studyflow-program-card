import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { differenceInDays, format, isToday, parseISO } from "date-fns";
import { classService } from "@/services/api/classService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import QuickStats from "@/components/molecules/QuickStats";
import AssignmentCard from "@/components/molecules/AssignmentCard";

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
      
      const mappedAssignments = assignmentsData.map(a => ({
        ...a,
        classId: a.class_id_c?.Id || a.class_id_c,
        title: a.title_c || a.title,
        dueDate: a.due_date_c || a.dueDate,
        completed: a.completed_c !== undefined ? a.completed_c : a.completed,
        completedDate: a.completed_date_c || a.completedDate
      }))
      
      setClasses(classesData)
      setAssignments(mappedAssignments)
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
        completed_c: completed,
        completed_date_c: completed ? new Date().toISOString() : null
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
!(a.completed_c || a.completed) && differenceInDays(parseISO(a.due_date_c || a.dueDate), new Date()) >= 0
  ).length

  const completedToday = assignments.filter(a => 
(a.completed_c || a.completed) && (a.completed_date_c || a.completedDate) && isToday(parseISO(a.completed_date_c || a.completedDate))
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
(c.schedule_c || c.schedule)?.some(s => s.dayOfWeek === dayOfWeek)
  )

  // Get upcoming assignments (next 7 days)
const upcomingAssignmentsList = assignments
    .filter(a => 
      !(a.completed_c || a.completed) && 
      differenceInDays(parseISO(a.due_date_c || a.dueDate), new Date()) <= 7 && 
      differenceInDays(parseISO(a.due_date_c || a.dueDate), new Date()) >= 0
    )
    .sort((a, b) => new Date(a.due_date_c || a.dueDate) - new Date(b.due_date_c || b.dueDate))
    .slice(0, 5)

const getClassById = (id) => {
    const classItem = classes.find(c => c.Id === id)
    if (classItem) {
      return {
        ...classItem,
        name: classItem.name_c || classItem.name,
        code: classItem.code_c || classItem.code,
        color: classItem.color_c || classItem.color
      }
    }
    return null
  }

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
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: classItem.color_c || classItem.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{classItem.name_c || classItem.name}</h3>
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