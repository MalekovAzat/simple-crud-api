function sendResponse(res, { jsonBody, statusCode = 200 }) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  if (jsonBody !== "") {
    res.write(JSON.stringify(jsonBody));
  }
  res.end();
}

module.exports = sendResponse;
