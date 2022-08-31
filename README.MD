# Little Litmus!
Litmus is a purpose built expressjs and polkadot based RESTful API to demonstrate Node.js and Web3.0 skills.
It offers two APIs:

 1. POST `/api/v1/signin` 
It offers authentication by using substrate account and signature verification, and returns a API signed bearer token as identity for substrate account. Please see the demo section.
 2. GET `/api/v1/secret`
Its token authenticated API that returns random magic strings from Postgres.

The app uses some of the famous npm packages, i.e. `express`, `joi`, `dotenv`, `prisma` ORM, `passport`, `pino` logger with ECS formatting, and more importantly `polkadot` to verify signatures.

**DEMO:**

    curl --location --request POST 'http://localhost:3000/api/v1/signin' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username": "14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo",
        "message": "Sign-in request for address 14GgSVJ1unwjVw4CuMGXYz4P4yT1HzVqEDEiExhiCS84EGQo.",
        "signature": "0xfc03197bd2110f613677913e3d52afbc1ecda9099109f01300a97acde7122d305d87d115cf173632319c6666d829a4585a45462cb3d2df5513f7d5a68c9f1785"
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

More on polkadot signature verification: [Verify Signature | polkadot{​.js}​​​​​​​​](https://polkadot.js.org/docs/util-crypto/examples/verify-signature)

Polkadot playground: [Polkadot/Substrate Portal​​​​​​​](https://polkadot.js.org/apps/#/signing)

## Setup environment variables:
Generate RSA keys for bearer token signing and verification.
1. > mkdir ./certs && ssh-keygen -t rsa -m PEM -b 2048 -C "example@example.com" -f ./certs/cert.pem
2. > LITMUS_API_PORT=3000
3. > DATABASE_URL={POSTGRES-CONNECTION-STRING}
