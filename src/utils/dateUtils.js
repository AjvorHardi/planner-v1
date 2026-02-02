// Get week range (Monday to Sunday) for a given date
export function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}

// Format week range as "Jan 6-12, 2026"
export function formatWeekRange(start, end) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const startMonth = months[start.getMonth()];
  const startDay = start.getDate();
  const endMonth = months[end.getMonth()];
  const endDay = end.getDate();
  const year = end.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
}

// Format date as "2-feb" for day column headers
export function formatDayDate(date) {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const d = new Date(date);
  return `${d.getDate()}-${months[d.getMonth()]}`;
}

// Get array of time slots from 6:00 to 23:00 in 30-minute intervals
export function getTimeSlots() {
  const slots = [];
  for (let hour = 6; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

// Get day of week (0 = Sunday, 1 = Monday, etc.)
export function getDayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 ? 6 : day - 1; // Convert to Monday=0, Sunday=6
}

// Get slot index from time (Date object or time string like "09:30")
export function getSlotIndex(time) {
  let hours, minutes;
  
  if (time instanceof Date) {
    hours = time.getHours();
    minutes = time.getMinutes();
  } else {
    [hours, minutes] = time.split(':').map(Number);
  }
  
  const startHour = 6;
  const totalMinutes = (hours * 60 + minutes) - (startHour * 60);
  return totalMinutes / 30;
}

// Calculate CSS grid row span based on duration in minutes
export function getSlotHeight(duration) {
  return duration / 30; // Each slot is 30 minutes
}

// Check if a date is today
export function isToday(date) {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

// Get ISO date string for a date (YYYY-MM-DD)
export function getISODateString(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Get start of week as ISO date string
export function getWeekStartISO(date) {
  const weekRange = getWeekRange(date);
  return getISODateString(weekRange.start);
}

// Format time for display (HH:MM)
export function formatTime(timeString) {
  if (!timeString) return '';
  const date = new Date(timeString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}