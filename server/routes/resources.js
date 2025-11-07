import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all resources (with optional eligibility filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, location, showAll } = req.query;

    // Get user profile for eligibility matching
    const userProfile = await db.collection('users').doc(req.user.uid).get();
    const userData = userProfile.data();

    let resourcesQuery = db.collection('resources');

    // Apply filters
    if (type) {
      resourcesQuery = resourcesQuery.where('type', '==', type);
    }

    const resourcesSnapshot = await resourcesQuery.get();
    const resources = [];

    resourcesSnapshot.forEach((doc) => {
      const resource = { id: doc.id, ...doc.data() };

      // Check eligibility only if showAll is not true
      if (showAll === 'true' || checkEligibility(resource, userData)) {
        resources.push(resource);
      }
    });

    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get single resource
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const resourceDoc = await db.collection('resources').doc(req.params.id).get();

    if (!resourceDoc.exists) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ resource: { id: resourceDoc.id, ...resourceDoc.data() } });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Create resource (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      location,
      contact,
      eligibilityCriteria,
      website,
      hours
    } = req.body;

    const resourceData = {
      name,
      description,
      type, // food, housing, nonprofit_aid, healthcare, education, etc.
      location,
      contact,
      eligibilityCriteria: eligibilityCriteria || {},
      website,
      hours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const resourceRef = await db.collection('resources').add(resourceData);

    res.json({
      message: 'Resource created successfully',
      resource: { id: resourceRef.id, ...resourceData }
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update resource (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('resources').doc(req.params.id).update(resourceData);

    res.json({
      message: 'Resource updated successfully',
      resource: { id: req.params.id, ...resourceData }
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete resource (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.collection('resources').doc(req.params.id).delete();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// Eligibility matching function
function checkEligibility(resource, userProfile) {
  if (!resource.eligibilityCriteria || !userProfile) {
    return true; // No criteria or no profile, show resource
  }

  const criteria = resource.eligibilityCriteria;

  // Check income eligibility
  if (criteria.maxIncome && userProfile.incomeRange) {
    const userIncome = parseIncomeRange(userProfile.incomeRange);
    if (userIncome > criteria.maxIncome) {
      return false;
    }
  }

  // Check household size
  if (criteria.minHouseholdSize && userProfile.householdSize < criteria.minHouseholdSize) {
    return false;
  }

  if (criteria.maxHouseholdSize && userProfile.householdSize > criteria.maxHouseholdSize) {
    return false;
  }

  // Check student status
  if (criteria.requiresStudent && !userProfile.isStudent) {
    return false;
  }

  // Check disability status
  if (criteria.requiresDisability && !userProfile.hasDisability) {
    return false;
  }

  // Check location/zip code
  if (criteria.zipCodes && criteria.zipCodes.length > 0) {
    if (!criteria.zipCodes.includes(userProfile.zipCode)) {
      return false;
    }
  }

  return true;
}

// Helper function to parse income range
function parseIncomeRange(incomeRange) {
  // Example: "20000-30000" -> return max value 30000
  const ranges = {
    '0-15000': 15000,
    '15000-25000': 25000,
    '25000-35000': 35000,
    '35000-50000': 50000,
    '50000+': 999999
  };

  return ranges[incomeRange] || 999999;
}

export default router;
