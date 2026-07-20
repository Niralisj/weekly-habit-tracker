function dayStats(tasks, dayData) {
  const counted = tasks.filter((task) => task.tag !== 'Bonus')

  const done = counted.filter((task) => dayData[task.id]).length

  return {
    done,
    total: counted.length,
  }
}

export default function WrappedCard({
  weekDays,
  schedule,
  allData,
  weekPct,
  dsaDone,
  dsaTotal,
  fullDays,
}) {
  return (
    <section className="wrapped-card">
      <p className="wrapped-eyebrow">
        THIS WEEK, WRAPPED
      </p>

      <div className="wrapped-stats">
        <div className="wrapped-stat">
          <span className="wrapped-num">{weekPct}%</span>
          <span className="wrapped-label">
            overall done
          </span>
        </div>

        <div className="wrapped-stat">
          <span className="wrapped-num">
            {dsaTotal
              ? Math.round((dsaDone / dsaTotal) * 100)
              : 0}
            %
          </span>

          <span className="wrapped-label">
            DSA done
          </span>
        </div>

        <div className="wrapped-stat">
          <span className="wrapped-num">
            {fullDays}
          </span>

          <span className="wrapped-label">
            full days
          </span>
        </div>
      </div>

      <div className="wrapped-strip">
        {weekDays.map((day) => {
          const tasks = schedule[day.key]
          const data = allData[day.iso] || {}

          const { done, total } = dayStats(tasks, data)

          const complete =
            total > 0 && done === total

          return (
            <div
              key={day.key}
              className={
                'wrapped-block' +
                (complete
                  ? ' wrapped-block--full'
                  : day.isFuture
                  ? ' wrapped-block--future'
                  : '')
              }
              title={`${day.fullLabel}: ${done}/${total}`}
            />
          )
        })}
      </div>
    </section>
  )
}