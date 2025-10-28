import { motion } from "framer-motion"
import StatCard from "@/components/molecules/StatCard"

const QuickStats = ({ stats }) => {
  const {
    totalClasses = 0,
    upcomingAssignments = 0,
    completedToday = 0,
    averageGrade = 0
  } = stats

  const statCards = [
    {
      title: "Total Classes",
      value: totalClasses,
      icon: "GraduationCap",
      color: "indigo"
    },
    {
      title: "Upcoming Assignments",
      value: upcomingAssignments,
      icon: "FileText",
      color: "amber"
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: "CheckCircle",
      color: "green"
    },
    {
      title: "Average Grade",
      value: averageGrade ? `${averageGrade}%` : "N/A",
      icon: "Trophy",
      color: "blue"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  )
}

export default QuickStats