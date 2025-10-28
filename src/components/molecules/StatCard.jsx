import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatCard = ({
  title,
  value,
  icon,
  color = "indigo",
  trend,
  trendDirection = "up",
  className
}) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-600 text-indigo-600",
    green: "from-green-500 to-emerald-600 text-green-600",
    amber: "from-amber-500 to-orange-600 text-amber-600",
    red: "from-red-500 to-pink-600 text-red-600",
    blue: "from-blue-500 to-cyan-600 text-blue-600"
  }

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)" }}
      className={cn(
        "bg-white rounded-xl shadow-soft p-6 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trendDirection === "up" ? "text-green-600" : "text-red-600"
          )}>
            <ApperIcon 
              name={trendDirection === "up" ? "TrendingUp" : "TrendingDown"} 
              className="w-4 h-4 mr-1" 
            />
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <div className={cn(
          "text-3xl font-bold mb-1 text-gradient",
          colorClasses[color]
        )}>
          {value}
        </div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
      </div>
    </motion.div>
  )
}

export default StatCard