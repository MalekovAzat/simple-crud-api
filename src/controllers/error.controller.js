const sendResponse = require("../utils/SendResponse");
const extractIdFromUrl = require("../utils/ExtractIdFromUrl");

class ErrorController {
  constructor() {}
  wrongPersonId(req, res) {
    const id = extractIdFromUrl(req.url);

    sendResponse(res, {
      statusCode: 400,
      jsonBody: {
        message: `Provided invalid ${id}`,
      },
    });
  }
  unsupportedPath(req, res) {
    sendResponse(res, {
      statusCode: 404,
      jsonBody: {
        message: `Unsupported url ${req.url}`,
      },
    });
  }
}

const errorController = new ErrorController();

module.exports = errorController;
