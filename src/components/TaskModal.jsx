import { useState, useEffect, useRef } from 'react';
import { getAutoColor } from '../utils/colors';
import { getColorOptions } from '../utils/colors';

const DURATION_OPTIONS = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hr' },
  { value: 90, label: '1.5 hr' },
  { value: 120, label: '2 hr' },
  { value: 180, label: '3 hr' },
  { value: 240, label: '4 hr' },
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
    duration: task?.duration || 30,
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

  // Handle outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleSave(formDataRef.current);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleSave(formDataRef.current);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

  // Format startTime for input type="datetime-local"
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      handleChange('startTime', date.toISOString());
    } else {
      handleChange('startTime', '');
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
            <input
              type="datetime-local"
              value={formatDateTimeLocal(formData.startTime)}
              onChange={handleDateTimeChange}
            />
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