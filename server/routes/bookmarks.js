import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookmarks
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookmarksSnapshot = await db
      .collection('bookmarks')
      .where('userId', '==', req.user.uid)
      .get();

    const bookmarks = [];
    bookmarksSnapshot.forEach((doc) => {
      bookmarks.push({ id: doc.id, ...doc.data() });
    });

    // Fetch full resource details for each bookmark
    const resourcePromises = bookmarks.map(async (bookmark) => {
      const resourceDoc = await db.collection('resources').doc(bookmark.resourceId).get();
      if (resourceDoc.exists) {
        return {
          bookmarkId: bookmark.id,
          resource: { id: resourceDoc.id, ...resourceDoc.data() },
          savedAt: bookmark.createdAt
        };
      }
      return null;
    });

    const fullBookmarks = (await Promise.all(resourcePromises)).filter(b => b !== null);

    res.json({ bookmarks: fullBookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
});

// Add bookmark
router.post('/', verifyToken, async (req, res) => {
  try {
    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }

    // Check if resource exists
    const resourceDoc = await db.collection('resources').doc(resourceId).get();
    if (!resourceDoc.exists) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await db
      .collection('bookmarks')
      .where('userId', '==', req.user.uid)
      .where('resourceId', '==', resourceId)
      .get();

    if (!existingBookmark.empty) {
      return res.status(400).json({ error: 'Resource already bookmarked' });
    }

    const bookmarkData = {
      userId: req.user.uid,
      resourceId,
      createdAt: new Date().toISOString()
    };

    const bookmarkRef = await db.collection('bookmarks').add(bookmarkData);

    res.json({
      message: 'Bookmark added successfully',
      bookmark: { id: bookmarkRef.id, ...bookmarkData }
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// Remove bookmark
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const bookmarkDoc = await db.collection('bookmarks').doc(req.params.id).get();

    if (!bookmarkDoc.exists) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const bookmarkData = bookmarkDoc.data();

    // Verify ownership
    if (bookmarkData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('bookmarks').doc(req.params.id).delete();

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

export default router;
