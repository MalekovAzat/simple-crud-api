require("dotenv").config({ path: __dirname + "/../.env" });
const http = require("http");
const port = process.env.PORT || 3000;

const profileController = require("./controllers/profile.controller");

const getRequestHandler = require("./utils/getRequestHandler");

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  //   console.log(req, res);

  const requestHandler = getRequestHandler({ method, url });
  requestHandler(req, res);
});

server.listen(port, () => {
  console.log("Server is listening on", server.address().port, "port");
});
