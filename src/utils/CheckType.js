function checkType(variable, type) {
  if (type === "string") {
    return typeof variable === "string";
  }
  if (type === "array") {
    if (!Array.isArray(variable)) {
      return false;
    }
    return (
      variable.filter((el) => typeof el === "string").length === variable.length
    );
  }
  if (type === "number") {
    return typeof variable === "number";
  }
  return false;
}

module.exports = checkType;
