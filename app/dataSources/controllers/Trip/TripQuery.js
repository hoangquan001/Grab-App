const { Trip } = require('../../models');
const { getSelectFieldFromInfo } = require('../../utils');

const { matchDate } = require('../../utils/controllers');

async function getMyTrips(args, context, info) {
  const { limit, cursor } = args;
  if (!limit || limit <= 0) return null;
  const query = {};
  if (cursor) {
    query._id = { $gt: cursor };
  }

  const select = getSelectFieldFromInfo(info).join(' ');
  const { userId, userRole } = context.signature;

  if (userRole === 'Driver') {
    query.driver = userId;
  } else
  if (userRole === 'Customer') {
    query.customer = userId;
  } else {
    return null;
  }
  return Trip.find(query, select).limit(limit).lean();
}
async function getListTrips(args, context, info) {
  try {
    const { filters, limit, cursor } = args;

    if (!limit || limit <= 0) { return null; }

    const select = getSelectFieldFromInfo(info).join(' ');

    const query = {};

    if (!filters) {
      if (cursor) {
        query._id = { $gt: cursor };
      }
      return Trip.find(query, select).sort({ _id: 1 }).limit(limit).lean();
    }

    const { location, status, startDate } = filters;

    // add query field
    if (startDate) {
      query.startDate = matchDate(startDate);
    }
    if (location) {
      query.$or = [
        { departurePlace: { $regex: location, $options: 'i' } },
        { destination: { $regex: location, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }
    if (cursor) {
      query._id = { $gt: cursor };
    }

    return Trip.find(query, select).sort({ _id: 1 }).limit(limit).lean();
  } catch (e) { return null; }
}

module.exports = {
  getMyTrips,
  getListTrips,
};
