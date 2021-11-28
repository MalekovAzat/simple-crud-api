const uuid = require("uuid");

function getUniqueUUID() {
  return uuid.v4();
}

module.exports = getUniqueUUID;
