require("dotenv").config({ path: __dirname + "/../.env" });

const port = process.env.PORT;
const request = require("supertest");

describe("E2E test scenario 1. Add one person update and delete. get->post->get->put->delete->get", () => {
  const req = request(`http://localhost:${port}`);
  let savedId = "";
  it("Get. Request all persons. Expected 200 []", async () => {
    const response = await req.get("/person").send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
  it("Post. Add one person. Expected 201, right data", async () => {
    const response = await req.post("/person").send({
      name: "Oleg",
      age: 10,
      hobbies: ["Hobbies1", "Hobbies2"],
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.age).toBe(10);
    expect(response.body.name).toBe("Oleg");
    expect(response.body).toHaveProperty("id");
    expect(response.body.hobbies.length).toBe(2);
    expect(response.body.hobbies[0]).toBe("Hobbies1");
    expect(response.body.hobbies[1]).toBe("Hobbies2");

    savedId = response.body.id;
  });

  it("Get. Get all persons. Expected 200, and added person data", async () => {
    const response = await req.get("/person").send();
    expect(response.statusCode).toBe(200);

    const body = response.body;

    expect(body.length).toEqual(1);
    expect(body[0].id).toEqual(savedId);
    expect(body[0].name).toBe("Oleg");
    expect(body[0].hobbies.length).toBe(2);
    expect(body[0].hobbies[0]).toBe("Hobbies1");
    expect(body[0].hobbies[1]).toBe("Hobbies2");
  });
  it("Put. Update existed person. Expected 200 and updated person", async () => {
    const response = await req.put(`/person/${savedId}`).send({
      name: "Nick",
      hobbies: ["newHobby1", "newHobby2"],
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.age).toBe(10);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Nick");
    expect(response.body.id).toEqual(savedId);
    expect(response.body.hobbies.length).toBe(2);
    expect(response.body.hobbies[0]).toBe("newHobby1");
    expect(response.body.hobbies[1]).toBe("newHobby2");
  });
  it("Delete. Delete existed person. Expected 204 without body", async () => {
    const response = await req.delete(`/person/${savedId}`).send();

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe("");
  });
  it("Get. Get persons after deletion. Expected 200 with empty array", async () => {
    const response = await req.get("/person").send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("E2E test scenario 2. Add 2 person, try update first with incorrect id, try update first with unexisted id, get all. post+post->put->get all", () => {
  const req = request(`http://localhost:${port}`);
  let savedId1 = "";
  let savedId2 = "";

  it("Post. Add 2 person. Expected 201, right data", async () => {
    let response = await req.post("/person").send({
      name: "Oleg",
      age: 10,
      hobbies: ["Hobbies1", "Hobbies2"],
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.age).toBe(10);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Oleg");
    expect(response.body.hobbies.length).toBe(2);
    expect(response.body.hobbies[0]).toBe("Hobbies1");
    expect(response.body.hobbies[1]).toBe("Hobbies2");

    savedId1 = response.body.id;

    response = await req.post("/person").send({
      name: "Andrey",
      age: 15,
      hobbies: ["Hobby1", "Hobby2"],
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.age).toBe(15);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Andrey");
    expect(response.body.hobbies.length).toBe(2);
    expect(response.body.hobbies[0]).toBe("Hobby1");
    expect(response.body.hobbies[1]).toBe("Hobby2");

    savedId2 = response.body.id;
  });

  it("Put. Update person with incrorect id. Expected 400 and message about invalid id", async () => {
    const response = await req.put(`/person/${savedId1}` + "abc").send({
      name: "Nick",
      hobbies: ["newHobby1", "newHobby2"],
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      `Provided invalid id ${savedId1}abc`
    );
  });
  it("Put. Try to update with inexistent id. Expected 404 and message about inexistent person", async () => {
    const response = await req
      .put(`/person/318712c9-7af7-4563-a247-be383103e15f`)
      .send({
        name: "Nick",
        hobbies: ["newHobby1", "newHobby2"],
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Provided id 318712c9-7af7-4563-a247-be383103e15f is not found"
    );
  });

  it("Get. Get 2 unchanged persons. Expected 200 and unchanced persons", async () => {
    const response = await req.get("/person").send();

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);

    const findPersonById = (sId) =>
      response.body.filter(({ id }) => id === sId);

    const person1 = findPersonById(savedId1)[0];
    expect(person1.age).toBe(10);
    expect(person1.name).toBe("Oleg");
    expect(person1.hobbies.length).toBe(2);
    expect(person1.hobbies[0]).toBe("Hobbies1");
    expect(person1.hobbies[1]).toBe("Hobbies2");

    const person2 = findPersonById(savedId2)[0];
    expect(person2.age).toBe(15);
    expect(person2.name).toBe("Andrey");
    expect(person2.hobbies.length).toBe(2);
    expect(person2.hobbies[0]).toBe("Hobby1");
    expect(person2.hobbies[1]).toBe("Hobby2");
  });
});

describe("E2E test scenario 3. Add 1 person and try to delete with incorrect id, try to delete with unexisted id, get by id. post->delete->delete->get", () => {
  const req = request(`http://localhost:${port}`);
  let savedId1 = "";

  it("Post. Add 2 person. Expected 201, right data", async () => {
    let response = await req.post("/person").send({
      name: "Oleg",
      age: 10,
      hobbies: ["Hobbies1", "Hobbies2"],
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.age).toBe(10);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Oleg");
    expect(response.body.hobbies.length).toBe(2);
    expect(response.body.hobbies[0]).toBe("Hobbies1");
    expect(response.body.hobbies[1]).toBe("Hobbies2");

    savedId1 = response.body.id;
  });

  it("Delete. Try to delete with incorrect id. Expected 400 and message about invalid id", async () => {
    const response = await req.delete(`/person/${savedId1}` + "abc").send();

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      `Provided invalid id ${savedId1}abc`
    );
  });

  it("Delete. Try to delete with inexistent id. Expected 404 and message about inexistent person", async () => {
    const response = await req
      .delete(`/person/318712c9-7af7-4563-a247-be383103e15f`)
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Person with id 318712c9-7af7-4563-a247-be383103e15f is not found"
    );
  });

  it("Get. Get 1 undeleted persons. Expected 200 and unchanced person", async () => {
    const response = await req.get("/person").send();

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);

    const findPersonById = (sId) =>
      response.body.filter(({ id }) => id === sId);

    const person1 = findPersonById(savedId1)[0];
    expect(person1.age).toBe(10);
    expect(person1.name).toBe("Oleg");
    expect(person1.hobbies.length).toBe(2);
    expect(person1.hobbies[0]).toBe("Hobbies1");
    expect(person1.hobbies[1]).toBe("Hobbies2");
  });
});
