import nodemailer from 'nodemailer';

let transporter = null;

const setupTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmailNotification = async (contactData) => {
  transporter = transporter || setupTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact: ${contactData.subject}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
      `
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: `Thank you for contacting`,
      html: `
        <p>Hi ${contactData.name},</p>
        <p>Thank you for reaching out! We’ve received your message and will respond soon.</p>
        <hr>
        <p><strong>Your Message:</strong><br>${contactData.message.replace(/\n/g, '<br>')}</p>
      `
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmailNotification;