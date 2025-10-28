import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/layouts/Root"

function Signup() {
  const { isInitialized } = useAuth()
  
  useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
    }
  }, [isInitialized])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-16 h-16 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-3xl font-bold shadow-lg">
            S
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="text-center text-2xl font-bold text-gray-900">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-600">
              Join StudyFlow to organize your academic life
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup