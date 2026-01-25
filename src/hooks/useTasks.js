import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTasks, saveTasks } from '../utils/storage';
import { getAutoColor } from '../utils/colors';
import { getWeekStartISO } from '../utils/dateUtils';

export function useTasks() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Add a new task
  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      title: taskData.title || '',
      notes: taskData.notes || '',
      details: taskData.details || '',
      startTime: taskData.startTime || null,
      duration: taskData.duration || 60,
      category: taskData.category || null,
      titleColor: taskData.titleColor || null,
      isDone: taskData.isDone || false,
      weekDate: taskData.weekDate || null,
    };

    // Auto-assign color if not set
    if (!newTask.titleColor) {
      newTask.titleColor = getAutoColor(newTask);
    }

    // Set weekDate if startTime is provided
    if (newTask.startTime && !newTask.weekDate) {
      newTask.weekDate = getWeekStartISO(new Date(newTask.startTime));
    }

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return newTask.id;
  };

  // Update an existing task
  const updateTask = (id, updates) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const updated = { ...task, ...updates };

        // Auto-assign color based on isDone/category
        updated.titleColor = getAutoColor(updated);

        // Set weekDate if startTime is being added/changed
        if (updates.startTime !== undefined) {
          if (updates.startTime) {
            updated.weekDate = getWeekStartISO(new Date(updates.startTime));
          } else {
            updated.weekDate = null;
          }
        }

        return updated;
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Get task by ID
  const getTask = (id) => {
    return tasks.find((task) => task.id === id);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTask,
  };
}