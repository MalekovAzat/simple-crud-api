function countOfArg(obj, requiredKeys) {
  const arrKeys = Object.keys(obj);
  const elements = arrKeys.filter((elem) => requiredKeys.indexOf(elem) > -1);

  return elements.length;
}

module.exports = countOfArg;
