import { PrismaClient } from '@prisma/client';
const dbcontext = new PrismaClient();

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
