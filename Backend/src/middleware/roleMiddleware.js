/**
 * Role-based access control middleware
 */

// Check if user has one of the allowed roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Check if user is admin
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

// Check if user is donor
exports.donorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'DONOR') {
    return res.status(403).json({
      success: false,
      message: 'Donor access required',
    });
  }
  next();
};

// Check if user is NGO
exports.ngoOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'NGO') {
    return res.status(403).json({
      success: false,
      message: 'NGO access required',
    });
  }
  next();
};

// Check if user is volunteer
exports.volunteerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'VOLUNTEER') {
    return res.status(403).json({
      success: false,
      message: 'Volunteer access required',
    });
  }
  next();
};

// Check if user is donor or admin
exports.donorOrAdmin = (req, res, next) => {
  if (!req.user || !['DONOR', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Donor or Admin access required',
    });
  }
  next();
};

// Check if user is NGO or volunteer
exports.ngoOrVolunteer = (req, res, next) => {
  if (!req.user || !['NGO', 'VOLUNTEER'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'NGO or Volunteer access required',
    });
  }
  next();
};

