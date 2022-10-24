// Mutation for USER
async function signUp(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.signUp(args, context, info);
  return result;
}
async function login(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.login(args, context, info);
  return result;
}

async function logout(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.logout(args, context, info);

  return result;
}

async function activateDriver(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.activateDriver(args, context, info);
  return result;
}

// Mutation for TRIP
async function createTripByCustomer(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.createTripByCustomer(args, context, info);
  return result;
}
async function cancelTripByCustomer(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.cancelTripByCustomer(args, context, info);
  return result;
}
async function acceptTripByDriver(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.acceptTripByDriver(args, context, info);
  return result;
}

async function finishTripByDriver(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.finishTripByDriver(args, context, info);
  return result;
}
// Mutation for ROOM
async function joinChatRoom(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.joinChatRoom(args, context, info);
  return result;
}

module.exports = {
  signUp,
  login,
  activateDriver,
  logout,
  createTripByCustomer,
  cancelTripByCustomer,
  acceptTripByDriver,
  finishTripByDriver,
  joinChatRoom,
};
