import { motion } from "framer-motion"
import { format, differenceInDays, parseISO, isToday, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Checkbox from "@/components/atoms/Checkbox"
import { cn } from "@/utils/cn"

const AssignmentCard = ({ 
  assignment, 
  classItem, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const { title, description, dueDate, priority, completed, grade } = assignment
  const dueDateObj = parseISO(dueDate)
  const daysUntilDue = differenceInDays(dueDateObj, new Date())
  const isDueToday = isToday(dueDateObj)
  const isOverdue = isPast(dueDateObj) && !completed

  const getDueDateStatus = () => {
    if (completed) return { color: "text-green-600", text: "Completed" }
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
        completed && "opacity-75"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Checkbox
            checked={completed}
            onChange={(checked) => onToggleComplete(assignment.Id, checked)}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className={cn(
                "font-semibold text-gray-900",
                completed && "line-through text-gray-500"
              )}>
                {title}
              </h4>
              {classItem && (
                <div className="flex items-center mt-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: classItem.color }}
                  />
                  <span className="text-sm text-gray-600">{classItem.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 ml-4">
              {priority && (
                <ApperIcon name="Flag" className="w-4 h-4 text-amber-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(assignment)}
                className="p-1 hover:bg-gray-100"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(assignment.Id)}
                className="p-1 hover:bg-red-50 hover:text-red-600"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className={dueDateStatus.color}>{dueDateStatus.text}</span>
            {grade !== undefined && (
              <span className="font-medium text-indigo-600">{grade}%</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AssignmentCard