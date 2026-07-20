import { SCHEDULE, toISODate } from '../scheduleData'

const JS_DAY_TO_KEY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function calcDSAStreak(allData) {
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let isFirstDay = true

  for (let i = 0; i < 366; i++) {
    const iso = toISODate(cursor)
    const dayKey = JS_DAY_TO_KEY[cursor.getDay()]
    const tasks = SCHEDULE[dayKey] || []

    const criticalIds = tasks
      .filter((task) => task.critical)
      .map((task) => task.id)

    const dayData = allData[iso] || {}

    if (criticalIds.length > 0) {
      const done = criticalIds.every((id) => dayData[id])

      if (done) {
        streak++
      } else if (!isFirstDay) {
        break
      }
    }

    cursor.setDate(cursor.getDate() - 1)
    isFirstDay = false
  }

  return streak
}