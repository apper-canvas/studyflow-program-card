import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ClassCard from "@/components/molecules/ClassCard"
import ClassModal from "@/components/organisms/ClassModal"
import { classService } from "@/services/api/classService"

const Classes = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await classService.getAll()
      setClasses(data)
    } catch (err) {
      setError("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (classItem) => {
    setEditingClass(classItem)
    setIsModalOpen(true)
  }

  const handleDelete = async (classId) => {
    if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      return
    }

    try {
      await classService.delete(classId)
      setClasses(classes.filter(c => c.Id !== classId))
      toast.success("Class deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete class")
    }
  }

  const handleViewAssignments = (classId) => {
    navigate(`/assignments?class=${classId}`)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingClass(null)
  }

  const handleSave = () => {
    loadClasses()
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadClasses} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
          <p className="text-gray-600">Manage your class schedule and information</p>
        </div>
        
        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Class
        </Button>
      </motion.div>

      {classes.length === 0 ? (
        <Empty 
          type="classes"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {classes.map((classItem, index) => (
            <motion.div
              key={classItem.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ClassCard
                classItem={classItem}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewAssignments={handleViewAssignments}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ClassModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        classItem={editingClass}
        onSave={handleSave}
      />
    </div>
  )
}

export default Classes