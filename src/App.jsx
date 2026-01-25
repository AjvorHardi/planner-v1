import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import WeeklyPlanner from './components/WeeklyPlanner';
import Sidebar from './components/Sidebar';
import WeekNavigation from './components/WeekNavigation';
import TaskModal from './components/TaskModal';
import './App.css';

function App() {
  const { tasks, addTask, updateTask, deleteTask, getTask } = useTasks();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [modalTaskId, setModalTaskId] = useState(null);
  const [modalStartTime, setModalStartTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (taskId = null, startTime = null) => {
    setModalTaskId(taskId);
    setModalStartTime(startTime);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTaskId(null);
    setModalStartTime(null);
  };

  const handleWeekChange = (newDate) => {
    setSelectedWeek(newDate);
  };

  return (
    <div className="app">
      <WeekNavigation
        selectedWeek={selectedWeek}
        onWeekChange={handleWeekChange}
        tasks={tasks}
      />
      <div className="app-content">
        <WeeklyPlanner
          tasks={tasks}
          selectedWeek={selectedWeek}
          onTimeSlotClick={openModal}
          onTaskDoubleClick={openModal}
          onTaskUpdate={updateTask}
        />
        <Sidebar
          tasks={tasks}
          onTaskClick={openModal}
          onNewTask={openModal}
        />
      </div>
      {isModalOpen && (
        <TaskModal
          taskId={modalTaskId}
          initialStartTime={modalStartTime}
          onClose={closeModal}
          onSave={(taskData) => {
            if (modalTaskId) {
              updateTask(modalTaskId, taskData);
            } else {
              addTask(taskData);
            }
            closeModal();
          }}
          onDelete={(id) => {
            deleteTask(id);
            closeModal();
          }}
          getTask={getTask}
        />
      )}
    </div>
  );
}

export default App;