import express from 'express';
import { auth } from '../config/firebase.js';

const router = express.Router();

// Register user (Firebase handles this on client, but we can set custom claims)
router.post('/register', async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    // Set custom claims based on role
    const customClaims = {
      role: role || 'user',
      admin: role === 'admin'
    };

    await auth.setCustomUserClaims(uid, customClaims);

    res.json({
      message: 'User registered successfully',
      role: customClaims.role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    res.json({ valid: true, uid: decodedToken.uid });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

export default router;
