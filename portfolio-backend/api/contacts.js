import connectDB from '../lib/utils/connectDB';
import Contact from '../lib/models/contact';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-ipAddress -userAgent');

    const total = await Contact.countDocuments();

    res.status(200).json({
      contacts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContacts: total
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
}