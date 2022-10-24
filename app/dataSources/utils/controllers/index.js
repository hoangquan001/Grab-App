const _ = require('lodash');
const tripUtils = require('./tripUtils');
// const userUtils = require('./userUtils');

function getSelectFieldFromInfo(info, convertField = { id: '_id' }) {
  // format example: convertField = { name: 'firstName lastName' }
  const { selections } = info.fieldNodes[0].selectionSet;
  const fields = _.map(selections, val => {
    let field = val.name.value;
    if (convertField && convertField[field]) {
      field = convertField[field];
    }
    return field;
  });
  // if (_.includes(fields, '_id') === false) {
  //   fields.push('-_id');
  // }
  return fields;
}

module.exports = {
  ...tripUtils,
  // ...userUtils,
  getSelectFieldFromInfo,
};
