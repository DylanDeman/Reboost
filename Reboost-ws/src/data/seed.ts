import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const PASSWORD = '123456789';

  // Create users
  const gebruikers = [];
  for (let i = 0; i < 5; i++) {
    const gebruiker = await prisma.gebruiker.create({
      data: {
        naam: faker.person.fullName(),
        wachtwoord: PASSWORD,
        roles: JSON.stringify(['user']),
      },
    });
    gebruikers.push(gebruiker);
  }

  // Create places
  const plaatsen = [];
  for (let i = 0; i < 5; i++) {
    const plaats = await prisma.plaats.create({
      data: {
        naam: faker.location.city(),
        straat: faker.location.street(),
        huisnummer: faker.location.buildingNumber(),
        postcode: faker.location.zipCode(),
        gemeente: faker.location.city(),
      },
    });
    plaatsen.push(plaats);
  }

  // Create events
  const evenementen = [];
  for (let i = 0; i < 10; i++) {
    const auteur = faker.helpers.arrayElement(gebruikers);
    const plaats = faker.helpers.arrayElement(plaatsen);

    const evenement = await prisma.evenement.create({
      data: {
        naam: faker.lorem.words(3),
        datum: faker.date.future(),
        auteur_id: auteur.id,
        plaats_id: plaats.id,
      },
    });
    evenementen.push(evenement);
  }

  // Create tools
  for (let i = 0; i < 30; i++) {
    const evenement = faker.helpers.arrayElement(evenementen);

    await prisma.gereedschap.create({
      data: {
        naam: `${faker.commerce.productName()}-${i}`, // ensure uniqueness
        beschrijving: faker.commerce.productDescription(),
        beschikbaar: faker.datatype.boolean(),
        verhuurd: faker.datatype.boolean(),
        evenement_id: evenement.id,
      },
    });
  }

  console.log('🌱 Dummy data seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
