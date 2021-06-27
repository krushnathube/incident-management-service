# Incident Management Service - PERN Stack

## Built using
Incident management service application developed using React, Node.js, Express.js, PostgresSQL

#### Front-end
- [ReactJS](https://reactjs.org/) - Frontend framework
- [Redux hooks](https://redux.js.org/) - State management library
- [Redux Toolkit](https://redux-toolkit.js.org/) - Toolset for efficient Redux development
- [Redux Thunk](https://github.com/reduxjs/redux-thunk) - Middleware which allows action creators to return a function
- [React Router](https://reactrouter.com/) - Library for general routing & navigation
- [React Hook Form](https://react-hook-form.com/) - Library for flexible & extensible forms
- [Material-UI w/ lots of CSS customisations](https://material-ui.com/) - UI library
- [Yup](https://github.com/jquense/yup) - Form validation tool
- [date-fns](https://date-fns.org/) - Library for manipulating/formatting of timestamps

#### Back-end
- [Node.js](https://nodejs.org/en/) - Runtime environment for JS
- [Express.js](https://expressjs.com/) - Node.js framework, makes process of building APIs easier & faster
- [PostgreSQL](https://www.postgresql.org/) - Opens-source SQL database to store data
- [TypeORM](https://typeorm.io/) - TS-based ORM for mostly SQL-based databases
- [JSON Web Token](https://jwt.io/) - A standard to secure/authenticate HTTP requests
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - For hashing passwords
- [helmet](https://helmetjs.github.io/) Basic Security Features thanks to Helmet.
- [Morgan](https://github.com/expressjs/morgan) To log http request we use the express middleware morgan.
- [Chai](https://www.chaijs.com/) Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
- [Sinon](https://sinonjs.org/) Standalone test spies, stubs and mocks for JavaScript.
Works with any unit testing framework.

## Features
-  Create an incident as an admin
- Assign the incident to a user
- Acknowledge the incident as a user
- Resolve the incident as a user
-  Read details about a certain incident
- Index incidents (includes filtering, sorting by date created/updated and incident type and
paging)
- Delete an incident
- Error management with descriptive messages
- Descriptive color indicators for bug type & status
- Toast notifications for actions: creating incidents etc.
- Loading spinners for fetching processes
- Dark mode toggle local storage save
- Proper responsive UI for all screens
- Unit test cases

## TODO/Improvements
- Front end unit test cases
- Integrate Swagger document for API documentation

#### Prerequisites
- [Node.js](https://nodejs.org/en/) - Runtime environment for JS
- [PostgreSQL](https://www.postgresql.org/) - Opens-source SQL database to store data
- [Docker](https://www.docker.com/products/docker-desktop) - Docker Desktop
The fastest way to containerize applications on your desktop

#### Docker
Up Incident management service application:
```
docker-compose up -d
```

#### Client
Run development client:
```
cd client
npm install
npm start
```

#### Server env variable
Create a .env file in server directory and add the following:
```
PORT = 3005
JWT_SECRET = "Your JWT secret"
PGTYPE = "postgres"
PGTYPE = 'postgres'
PGUSER  = 'postgres'
PGPASSWORD ='password'
PGHOST = 'localhost'
PGPORT = 5432
PGDATABASE = 'ims'
```

#### Server
Open ormconfig.js & update default PostgreSQL credentials to match with yours local database.

To run the migarations, go to server dir & run this command:
`npm run typeorm migration:run`

Run backend development server:

```
cd server
npm install
npm run dev
```

#### Unit test cases
Run unit testcases development server:

```
cd server
npm run test
npm run coverage
```
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/unit-testcases-1.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/unit-testcases-2.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/test-coverage.png)

#### Build
Create build on development server:

```
cd server
npm run build
```
#### Linting
Run linting on development server:

```
cd server
npm run lint
```

## Folder Structure
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/folder-structure-client.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/folder-structure-server.png)

## Screenshots
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/login.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/signup.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/home-blank.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/list-incident.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/add-incident.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/ack-incident.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/close-incident.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/assignee-list.png)
![](https://github.com/krushnathube/incident-management-service/blob/master/screenshots/login-black.png)
