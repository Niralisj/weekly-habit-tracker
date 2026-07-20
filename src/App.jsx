import { useEffect, useMemo, useState } from 'react'
import {
  SCHEDULE,
  NOTES_TO_SELF,
  getWeekDays,
  formatRange,
  toISODate,
} from './scheduleData.js'

const STORAGE_KEY = 'placement-tracker-data-v1'
const JS_DAY_TO_KEY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage unavailable — app still works for the session
  }
}

function calcDSAStreak(allData) {
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let isFirstDay = true

  for (let i = 0; i < 366; i++) {
    const iso = toISODate(cursor)
    const dayKey = JS_DAY_TO_KEY[cursor.getDay()]
    const tasks = SCHEDULE[dayKey] || []
    const criticalIds = tasks.filter((t) => t.critical).map((t) => t.id)
    const dayData = allData[iso] || {}

    if (criticalIds.length > 0) {
      const done = criticalIds.every((id) => dayData[id])
      if (done) {
        streak += 1
      } else if (isFirstDay) {
        // today isn't over yet — don't break the streak, just don't count it
      } else {
        break
      }
    }
    cursor.setDate(cursor.getDate() - 1)
    isFirstDay = false
  }
  return streak
}

function dayStats(tasks, dayData) {
  const counted = tasks.filter((t) => t.tag !== 'Bonus')
  const done = counted.filter((t) => dayData[t.id]).length
  return { done, total: counted.length, pct: counted.length ? done / counted.length : 0 }
}

export default function App() {
  const [allData, setAllData] = useState(loadData)
  const [weekAnchor] = useState(new Date())
  const weekDays = useMemo(() => getWeekDays(weekAnchor), [weekAnchor])
  const todayKey = weekDays.find((d) => d.isToday)?.key ?? weekDays[0].key
  const [selectedKey, setSelectedKey] = useState(todayKey)

  useEffect(() => saveData(allData), [allData])

  const selectedDay = weekDays.find((d) => d.key === selectedKey)
  const selectedTasks = SCHEDULE[selectedKey]
  const selectedDayData = allData[selectedDay.iso] || {}

  function toggleTask(iso, taskId) {
    setAllData((prev) => {
      const dayData = { ...(prev[iso] || {}) }
      dayData[taskId] = !dayData[taskId]
      return { ...prev, [iso]: dayData }
    })
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

      <nav className="day-strip">
        {weekDays.map((d) => {
          const tasks = SCHEDULE[d.key]
          const data = allData[d.iso] || {}
          const { done, total } = dayStats(tasks, data)
          const started = done > 0
          const complete = total > 0 && done === total
          return (
            <button
              key={d.key}
              className={
                'day-pill' +
                (d.key === selectedKey ? ' day-pill--active' : '') +
                (complete ? ' day-pill--complete' : started ? ' day-pill--started' : ' day-pill--dim') +
                (d.isFuture ? ' day-pill--future' : '')
              }
              onClick={() => setSelectedKey(d.key)}
            >
              <span className="day-pill-label">{d.label}</span>
              <span className="day-pill-date">{d.date.getDate()}</span>
              {d.isToday && <span className="day-pill-today-dot" />}
            </button>
          )
        })}
      </nav>

      <main className="task-panel">
        <h2 className="panel-heading">{selectedDay.fullLabel}</h2>
        <ul className="task-list">
          {selectedTasks.map((t) => {
            const checked = !!selectedDayData[t.id]
            return (
              <li key={t.id} className={'task-card' + (checked ? ' task-card--done' : '')}>
                <button
                  className="task-check"
                  onClick={() => toggleTask(selectedDay.iso, t.id)}
                  aria-pressed={checked}
                  aria-label={checked ? `Mark ${t.label} not done` : `Mark ${t.label} done`}
                >
                  {checked ? '✓' : ''}
                </button>
                <div className="task-body">
                  <div className="task-top-row">
                    <span className="task-label">{t.label}</span>
                    {t.critical && <span className="must-tag">MUST</span>}
                  </div>
                  <div className="task-meta-row">
                    <span className={`tag tag--${t.tag.toLowerCase()}`}>{t.tag}</span>
                    <span className="task-time">{t.time}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </main>

      <section className="wrapped-card">
        <p className="wrapped-eyebrow">THIS WEEK, WRAPPED</p>
        <div className="wrapped-stats">
          <div className="wrapped-stat">
            <span className="wrapped-num">{weekPct}%</span>
            <span className="wrapped-label">overall done</span>
          </div>
          <div className="wrapped-stat">
            <span className="wrapped-num">{dsaTotal ? Math.round((dsaDone / dsaTotal) * 100) : 0}%</span>
            <span className="wrapped-label">DSA done</span>
          </div>
          <div className="wrapped-stat">
            <span className="wrapped-num">{fullDays}</span>
            <span className="wrapped-label">full days</span>
          </div>
        </div>
        <div className="wrapped-strip">
          {weekDays.map((d) => {
            const tasks = SCHEDULE[d.key]
            const data = allData[d.iso] || {}
            const { done, total } = dayStats(tasks, data)
            const complete = total > 0 && done === total
            return (
              <div
                key={d.key}
                className={'wrapped-block' + (complete ? ' wrapped-block--full' : d.isFuture ? ' wrapped-block--future' : '')}
                title={`${d.fullLabel}: ${done}/${total}`}
              />
            )
          })}
        </div>
      </section>

      <section className="notes-panel">
        <p className="notes-heading">NOTES TO SELF</p>
        <div className="notes-list">
          {NOTES_TO_SELF.map((note, i) => (
            <p key={i} className="note-card">
              {note}
            </p>
          ))}
        </div>
      </section>

      <footer className="foot-note">Placement season opens Aug 15. Data lives only in this browser.</footer>
    </div>
  )
}
