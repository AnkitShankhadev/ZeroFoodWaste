const express = require('express');
const router = express.Router();
const {
  findNearbyNGOs,
  findNearbyVolunteers,
  findNearbyDonations,
  assignVolunteer,
  getMyAssignments,
  updateAssignmentStatus,
} = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');
const { volunteerOnly, ngoOrVolunteer, authorize } = require('../middleware/roleMiddleware');

router.use(protect); // All routes require authentication

router.get('/nearby-ngos', findNearbyNGOs);
router.get('/nearby-volunteers', findNearbyVolunteers);
router.get('/nearby-donations', findNearbyDonations);
router.post('/assign-volunteer', authorize('NGO', 'ADMIN'), assignVolunteer);
router.get('/my-assignments', volunteerOnly, getMyAssignments);
router.put('/assignments/:id/status', volunteerOnly, updateAssignmentStatus);

module.exports = router;

