# PostgreSQL + Prisma Backend Quick Guide

This is a short reference for creating a basic Node.js backend with PostgreSQL and Prisma from scratch.

## 1. Create the project

```bash
mkdir my-backend
cd my-backend
npm init -y
```

## 2. Install packages

Runtime dependencies:

```bash
npm install express cors dotenv @prisma/client @prisma/adapter-pg pg
```

Prisma CLI:

```bash
npm install prisma
```

## 3. Create basic files

Create:

- `server.js`
- `app.js`
- `.env`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `src/config/db.js`

## 4. Add environment variables

`.env`

```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/your_db_name"
```

## 5. Create PostgreSQL database

Open PostgreSQL and run:

```sql
CREATE DATABASE your_db_name;
```

## 6. Setup Prisma schema

`prisma/schema.prisma`

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "library"
}

datasource db {
  provider = "postgresql"
}
```

Add your models below this. Example:

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

## 7. Setup Prisma config

`prisma.config.ts`

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

## 8. Run migration and generate client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 9. Create Prisma connection

`src/config/db.js`

```js
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
```

## 10. Create Express server

`server.js`

```js
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
```

## 11. Create app file

`app.js`

```js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = app;
```

## 12. Start the project

```bash
node server.js
```

## 13. Important note for Prisma 7

Do not put `url = env("DATABASE_URL")` inside `schema.prisma`.

In Prisma 7:

- keep the database URL in `prisma.config.ts`
- use `@prisma/adapter-pg`
- pass `adapter` into `new PrismaClient()`

## 14. Most useful commands

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
node server.js
```
