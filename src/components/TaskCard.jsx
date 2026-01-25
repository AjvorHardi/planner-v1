import { getAutoColor } from '../utils/colors';

function TaskCard({ task, onDoubleClick, onToggleDone, style }) {
  const backgroundColor = getAutoColor(task);

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onToggleDone(task.id, !task.isDone);
  };

  const handleClick = (e) => {
    // Stop propagation so clicks on task don't trigger time slot click
    e.stopPropagation();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick(task.id);
  };

  return (
    <div
      className="task-card"
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      <div
        className="task-card-header"
        style={{ backgroundColor }}
      >
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="task-checkbox"
        />
        <span className="task-title">{task.title}</span>
      </div>
      {task.notes && (
        <div className="task-notes">{task.notes}</div>
      )}
    </div>
  );
}

export default TaskCard;