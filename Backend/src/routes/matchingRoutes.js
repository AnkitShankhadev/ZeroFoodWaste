const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

// Find nearby entities
router.get('/nearby-ngos', matchingController.findNearbyNGOs);
router.get('/nearby-volunteers', matchingController.findNearbyVolunteers);
router.get('/nearby-donations', matchingController.findNearbyDonations);

// NGO assigns volunteer to donation
router.post('/assign-volunteer', authorize('NGO', 'ADMIN'), matchingController.assignVolunteer);

// Volunteer routes
router.get('/my-assignments', authorize('VOLUNTEER'), matchingController.getMyAssignments);
router.put('/assignments/:id/status', authorize('VOLUNTEER'), matchingController.updateAssignmentStatus);

// Volunteers can see available tasks
router.get('/available-for-pickup', authorize('VOLUNTEER'), matchingController.getAvailableForPickup);

// Volunteer self-assigns to a task
router.post('/accept-task/:donationId', authorize('VOLUNTEER'), matchingController.volunteerAcceptTask);

// Complete assignment (convenience endpoint)
router.post('/assignments/:id/complete', authorize('VOLUNTEER'), matchingController.completeAssignment);

module.exports = router;