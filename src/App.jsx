import { useEffect, useMemo, useState } from 'react'

import {
  SCHEDULE,
  NOTES_TO_SELF,
  getWeekDays,
  formatRange,
} from './scheduleData'

import {
  loadData,
  saveData,
  loadCustomHabits,
  saveCustomHabits,
} from './utils/storage'

import { calcDSAStreak } from './utils/streak'
import DayStrip from './components/DayStrip'
import TaskList from './components/TaskList'
import WrappedCard from './components/WrappedCard'
import NotesPanel from './components/NotesPanel'
import AddHabitModal from './components/AddHabitModal'


export default function App() {

  const [allData, setAllData] = useState(loadData)
  const [customHabits, setCustomHabits] = useState(loadCustomHabits)
  const [weekAnchor] = useState(new Date())
  const weekDays = useMemo(() => getWeekDays(weekAnchor), [weekAnchor])
  const todayKey = weekDays.find((d) => d.isToday)?.key ?? weekDays[0].key
  const [selectedKey, setSelectedKey] = useState(todayKey)

  const [showAddHabit, setShowAddHabit] = useState(false)

  const [newHabit, setNewHabit] = useState({
  label: '',
  tag: 'Custom',
  time: '',
  critical: false,
  days: [],
})
  
  const WEEK_DAYS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]
  useEffect(() => saveData(allData), [allData])
  useEffect(() => {
  saveCustomHabits(customHabits)
    }, [customHabits])
   
  const selectedDay = weekDays.find((d) => d.key === selectedKey)
  const recurringHabits = customHabits.filter((habit) =>
  habit.days.includes(selectedKey)
)

  const selectedTasks = [
  ...SCHEDULE[selectedKey],
  ...recurringHabits,
]
  const selectedDayData = allData[selectedDay.iso] || {}

  function toggleTask(iso, taskId) {
    setAllData((prev) => {
      const dayData = { ...(prev[iso] || {}) }
      dayData[taskId] = !dayData[taskId]
      return { ...prev, [iso]: dayData }
    })
  }

  function saveHabit() {
  if (!newHabit.label.trim()) return

  if (newHabit.days.length === 0) return

  const habit = {
    id: crypto.randomUUID(),
    label: newHabit.label,
    tag: newHabit.tag,
    time: newHabit.time || '--',
    critical: newHabit.critical,
    days: newHabit.days,
  }

  setCustomHabits((prev) => [...prev, habit])

  setNewHabit({
    label: '',
    tag: 'Custom',
    time: '',
    critical: false,
    days: [],
  })

  setShowAddHabit(false)
}

  const streak = useMemo(() => calcDSAStreak(allData), [allData])

  // Week-level stats — only count today and days already passed, future days haven't happened yet
  const pastOrToday = weekDays.filter((d) => !d.isFuture)
  let weekDone = 0
  let weekTotal = 0
  let dsaDone = 0
  let dsaTotal = 0
  let fullDays = 0
  pastOrToday.forEach((d) => {
    const tasks = SCHEDULE[d.key].filter((t) => t.tag !== 'Bonus')
    const data = allData[d.iso] || {}
    const done = tasks.filter((t) => data[t.id]).length
    weekDone += done
    weekTotal += tasks.length
    if (tasks.length && done === tasks.length) fullDays += 1

    const criticalTasks = SCHEDULE[d.key].filter((t) => t.critical)
    dsaDone += criticalTasks.filter((t) => data[t.id]).length
    dsaTotal += criticalTasks.length
  })
  const weekPct = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-row">
          <div>
            <p className="eyebrow">PLACEMENT MODE</p>
            <h1 className="title">This week&rsquo;s watch list.</h1>
          </div>
          <div className={'streak-badge' + (streak > 0 ? ' streak-badge--lit' : '')} title="Consecutive days DSA fully done">
            <span className="streak-flame">🔥</span>
            <span className="streak-num">{streak}</span>
          </div>
        </div>
        <p className="week-range">{formatRange(weekDays)}</p>
        <div className="progress-track" aria-label={`${weekPct}% of this week done`}>
          <div className="progress-fill" style={{ width: `${weekPct}%` }} />
        </div>
      </header>

      <DayStrip
    weekDays={weekDays}
    selectedKey={selectedKey}
    setSelectedKey={setSelectedKey}
    allData={allData}
    schedule={SCHEDULE}
/>

      <main className="task-panel">
        <div className="task-header">
  <h2 className="panel-heading">
    {selectedDay.fullLabel}
  </h2>

  <button
    className="add-habit-btn"
    onClick={() => setShowAddHabit(true)}
  >
    + Add Habit
  </button>
</div>
        <TaskList
        tasks={selectedTasks}
      dayData={selectedDayData}
      dayIso={selectedDay.iso}
        toggleTask={toggleTask}
/>
        
      </main>
<AddHabitModal
  open={showAddHabit}
  onClose={() => setShowAddHabit(false)}
  newHabit={newHabit}
  setNewHabit={setNewHabit}
  onSave={saveHabit}
  weekDays={WEEK_DAYS}
/>
  <WrappedCard
  weekDays={weekDays}
  schedule={SCHEDULE}
  allData={allData}
  weekPct={weekPct}
  dsaDone={dsaDone}
  dsaTotal={dsaTotal}
  fullDays={fullDays}
/>

      <NotesPanel notes={NOTES_TO_SELF} />
      <footer className="foot-note">Placement season opens Aug 15. Data lives only in this browser.</footer>
    </div>
  )
}
