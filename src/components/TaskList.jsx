export default function TaskList({
  tasks,
  dayData,
  dayIso,
  toggleTask,
}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const checked = !!dayData[task.id]

        return (
          <li
            key={task.id}
            className={
              'task-card' +
              (checked ? ' task-card--done' : '')
            }
          >
            <button
              className="task-check"
              onClick={() => toggleTask(dayIso, task.id)}
              aria-pressed={checked}
              aria-label={
                checked
                  ? `Mark ${task.label} not done`
                  : `Mark ${task.label} done`
              }
            >
              {checked ? '✓' : ''}
            </button>

            <div className="task-body">
              <div className="task-top-row">
                <span className="task-label">
                  {task.label}
                </span>

                {task.critical && (
                  <span className="must-tag">
                    MUST
                  </span>
                )}
              </div>

              <div className="task-meta-row">
                <span
                  className={`tag tag--${task.tag.toLowerCase()}`}
                >
                  {task.tag}
                </span>

                <span className="task-time">
                  {task.time}
                </span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}