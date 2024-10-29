import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Configure your email service
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendAppointmentEmail = async (appointment, type) => {
    try {
        const { client, provider } = await appointment.populate('client provider');
        
        let subject, text;
        switch(type) {
            case 'created':
                subject = 'Appointment Confirmed';
                text = `Your appointment has been scheduled for ${appointment.datetime}`;
                break;
            case 'updated':
                subject = 'Appointment Updated';
                text = `Your appointment has been updated to ${appointment.datetime}`;
                break;
            case 'cancelled':
                subject = 'Appointment Cancelled';
                text = `Your appointment for ${appointment.datetime} has been cancelled`;
                break;
            case 'reminder':
                subject = 'Appointment Reminder';
                text = `Reminder: You have an appointment tomorrow at ${appointment.datetime}`;
                break;
        }

        if (appointment.meetingType === 'video') {
            text += `\nMeeting link: ${appointment.meetingLink}`;
        }

        // Send to client
        await transporter.sendMail({
            to: client.email,
            subject,
            text
        });

        // Send to provider
        await transporter.sendMail({
            to: provider.email,
            subject,
            text
        });

    } catch (error) {
        console.error('Email send error:', error);
    }
};
