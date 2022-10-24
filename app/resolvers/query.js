function getUsers(_, args, context, info) {
  const { dataSources } = context;

  return dataSources.getManyUsers(args, context, info);
}
async function getMe(__, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.getUserById(args, context, info);
  return result;
}

function getMyTrips(__, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.getMyTrips(args, context, info);
  return result;
}

function getListTrips(__, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.getListTrips(args, context, info);
  return result;
}

function getMyRooms(__, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.getMyRooms(args, context, info);
  return result;
}

module.exports = {
  me: getMe,
  users: getUsers,
  myTrips: getMyTrips,
  listTrips: getListTrips,
  myRooms: getMyRooms,
};
