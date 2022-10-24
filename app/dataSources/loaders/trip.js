const _ = require('lodash');
const { Trip } = require('../models');

async function batchTripsById(keys) {
  // const keys =
  const keysObj = keys.map(key => JSON.parse(key));
  const tripIds = keysObj.map(key => key.tripId);
  const selects = keysObj.map(key => key.select);
  const select = _.union(...selects).join(' ');
  const trips = await Trip.find({ _id: { $in: tripIds } }, select).lean();
  return tripIds.map(tripId => trips.find(trip => String(trip._id) === tripId));
}

module.exports = {
  batchTripsById,
};
