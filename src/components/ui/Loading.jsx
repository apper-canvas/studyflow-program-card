import { motion } from "framer-motion"

const Loading = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-6"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-indigo-200 border-t-primary rounded-full"
      />
    </div>
  )
}

export default Loading