import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "FolderOpen",
  type = "default" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "classes":
        return {
          title: "No classes yet",
          description: "Start organizing your academic life by adding your first class",
          actionLabel: "Add Class",
          icon: "GraduationCap"
        }
      case "assignments":
        return {
          title: "No assignments found",
          description: "All caught up! Your assignments will appear here when you add them",
          actionLabel: "Add Assignment",
          icon: "FileText"
        }
      case "grades":
        return {
          title: "No grades recorded",
          description: "Track your academic progress by recording grades for your classes",
          actionLabel: "Add Grade",
          icon: "Trophy"
        }
      default:
        return { title, description, actionLabel, icon }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={content.icon} className="w-10 h-10 text-indigo-600" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        {content.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 max-w-md"
      >
        {content.description}
      </motion.p>
      
      {onAction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={onAction}
            className="px-8 py-3 gradient-primary text-white font-medium rounded-lg hover:scale-105 transition-all duration-200 shadow-medium"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {content.actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Empty