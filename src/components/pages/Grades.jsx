import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { classService } from "@/services/api/classService";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import { cn } from "@/utils/cn";

const Grades = () => {
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
        completed: a.completed_c !== undefined ? a.completed_c : a.completed,
        grade: a.grade_c !== undefined ? a.grade_c : a.grade
      }))
      
      setClasses(classesData)
      setAssignments(mappedAssignments)
      setAssignments(assignmentsData)
    } catch (err) {
      setError("Failed to load grades data")
    } finally {
      setLoading(false)
    }
  }

  const calculateClassGrade = (classId) => {
const classAssignments = assignments.filter(a => 
      (a.classId || (a.class_id_c?.Id || a.class_id_c)) === classId && 
      (a.completed_c || a.completed) && 
      (a.grade_c !== null && a.grade_c !== undefined) || (a.grade !== null && a.grade !== undefined)
    )
    
    if (classAssignments.length === 0) return null
    
const totalGrades = classAssignments.reduce((sum, a) => sum + (a.grade_c || a.grade), 0)
    return Math.round(totalGrades / classAssignments.length)
  }

  const calculateOverallGPA = () => {
const classesWithGrades = classes.filter(c => 
      (c.current_grade_c !== null && c.current_grade_c !== undefined) || 
      (c.currentGrade !== null && c.currentGrade !== undefined)
    )
    
    if (classesWithGrades.length === 0) return 0
    
const totalGradePoints = classesWithGrades.reduce((sum, c) => {
      const grade = (c.current_grade_c !== undefined ? c.current_grade_c : c.currentGrade) || calculateClassGrade(c.Id)
      const credits = c.credits_c || c.credits || 3
      return sum + (grade * credits)
    }, 0)
    
    const totalCredits = classesWithGrades.reduce((sum, c) => sum + (c.credits || 3), 0)
    
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0
  }

  const gradeToGPA = (grade) => {
    if (grade >= 97) return 4.0
    if (grade >= 93) return 3.7
    if (grade >= 90) return 3.3
    if (grade >= 87) return 3.0
    if (grade >= 83) return 2.7
    if (grade >= 80) return 2.3
    if (grade >= 77) return 2.0
    if (grade >= 73) return 1.7
    if (grade >= 70) return 1.3
    if (grade >= 67) return 1.0
    if (grade >= 65) return 0.7
    return 0.0
  }

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-amber-600"
    return "text-red-600"
  }

  const getGradeColorBg = (grade) => {
    if (grade >= 90) return "bg-green-50 border-green-200"
    if (grade >= 80) return "bg-blue-50 border-blue-200"
    if (grade >= 70) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const overallGPA = calculateOverallGPA()
const completedAssignments = assignments.filter(a => 
    (a.completed_c || a.completed) && 
    ((a.grade_c !== null && a.grade_c !== undefined) || (a.grade !== null && a.grade !== undefined))
  )
  const averageGrade = completedAssignments.length > 0 
    ? Math.round(completedAssignments.reduce((sum, a) => sum + (a.grade_c || a.grade), 0) / completedAssignments.length)
    : 0

  const stats = {
    overallGPA,
    totalClasses: classes.length,
    completedAssignments: completedAssignments.length,
    averageGrade
  }

  const statsCards = [
    {
      title: "Overall GPA",
      value: overallGPA || "N/A",
      icon: "Award",
      color: "indigo"
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: "GraduationCap",
      color: "blue"
    },
    {
      title: "Graded Assignments",
      value: stats.completedAssignments,
      icon: "CheckCircle",
      color: "green"
    },
    {
      title: "Average Grade",
      value: averageGrade ? `${averageGrade}%` : "N/A",
      icon: "Trophy",
      color: "amber"
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grades</h1>
          <p className="text-gray-600">Track your academic progress and performance</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {classes.length === 0 ? (
        <Empty 
          type="grades"
          title="No classes to grade"
          description="Add classes first to start tracking your grades"
          actionLabel="Add Classes"
          onAction={() => window.location.href = "/classes"}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Class Grades */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Class Performance</h2>
            
            <div className="space-y-4">
              {classes.map((classItem, index) => {
const calculatedGrade = calculateClassGrade(classItem.Id)
                const displayGrade = (classItem.current_grade_c !== undefined ? classItem.current_grade_c : classItem.currentGrade) || calculatedGrade
                const classAssignments = assignments.filter(a => (a.classId || (a.class_id_c?.Id || a.class_id_c)) === classItem.Id)
                const gradedAssignments = classAssignments.filter(a => 
                  (a.completed_c || a.completed) && 
                  ((a.grade_c !== null && a.grade_c !== undefined) || (a.grade !== null && a.grade !== undefined))
                )
                
                return (
                  <motion.div
                    key={classItem.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border",
                      displayGrade ? getGradeColorBg(displayGrade) : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: classItem.color_c || classItem.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{classItem.name_c || classItem.name}</h3>
                          <p className="text-sm text-gray-600">{classItem.code_c || classItem.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {displayGrade ? (
                          <div className={cn("text-2xl font-bold", getGradeColor(displayGrade))}>
                            {displayGrade}%
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-400">
                            N/A
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          GPA: {displayGrade ? gradeToGPA(displayGrade).toFixed(1) : "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="FileText" className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {gradedAssignments.length} graded assignments
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="BookOpen" className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {classItem.credits || 3} credits
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {classItem.instructor}
                        </span>
                      </div>
                    </div>

                    {/* Recent Assignments */}
                    {gradedAssignments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Recent Grades:</p>
                        <div className="flex flex-wrap gap-2">
{gradedAssignments.slice(-5).map(assignment => (
                            <div 
                              key={assignment.Id}
                              className="px-2 py-1 bg-white rounded text-xs font-medium flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-900">{assignment.title_c || assignment.title}</span>
                              <span className="text-sm font-semibold text-indigo-600">{assignment.grade_c || assignment.grade}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Grade Distribution</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
{ label: "A (90-100%)", color: "green", count: completedAssignments.filter(a => (a.grade_c || a.grade) >= 90).length },
                { label: "B (80-89%)", color: "blue", count: completedAssignments.filter(a => (a.grade_c || a.grade) >= 80 && (a.grade_c || a.grade) < 90).length },
                { label: "C (70-79%)", color: "amber", count: completedAssignments.filter(a => (a.grade_c || a.grade) >= 70 && (a.grade_c || a.grade) < 80).length },
                { label: "D/F (<70%)", color: "red", count: completedAssignments.filter(a => (a.grade_c || a.grade) < 70).length }
              ].map((grade, index) => (
                <motion.div
                  key={grade.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className={cn("text-3xl font-bold mb-2", `text-${grade.color}-600`)}>
                    {grade.count}
                  </div>
                  <p className="text-sm text-gray-600">{grade.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Grades