import assignmentsData from "@/services/mockData/assignments.json"

let assignments = [...assignmentsData]

const delay = () => new Promise(resolve => setTimeout(resolve, 250))

export const assignmentService = {
  getAll: async () => {
    await delay()
    return [...assignments]
  },

  getById: async (id) => {
    await delay()
    const assignment = assignments.find(a => a.Id === parseInt(id))
    if (!assignment) {
      throw new Error("Assignment not found")
    }
    return { ...assignment }
  },

  getByClassId: async (classId) => {
    await delay()
    return assignments.filter(a => a.classId === classId).map(a => ({ ...a }))
  },

  create: async (assignmentData) => {
    await delay()
    const newId = Math.max(...assignments.map(a => a.Id), 0) + 1
    const newAssignment = {
      Id: newId,
      ...assignmentData,
      completed: false,
      completedDate: null,
      grade: null
    }
    assignments.push(newAssignment)
    return { ...newAssignment }
  },

  update: async (id, assignmentData) => {
    await delay()
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    assignments[index] = { ...assignments[index], ...assignmentData }
    return { ...assignments[index] }
  },

  delete: async (id) => {
    await delay()
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    assignments.splice(index, 1)
    return true
  }
}