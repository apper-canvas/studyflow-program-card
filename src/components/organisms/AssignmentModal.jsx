import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Checkbox from "@/components/atoms/Checkbox"
import { assignmentService } from "@/services/api/assignmentService"
import { classService } from "@/services/api/classService"

const AssignmentModal = ({ isOpen, onClose, assignment, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    dueDate: "",
    priority: false
  })
  
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadClasses()
    }
  }, [isOpen])

  useEffect(() => {
    if (assignment) {
      setFormData({
title: assignment.title_c || assignment.title || "",
        description: assignment.description_c || assignment.description || "",
        classId: assignment.class_id_c?.Id || assignment.class_id_c || assignment.classId || "",
        dueDate: assignment.due_date_c ? format(new Date(assignment.due_date_c), "yyyy-MM-dd'T'HH:mm") : (assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm") : ""),
        priority: assignment.priority_c !== undefined ? assignment.priority_c : (assignment.priority || false)
      })
    } else {
      setFormData({
        title: "",
        description: "",
        classId: "",
        dueDate: "",
        priority: false
      })
    }
  }, [assignment, isOpen])

  const loadClasses = async () => {
    try {
      setLoading(true)
      const data = await classService.getAll()
      setClasses(data)
    } catch (error) {
      toast.error("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.classId || !formData.dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const assignmentData = {
title_c: formData.title,
        description_c: formData.description,
        class_id_c: parseInt(formData.classId),
        due_date_c: new Date(formData.dueDate).toISOString(),
        priority_c: formData.priority,
        completed_c: assignment?.completed_c || assignment?.completed || false,
        completed_date_c: assignment?.completed_date_c || assignment?.completedDate || null,
        grade_c: assignment?.grade_c || assignment?.grade || null
      }

      if (assignment) {
        await assignmentService.update(assignment.Id, assignmentData)
        toast.success("Assignment updated successfully!")
      } else {
        await assignmentService.create(assignmentData)
        toast.success("Assignment created successfully!")
      }
      
      onSave()
      onClose()
    } catch (error) {
      toast.error("Failed to save assignment")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-hard max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {assignment ? "Edit Assignment" : "Add New Assignment"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <FormField
                label="Assignment Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Chapter 5 Essay"
              />

              <FormField
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Assignment details and requirements..."
                rows={3}
              />

              <FormField
                label="Class *"
                type="select"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                disabled={loading}
              >
                <option value="">Select a class</option>
{classes.map(classItem => (
                  <option key={classItem.Id} value={classItem.Id}>
                    {classItem.code_c || classItem.code} - {classItem.name_c || classItem.name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Due Date *"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />

              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={formData.priority}
                  onChange={(checked) => setFormData({ ...formData, priority: checked })}
                />
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority Assignment</label>
                  <p className="text-xs text-gray-500">Mark as high priority</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {assignment ? "Update Assignment" : "Create Assignment"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AssignmentModal