export default function AddHabitModal({
  open,
  onClose,
  newHabit,
  setNewHabit,
  onSave,
  weekDays,
}) {
  if (!open) return null

  function toggleDay(day) {
    if (newHabit.days.includes(day)) {
      setNewHabit({
        ...newHabit,
        days: newHabit.days.filter((d) => d !== day),
      })
    } else {
      setNewHabit({
        ...newHabit,
        days: [...newHabit.days, day],
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="habit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add Habit</h2>

        <input
          type="text"
          placeholder="Habit name"
          value={newHabit.label}
          onChange={(e) =>
            setNewHabit({
              ...newHabit,
              label: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Time (optional)"
          value={newHabit.time}
          onChange={(e) =>
            setNewHabit({
              ...newHabit,
              time: e.target.value,
            })
          }
        />

        <select
          value={newHabit.tag}
          onChange={(e) =>
            setNewHabit({
              ...newHabit,
              tag: e.target.value,
            })
          }
        >
          <option>DSA</option>
          <option>Project</option>
          <option>College</option>
          <option>Health</option>
          <option>Custom</option>
          <option>Bonus</option>
        </select>

        <div className="days-picker">
          {weekDays.map((day) => (
            <button
              type="button"
              key={day}
              className={
                newHabit.days.includes(day)
                  ? 'day-btn active'
                  : 'day-btn'
              }
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <label className="critical-row">
          <input
            type="checkbox"
            checked={newHabit.critical}
            onChange={(e) =>
              setNewHabit({
                ...newHabit,
                critical: e.target.checked,
              })
            }
          />

          Critical Habit
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}