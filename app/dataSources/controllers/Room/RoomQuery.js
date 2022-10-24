const { Room } = require('../../models');
const { getSelectFieldFromInfo } = require('../../utils');

async function getMyRooms(args, context, info) {
  const select = getSelectFieldFromInfo(info);
  const { signature } = context;
  const query = {
    users: signature.userId,

  };
  const rooms = await Room.find(query, select);
  return rooms;
}
module.exports = {
  getMyRooms,
};
