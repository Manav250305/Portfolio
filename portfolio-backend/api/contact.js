// api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers for all requests (including OPTIONS)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Cache-Control',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Max-Age': '86400'
  };

  // Apply CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  // Handle CORS preflight - MUST return 200 with proper headers
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }

  // Only allow POST requests for actual functionality
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: `Method ${req.method} not allowed. Use POST.` });
  }

  try {
    console.log('Processing POST request...');
    console.log('Request body:', req.body);

    // Check environment variables
    const envCheck = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasNotificationEmail: !!process.env.NOTIFICATION_EMAIL,
      emailUser: process.env.EMAIL_USER || 'undefined'
    };
    console.log('Environment check:', envCheck);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration');
      return res.status(500).json({ 
        error: 'Email service not configured',
        debug: envCheck
      });
    }

    const { name, email, subject, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Missing required fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return res.status(400).json({ 
        error: 'All fields are required',
        received: { name: !!name, email: !!email, subject: !!subject, message: !!message }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('Creating email transporter...');

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test the connection
    console.log('Testing SMTP connection...');
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError.message);
      return res.status(500).json({ 
        error: 'Email service configuration error',
        details: verifyError.message 
      });
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;

    // Email to you (notification)
    const notificationEmailOptions = {
      from: process.env.EMAIL_USER,
      to: notificationEmail,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; text-align: center; color: #64748b; font-size: 12px;">
            Sent from your Portfolio Contact Form | ${new Date().toLocaleString()}
          </div>
        </div>
      `
    };

    // Auto-reply email to the sender
    const autoReplyEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting me, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Thank You for Reaching Out!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="font-style: italic; color: #64748b;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
          </div>
          
          <p>I typically respond within 24-48 hours.</p>
          
          <p>Best regards,<br>
          <strong>Manav Prakash</strong><br>
          Computer Science & Engineering Student<br>
          VIT Vellore</p>
        </div>
      `
    };

    console.log('Sending emails...');

    // Send both emails
    const emailResults = await Promise.allSettled([
      transporter.sendMail(notificationEmailOptions),
      transporter.sendMail(autoReplyEmailOptions)
    ]);

    console.log('Email results:', emailResults.map((result, index) => ({
      email: index === 0 ? 'notification' : 'auto-reply',
      status: result.status,
      error: result.status === 'rejected' ? result.reason?.message : null
    })));

    // Check if at least the notification email was sent
    if (emailResults[0].status === 'rejected') {
      console.error('Failed to send notification email:', emailResults[0].reason);
      return res.status(500).json({ 
        error: 'Failed to send notification email',
        details: emailResults[0].reason?.message
      });
    }

    console.log('Emails sent successfully');
    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send message. Please try again later.',
      details: error.message
    });
  }
}