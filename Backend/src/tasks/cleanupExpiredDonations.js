const cron = require("node-cron");
const FoodDonation = require("../models/FoodDonation");
const notificationService = require("../services/notificationService");

/**
 * Delete or mark donations as expired if their expiryDate has passed
 * Runs every 15 minutes
 */
const setupCleanupTask = () => {
  // Schedule task to run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    try {
      console.log("[Cleanup Task] Checking for expired donations...");

      const now = new Date();

      // Find donations that are expired
      const expiredDonations = await FoodDonation.find({
        expiryDate: { $lt: now },
        status: { $nin: ["DELIVERED", "CANCELLED", "EXPIRED"] },
      }).populate("donorId", "name email");

      if (expiredDonations.length === 0) {
        console.log("[Cleanup Task] No expired donations found.");
        return;
      }

      console.log(
        `[Cleanup Task] Found ${expiredDonations.length} expired donation(s).`,
      );

      // Process each expired donation
      for (const donation of expiredDonations) {
        try {
          // Update donation status to EXPIRED
          donation.status = "EXPIRED";
          await donation.save();

          // Send notification to donor
          await notificationService.createNotification(
            donation.donorId._id,
            `Your donation of ${donation.foodType} has expired and been removed from availability.`,
            "SYSTEM",
            donation._id,
          );

          console.log(
            `[Cleanup Task] Marked donation ${donation._id} as EXPIRED.`,
          );
        } catch (error) {
          console.error(
            `[Cleanup Task] Error processing donation ${donation._id}:`,
            error.message,
          );
        }
      }

      console.log(
        `[Cleanup Task] Successfully processed ${expiredDonations.length} expired donation(s).`,
      );
    } catch (error) {
      console.error("[Cleanup Task] Error during cleanup:", error.message);
    }
  });

  console.log(
    "[Cleanup Task] Expired donations cleanup task scheduled (runs every 15 minutes).",
  );
};

module.exports = setupCleanupTask;
