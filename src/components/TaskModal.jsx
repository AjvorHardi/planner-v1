import { useState, useEffect, useRef } from 'react';
import { getAutoColor } from '../utils/colors';
import { getColorOptions } from '../utils/colors';

const DURATION_OPTIONS = [
  { value: 60, label: '1 hr' },
  { value: 120, label: '2 hr' },
  { value: 180, label: '3 hr' },
  { value: 240, label: '4 hr' },
  { value: 300, label: '5 hr' },
  { value: 360, label: '6 hr' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'NON NEGOTIABLE', label: 'NON NEGOTIABLE' },
  { value: 'HAVE TO', label: 'HAVE TO' },
  { value: 'WANT TO', label: 'WANT TO' },
];

function TaskModal({ taskId, initialStartTime, onClose, onSave, onDelete, getTask }) {
  const task = taskId ? getTask(taskId) : null;
  const modalRef = useRef(null);
  const formDataRef = useRef(null);

  const [formData, setFormData] = useState({
    title: task?.title || '',
    notes: task?.notes || '',
    details: task?.details || '',
    startTime: initialStartTime || task?.startTime || '',
    duration: task?.duration || 60,
    category: task?.category || '',
    titleColor: task?.titleColor || '',
    isDone: task?.isDone || false,
  });

  const [initialData, setInitialData] = useState({ ...formData });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Keep ref in sync with formData
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Update form data when task or initialStartTime changes
  useEffect(() => {
    if (task) {
      const newData = {
        title: task.title || '',
        notes: task.notes || '',
        details: task.details || '',
        startTime: initialStartTime || task.startTime || '',
        duration: task.duration || 30,
        category: task.category || '',
        titleColor: task.titleColor || '',
        isDone: task.isDone || false,
      };
      setFormData(newData);
      setInitialData({ ...newData });
    } else if (initialStartTime) {
      const newData = {
        ...formData,
        startTime: initialStartTime,
      };
      setFormData(newData);
      setInitialData({ ...newData });
    }
  }, [task, initialStartTime]);

  // Auto-save color when isDone or category changes
  useEffect(() => {
    const autoColor = getAutoColor({
      isDone: formData.isDone,
      category: formData.category,
      titleColor: formData.titleColor,
    });
    setFormData(prev => ({ ...prev, titleColor: autoColor }));
  }, [formData.isDone, formData.category]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (data = formData) => {
    if (!data.title.trim()) {
      return; // Don't save if title is empty
    }

    const taskData = {
      title: data.title.trim(),
      notes: data.notes.trim(),
      details: data.details.trim(),
      startTime: data.startTime || null,
      duration: data.duration,
      category: data.category || null,
      titleColor: data.titleColor,
      isDone: data.isDone,
    };

    onSave(taskData);
  };

  const handleCancel = () => {
    setFormData({ ...initialData });
    onClose();
  };

  // Keep cancel handler ref in sync
  const handleCancelRef = useRef(handleCancel);
  useEffect(() => {
    handleCancelRef.current = handleCancel;
  }, [initialData, onClose]);

  // Handle outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleSave(formDataRef.current);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCancelRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []); // Empty deps - using refs for handlers

  const handleDelete = () => {
    if (taskId) {
      onDelete(taskId);
    }
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    setShowDeleteConfirm(false);
  };

  const colorOptions = getColorOptions();

  // Parse date and hour from ISO string
  const getDateAndHour = (isoString) => {
    if (!isoString) return { date: '', hour: '' };
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return {
      date: `${year}-${month}-${day}`,
      hour: String(date.getHours()).padStart(2, '0')
    };
  };

  // Generate hour options (6:00 to 23:00)
  const hourOptions = [];
  for (let i = 6; i < 24; i++) {
    hourOptions.push(String(i).padStart(2, '0'));
  }

  const { date: selectedDate, hour: selectedHour } = getDateAndHour(formData.startTime);

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (!dateValue) {
      // Clear startTime if date is cleared
      handleChange('startTime', '');
      return;
    }
    
    if (selectedHour) {
      // Combine date and hour into ISO string
      const date = new Date(`${dateValue}T${selectedHour}:00:00`);
      handleChange('startTime', date.toISOString());
    } else {
      // If only date is set, use default hour of 9:00
      const date = new Date(`${dateValue}T09:00:00`);
      handleChange('startTime', date.toISOString());
    }
  };

  const handleHourChange = (e) => {
    const hourValue = e.target.value;
    if (!hourValue) {
      // Clear startTime if hour is cleared
      handleChange('startTime', '');
      return;
    }
    
    if (selectedDate) {
      // Combine date and hour into ISO string
      const date = new Date(`${selectedDate}T${hourValue}:00:00`);
      handleChange('startTime', date.toISOString());
    } else {
      // If only hour is set, use today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const date = new Date(`${year}-${month}-${day}T${hourValue}:00:00`);
      handleChange('startTime', date.toISOString());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header" style={{ backgroundColor: formData.titleColor || '#3B82F6' }}>
          <input
            type="checkbox"
            checked={formData.isDone}
            onChange={(e) => handleChange('isDone', e.target.checked)}
            className="modal-done-checkbox"
          />
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Task title (required)"
            className="modal-title-input"
            autoFocus
          />
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Start Time (optional - leave empty for sidebar)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{ width: '140px' }}
              />
              <select
                value={selectedHour}
                onChange={handleHourChange}
                style={{ width: '120px' }}
              >
                <option value="">--</option>
                {hourOptions.map(hour => (
                  <option key={hour} value={hour}>{hour}:00</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label>Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
            >
              {DURATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label>Color</label>
            <select
              value={formData.titleColor}
              onChange={(e) => handleChange('titleColor', e.target.value)}
            >
              {colorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label>Notes (shown on card)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows="3"
              placeholder="Optional notes displayed on task card"
            />
          </div>

          <div className="modal-field">
            <label>Details (only in modal)</label>
            <textarea
              value={formData.details}
              onChange={(e) => handleChange('details', e.target.value)}
              rows="5"
              placeholder="Optional details only visible in this modal"
            />
          </div>
        </div>

        <div className="modal-footer">
          {taskId && (
            <>
              {!showDeleteConfirm ? (
                <button
                  className="delete-button"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
              ) : (
                <div className="delete-confirm">
                  <span>Are you sure?</span>
                  <button
                    className="confirm-delete-button"
                    onClick={handleDeleteConfirm}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="cancel-delete-button"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
          <div className="modal-footer-right">
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;