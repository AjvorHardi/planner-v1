// Color constants
export const COLORS = {
  success: '#10B981',        // green - auto-applied when isDone=true
  failure: '#EF4444',        // red
  nonNegotiable: '#F97316',  // orange - auto-applied for NON NEGOTIABLE category
  haveTo: '#EAB308',         // yellow - auto-applied for HAVE TO category
  wantTo: '#3B82F6',         // blue - auto-applied for WANT TO category
  purple: '#A855F7',         // purple
  teal: '#14B8A6',           // teal
  pink: '#EC4899',           // pink
  indigo: '#6366F1',         // indigo
  cyan: '#06B6D4',           // cyan
  emerald: '#10B981',        // emerald
  amber: '#F59E0B',          // amber
};

// Get auto-assigned color based on task state
export function getAutoColor(task) {
  if (task.isDone) {
    return COLORS.success;
  }
  
  if (task.category === 'NON NEGOTIABLE') {
    return COLORS.nonNegotiable;
  }
  if (task.category === 'HAVE TO') {
    return COLORS.haveTo;
  }
  if (task.category === 'WANT TO') {
    return COLORS.wantTo;
  }
  
  // Return manually set color or default
  return task.titleColor || COLORS.wantTo;
}

// Get extended color options for color picker dropdown
export function getColorOptions() {
  return [
    { label: 'Green (Done)', value: COLORS.success },
    { label: 'Orange (Non-Negotiable)', value: COLORS.nonNegotiable },
    { label: 'Yellow (Have To)', value: COLORS.haveTo },
    { label: 'Blue (Want To)', value: COLORS.wantTo },
    { label: 'Purple', value: COLORS.purple },
    { label: 'Teal', value: COLORS.teal },
    { label: 'Pink', value: COLORS.pink },
    { label: 'Indigo', value: COLORS.indigo },
    { label: 'Cyan', value: COLORS.cyan },
    { label: 'Emerald', value: COLORS.emerald },
    { label: 'Amber', value: COLORS.amber },
    { label: 'Red', value: COLORS.failure },
  ];
}