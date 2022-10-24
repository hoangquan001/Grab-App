const _ = require('lodash');
const gql = require('graphql-tag');
const config = require('../config');

function checkQuery(query) {
  const treeQuery = gql(query);

  const definition = _.find(treeQuery.definitions, data => data.kind === 'OperationDefinition');
  if (!definition) { throw new Error('invalid query'); }

  const { operation, selectionSet } = definition;
  const fieldsName = selectionSet.selections.map(val => val.name.value);
  const isPass = _.difference(
    fieldsName,
    operation === 'query'
      ? config.queryWhiteList
      : config.mutationWhiteList,
  ).length === 0;

  const isLogout = !!(operation === 'mutation' && _.find(fieldsName, field => field === 'logout'));
  return {
    isPass,
    isLogout,
  };
  //
}
module.exports = checkQuery;
