# Little Litmus!
Litmus is a purpose built expressjs based RESTful API to demonstrate Nodejs and Web2.0 skills.
It offers two APIs:

 1. POST `/api/v1/signin` 
It offers user authentication, password and bearer JWT token security using passport, crypto, and Postgres. If the provided credentials do not exist, it will automatically create an account using given username and password.
 2. GET `/api/v1/secret`
Its token authenticated API that returns random magic strings from Postgres.

The app uses some of the famous npm packages, i.e. `express`, `joi`, `dotenv`, `prisma` ORM, `passport`, `pino` logger with ECS formatting, `luxon` etc.

**DEMO:**

    curl --location --request POST 'http://localhost:3000/api/v1/signin' \
    --header 'Content-Type: application/json' \
    --data-raw '{
	    "username": "alice",
	    "password": "p688m0^d"
	    }'
	    
    curl --location --request GET 'http://localhost:3000/api/v1/secret' \
    --header 'Authorization: Bearer {TOKEN}'

## How to setup:
It requires Node v16.17.0 and yarn cli, and Postgres and Prisma Client for db connectivity.
 1. > yarn install
 2. > npm run db:migrate:up
 3. > npm run db:seed
 4. > npm start

Learn more about Prisma: [Add Prisma to an existing project that uses a relational database (15 min) | typescript-postgres | Prisma Docs](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgres)

## Setup environment variables:
Generate RSA keys for bearer token signing and verification.
1. > mkdir ./certs && ssh-keygen -t rsa -m PEM -b 2048 -C "example@example.com" -f ./certs/cert.pem
2. > LITMUS_API_PORT=3000
3. > DATABASE_URL={POSTGRES-CONNECTION-STRING}
