import {
  eachDayOfInterval,
  endOfWeek,
  format,
} from 'date-fns'

const DAY_LABELS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]

export default function Heatmap({
  allData,
  schedule,
  weekAnchor,
}) {
  const today = weekAnchor

  const endDate = endOfWeek(today, {
    weekStartsOn: 1,
  })

  const startDate = new Date(endDate)
  const WEEKS_TO_SHOW = 26

    startDate.setDate(
    startDate.getDate() - WEEKS_TO_SHOW * 7 + 1
)

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const weeks = []

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  function getCompletion(date) {
    const iso = format(date, 'yyyy-MM-dd')
    const dayKey = format(date, 'EEE')

    const tasks = (schedule[dayKey] || []).filter(
      (task) => task.tag !== 'Bonus'
    )

    if (tasks.length === 0) return 0

    const dayData = allData[iso] || {}

    const completed = tasks.filter(
      (task) => dayData[task.id]
    ).length

    return completed / tasks.length
  }

  function getColor(percent) {
    if (percent === 0) return 'heatmap-none'
    if (percent < 0.3) return 'heatmap-low'
    if (percent < 0.7) return 'heatmap-mid'
    if (percent < 1) return 'heatmap-high'
    return 'heatmap-perfect'
  }

  const monthLabels = weeks.map((week) =>
    format(week[0], 'MMM')
  )

  return (
    <section className="heatmap-card">
      <p className="wrapped-eyebrow">
        WATCH HISTORY
      </p>

      <h3 className="heatmap-month">
        {format(today, 'MMMM yyyy')}
      </h3>

      <div className="heatmap-wrapper">

        <div className="heatmap-month-row">
          <div className="heatmap-day-spacer"></div>

          <div className="heatmap-months">
            {monthLabels.map((month, index) => (
              <div
                key={index}
                className="heatmap-month-label"
              >
                {index === 0 ||
                month !== monthLabels[index - 1]
                  ? month
                  : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="heatmap-content">

          <div className="heatmap-days">
            {DAY_LABELS.map((day) => (
              <div
                key={day}
                className="heatmap-day-label"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="heatmap-weeks">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="heatmap-week"
              >
                {week.map((date) => {
                  const percent = getCompletion(date)

                  const isToday =
                    format(date, 'yyyy-MM-dd') ===
                    format(new Date(), 'yyyy-MM-dd')

                  return (
                    <div
                      key={date.toISOString()}
                      className={`heatmap-cell ${getColor(
                        percent
                      )} ${
                        isToday
                          ? 'heatmap-today'
                          : ''
                      }`}
                      title={`${format(
                        date,
                        'dd MMM yyyy'
                      )} • ${Math.round(
                        percent * 100
                      )}%`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

        </div>

        <div className="heatmap-legend">
          <span>Less</span>

          <div className="heatmap-cell heatmap-none" />
          <div className="heatmap-cell heatmap-low" />
          <div className="heatmap-cell heatmap-mid" />
          <div className="heatmap-cell heatmap-high" />
          <div className="heatmap-cell heatmap-perfect" />

          <span>More</span>
        </div>

      </div>
    </section>
  )
}