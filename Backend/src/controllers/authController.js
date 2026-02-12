const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");
const { generateToken } = require("../utils/tokenGenerator");
const { AppError } = require("../middleware/errorHandler");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailService");
const { FRONTEND_URL } = require("../config/env");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, location, phone } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return next(new AppError("Please provide all required fields", 400));
    }

    if (!["DONOR", "NGO", "VOLUNTEER"].includes(role)) {
      return next(new AppError("Invalid role", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists with this email", 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
      phone,
    });

    // Create leaderboard entry for new user
    await Leaderboard.create({
      userId: user._id,
      role: user.role,
      totalPoints: 0,
      donationsCount: 0,
      collectionsCount: 0,
      pickupsCount: 0,
      achievementsCount: 0,
      badgesCount: 0,
      rank: 0,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token, // ✅ FIX: Token at root level for frontend
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Check if user exists and get password
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return next(new AppError("Account is not active", 403));
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token, // ✅ FIX: Token at root level for frontend
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          totalPoints: user.totalPoints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError("Please provide current and new password", 400));
    }

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(new AppError("Current password is incorrect", 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password - send reset link to email
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide an email address", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal whether email exists
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    const resetURL = `${FRONTEND_URL}/forgot-password?token=${resetToken}&email=${encodeURIComponent(
      user.email,
    )}`;

    const message = `
      <p>Hello ${user.name || ""},</p>
      <p>You requested a password reset for your ZeroFoodWaste account.</p>
      <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
      <p>
        <a href="${resetURL}" style="display:inline-block;padding:10px 20px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetURL}">${resetURL}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>— ZeroFoodWaste Team</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "ZeroFoodWaste Password Reset",
        html: message,
      });

      res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent",
      });
    } catch (err) {
      // Cleanup on failure
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Error sending reset email:", err.message);
      return next(
        new AppError(
          "There was an error sending the email. Please try again later.",
          500,
        ),
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/resetpassword
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(new AppError("Token and new password are required", 400));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return next(new AppError("Reset token is invalid or has expired", 400));
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Generate new JWT
    const newToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token: newToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
