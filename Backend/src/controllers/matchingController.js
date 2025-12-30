const geoService = require('../services/geoService');
const FoodDonation = require('../models/FoodDonation');
const PickupAssignment = require('../models/PickupAssignment');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('../services/notificationService');

/**
 * @desc    Find nearby NGOs for a donation
 * @route   GET /api/matching/nearby-ngos
 * @access  Private
 */
exports.findNearbyNGOs = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return next(new AppError('Please provide latitude and longitude', 400));
    }

    const ngos = await geoService.findNearbyNGOs(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined
    );

    res.status(200).json({
      success: true,
      data: {
        ngos,
        count: ngos.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Find nearby volunteers for a donation
 * @route   GET /api/matching/nearby-volunteers
 * @access  Private
 */
exports.findNearbyVolunteers = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return next(new AppError('Please provide latitude and longitude', 400));
    }

    const volunteers = await geoService.findNearbyVolunteers(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined
    );

    res.status(200).json({
      success: true,
      data: {
        volunteers,
        count: volunteers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Find nearby donations
 * @route   GET /api/matching/nearby-donations
 * @access  Private
 */
exports.findNearbyDonations = async (req, res, next) => {
  try {
    const { lat, lng, radius, status = 'CREATED' } = req.query;

    if (!lat || !lng) {
      return next(new AppError('Please provide latitude and longitude', 400));
    }

    const donations = await geoService.findNearbyDonations(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined,
      status
    );

    res.status(200).json({
      success: true,
      data: {
        donations,
        count: donations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign volunteer to donation
 * @route   POST /api/matching/assign-volunteer
 * @access  Private/NGO/Admin
 */
exports.assignVolunteer = async (req, res, next) => {
  try {
    const { donationId, volunteerId } = req.body;

    if (!donationId || !volunteerId) {
      return next(new AppError('Please provide donation ID and volunteer ID', 400));
    }

    const donation = await FoodDonation.findById(donationId);

    if (!donation) {
      return next(new AppError('Donation not found', 404));
    }

    // Check if NGO accepted this donation or is admin
    if (donation.acceptedBy?.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('Not authorized to assign volunteer', 403));
    }

    if (donation.status !== 'ACCEPTED') {
      return next(new AppError('Donation must be accepted before assigning volunteer', 400));
    }

    const volunteer = await User.findById(volunteerId);

    if (!volunteer || volunteer.role !== 'VOLUNTEER') {
      return next(new AppError('Invalid volunteer', 400));
    }

    // Check if assignment already exists
    let assignment = await PickupAssignment.findOne({ donationId });

    if (assignment) {
      assignment.volunteerId = volunteerId;
      assignment.status = 'PENDING';
      await assignment.save();
    } else {
      assignment = await PickupAssignment.create({
        donationId,
        volunteerId,
        status: 'PENDING',
      });
    }

    // Update donation
    donation.status = 'ASSIGNED';
    donation.assignedVolunteer = volunteerId;
    await donation.save();

    // Send notification to volunteer
    await notificationService.createNotification(
      volunteerId,
      `You have been assigned to pick up a donation: ${donation.foodType}`,
      'VOLUNTEER_ASSIGNED',
      donation._id
    );

    res.status(200).json({
      success: true,
      data: {
        assignment,
        donation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assignments for volunteer
 * @route   GET /api/matching/my-assignments
 * @access  Private/Volunteer
 */
exports.getMyAssignments = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { volunteerId: req.user.id };
    if (status) query.status = status;

    const assignments = await PickupAssignment.find(query)
      .populate({
        path: 'donationId',
        populate: [
          { path: 'donorId', select: 'name email location phone' },
          { path: 'acceptedBy', select: 'name email location' },
        ],
      })
      .sort({ assignedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        assignments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update assignment status
 * @route   PUT /api/matching/assignments/:id/status
 * @access  Private/Volunteer
 */
exports.updateAssignmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const assignment = await PickupAssignment.findById(req.params.id);

    if (!assignment) {
      return next(new AppError('Assignment not found', 404));
    }

    // Check if user is the assigned volunteer
    if (assignment.volunteerId.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this assignment', 403));
    }

    assignment.status = status;
    if (notes) assignment.notes = notes;

    if (status === 'IN_PROGRESS' && !assignment.startedAt) {
      assignment.startedAt = new Date();
    }

    if (status === 'COMPLETED') {
      assignment.completedAt = new Date();
    }

    if (status === 'CANCELLED') {
      assignment.cancelledAt = new Date();
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      data: {
        assignment,
      },
    });
  } catch (error) {
    next(error);
  }
};

