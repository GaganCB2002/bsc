import Activity from '../models/Activity.js';

// Logs an activity entry without ever throwing back to the request flow.
// If the Activity collection write fails, we just log a warning so the
// primary action (login, profile update, etc.) is not rolled back.
export const logActivity = async (userId, type, metadata = {}) => {
  try {
    if (!userId) return;
    await Activity.create({ userId, type, metadata });
  } catch (err) {
    console.warn(`[activity] failed to log '${type}': ${err.message}`);
  }
};
