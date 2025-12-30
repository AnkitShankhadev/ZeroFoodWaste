const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const { calculateDistance, sortByDistance } = require('../utils/distanceCalculator');
const { MATCHING_RADIUS } = require('../config/env');

/**
 * Find nearby NGOs within radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Radius in kilometers (default from env)
 * @returns {Promise<Array>} Array of nearby NGOs
 */
const findNearbyNGOs = async (lat, lng, radiusKm = MATCHING_RADIUS) => {
  try {
    // Find all active NGOs
    const ngos = await User.find({
      role: 'NGO',
      status: 'ACTIVE',
      'location.lat': { $exists: true },
      'location.lng': { $exists: true },
    });

    // Filter NGOs within radius
    const nearbyNGOs = ngos.filter((ngo) => {
      const distance = calculateDistance(
        lat,
        lng,
        ngo.location.lat,
        ngo.location.lng
      );
      return distance <= radiusKm;
    });

    // Sort by distance and add distance field
    return sortByDistance(nearbyNGOs, lat, lng);
  } catch (error) {
    throw new Error(`Error finding nearby NGOs: ${error.message}`);
  }
};

/**
 * Find nearby volunteers within radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Radius in kilometers (default from env)
 * @returns {Promise<Array>} Array of nearby volunteers
 */
const findNearbyVolunteers = async (lat, lng, radiusKm = MATCHING_RADIUS) => {
  try {
    // Find all active volunteers
    const volunteers = await User.find({
      role: 'VOLUNTEER',
      status: 'ACTIVE',
      'location.lat': { $exists: true },
      'location.lng': { $exists: true },
    });

    // Filter volunteers within radius
    const nearbyVolunteers = volunteers.filter((volunteer) => {
      const distance = calculateDistance(
        lat,
        lng,
        volunteer.location.lat,
        volunteer.location.lng
      );
      return distance <= radiusKm;
    });

    // Sort by distance and add distance field
    return sortByDistance(nearbyVolunteers, lat, lng);
  } catch (error) {
    throw new Error(`Error finding nearby volunteers: ${error.message}`);
  }
};

/**
 * Find nearby food donations within radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Radius in kilometers (default from env)
 * @param {string} status - Filter by donation status
 * @returns {Promise<Array>} Array of nearby donations
 */
const findNearbyDonations = async (lat, lng, radiusKm = MATCHING_RADIUS, status = 'CREATED') => {
  try {
    // Find donations with specified status
    const query = {
      status,
      'location.lat': { $exists: true },
      'location.lng': { $exists: true },
    };

    const donations = await FoodDonation.find(query).populate('donorId', 'name email');

    // Filter donations within radius
    const nearbyDonations = donations.filter((donation) => {
      const distance = calculateDistance(
        lat,
        lng,
        donation.location.lat,
        donation.location.lng
      );
      return distance <= radiusKm;
    });

    // Sort by distance and add distance field
    return sortByDistance(nearbyDonations, lat, lng);
  } catch (error) {
    throw new Error(`Error finding nearby donations: ${error.message}`);
  }
};

/**
 * Get distance between two points
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const getDistance = (lat1, lng1, lat2, lng2) => {
  return calculateDistance(lat1, lng1, lat2, lng2);
};

module.exports = {
  findNearbyNGOs,
  findNearbyVolunteers,
  findNearbyDonations,
  getDistance,
};

