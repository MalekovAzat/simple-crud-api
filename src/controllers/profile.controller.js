const db = require("../db");

const sendResponse = require("../utils/SendResponse");
const extractIdFromUrl = require("../utils/ExtractIdFromUrl");

const countOfArg = require("../utils/CountOfArg");
const checkType = require("../utils/CheckType");
const allRequiredFieldValid = require("../utils/AllRequiredFieldValid");

class ProfileController {
  async getAll(req, res) {
    const profiles = db.getAllProfiles();

    sendResponse(res, { jsonBody: profiles, statusCode: 200 });
  }

  async getOne(req, res) {
    const id = extractIdFromUrl(req.url);
    const person = db.getPerson(id);
    // wrong case when profile is not found
    if (Object.keys(person).length === 0) {
      sendResponse(res, {
        statusCode: 404,
        jsonBody: {
          message: `Provided id ${id} is not found`,
        },
      });
    } else {
      sendResponse(res, {
        statusCode: 200,
        jsonBody: person,
      });
    }
  }

  async createPerson(req, res) {
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      try {
        const data = JSON.parse(chunk);

        if (
          !checkType(data["age"], "number") ||
          !checkType(data["name"], "string") ||
          !checkType(data["hobbies"], "array")
        ) {
          sendResponse(res, {
            statusCode: 400,
            jsonBody: {
              message:
                "Provide required properties in request body: name->string, age->number, hobbies->array of strings",
            },
          });
        } else {
          const person = db.createPerson(data);

          sendResponse(res, {
            statusCode: 201,
            jsonBody: person,
          });
        }
      } catch (e) {
        console.log(e.message);
        sendResponse(res, {
          statusCode: 500,
          jsonBody: { message: "Internal server error" },
        });
      }
    });
  }

  async updatePerson(req, res) {
    const id = extractIdFromUrl(req.url);

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      try {
        const data = JSON.parse(chunk);

        if (allRequiredFieldValid(data)) {
          db.updateProperties(id, data);

          const person = db.getPerson(id);

          if (Object.keys(person).length === 0) {
            sendResponse(res, {
              statusCode: 404,
              jsonBody: {
                message: `Provided id ${id} is not found`,
              },
            });
          } else {
            sendResponse(res, {
              statusCode: 200,
              jsonBody: person,
            });
          }
        } else {
          sendResponse(res, {
            statusCode: 400,
            jsonBody: {
              message:
                "Provide all provided properties should have valid types: name->string, age->number, hobbies->array of strings",
            },
          });
        }
      } catch (e) {
        console.log(e.message);
        sendResponse(res, {
          statusCode: 500,
          jsonBody: { message: "Internal server error" },
        });
      }
    });
  }

  async deletePerson(req, res) {
    const id = extractIdFromUrl(req.url);

    const deleted = db.deletePerson(id);

    if (deleted) {
      sendResponse(res, {
        statusCode: 204,
        jsonBody: "",
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        jsonBody: {
          message: `Person with id ${id} is not found`,
        },
      });
    }
  }
}

const profileController = new ProfileController();

module.exports = profileController;
