import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all partners
router.get('/', async (req, res) => {
  try {
    const { verified } = req.query;

    let partnersQuery = db.collection('partners');

    if (verified !== undefined) {
      partnersQuery = partnersQuery.where('verified', '==', verified === 'true');
    }

    const partnersSnapshot = await partnersQuery.get();
    const partners = [];

    partnersSnapshot.forEach((doc) => {
      partners.push({ id: doc.id, ...doc.data() });
    });

    res.json({ partners });
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ error: 'Failed to get partners' });
  }
});

// Get single partner
router.get('/:id', async (req, res) => {
  try {
    const partnerDoc = await db.collection('partners').doc(req.params.id).get();

    if (!partnerDoc.exists) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ partner: { id: partnerDoc.id, ...partnerDoc.data() } });
  } catch (error) {
    console.error('Get partner error:', error);
    res.status(500).json({ error: 'Failed to get partner' });
  }
});

// Register partner
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      organizationName,
      contactName,
      email,
      phone,
      address,
      description,
      services
    } = req.body;

    const partnerData = {
      userId: req.user.uid,
      organizationName,
      contactName,
      email,
      phone,
      address,
      description,
      services: services || [],
      verified: false, // Admin needs to verify
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const partnerRef = await db.collection('partners').add(partnerData);

    res.json({
      message: 'Partner registered successfully. Awaiting verification.',
      partner: { id: partnerRef.id, ...partnerData }
    });
  } catch (error) {
    console.error('Register partner error:', error);
    res.status(500).json({ error: 'Failed to register partner' });
  }
});

// Update partner
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const partnerDoc = await db.collection('partners').doc(req.params.id).get();

    if (!partnerDoc.exists) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const partnerData = partnerDoc.data();

    // Only owner or admin can update
    if (partnerData.userId !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('partners').doc(req.params.id).update(updateData);

    res.json({
      message: 'Partner updated successfully',
      partner: { id: req.params.id, ...updateData }
    });
  } catch (error) {
    console.error('Update partner error:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// Verify partner (admin only)
router.post('/:id/verify', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.collection('partners').doc(req.params.id).update({
      verified: true,
      verifiedAt: new Date().toISOString()
    });

    res.json({ message: 'Partner verified successfully' });
  } catch (error) {
    console.error('Verify partner error:', error);
    res.status(500).json({ error: 'Failed to verify partner' });
  }
});

// Delete partner
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.collection('partners').doc(req.params.id).delete();
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;
