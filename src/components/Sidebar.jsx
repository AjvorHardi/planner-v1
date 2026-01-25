import { getAutoColor } from '../utils/colors';

function Sidebar({ tasks, onTaskClick, onNewTask }) {
  // Get unscheduled tasks (startTime === null) in creation order
  // Filter maintains array order, which is creation order
  const unscheduledTasks = tasks.filter(task => !task.startTime);

  return (
    <div className="sidebar">
      <button className="sidebar-add-button" onClick={() => onNewTask(null, null)}>
        +
      </button>
      <div className="sidebar-tasks">
        {unscheduledTasks.length === 0 ? (
          <div className="sidebar-empty">No unscheduled tasks</div>
        ) : (
          unscheduledTasks.map(task => {
            const backgroundColor = getAutoColor(task);
            return (
              <div
                key={task.id}
                className="sidebar-task"
                onClick={() => onTaskClick(task.id, null)}
              >
                <div 
                  className="sidebar-task-header"
                  style={{ backgroundColor }}
                >
                  <span className="sidebar-task-title">{task.title}</span>
                </div>
                {task.notes && (
                  <div className="sidebar-task-notes">{task.notes}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;