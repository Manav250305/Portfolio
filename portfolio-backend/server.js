const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many contact form submissions, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// MongoDB connection with proper error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure MongoDB is running or check your connection string');
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Handle process termination
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

connectDB();

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
});

// Add indexes
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

// Email transporter setup with better error handling
let transporter = null;

const setupEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured (EMAIL_USER or EMAIL_PASS missing)');
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify email configuration
    transporter.verify()
      .then(() => {
        console.log('✅ Email server is ready');
      })
      .catch((error) => {
        console.error('❌ Email configuration error:', error.message);
        console.log('💡 Check your EMAIL_USER and EMAIL_PASS in .env file');
        transporter = null;
      });

  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    transporter = null;
  }
};

setupEmailTransporter();

// Helper functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return validator.escape(input.trim());
};

const sendEmailNotification = async (contactData) => {
  if (!transporter) {
    console.log('Email transporter not configured');
    return;
  }

  try {
    // Notification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
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

    // Auto-reply email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: `Thank you for contacting me - ${contactData.subject}`,
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${contactData.name},</p>
        <p>I've received your message about "${contactData.subject}" and will get back to you soon.</p>
        <p>Best regards,<br>Manav</p>
      `
    });

    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    // Sanitize data
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    };

    // Basic spam check
    const spamPatterns = [
      /viagra|cialis|lottery|winner/i,
      /(.)\1{10,}/
    ];

    const containsSpam = spamPatterns.some(pattern => 
      pattern.test(sanitizedData.message) || 
      pattern.test(sanitizedData.subject)
    );

    if (containsSpam) {
      return res.status(400).json({
        error: 'Message appears to be spam'
      });
    }

    // Check for duplicates in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const duplicate = await Contact.findOne({
      email: sanitizedData.email,
      message: sanitizedData.message,
      createdAt: { $gte: oneHourAgo }
    });

    if (duplicate) {
      return res.status(429).json({
        error: 'Duplicate submission detected'
      });
    }

    // Save contact
    const contact = new Contact(sanitizedData);
    await contact.save();

    // Send emails
    await sendEmailNotification(sanitizedData);

    res.status(201).json({
      message: 'Thank you for your message! I\'ll get back to you soon.',
      id: contact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Something went wrong. Please try again later.'
    });
  }
});

// Get contacts (admin)
app.get('/api/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-ipAddress -userAgent');

    const total = await Contact.countDocuments();

    res.json({
      contacts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContacts: total
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update contact status
app.patch('/api/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Status updated', contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${!!transporter}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
});