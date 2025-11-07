import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const profileDoc = await db.collection('users').doc(req.user.uid).get();

    if (!profileDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: profileDoc.data() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Create or update user profile
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      location,
      zipCode,
      hasTransportation,
      hasDisability,
      incomeRange,
      householdSize,
      isStudent
    } = req.body;

    const profileData = {
      uid: req.user.uid,
      location,
      zipCode,
      hasTransportation: hasTransportation || false,
      hasDisability: hasDisability || false,
      incomeRange,
      householdSize,
      isStudent: isStudent || false,
      updatedAt: new Date().toISOString()
    };

    await db.collection('users').doc(req.user.uid).set(profileData, { merge: true });

    res.json({
      message: 'Profile updated successfully',
      profile: profileData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete user profile
router.delete('/', verifyToken, async (req, res) => {
  try {
    await db.collection('users').doc(req.user.uid).delete();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

export default router;
