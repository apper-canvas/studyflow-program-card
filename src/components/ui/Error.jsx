import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  type = "default" 
}) => {
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
        className="w-16 h-16 bg-gradient-error rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        Oops! Something went wrong
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-6 max-w-md"
      >
        {message}. Please try again or contact support if the problem persists.
      </motion.p>
      
      {showRetry && onRetry && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={onRetry}
            className="px-6 py-3 gradient-primary text-white font-medium rounded-lg hover:scale-105 transition-all duration-200 shadow-medium"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Error