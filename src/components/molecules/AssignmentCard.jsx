import { motion } from "framer-motion";
import { differenceInDays, format, isPast, isToday, parseISO } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import { cn } from "@/utils/cn";

const AssignmentCard = ({ 
  assignment, 
  classItem, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
const { title_c, description_c, due_date_c, priority_c, completed_c, grade_c } = assignment
  const dueDateObj = parseISO(due_date_c)
  const daysUntilDue = differenceInDays(dueDateObj, new Date())
  const isDueToday = isToday(dueDateObj)
  const isOverdue = isPast(dueDateObj) && !completed_c

  const getDueDateStatus = () => {
    if (completed_c) return { color: "text-green-600", text: "Completed" }
    if (isOverdue) return { color: "text-red-600", text: "Overdue" }
    if (isDueToday) return { color: "text-amber-600", text: "Due Today" }
    if (daysUntilDue <= 3) return { color: "text-amber-600", text: `Due in ${daysUntilDue} days` }
    return { color: "text-gray-600", text: `Due ${format(dueDateObj, "MMM d")}` }
  }

  const dueDateStatus = getDueDateStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
className={cn(
        "bg-white rounded-xl shadow-soft p-4 transition-all duration-300 hover:shadow-medium",
        completed_c && "opacity-75"
      )}
    >
<div className="flex items-start space-x-4">
        <div className="mt-1">
          <Checkbox
            checked={completed_c}
            onChange={(checked) => onToggleComplete(assignment.Id, checked)}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn(
              "font-semibold text-gray-900",
              completed_c && "line-through text-gray-500"
            )}>{title_c}</h3>
            
            <div className="flex items-center space-x-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                priority_c 
                  ? "bg-red-100 text-red-700" 
                  : "bg-blue-100 text-blue-700"
              )}>
                {priority_c ? "High Priority" : "Normal"}
              </span>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                dueDateStatus.color.replace('text-', 'bg-').replace('-600', '-100'),
                dueDateStatus.color
              )}>
                {dueDateStatus.text}
              </span>
            </div>
          </div>

          {description_c && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{description_c}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {classItem && (
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: classItem.color_c }}
                  />
                  <span className="text-sm text-gray-600">{classItem.name_c}</span>
                </div>
              )}
              {grade_c !== undefined && grade_c !== null && (
                <span className="font-medium text-indigo-600 text-sm">{grade_c}%</span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(assignment)}
                className="p-1 hover:bg-gray-100"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(assignment.Id)}
                className="p-1 hover:bg-red-50 text-red-600"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
</div>
        </div>
      </div>
    </motion.div>
  )
}

export default AssignmentCard