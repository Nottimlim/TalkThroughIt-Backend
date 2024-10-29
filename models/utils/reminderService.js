import schedule from 'node-schedule';
import { sendAppointmentEmail } from './emailService.js';

const reminderJobs = new Map();

export const scheduleReminder = async (appointment) => {
    const { reminderSettings, datetime } = appointment;
    
    // Calculate reminder time
    const reminderTime = new Date(datetime);
    reminderTime.setHours(reminderTime.getHours() - reminderSettings.reminderTime);

    // Cancel existing reminder if any
    if (reminderJobs.has(appointment._id.toString())) {
        reminderJobs.get(appointment._id.toString()).cancel();
    }

    // Schedule new reminder
    const job = schedule.scheduleJob(reminderTime, async () => {
        try {
            await sendAppointmentEmail(appointment, 'reminder');
            appointment.reminderSent = true;
            await appointment.save();
        } catch (error) {
            console.error('Reminder send error:', error);
        }
    });

    reminderJobs.set(appointment._id.toString(), job);
};

export const cancelReminder = (appointmentId) => {
    const job = reminderJobs.get(appointmentId);
    if (job) {
        job.cancel();
        reminderJobs.delete(appointmentId);
    }
};
