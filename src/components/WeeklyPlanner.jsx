import { useMemo } from 'react';
import { getTimeSlots, getDayOfWeek, getSlotIndex, getSlotHeight, getWeekRange, getWeekStartISO, formatDayDate } from '../utils/dateUtils';
import TaskCard from './TaskCard';

function WeeklyPlanner({ tasks, selectedWeek, onTimeSlotClick, onTaskDoubleClick, onTaskUpdate }) {
  const timeSlots = getTimeSlots();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get week start date
  const weekStartISO = getWeekStartISO(selectedWeek);
  
  // Filter tasks for current week
  const weekTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.startTime) return false;
      return task.weekDate === weekStartISO;
    });
  }, [tasks, weekStartISO]);

  // Get tasks that start in a specific time slot and day
  const getTasksStartingInSlot = (dayIndex, slotIndex) => {
    return weekTasks.filter(task => {
      if (!task.startTime) return false;
      
      const taskDate = new Date(task.startTime);
      const taskDayIndex = getDayOfWeek(taskDate);
      const taskSlotIndex = getSlotIndex(taskDate);
      
      return taskDayIndex === dayIndex && taskSlotIndex === slotIndex;
    });
  };

  // Get task position for side-by-side layout
  const getTaskPosition = (task, allTasksInSlot) => {
    const taskIndex = allTasksInSlot.findIndex(t => t.id === task.id);
    const totalTasks = allTasksInSlot.length;
    
    // Calculate width and position for side-by-side layout
    const widthPercent = 100 / totalTasks;
    const leftPercent = taskIndex * widthPercent;
    
    return {
      width: `${widthPercent}%`,
      left: `${leftPercent}%`,
    };
  };

  const handleCellClick = (dayIndex, slotIndex) => {
    const slotTime = timeSlots[slotIndex];
    const [hours, minutes] = slotTime.split(':').map(Number);
    
    // Create date for this slot
    const weekStart = new Date(selectedWeek);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(weekStart.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    const slotDate = new Date(monday);
    slotDate.setDate(monday.getDate() + dayIndex);
    slotDate.setHours(hours, minutes, 0, 0);
    
    onTimeSlotClick(null, slotDate.toISOString());
  };

  const handleToggleDone = (taskId, isDone) => {
    onTaskUpdate(taskId, { isDone });
  };

  // Check if today is in current week
  const today = new Date();
  const todayWeekStart = getWeekStartISO(today);
  const todayDayIndex = todayWeekStart === weekStartISO ? getDayOfWeek(today) : -1;

  const monday = getWeekRange(selectedWeek).start;

  return (
    <div className="weekly-planner">
      <div className="planner-grid" style={{
        gridTemplateColumns: '60px repeat(7, 1fr)',
        gridTemplateRows: `auto repeat(${timeSlots.length}, minmax(40px, auto))`
      }}>
        {/* Time label header - Row 1, Col 1 */}
        <div 
          className="time-label-header"
          style={{ gridRow: 1, gridColumn: 1 }}
        ></div>

        {/* Day headers - Row 1, Cols 2-8 */}
        {days.map((day, dayIndex) => {
          const dayDate = new Date(monday);
          dayDate.setDate(monday.getDate() + dayIndex);
          return (
            <div
              key={`header-${dayIndex}`}
              className={`day-header ${todayDayIndex === dayIndex ? 'today' : ''}`}
              style={{ gridRow: 1, gridColumn: dayIndex + 2 }}
            >
              {day} ({formatDayDate(dayDate)})
            </div>
          );
        })}

        {/* Time labels - Starting Row 2, Col 1 */}
        {timeSlots.map((time, index) => (
          <div 
            key={`time-${index}`} 
            className="time-label"
            style={{ gridRow: index + 2, gridColumn: 1 }}
          >
            {index % 2 === 0 ? time : ''}
          </div>
        ))}

        {/* Time slot cells - Starting Row 2, Cols 2-8 */}
        {days.map((day, dayIndex) =>
          timeSlots.map((time, slotIndex) => {
            const tasksStartingHere = getTasksStartingInSlot(dayIndex, slotIndex);
            
            return (
              <div
                key={`cell-${dayIndex}-${slotIndex}`}
                className={`time-slot ${todayDayIndex === dayIndex ? 'today' : ''}`}
                style={{ 
                  gridRow: slotIndex + 2, 
                  gridColumn: dayIndex + 2 
                }}
                onClick={() => handleCellClick(dayIndex, slotIndex)}
              >
                {tasksStartingHere.map((task) => {
                  const position = getTaskPosition(task, tasksStartingHere);
                  const slotHeight = getSlotHeight(task.duration);
                  
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDoubleClick={onTaskDoubleClick}
                      onToggleDone={handleToggleDone}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: position.left,
                        width: position.width,
                        height: `${slotHeight * 40}px`,
                        zIndex: 1,
                      }}
                    />
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default WeeklyPlanner;