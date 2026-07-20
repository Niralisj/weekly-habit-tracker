// ---- The routine itself. Edit this if the schedule ever changes. ----

export const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DAY_FULL = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
}

function weekdayTasks(day) {
  const base = [
    { id: 'morning-dsa', label: 'Morning DSA', time: '6:00–6:30 am', tag: 'DSA', critical: true },
    { id: 'college', label: 'Attend college', time: '9:00 am–5:00 pm', tag: 'College' },
    { id: 'gym', label: 'Gym', time: '6:45–7:45/8:00 pm', tag: 'Gym' },
    { id: 'college-review', label: 'College review — capped', time: '10–20 min', tag: 'College' },
    { id: 'evening-dsa', label: 'Evening DSA block', time: '8:20–9:15 pm', tag: 'DSA', critical: true },
  ]
  if (day === 'Mon' || day === 'Wed' || day === 'Fri') {
    base.push({ id: 'resume', label: 'Resume / project polish', time: 'light touch', tag: 'Extra' })
  }
  if (day === 'Tue' || day === 'Thu') {
    base.push({ id: 'cs-fundamentals', label: 'CS fundamental — OS / DBMS / OOPs / CN', time: '30 min', tag: 'Extra' })
  }
  if (day === 'Thu') {
    base.push({ id: 'mock-interview', label: 'Mock interview / viva practice', time: 'once every 2 weeks', tag: 'Bonus' })
  }
  return base
}

export const SCHEDULE = {
  Mon: weekdayTasks('Mon'),
  Tue: weekdayTasks('Tue'),
  Wed: weekdayTasks('Wed'),
  Thu: weekdayTasks('Thu'),
  Fri: weekdayTasks('Fri'),
  Sat: [
    { id: 'long-dsa', label: 'Long DSA block — harder patterns', time: '2–3 hrs', tag: 'DSA', critical: true },
    { id: 'react-learning', label: 'Learn to code properly — React etc.', time: 'open block', tag: 'Build' },
  ],
  Sun: [
    { id: 'ml-project', label: 'ML / DS project work', time: 'open block', tag: 'Project' },
    { id: 'applications', label: 'Resume + applications', time: 'open block', tag: 'Placement' },
    { id: 'notion-review', label: 'Notion log review', time: '15 min', tag: 'Review' },
  ],
}

// ---- Notes to self. Static. Never a popup, just always there. ----
export const NOTES_TO_SELF = [
  "6am DSA isn't optional because you're strict. It's non-negotiable because 9pm-you is already tired and 6am-you isn't.",
  'Scrolling asks nothing of you. That\u2019s exactly why it never feels like the harder, better option.',
  "One missed weekday is data. Two in a row is a pattern worth noticing. Catch it before it becomes the week.",
  'You don\u2019t need a longer session. You need today\u2019s session to actually happen.',
]

// ---- Date helpers ----

export function toISODate(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Returns the Monday of the current week as a Date, zeroed to midnight.
export function getMonday(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const jsDay = d.getDay() // 0 = Sun, 1 = Mon, ...
  const diff = jsDay === 0 ? -6 : 1 - jsDay
  d.setDate(d.getDate() + diff)
  return d
}

// Returns array of 7 { key, date, iso, label, fullLabel, isToday, isFuture } for the week containing `date`.
export function getWeekDays(date = new Date()) {
  const monday = getMonday(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return DAY_ORDER.map((key, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      key,
      date: d,
      iso: toISODate(d),
      label: key,
      fullLabel: DAY_FULL[key],
      isToday: toISODate(d) === toISODate(today),
      isFuture: d > today,
    }
  })
}

export function formatRange(weekDays) {
  const start = weekDays[0].date
  const end = weekDays[6].date
  const opts = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}
