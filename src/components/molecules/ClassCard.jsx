import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Assignments from "@/components/pages/Assignments";
import { cn } from "@/utils/cn";

const ClassCard = ({ classItem, onEdit, onDelete, onViewAssignments }) => {
const { name_c, code_c, instructor_c, schedule_c, color_c, location_c, current_grade_c } = classItem
  const getNextClass = () => {
if (!schedule_c || schedule_c.length === 0) return null
    
    const today = new Date()
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" })
    const todaySchedule = schedule_c.find(s => s.dayOfWeek === dayOfWeek)
    
    return todaySchedule
  }

  const nextClass = getNextClass()

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)" }}
      className="bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color_c }}
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{name_c}</h3>
              <p className="text-sm text-gray-600">{code_c}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(classItem)}
              className="p-2 hover:bg-gray-100"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(classItem.Id)}
              className="p-2 hover:bg-red-50 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
<ApperIcon name="User" className="w-4 h-4 mr-2" />
            {instructor_c}
          </div>
          
{location_c && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
              {location_c}
            </div>
          )}
          
          {nextClass && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
              Next: {nextClass.startTime} - {nextClass.endTime}
            </div>
          )}
          
{current_grade_c !== undefined && current_grade_c !== null && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Trophy" className="w-4 h-4 mr-2" />
              Current Grade: <span className="font-semibold ml-1">{current_grade_c}%</span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewAssignments(classItem.Id)}
          className="w-full"
        >
          <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
          View Assignments
        </Button>
      </div>
    </motion.div>
  )
}

export default ClassCard