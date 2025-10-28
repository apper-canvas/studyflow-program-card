import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <motion.button
      type="button"
      ref={ref}
      onClick={() => onChange && onChange(!checked)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={disabled}
      className={cn(
        "relative w-5 h-5 rounded border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        checked 
          ? "bg-indigo-600 border-indigo-600" 
          : "bg-white border-gray-300 hover:border-indigo-400",
        className
      )}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox