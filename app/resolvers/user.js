function getFullName(parent) {
  return `${parent.lastName} ${parent.firstName}`;
}
function getId(parent) {
  return parent._id;
}
module.exports = {
  name: getFullName,
  id: getId,
};
