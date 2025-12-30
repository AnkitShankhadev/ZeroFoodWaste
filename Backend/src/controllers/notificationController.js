const notificationService = require('../services/notificationService');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const { unreadOnly = false, limit = 50 } = req.query;

    const notifications = await notificationService.getUserNotifications(
      req.user.id,
      unreadOnly === 'true',
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(
      req.user.id,
      true
    );

    res.status(200).json({
      success: true,
      data: {
        count: notifications.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

