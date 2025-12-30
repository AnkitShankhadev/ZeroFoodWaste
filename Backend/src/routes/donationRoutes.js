const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getDonation,
  updateDonation,
  acceptDonation,
  completeDonation,
  cancelDonation,
  deleteDonation,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { donorOnly, ngoOnly, authorize } = require('../middleware/roleMiddleware');

router.use(protect); // All routes require authentication

router.post('/', donorOnly, createDonation);
router.get('/', getAllDonations);
router.get('/:id', getDonation);
router.put('/:id', authorize('DONOR', 'ADMIN'), updateDonation);
router.put('/:id/accept', ngoOnly, acceptDonation);
router.put('/:id/complete', authorize('DONOR', 'VOLUNTEER', 'ADMIN'), completeDonation);
router.put('/:id/cancel', authorize('DONOR', 'ADMIN'), cancelDonation);
router.delete('/:id', authorize('DONOR', 'ADMIN'), deleteDonation);

module.exports = router;

