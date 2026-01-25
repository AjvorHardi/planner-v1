import { getWeekRange, formatWeekRange } from '../utils/dateUtils';
import { exportTasks } from '../utils/storage';

function WeekNavigation({ selectedWeek, onWeekChange, tasks }) {
  const weekRange = getWeekRange(selectedWeek);
  const weekDisplay = formatWeekRange(weekRange.start, weekRange.end);

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  const handleExport = () => {
    exportTasks(tasks);
  };

  return (
    <div className="week-navigation">
      <button className="nav-button" onClick={handlePreviousWeek}>
        ←
      </button>
      <div className="week-display">{weekDisplay}</div>
      <button className="nav-button" onClick={handleNextWeek}>
        →
      </button>
      <button className="export-button" onClick={handleExport}>
        Export Data
      </button>
    </div>
  );
}

export default WeekNavigation;