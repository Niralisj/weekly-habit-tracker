function dayStats(tasks, dayData) {
  const counted = tasks.filter((task) => task.tag !== 'Bonus')
  const done = counted.filter((task) => dayData[task.id]).length

  return {
    done,
    total: counted.length,
  }
}

export default function DayStrip({
  weekDays,
  selectedKey,
  setSelectedKey,
  allData,
  schedule,
}) {
  return (
    <nav className="day-strip">
      {weekDays.map((day) => {
        const tasks = schedule[day.key]
        const data = allData[day.iso] || {}

        const { done, total } = dayStats(tasks, data)

        const started = done > 0
        const complete = total > 0 && done === total

        return (
          <button
            key={day.key}
            className={
              'day-pill' +
              (day.key === selectedKey ? ' day-pill--active' : '') +
              (complete
                ? ' day-pill--complete'
                : started
                ? ' day-pill--started'
                : ' day-pill--dim') +
              (day.isFuture ? ' day-pill--future' : '')
            }
            onClick={() => setSelectedKey(day.key)}
          >
            <span className="day-pill-label">{day.label}</span>

            <span className="day-pill-date">
              {day.date.getDate()}
            </span>

            {day.isToday && (
              <span className="day-pill-today-dot" />
            )}
          </button>
        )
      })}
    </nav>
  )
}