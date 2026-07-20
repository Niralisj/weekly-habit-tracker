const STORAGE_KEY = 'placement-tracker-data-v1'
const CUSTOM_HABITS_KEY = 'placement-custom-habits-v1'

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

export function loadCustomHabits() {
  try {
    const raw = localStorage.getItem(CUSTOM_HABITS_KEY)

    if (!raw) return []

    const data = JSON.parse(raw)

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveCustomHabits(data) {
  try {
    localStorage.setItem(CUSTOM_HABITS_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}