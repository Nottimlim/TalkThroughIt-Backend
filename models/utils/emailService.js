import nodemailer from 'nodemailer';

// Create a test account if no email credentials are provided
let transporter;

const setupTransporter = async () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Use real email credentials if available
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Create test account for development
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }
};

setupTransporter();

export const sendAppointmentEmail = async (appointment, type) => {
    try {
        if (!transporter) {
            await setupTransporter();
        }

        const { client, provider } = await appointment.populate([
            { path: 'client', select: 'firstName lastName email' },
            { path: 'provider', select: 'firstName lastName email' }
        ]);

        let subject, text;
        const dateString = new Date(appointment.datetime).toLocaleString();

        switch(type) {
            case 'created':
                subject = 'Appointment Scheduled';
                text = `Your appointment has been scheduled for ${dateString}`;
                break;
            case 'updated':
                subject = 'Appointment Updated';
                text = `Your appointment has been updated to ${dateString}`;
                break;
            case 'cancelled':
                subject = 'Appointment Cancelled';
                text = `Your appointment for ${dateString} has been cancelled`;
                if (appointment.cancellationReason) {
                    text += `\nReason: ${appointment.cancellationReason}`;
                }
                break;
            case 'reminder':
                subject = 'Appointment Reminder';
                text = `This is a reminder for your appointment on ${dateString}`;
                break;
            default:
                subject = 'Appointment Update';
                text = `Your appointment for ${dateString} has been updated`;
        }

        // Add meeting details
        if (appointment.meetingType === 'video' && appointment.meetingLink) {
            text += `\n\nMeeting Link: ${appointment.meetingLink}`;
        } else if (appointment.meetingType === 'in-person' && appointment.location) {
            text += `\n\nLocation: ${appointment.location}`;
        }

        // Add additional appointment details
        text += `\n\nAppointment Details:`;
        text += `\nType: ${appointment.meetingType}`;
        text += `\nDuration: ${appointment.duration} minutes`;
        text += `\nStatus: ${appointment.status}`;

        // Send to client
        const clientEmail = {
            to: client.email,
            from: process.env.EMAIL_USER || 'appointments@talkthrough.it',
            subject,
            text: `Dear ${client.firstName},\n\n${text}\n\nProvider: ${provider.firstName} ${provider.lastName}`
        };

        // Send to provider
        const providerEmail = {
            to: provider.email,
            from: process.env.EMAIL_USER || 'appointments@talkthrough.it',
            subject,
            text: `Dear ${provider.firstName},\n\n${text}\n\nClient: ${client.firstName} ${client.lastName}`
        };

        // Send emails
        await Promise.all([
            transporter.sendMail(clientEmail),
            transporter.sendMail(providerEmail)
        ]);

        // Log email URLs if using test account
        if (!process.env.EMAIL_USER) {
            console.log('Test emails sent. Preview URLs:');
            console.log('Client email:', nodemailer.getTestMessageUrl(clientEmail));
            console.log('Provider email:', nodemailer.getTestMessageUrl(providerEmail));
        }

    } catch (error) {
        console.error('Email service error:', error);
    }
};
