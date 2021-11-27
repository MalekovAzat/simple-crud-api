const profileController = require("../controllers/profile.controller");
const errorController = require("../controllers/error.controller");

const handlersMap = {
  GET: [
    {
      pattern: /^\/person$/,
      handler: profileController.getAll,
    },
    {
      pattern:
        /^\/person\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      handler: profileController.getOne,
    },
    {
      pattern: /^\/person\/[^\/]*$/,
      handler: errorController.wrongPersonId,
    },
    {
      pattern: /\/.*/,
      handler: errorController.unsupportedPath,
    },
  ],
  POST: [
    {
      pattern: /^\/person$/,
      handler: profileController.createPerson,
    },
    {
      pattern: /\/.*/,
      handler: errorController.unsupportedPath,
    },
  ],
  PUT: [
    {
      pattern:
        /^\/person\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      handler: profileController.updatePerson,
    },
    {
      pattern: /^\/person\/[^\/]*$/,
      handler: errorController.wrongPersonId,
    },
    {
      pattern: /\/.*/,
      handler: errorController.unsupportedPath,
    },
  ],
  DELETE: [
    {
      pattern:
        /^\/person\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      handler: profileController.deletePerson,
    },
    {
      pattern: /^\/person\/[^\/]*$/,
      handler: errorController.wrongPersonId,
    },
    {
      pattern: /\/.*/,
      handler: errorController.unsupportedPath,
    },
  ],
};

function defaultHander(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end();
}

function getRequestHandler({ method, url }) {
  const requestsByMethod = handlersMap[method];
  if (requestsByMethod) {
    const findObj = requestsByMethod.filter(({ pattern, handler }) => {
      return pattern.test(url);
    });

    return findObj.length != 0 ? findObj[0].handler : defaultHander;
  }
}

module.exports = getRequestHandler;
