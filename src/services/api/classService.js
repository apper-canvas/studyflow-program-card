import classesData from "@/services/mockData/classes.json"

let classes = [...classesData]

const delay = () => new Promise(resolve => setTimeout(resolve, 300))

export const classService = {
  getAll: async () => {
    await delay()
    return [...classes]
  },

  getById: async (id) => {
    await delay()
    const classItem = classes.find(c => c.Id === parseInt(id))
    if (!classItem) {
      throw new Error("Class not found")
    }
    return { ...classItem }
  },

  create: async (classData) => {
    await delay()
    const newId = Math.max(...classes.map(c => c.Id), 0) + 1
    const newClass = {
      Id: newId,
      ...classData,
      currentGrade: null
    }
    classes.push(newClass)
    return { ...newClass }
  },

  update: async (id, classData) => {
    await delay()
    const index = classes.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Class not found")
    }
    classes[index] = { ...classes[index], ...classData }
    return { ...classes[index] }
  },

  delete: async (id) => {
    await delay()
    const index = classes.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Class not found")
    }
    classes.splice(index, 1)
    return true
  }
}