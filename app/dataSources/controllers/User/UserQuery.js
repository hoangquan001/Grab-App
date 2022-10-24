const { User } = require('../../models');
const { getSelectFieldFromInfo } = require('../../utils');

async function getUserById(args, context, info) {
  const select = getSelectFieldFromInfo(info, { id: '_id', name: 'firstName lastName' }).join(' ');
  const { userId } = context.signature;
  const user = await User.findById(userId, select).lean();
  return user;
}

async function getManyUsers(args, context, info) {
  try {
    const { filters, limit, cursor } = args;
    if (!limit || limit <= 0) { return null; }
    const select = getSelectFieldFromInfo(info, { id: '_id', name: 'firstName lastName' }).join(' ');
    let query = {};

    if (!filters) {
      if (cursor) {
        query._id = { $gt: cursor };
      }
      return User.find(query, select).sort({ _id: 1 }).limit(limit).lean();
    }

    const { username, name } = filters;
    // const users = null;
    if (username) {
      query = { username: { $regex: username } };
    } else if (name) {
      query = { $text: { $search: name } };
    }
    if (cursor) {
      query._id = { $gt: cursor };
    }
    const users = await User.find(query, select).sort({ _id: 1 }).limit(limit);
    return users;
  } catch (err) {
    return null;
  }
}
module.exports = {
  getUserById,
  getManyUsers,
};
