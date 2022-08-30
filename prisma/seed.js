import { PrismaClient } from '@prisma/client';
const dbcontext = new PrismaClient();

const seedUsers = async () => {
  await dbcontext.users.upsert({
    where: { username: 'alice' },
    update: {},
    create: {
      username: 'alice',
      passwordHash: 'a8bbfb8e499b3bd23a77ba44ac37710d8cf4ebf34fbde2d916915d012312c2ca',
      salt: 'dd79f6b921ef0eeb381351abdb80720e1397ecfd8da6b0ee1e0d14bdd96950bb',
      failedLoginCount: 0
    }
  });

  await dbcontext.users.upsert({
    where: { username: 'bob' },
    update: {},
    create: {
      username: 'bob',
      passwordHash: '68576258005f9c0e29eeae24f744a2c59459496baf71bf92d7da986dfd94395b',
      salt: 'a5e8a3e4b37da76a93f40eb0a97f58d2201efc647d90b4c22b9caba01f74e57a',
      failedLoginCount: 0
    }
  });

  await dbcontext.users.upsert({
    where: { username: 'jared' },
    update: {},
    create: {
      username: 'jared',
      passwordHash: '12858bf4775df52021251a8f5fdb652b20bd7aa8166987d61ca52714bd75c3b9',
      salt: '8ac0d41afc9db5707299b3c262ccbb0aa2feda03104de504951cc7867f89fbf5',
      failedLoginCount: 0
    }
  });
};

const seedSecretes = async () => {
  await dbcontext.secretes.createMany({
    data: [
      { message: 'The sea, once it casts its spell, holds one in its net of wonder forever. Jacques Yves Cousteau' },
      { message: 'Nature provides exceptions to every rule. Margaret Fuller' },
      { message: 'In a JWT, a claim appears as a name/value pair where the name is always a string and the value can be any JSON value' },
      { message: 'Consists of non-registered public or private claims. Public claims are collision-resistant while private claims are subject to possible collisions.' }
    ]
  });
};

async function main() {
  await seedUsers();
  await seedSecretes();
}

main()
  .then(async () => {
    await dbcontext.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await dbcontext.$disconnect();
    process.exit(1);
  });
