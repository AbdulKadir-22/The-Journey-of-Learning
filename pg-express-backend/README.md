# PG Express Backend

This project is a small backend API for a note-taking application built with `Node.js`, `Express`, `PostgreSQL`, and `Prisma ORM`.

It exposes a REST API to:

- create notes
- fetch all notes
- fetch a note by ID
- update a note
- delete a note
- search notes by title
- filter notes by tag

The project is intentionally small, but it already demonstrates a very practical backend architecture:

- Express handles routing and HTTP responses
- Prisma handles database access
- PostgreSQL stores the data
- environment variables keep secrets out of the codebase
- a service layer keeps database logic separate from controller logic

## Table Of Contents

- [Project Goal](#project-goal)
- [Tech Stack](#tech-stack)
- [What We Built](#what-we-built)
- [How The Project Works](#how-the-project-works)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Prisma Setup](#prisma-setup)
- [Running The Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Request And Response Examples](#request-and-response-examples)
- [Project Structure](#project-structure)
- [File By File Explanation](#file-by-file-explanation)
- [How We Built This Project Step By Step](#how-we-built-this-project-step-by-step)
- [Important Prisma 7 Note](#important-prisma-7-note)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Project Goal

The goal of this project is to build a simple backend API that performs CRUD operations on notes stored in a PostgreSQL database.

CRUD means:

- `Create`
- `Read`
- `Update`
- `Delete`

Each note contains:

- an auto-incrementing numeric ID
- a title
- content
- a list of tags
- a creation timestamp
- an update timestamp

This project is a strong beginner-to-intermediate backend learning project because it teaches:

- how to structure an Express API
- how to connect Node.js to PostgreSQL
- how to use Prisma ORM instead of raw SQL in application code
- how to separate routes, controllers, services, and config files
- how to manage database schema changes with migrations

## Tech Stack

- `Node.js`
- `Express.js`
- `PostgreSQL`
- `Prisma ORM`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`
- `dotenv`
- `cors`

## What We Built

We built a backend API with the following features:

1. `POST /api/notes`
Creates a new note.

2. `GET /api/notes`
Returns all notes.

3. `GET /api/notes?search=...`
Searches notes by title.

4. `GET /api/notes?tag=...`
Filters notes by tag.

5. `GET /api/notes/:id`
Returns one note by ID.

6. `PUT /api/notes/:id`
Updates a note.

7. `DELETE /api/notes/:id`
Deletes a note.

## How The Project Works

At a high level, the request flow is:

1. A client sends an HTTP request to the Express server.
2. The request reaches a route file.
3. The route calls the appropriate controller function.
4. The controller validates input and delegates the main work to a service.
5. The service uses Prisma Client to talk to PostgreSQL.
6. Prisma sends the query to the database.
7. The database returns data.
8. Prisma returns that data to the service.
9. The controller sends the final JSON response back to the client.

That means each layer has a clear responsibility:

- routes define URL endpoints
- controllers handle request and response logic
- services contain database logic
- config initializes shared tools like Prisma
- middleware handles errors and missing routes

## Prerequisites

Before running this project, install the following on your machine:

### 1. Node.js

Install Node.js from the official site:

`https://nodejs.org/`

This project currently runs on Node `v22.x` in the local environment where it was tested.

To verify installation:

```bash
node -v
npm -v
```

### 2. PostgreSQL

Install PostgreSQL from the official site:

`https://www.postgresql.org/download/`

You can also use pgAdmin if you want a GUI for managing your database.

To verify PostgreSQL installation:

```bash
psql --version
```

### 3. A Code Editor

Recommended:

- `VS Code`

## Installation

Clone the project and move into the folder:

```bash
git clone <your-repository-url>
cd pg-express-backend
```

Install all dependencies:

```bash
npm install
```

The project dependencies used in this repo are:

- `express`
- `cors`
- `dotenv`
- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

If you were installing them manually from scratch, the commands would be:

```bash
npm install express cors dotenv @prisma/client @prisma/adapter-pg pg
npm install prisma
```

## Environment Variables

This project uses a `.env` file to store environment-specific values.

Current variables used:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/note_db"
```

### What These Variables Mean

- `PORT`
The port number where the Express server runs.

- `DATABASE_URL`
The PostgreSQL connection string used by Prisma.

### Important

- Never commit real passwords or production secrets to GitHub.
- The `.env` file is already ignored through `.gitignore`.

Current `.gitignore` includes:

- `.env`
- `node_modules`
- `/generated/prisma`

## Database Setup

This project uses PostgreSQL and expects a database named `note_db`.

Create the database from PostgreSQL:

```sql
CREATE DATABASE note_db;
```

If you are using `psql`, you can do:

```bash
psql -U postgres
```

Then inside the PostgreSQL shell:

```sql
CREATE DATABASE note_db;
```

After creating the database, make sure your `.env` file points to the correct database:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/note_db"
```

## Prisma Setup

Prisma is the ORM used in this project.

ORM means Object Relational Mapping. It allows us to work with database data using JavaScript code instead of writing raw SQL queries in the application.

### Prisma Packages Used

- `prisma`
CLI tool used for migrations, schema management, and code generation.

- `@prisma/client`
The generated client used inside the app to query the database.

- `@prisma/adapter-pg`
The PostgreSQL driver adapter required by Prisma 7.

- `pg`
The PostgreSQL driver used by the adapter.

### Prisma Files In This Project

- `prisma/schema.prisma`
Contains the Prisma schema and model definition.

- `prisma/migrations/...`
Contains migration files generated by Prisma.

- `prisma.config.ts`
Contains Prisma configuration, including the datasource URL in Prisma 7.

### Prisma Schema In This Project

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "library"
}

datasource db {
  provider = "postgresql"
}

model Note {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  tags      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### What This Schema Means

- `generator client`
Tells Prisma to generate a JavaScript client.

- `provider = "prisma-client-js"`
Uses the standard Prisma client generator for JavaScript.

- `engineType = "library"`
Uses Prisma's library engine mode for this project.

- `datasource db`
Defines PostgreSQL as the database provider.

- `model Note`
Defines the structure of the `Note` table.

### Note Model Fields

- `id`
Primary key. Automatically increments.

- `title`
Text title of the note.

- `content`
Main content of the note.

- `tags`
An array of strings. This uses PostgreSQL array support.

- `createdAt`
Automatically stores the creation time.

- `updatedAt`
Automatically updates whenever the record changes.

### Prisma Config In Prisma 7

This project uses `prisma.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

In Prisma 7, the datasource URL is configured in `prisma.config.ts`, not in the `datasource` block inside `schema.prisma`.

### Generate The Prisma Client

Whenever you change the Prisma schema, regenerate the client:

```bash
npx prisma generate
```

### Run Migrations

To create or apply migrations in development:

```bash
npx prisma migrate dev --name init
```

The migration generated for this project creates the `Note` table.

## Running The Project

Start the server:

```bash
node server.js
```

If everything is working, you should see:

```bash
Server is running on port 5000
```

You can then test the API at:

`http://localhost:5000`

And the API base path is:

`http://localhost:5000/api`

## API Endpoints

### 1. Default Route

`GET /`

Returns:

```json
{
  "message": "Welcome to Note Taking API"
}
```

### 2. Create A Note

`POST /api/notes`

### 3. Get All Notes

`GET /api/notes`

### 4. Search Notes By Title

`GET /api/notes?search=meeting`

This performs a case-insensitive title search.

### 5. Filter Notes By Tag

`GET /api/notes?tag=work`

This checks whether the PostgreSQL string array `tags` contains the given tag.

### 6. Get A Single Note

`GET /api/notes/:id`

### 7. Update A Note

`PUT /api/notes/:id`

### 8. Delete A Note

`DELETE /api/notes/:id`

## Request And Response Examples

### Create Note

Request:

```http
POST /api/notes
Content-Type: application/json
```

```json
{
  "title": "Learn Prisma",
  "content": "Study schema, migrations, and Prisma Client.",
  "tags": ["backend", "prisma", "database"]
}
```

Possible response:

```json
{
  "id": 1,
  "title": "Learn Prisma",
  "content": "Study schema, migrations, and Prisma Client.",
  "tags": ["backend", "prisma", "database"],
  "createdAt": "2026-04-18T05:40:00.000Z",
  "updatedAt": "2026-04-18T05:40:00.000Z"
}
```

### Get All Notes

Request:

```http
GET /api/notes
```

Possible response:

```json
[
  {
    "id": 2,
    "title": "Express Notes API",
    "content": "Build controllers, services, and routes.",
    "tags": ["express", "api"],
    "createdAt": "2026-04-18T06:00:00.000Z",
    "updatedAt": "2026-04-18T06:00:00.000Z"
  },
  {
    "id": 1,
    "title": "Learn Prisma",
    "content": "Study schema, migrations, and Prisma Client.",
    "tags": ["backend", "prisma", "database"],
    "createdAt": "2026-04-18T05:40:00.000Z",
    "updatedAt": "2026-04-18T05:40:00.000Z"
  }
]
```

### Get Note By ID

Request:

```http
GET /api/notes/1
```

Possible response:

```json
{
  "id": 1,
  "title": "Learn Prisma",
  "content": "Study schema, migrations, and Prisma Client.",
  "tags": ["backend", "prisma", "database"],
  "createdAt": "2026-04-18T05:40:00.000Z",
  "updatedAt": "2026-04-18T05:40:00.000Z"
}
```

### Update Note

Request:

```http
PUT /api/notes/1
Content-Type: application/json
```

```json
{
  "title": "Learn Prisma ORM",
  "content": "Practice schema design, migrations, and CRUD queries.",
  "tags": ["prisma", "postgresql", "backend"]
}
```

Possible response:

```json
{
  "id": 1,
  "title": "Learn Prisma ORM",
  "content": "Practice schema design, migrations, and CRUD queries.",
  "tags": ["prisma", "postgresql", "backend"],
  "createdAt": "2026-04-18T05:40:00.000Z",
  "updatedAt": "2026-04-18T06:15:00.000Z"
}
```

### Delete Note

Request:

```http
DELETE /api/notes/1
```

Possible response:

```json
{
  "message": "Note deleted successfully"
}
```

### Validation Error

If `title` or `content` is missing during note creation:

```json
{
  "error": "Title and content are required"
}
```

### Not Found Error

If a note does not exist:

```json
{
  "error": "Note not found"
}
```

## Project Structure

This is the important structure of the project:

```text
pg-express-backend/
|-- .env
|-- .gitignore
|-- app.js
|-- package.json
|-- package-lock.json
|-- prisma.config.ts
|-- README.md
|-- server.js
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|       |-- migration_lock.toml
|       `-- 20260418053359_init/
|           `-- migration.sql
`-- src/
    |-- config/
    |   |-- db.js
    |   `-- prisma.js
    |-- controllers/
    |   `-- note.controller.js
    |-- middlewares/
    |   `-- error.middleware.js
    |-- routes/
    |   |-- index.js
    |   `-- note.routes.js
    `-- services/
        `-- note.service.js
```

## File By File Explanation

### `server.js`

This is the entry point of the project.

Responsibilities:

- loads environment variables using `dotenv`
- imports the Express app
- reads the port from environment variables
- starts the server

### `app.js`

This file creates the Express application.

Responsibilities:

- initializes Express
- enables CORS
- enables JSON body parsing
- defines the default `/` route
- mounts API routes under `/api`
- adds not found middleware
- adds global error middleware

### `src/routes/index.js`

This file acts as the main API router.

Responsibilities:

- imports note routes
- mounts them under `/notes`

So `/api/notes` comes from:

- `/api` in `app.js`
- `/notes` in `src/routes/index.js`

### `src/routes/note.routes.js`

This file defines all note-related routes.

Responsibilities:

- maps HTTP verbs to controller functions
- keeps route declarations clean and readable

### `src/controllers/note.controller.js`

This file contains the controller logic.

Responsibilities:

- reads request data from `req.body`, `req.params`, and `req.query`
- validates required fields
- calls the service layer
- sends the JSON response
- handles controller-level errors

### `src/services/note.service.js`

This file contains the Prisma query logic.

Responsibilities:

- create notes
- fetch all notes
- search notes by title
- filter notes by tag
- fetch a note by ID
- update a note
- delete a note

This is the layer where Prisma queries live. That keeps the controller cleaner.

### `src/config/db.js`

This file creates and exports the Prisma client instance actually used by the app.

Responsibilities:

- imports `PrismaClient`
- imports `PrismaPg`
- reads `DATABASE_URL`
- creates a PostgreSQL adapter
- passes the adapter into `PrismaClient`
- exports one shared Prisma instance

### `src/config/prisma.js`

This file currently also exists in the project, but it is not the file used by the services. The service layer imports `src/config/db.js`.

So for the current application flow:

- `db.js` is active
- `prisma.js` is unused

### `src/middlewares/error.middleware.js`

This file contains common error middleware.

Responsibilities:

- handle routes that do not exist
- send a global JSON error response
- optionally include stack traces in non-production mode

### `prisma/schema.prisma`

This file defines:

- the database provider
- the Prisma client generator
- the `Note` model

### `prisma/migrations/.../migration.sql`

This file contains the SQL that Prisma generated to create the database table.

In this project, it creates:

- the `Note` table
- the primary key on `id`
- timestamps and text array storage for tags

### `prisma.config.ts`

This file is required for this Prisma 7 style setup.

Responsibilities:

- points Prisma to the schema file
- defines the migrations folder
- reads `DATABASE_URL` from environment variables

## How We Built This Project Step By Step

This section explains the overall build process from scratch.

### Step 1. Initialize The Node Project

We started by creating a new Node.js project:

```bash
npm init -y
```

This created `package.json`.

### Step 2. Install Runtime Dependencies

We installed the packages needed for the backend:

```bash
npm install express cors dotenv @prisma/client @prisma/adapter-pg pg
```

Why:

- `express` for the web server
- `cors` to allow cross-origin requests
- `dotenv` to load environment variables
- `@prisma/client` to run Prisma queries in code
- `@prisma/adapter-pg` because Prisma 7 requires a PostgreSQL adapter
- `pg` because the adapter uses the PostgreSQL driver

### Step 3. Install Prisma CLI

We installed Prisma:

```bash
npm install prisma
```

This gives access to commands such as:

- `npx prisma generate`
- `npx prisma migrate dev`

### Step 4. Create The Express Server

We created:

- `server.js`
- `app.js`

Why split them:

- `server.js` starts the server
- `app.js` configures middleware and routes

This is a common backend pattern because it keeps the app setup separate from the server startup.

### Step 5. Configure Environment Variables

We added a `.env` file:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/note_db"
```

Why:

- keeps secrets and environment-specific values outside source code
- makes local and production configuration easier

### Step 6. Initialize Prisma

We created Prisma configuration files and schema definitions:

- `prisma/schema.prisma`
- `prisma.config.ts`

The schema defines the data model, and the config file defines where Prisma should get the database URL.

### Step 7. Define The Data Model

We created the `Note` model with:

- `id`
- `title`
- `content`
- `tags`
- `createdAt`
- `updatedAt`

This tells Prisma what database table and fields to create.

### Step 8. Run The Initial Migration

We ran:

```bash
npx prisma migrate dev --name init
```

This did two important things:

1. created the SQL migration file
2. applied the migration to the PostgreSQL database

### Step 9. Generate Prisma Client

We ran:

```bash
npx prisma generate
```

This generated the Prisma client used by the application.

Without this step, the app cannot use Prisma queries in JavaScript.

### Step 10. Create A Shared Database Client

We created `src/config/db.js` to initialize Prisma once and export it.

This helps:

- avoid duplicating client setup
- centralize database connection logic
- keep services clean

### Step 11. Create The Service Layer

We created `src/services/note.service.js`.

Why:

- keeps Prisma queries out of controllers
- makes the code cleaner and easier to maintain
- separates business logic from HTTP logic

### Step 12. Create The Controller Layer

We created `src/controllers/note.controller.js`.

Why:

- reads incoming request data
- validates required fields
- handles HTTP responses
- calls service functions

### Step 13. Create Routes

We created:

- `src/routes/index.js`
- `src/routes/note.routes.js`

Why:

- keeps endpoint definitions organized
- makes it easier to add more resource routes later

### Step 14. Add Error Middleware

We created `src/middlewares/error.middleware.js`.

Why:

- handles invalid routes
- provides cleaner JSON error responses
- improves debugging during development

### Step 15. Test The API

After starting the server, we tested endpoints using tools such as:

- Postman
- Thunder Client
- Insomnia
- `curl`

## Important Prisma 7 Note

This project uses Prisma `7.7.0`.

That matters because Prisma 7 introduced an important change:

### Old Prisma Pattern

Older projects often used:

```js
const prisma = new PrismaClient();
```

And inside `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Prisma 7 Pattern Used Here

Now, for this setup:

1. the datasource URL belongs in `prisma.config.ts`
2. PostgreSQL Prisma clients should be created with a driver adapter

That is why this project uses:

```js
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
```

If you skip the adapter in Prisma 7, you may get an error like:

`Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor.`

## Useful Commands

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Create and apply a new migration:

```bash
npx prisma migrate dev --name <migration_name>
```

Open Prisma Studio:

```bash
npx prisma studio
```

Start the server:

```bash
node server.js
```

## Troubleshooting

### 1. `DATABASE_URL is not set`

Cause:

- `.env` file is missing
- `DATABASE_URL` is misspelled
- server started without loading environment variables

Fix:

- ensure `.env` exists
- ensure `DATABASE_URL` is correctly written
- ensure `server.js` still includes `require('dotenv').config()`

### 2. Prisma Client Constructor Error About Adapter

Cause:

- Prisma 7 needs an adapter for PostgreSQL
- code is using `new PrismaClient()` without `PrismaPg`

Fix:

- install `@prisma/adapter-pg` and `pg`
- initialize Prisma with:

```js
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
```

### 3. Migration Fails

Cause:

- PostgreSQL is not running
- wrong database username or password
- target database does not exist

Fix:

- start PostgreSQL
- verify the connection string
- create the database first

### 4. `Note not found`

Cause:

- the requested record ID does not exist

Fix:

- verify the ID in the URL
- check the database contents

### 5. Empty Search Results

Cause:

- no records match the title or tag filter

Fix:

- test without filters
- verify data exists in the `Note` table
- verify tags were stored as an array

## Future Improvements

This project is intentionally simple, but some good next steps would be:

- add request validation with `Joi` or `Zod`
- add a development script using `nodemon`
- add API tests
- add pagination for notes
- add sorting options
- add authentication and user-specific notes
- add Swagger or OpenAPI documentation
- remove the unused `src/config/prisma.js` file or align it with `db.js`
- add Docker support for PostgreSQL and the backend

## Summary

This project is a clean example of a REST API built with Express, PostgreSQL, and Prisma.

It demonstrates:

- backend folder organization
- CRUD operations
- search and filtering
- Prisma schema and migrations
- environment variable management
- PostgreSQL integration
- Prisma 7 adapter-based database configuration

If you understand this project well, you already have a solid foundation for building larger backend systems with Node.js and PostgreSQL.
