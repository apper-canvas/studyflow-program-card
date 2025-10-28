import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { parseISO, differenceInDays, isToday, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import AssignmentCard from "@/components/molecules/AssignmentCard"
import AssignmentModal from "@/components/organisms/AssignmentModal"
import { assignmentService } from "@/services/api/assignmentService"
import { classService } from "@/services/api/classService"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  
  const [searchParams] = useSearchParams()
  const selectedClassId = searchParams.get("class")
  
  const [filters, setFilters] = useState({
    classId: selectedClassId || "",
    status: "all", // all, upcoming, completed, overdue
    sortBy: "dueDate" // dueDate, priority, class
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedClassId) {
      setFilters(prev => ({ ...prev, classId: selectedClassId }))
    }
  }, [selectedClassId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [assignmentsData, classesData] = await Promise.all([
        assignmentService.getAll(),
        classService.getAll()
      ])
      
      setAssignments(assignmentsData)
      setClasses(classesData)
    } catch (err) {
      setError("Failed to load assignments")
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

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setIsModalOpen(true)
  }

  const handleDelete = async (assignmentId) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return
    }

    try {
      await assignmentService.delete(assignmentId)
      setAssignments(assignments.filter(a => a.Id !== assignmentId))
      toast.success("Assignment deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete assignment")
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingAssignment(null)
  }

  const handleSave = () => {
    loadData()
  }

  const getFilteredAssignments = () => {
    let filtered = assignments

    // Filter by class
    if (filters.classId) {
      filtered = filtered.filter(a => a.classId === filters.classId)
    }

    // Filter by status
    switch (filters.status) {
      case "upcoming":
        filtered = filtered.filter(a => 
          !a.completed && differenceInDays(parseISO(a.dueDate), new Date()) >= 0
        )
        break
      case "completed":
        filtered = filtered.filter(a => a.completed)
        break
      case "overdue":
        filtered = filtered.filter(a => 
          !a.completed && isPast(parseISO(a.dueDate)) && !isToday(parseISO(a.dueDate))
        )
        break
    }

    // Sort assignments
    switch (filters.sortBy) {
      case "dueDate":
        filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        break
      case "priority":
        filtered.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0))
        break
      case "class":
        filtered.sort((a, b) => {
          const classA = classes.find(c => c.Id === a.classId)?.name || ""
          const classB = classes.find(c => c.Id === b.classId)?.name || ""
          return classA.localeCompare(classB)
        })
        break
    }

    return filtered
  }

  const getClassById = (id) => classes.find(c => c.Id === id)

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  const filteredAssignments = getFilteredAssignments()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600">Track and manage your assignments</p>
        </div>
        
        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Assignment
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-soft p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
            <Select
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
            >
              <option value="">All Classes</option>
              {classes.map(classItem => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.code} - {classItem.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Assignments</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="class">Class</option>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Empty 
          type="assignments"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AssignmentCard
                assignment={assignment}
                classItem={getClassById(assignment.classId)}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        assignment={editingAssignment}
        onSave={handleSave}
      />
    </div>
  )
}

export default Assignments