import { getApperClient } from "@/services/apperClient"

const TABLE_NAME = "assignment_c"

export const assignmentService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "class_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_date_c" } },
          { field: { Name: "grade_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments:", error?.message || error)
      return []
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "class_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_date_c" } },
          { field: { Name: "grade_c" } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Assignment not found")
      }

      return response.data
    } catch (error) {
      console.error("Error fetching assignment:", error?.message || error)
      throw error
    }
  },

  getByClassId: async (classId) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "class_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_date_c" } },
          { field: { Name: "grade_c" } }
        ],
        where: [
          {
            FieldName: "class_id_c",
            Operator: "EqualTo",
            Values: [parseInt(classId)]
          }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments by class:", error?.message || error)
      return []
    }
  },

  create: async (assignmentData) => {
    try {
      const apperClient = getApperClient()
      
      const payload = {
        records: [
          {
            Name: assignmentData.title_c || assignmentData.title || "Untitled",
            title_c: assignmentData.title_c || assignmentData.title,
            description_c: assignmentData.description_c || assignmentData.description,
            class_id_c: parseInt(assignmentData.class_id_c || assignmentData.classId),
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            priority_c: assignmentData.priority_c !== undefined ? assignmentData.priority_c : (assignmentData.priority || false),
            completed_c: false,
            completed_date_c: null,
            grade_c: null
          }
        ]
      }

      const response = await apperClient.createRecord(TABLE_NAME, payload)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message || "Failed to create assignment")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to create assignment")
        }
        return response.results[0].data
      }

      return response.data
    } catch (error) {
      console.error("Error creating assignment:", error?.message || error)
      throw error
    }
  },

  update: async (id, assignmentData) => {
    try {
      const apperClient = getApperClient()
      
      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(assignmentData.Name && { Name: assignmentData.Name }),
            ...(assignmentData.title_c !== undefined && { title_c: assignmentData.title_c }),
            ...(assignmentData.title !== undefined && { title_c: assignmentData.title }),
            ...(assignmentData.description_c !== undefined && { description_c: assignmentData.description_c }),
            ...(assignmentData.description !== undefined && { description_c: assignmentData.description }),
            ...((assignmentData.class_id_c || assignmentData.classId) && { 
              class_id_c: parseInt(assignmentData.class_id_c || assignmentData.classId) 
            }),
            ...(assignmentData.due_date_c !== undefined && { due_date_c: assignmentData.due_date_c }),
            ...(assignmentData.dueDate !== undefined && { due_date_c: assignmentData.dueDate }),
            ...(assignmentData.priority_c !== undefined && { priority_c: assignmentData.priority_c }),
            ...(assignmentData.priority !== undefined && { priority_c: assignmentData.priority }),
            ...(assignmentData.completed_c !== undefined && { completed_c: assignmentData.completed_c }),
            ...(assignmentData.completed !== undefined && { completed_c: assignmentData.completed }),
            ...(assignmentData.completed_date_c !== undefined && { completed_date_c: assignmentData.completed_date_c }),
            ...(assignmentData.completedDate !== undefined && { completed_date_c: assignmentData.completedDate }),
            ...(assignmentData.grade_c !== undefined && { grade_c: assignmentData.grade_c }),
            ...(assignmentData.grade !== undefined && { grade_c: assignmentData.grade })
          }
        ]
      }

      const response = await apperClient.updateRecord(TABLE_NAME, payload)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message || "Failed to update assignment")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to update assignment")
        }
        return response.results[0].data
      }

      return response.data
    } catch (error) {
      console.error("Error updating assignment:", error?.message || error)
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
        throw new Error(response.message || "Failed to delete assignment")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to delete assignment")
        }
      }

      return true
    } catch (error) {
      console.error("Error deleting assignment:", error?.message || error)
      throw error
    }
  }
}