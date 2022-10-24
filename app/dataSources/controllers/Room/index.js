const query = require('./RoomQuery');
const command = require('./RoomCommand');

module.exports = {
  ...query,
  ...command,
};
