const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, authorize } = require('../middleware/roleMiddleware');

router.use(protect); // All routes require authentication

router.get('/', adminOnly, getAllUsers);
router.get('/:id', getUser);
router.put('/:id', authorize('DONOR', 'NGO', 'VOLUNTEER', 'ADMIN'), updateUser);
router.put('/:id/status', adminOnly, updateUserStatus);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;

