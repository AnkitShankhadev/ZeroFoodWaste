/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a point is within a radius of another point
 * @param {number} lat1 - Latitude of center point
 * @param {number} lon1 - Longitude of center point
 * @param {number} lat2 - Latitude of point to check
 * @param {number} lon2 - Longitude of point to check
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean} True if point is within radius
 */
const isWithinRadius = (lat1, lon1, lat2, lon2, radiusKm) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusKm;
};

/**
 * Sort locations by distance from a given point
 * @param {Array} locations - Array of location objects with lat/lng
 * @param {number} centerLat - Latitude of center point
 * @param {number} centerLon - Longitude of center point
 * @returns {Array} Sorted array with distance added
 */
const sortByDistance = (locations, centerLat, centerLon) => {
  return locations
    .map((location) => {
      const lat = location.location?.lat || location.coordinates?.lat || location.lat;
      const lng = location.location?.lng || location.coordinates?.lng || location.lng;
      
      return {
        ...location.toObject ? location.toObject() : location,
        distance: calculateDistance(centerLat, centerLon, lat, lng),
      };
    })
    .sort((a, b) => a.distance - b.distance);
};

module.exports = {
  calculateDistance,
  isWithinRadius,
  sortByDistance,
  toRadians,
};

