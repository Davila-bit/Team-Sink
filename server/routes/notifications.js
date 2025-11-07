import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    let notificationsSnapshot;

    try {
      notificationsSnapshot = await db
        .collection('notifications')
        .where('userId', '==', req.user.uid)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
    } catch (error) {
      // Fallback if the Firestore composite index is missing
      if (error?.code === 9) {
        console.warn('Missing notifications index - falling back without order:', error.message);
        notificationsSnapshot = await db
          .collection('notifications')
          .where('userId', '==', req.user.uid)
          .limit(50)
          .get();
      } else {
        throw error;
      }
    }

    const notifications = [];
    notificationsSnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    // Ensure descending order even if we had to drop orderBy
    notifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Create notification (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, title, message, type, resourceId } = req.body;

    const notificationData = {
      userId: userId || 'all', // 'all' for broadcast notifications
      title,
      message,
      type, // new_resource, update, alert, etc.
      resourceId: resourceId || null,
      read: false,
      createdAt: new Date().toISOString()
    };

    // If broadcasting to all users
    if (userId === 'all') {
      const usersSnapshot = await db.collection('users').get();
      const batch = db.batch();

      usersSnapshot.forEach((doc) => {
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, {
          ...notificationData,
          userId: doc.id
        });
      });

      await batch.commit();

      res.json({
        message: 'Broadcast notification sent successfully',
        count: usersSnapshot.size
      });
    } else {
      // Send to specific user
      const notificationRef = await db.collection('notifications').add(notificationData);

      res.json({
        message: 'Notification created successfully',
        notification: { id: notificationRef.id, ...notificationData }
      });
    }
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notificationDoc = await db.collection('notifications').doc(req.params.id).get();

    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notificationData = notificationDoc.data();

    // Verify ownership
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('notifications').doc(req.params.id).update({
      read: true,
      readAt: new Date().toISOString()
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    const notificationsSnapshot = await db
      .collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();

    notificationsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        read: true,
        readAt: new Date().toISOString()
      });
    });

    await batch.commit();

    res.json({
      message: 'All notifications marked as read',
      count: notificationsSnapshot.size
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const notificationDoc = await db.collection('notifications').doc(req.params.id).get();

    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notificationData = notificationDoc.data();

    // Verify ownership
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('notifications').doc(req.params.id).delete();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
