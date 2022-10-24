const _ = require('lodash');
const { getSelectFieldFromInfo } = require('../dataSources/utils');

function getId(parents) {
  return parents._id;
}
async function getUsers(parents, args, context, info) {
  try {
    if (!parents.users) {
      return null;
    }
    const { dataLoader } = context;
    const select = getSelectFieldFromInfo(info, { name: 'firstName lastName' });
    const keys = _.map(parents.users, userId => JSON.stringify({ userId, select }));
    const users = await dataLoader.userById.loadMany(keys);
    return users;
  } catch (error) {
    logger.error('room - getUsers error', error);
    throw error;
  }
}

async function getTrip(parents, args, context, info) {
  try {
    if (!parents.trip) {
      return null;
    }
    const { dataLoader } = context;
    const select = getSelectFieldFromInfo(info);
    const key = JSON.stringify({ tripId: String(parents.trip), select });
    const users = await dataLoader.tripById.load(key);
    return users;
  } catch (error) {
    logger.error('room - getUsers error', error);
    throw error;
  }
}

module.exports = {
  id: getId,
  users: getUsers,
  trip: getTrip,
};
