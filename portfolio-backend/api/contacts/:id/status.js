import connectDB from '../../../../lib/utils/connectDB';
import Contact from '../../../../lib/models/contact';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { id } = req.query;
  const { status } = req.body;

  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.status(200).json({ message: 'Status updated', contact });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
}