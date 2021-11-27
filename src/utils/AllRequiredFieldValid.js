const checkType = require("./CheckType");

// check if all founded requirement element are valid
function allRequiredFieldValid(obj, requiredFileds) {
  const nameToTypeMap = {
    age: "number",
    name: "string",
    hobbies: "array",
  };

  //find in obj all keys from nameToTypeMap
  const foundedRequiredKeys = Object.keys(obj).filter(
    (key) => Object.keys(nameToTypeMap).indexOf(key) != -1
  );

  const filteredByTypeKeys = foundedRequiredKeys.filter((key) =>
    checkType(obj[key], nameToTypeMap[key])
  );

  return foundedRequiredKeys.length === filteredByTypeKeys.length;
}

module.exports = allRequiredFieldValid;
