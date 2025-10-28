import { getApperClient } from "@/services/apperClient"

const TABLE_NAME = "class_c"

export const classService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "schedule_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      const classes = (response.data || []).map(classItem => ({
        ...classItem,
        schedule_c: classItem.schedule_c ? JSON.parse(classItem.schedule_c) : []
      }))

      return classes
    } catch (error) {
      console.error("Error fetching classes:", error?.message || error)
      return []
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "schedule_c" } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Class not found")
      }

      const classItem = {
        ...response.data,
        schedule_c: response.data.schedule_c ? JSON.parse(response.data.schedule_c) : []
      }

      return classItem
    } catch (error) {
      console.error("Error fetching class:", error?.message || error)
      throw error
    }
  },

  create: async (classData) => {
    try {
      const apperClient = getApperClient()
      
      const payload = {
        records: [
          {
            Name: classData.name_c || classData.name || "Untitled Class",
            name_c: classData.name_c || classData.name,
            code_c: classData.code_c || classData.code,
            instructor_c: classData.instructor_c || classData.instructor,
            department_c: classData.department_c || classData.department,
            location_c: classData.location_c || classData.location,
            credits_c: classData.credits_c || classData.credits || 3,
            color_c: classData.color_c || classData.color || "#4F46E5",
            current_grade_c: null,
            schedule_c: JSON.stringify(classData.schedule_c || classData.schedule || [])
          }
        ]
      }

      const response = await apperClient.createRecord(TABLE_NAME, payload)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message || "Failed to create class")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} classes: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to create class")
        }
        const createdClass = {
          ...response.results[0].data,
          schedule_c: response.results[0].data.schedule_c ? JSON.parse(response.results[0].data.schedule_c) : []
        }
        return createdClass
      }

      return response.data
    } catch (error) {
      console.error("Error creating class:", error?.message || error)
      throw error
    }
  },

  update: async (id, classData) => {
    try {
      const apperClient = getApperClient()
      
      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(classData.Name && { Name: classData.Name }),
            ...(classData.name_c !== undefined && { name_c: classData.name_c }),
            ...(classData.name !== undefined && { name_c: classData.name }),
            ...(classData.code_c !== undefined && { code_c: classData.code_c }),
            ...(classData.code !== undefined && { code_c: classData.code }),
            ...(classData.instructor_c !== undefined && { instructor_c: classData.instructor_c }),
            ...(classData.instructor !== undefined && { instructor_c: classData.instructor }),
            ...(classData.department_c !== undefined && { department_c: classData.department_c }),
            ...(classData.department !== undefined && { department_c: classData.department }),
            ...(classData.location_c !== undefined && { location_c: classData.location_c }),
            ...(classData.location !== undefined && { location_c: classData.location }),
            ...(classData.credits_c !== undefined && { credits_c: classData.credits_c }),
            ...(classData.credits !== undefined && { credits_c: classData.credits }),
            ...(classData.color_c !== undefined && { color_c: classData.color_c }),
            ...(classData.color !== undefined && { color_c: classData.color }),
            ...(classData.current_grade_c !== undefined && { current_grade_c: classData.current_grade_c }),
            ...(classData.currentGrade !== undefined && { current_grade_c: classData.currentGrade }),
            ...((classData.schedule_c !== undefined || classData.schedule !== undefined) && {
              schedule_c: JSON.stringify(classData.schedule_c || classData.schedule || [])
            })
          }
        ]
      }

      const response = await apperClient.updateRecord(TABLE_NAME, payload)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message || "Failed to update class")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} classes: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to update class")
        }
        const updatedClass = {
          ...response.results[0].data,
          schedule_c: response.results[0].data.schedule_c ? JSON.parse(response.results[0].data.schedule_c) : []
        }
        return updatedClass
      }

      return response.data
    } catch (error) {
      console.error("Error updating class:", error?.message || error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord(TABLE_NAME, {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message || "Failed to delete class")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} classes: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to delete class")
        }
      }

      return true
    } catch (error) {
      console.error("Error deleting class:", error?.message || error)
      throw error
    }
  }
}