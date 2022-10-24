const { getSelectFieldFromInfo } = require('../dataSources/utils');

function getId(parents) {
  return parents._id;
}
async function getDriverFromTrip(parents, args, context, info) {
  try {
    if (!parents.driver) {
      return null;
    }
    const select = getSelectFieldFromInfo(info, { name: 'firstName lastName' });
    const key = JSON.stringify({ userId: String(parents.driver), select });
    const { dataLoader } = context;
    const driver = await dataLoader.userById.load(key);
    return driver;
  } catch (error) {
    logger.error('trip - getDriverFromTrip error', error);
    throw error;
  }
}
async function getCustomerFromTrip(parents, args, context, info) {
  try {
    if (!parents.customer) {
      return null;
    }
    const select = getSelectFieldFromInfo(info, { name: 'firstName lastName' });
    const key = JSON.stringify({ userId: String(parents.customer), select });
    const { dataLoader } = context;
    const customer = await dataLoader.userById.load(key);
    return customer;
  } catch (error) {
    logger.error('trip - getCustomerFromTrip error', error);
    throw error;
  }
}

function getStartDate(parents) {
  const { startDate } = parents;
  if (!startDate) {
    return null;
  }
  return startDate.toISOString();
}
function getEndDate(parents) {
  const { endDate } = parents;
  if (!endDate) {
    return null;
  }
  return endDate.toISOString();
}
module.exports = {
  driver: getDriverFromTrip,
  customer: getCustomerFromTrip,
  startDate: getStartDate,
  endDate: getEndDate,
  id: getId,
};
