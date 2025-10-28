import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    default: "gradient-primary text-white hover:shadow-lg hover:scale-[1.02] focus:ring-indigo-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    success: "gradient-success text-white hover:shadow-lg hover:scale-[1.02] focus:ring-green-500",
    warning: "gradient-warning text-white hover:shadow-lg hover:scale-[1.02] focus:ring-amber-500",
    error: "gradient-error text-white hover:shadow-lg hover:scale-[1.02] focus:ring-red-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:scale-100",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = "Button"

export default Button