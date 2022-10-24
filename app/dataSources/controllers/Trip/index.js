const query = require('./TripQuery');
const command = require('./TripCommand');

module.exports = {
  ...query,
  ...command,
};
