import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import { classService } from "@/services/api/classService"

const ClassModal = ({ isOpen, onClose, classItem, onSave }) => {
const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    department: "",
    location: "",
    credits: 3,
    color: "#4F46E5",
    schedule: []
  })
  
  const [schedule, setSchedule] = useState([
    { dayOfWeek: "", startTime: "", endTime: "", location: "" }
  ])

  const colors = [
    "#4F46E5", "#7C3AED", "#F59E0B", "#10B981", 
    "#EF4444", "#3B82F6", "#8B5CF6", "#06B6D4"
  ]

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  useEffect(() => {
if (classItem) {
      setFormData({
        name: classItem.name || "",
        code: classItem.code || "",
        instructor: classItem.instructor || "",
        department: classItem.department || "",
        location: classItem.location || "",
        credits: classItem.credits || 3,
        color: classItem.color || "#4F46E5"
      })
      setSchedule(classItem.schedule?.length > 0 ? classItem.schedule : [
        { dayOfWeek: "", startTime: "", endTime: "", location: "" }
      ])
    } else {
setFormData({
        name: "",
        code: "",
        instructor: "",
        department: "",
        location: "",
        credits: 3,
        color: "#4F46E5"
      })
      setSchedule([
        { dayOfWeek: "", startTime: "", endTime: "", location: "" }
      ])
    }
  }, [classItem, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code) {
      toast.error("Please fill in required fields")
      return
    }

    const validSchedule = schedule.filter(s => 
      s.dayOfWeek && s.startTime && s.endTime
    )

    try {
      const classData = {
        ...formData,
        schedule: validSchedule
      }

      if (classItem) {
        await classService.update(classItem.Id, classData)
        toast.success("Class updated successfully!")
      } else {
        await classService.create(classData)
        toast.success("Class created successfully!")
      }
      
      onSave()
      onClose()
    } catch (error) {
      toast.error("Failed to save class")
    }
  }

  const addScheduleSlot = () => {
    setSchedule([...schedule, { dayOfWeek: "", startTime: "", endTime: "", location: "" }])
  }

  const removeScheduleSlot = (index) => {
    if (schedule.length > 1) {
      setSchedule(schedule.filter((_, i) => i !== index))
    }
  }

  const updateSchedule = (index, field, value) => {
    const updated = schedule.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    )
    setSchedule(updated)
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
            className="bg-white rounded-xl shadow-hard max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {classItem ? "Edit Class" : "Add New Class"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Class Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Introduction to Psychology"
                />
                
                <FormField
                  label="Class Code *"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. PSYC 101"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Professor name"
                />
                
                <FormField
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Room or building"
                />
              </div>

<FormField
                label="Department"
                type="text"
                placeholder="e.g., Computer Science, Mathematics"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Credits"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          formData.color === color ? "border-gray-400" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Schedule</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addScheduleSlot}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
                
                {schedule.map((slot, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                    <FormField
                      label="Day"
                      type="select"
                      value={slot.dayOfWeek}
                      onChange={(e) => updateSchedule(index, "dayOfWeek", e.target.value)}
                    >
                      <option value="">Select day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </FormField>
                    
                    <FormField
                      label="Start Time"
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSchedule(index, "startTime", e.target.value)}
                    />
                    
                    <FormField
                      label="End Time"
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSchedule(index, "endTime", e.target.value)}
                    />
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="error"
                        size="sm"
                        onClick={() => removeScheduleSlot(index)}
                        disabled={schedule.length === 1}
                        className="w-full"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                  {classItem ? "Update Class" : "Create Class"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ClassModal