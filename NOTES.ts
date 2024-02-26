// yarn add express zod cors dayjs bcrypt jsonwebtoken lodash nanoid pino pino-pretty
// yarn add cookie-parser

// State the role of each of these dependencies in the SAD, not readme. That is lodash provides utility fns for manipulating arrays, objects, and strings ... nanoid is a unique id generator. dayjs is for dates, pino and pino-pretty(for ensuring pino's output looks good) for logging

// yarn add @types/node @types/express @types/cors @types/dayjs @types/bcrypt @types/jsonwebtoken @types/lodash @types/nanoid -> types are at 8:56
// yarn add @prisma/client
// yarn add prisma -D
// npx prisma init
// yarn add typescript ts-node-dev -
// yarn add @types/express -D

// Steps for a typical backend implementation
// project bootsrapping

// Errors encountered
// ts-node-dev needed a tsconfig json to be present with the correct compilerOptions for it to work
// Namely this compiler options =>  "module": "NodeNext", "moduleResolution": "NodeNext",
// You can use this command to create the tsconfig.json file => npx tsc --init
// Problem 2: For some reason config folder was not recognized in typescript until an _underscore was added

// By the way
// 3. Run prisma db pull to turn your database schema into a Prisma schema.
// 4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

// npx prisma migrate dev --name init

// Learnings in regards to db
// When trying to implement audit trail ran into this article
// https://github.com/prisma/prisma/issues/1902

// Steps to take
// - Migrate DB & update scripts in package.json
// - Implement authentication
// - logging with prisma: https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/logging-middleware

// THIS IS the VIDEO that properly explains multipart/form-data in node express
// https://youtu.be/4sTmSlZDGow?si=Y_KTPOFfTE-gOL5B

// Then for reading and writing csv files
// https://youtu.be/dLS2w2GnW3M?si=kNScqDD6KmYr3epO
