import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Classes = lazy(() => import("@/components/pages/Classes"))
const Assignments = lazy(() => import("@/components/pages/Assignments"))
const Calendar = lazy(() => import("@/components/pages/Calendar"))
const Grades = lazy(() => import("@/components/pages/Grades"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "classes",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Classes />
      </Suspense>
    ),
  },
  {
    path: "assignments",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Assignments />
      </Suspense>
    ),
  },
  {
    path: "calendar",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Calendar />
      </Suspense>
    ),
  },
  {
    path: "grades",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Grades />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    ),
  },
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
]

export const router = createBrowserRouter(routes)