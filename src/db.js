const { profile } = require("console");
const getUniqueUUID = require("./utils/getUniqueUUID");

class Db {
  constructor() {
    this.profileMap = new Map();
  }

  getAllProfiles() {
    let profiles = [];

    if (this.profileMap.size) {
      this.profileMap.forEach((value, key) => {
        profiles.push({
          id: key,
          name: value.name,
          age: value.age,
          hobbies: value.hobbies,
        });
      });
    }
    return profiles;
  }

  createPerson(data) {
    const uuid = getUniqueUUID();

    this.profileMap.set(uuid, {
      name: data.name,
      age: data.age,
      hobbies: data.hobbies,
    });

    return this._getPerson(uuid);
  }

  updateProperties(id, data) {
    if (!this.profileMap.has(id)) {
      return;
    }

    for (const key of Object.keys(data)) {
      // if the key in allowed list
      if (["name", "age", "hobbies"].indexOf(key) > -1) {
        //toDo - add valueCheck
        this.profileMap.get(id)[key] = data[key];
      }
    }
  }

  deletePerson(id) {
    return this.profileMap.delete(id);
  }

  getPerson(id) {
    return this.profileMap.has(id) ? this._getPerson(id) : {};
  }

  _getPerson(id) {
    const person = this.profileMap.get(id);
    return { id, ...person };
  }
}

const db = new Db();

module.exports = db;
