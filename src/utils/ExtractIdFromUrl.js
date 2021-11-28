function extractIdFromUrl(url) {
  const splitedPath = url.split("/");
  return splitedPath.length >= 3 ? splitedPath[2] : "";
}

module.exports = extractIdFromUrl;
