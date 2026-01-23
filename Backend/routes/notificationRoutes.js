import express from 'express';
import auth from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get notifications for logged-in user
router.get('/', auth(), async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: err.message });
  }
});

// Mark a notification as read
router.put('/:id/read', auth(), async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(notif);
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
