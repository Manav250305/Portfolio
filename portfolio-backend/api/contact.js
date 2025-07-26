import connectDB from '../lib/utils/connectDB';
import Contact from '../lib/models/contact';
import validator from 'validator';
import sendEmailNotification from '../lib/utils/sendEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const sanitizedData = {
    name: validator.escape(name.trim()),
    email: email.toLowerCase().trim(),
    subject: validator.escape(subject.trim()),
    message: validator.escape(message.trim()),
    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  };

  const contact = new Contact(sanitizedData);

  try {
    await contact.save();
    await sendEmailNotification(sanitizedData);
    res.status(201).json({ message: 'Thank you! Message received.', id: contact._id });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed', details: err.message });
  }
}