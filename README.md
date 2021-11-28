# simple-crud-api

The repository for simple crud api task.

## Installing of the application

For successfull usage follow next steps:

1. Open terminal in the root folder of the repository.
2. Execute `npm i` to install all required modules for correct working.
3. In the root of the folder add new file `.env` with following strings.

```bash
PORT=3001
```

4. For run in `development` mode execute `npm run start:dev`. Application starts the server on `http://localhost:3001`.

5. For run in `production` mode execute `npm run start:prod`. Application creates bundle in `dist` folder and starts the server on `http://localhost:3001`.

## End to end testing

The test cases for the server are placed in `tests` folder.

To start the tests follow next steps:

1. Open 2 terminal.
2. At first terminal start the server with steps have been described above.
3. At second terminal execute `npm run test`.

The results of the tests are shown at the second terminal.
