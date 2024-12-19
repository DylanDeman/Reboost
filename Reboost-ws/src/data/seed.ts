import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../core/password';
import Role from '../core/roles';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  // ==========
  const passwordHash = await hashPassword('12345678');
  await prisma.gebruiker.createMany({
    data: [
      {
        id: 1,
        naam: 'Dylan De Man',
        wachtwoord: passwordHash,
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        naam: 'Steve Schwing',
        wachtwoord: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        naam: 'Nathan Van heirseele',
        wachtwoord: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
    ],
  });

  // Seed places
  // ===========
  await prisma.plaats.createMany({
    data: [
      {
        id: 1,
        naam: 'Het klokhuis',
        straat : 'Kaaiplein',
        huisnummer: '18',
        postcode: '9220',
        gemeente: 'Hamme',
        
      },
      {
        id: 2,
        naam: 'JH Snuffel',
        straat : 'Hamsesteenweg',
        huisnummer: '1',
        postcode: '9200',
        gemeente: 'Dendermonde',
      },
      {
        id: 3,
        naam: 'JH Zenith',
        straat : 'Otterstraat',
        huisnummer: '58',
        postcode: '9200',
        gemeente: 'Dendermonde',
      },
    ],
  });

  // Seed transactions
  // =================
  await prisma.evenement.createMany({
    data: [
      // User Dylan
      // ===========
      {
        id: 1,
        auteur_id: 1,
        plaats_id: 1,
        naam: 'Disco Dasco',
        datum: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 2,
        auteur_id: 1,
        plaats_id: 2,
        naam: 'Nacht van de jeugdbeweging',
        datum: new Date(2021, 4, 8, 20, 0),
      },
      {
        id: 3,
        auteur_id: 1,
        plaats_id: 3,
        naam: 'Fantasia',
        datum: new Date(2021, 4, 21, 14, 30),
      },
      // User Steve
      // ===========
      {
        id: 4,
        auteur_id: 2,
        plaats_id: 1,
        naam: 'Gentse feesten',
        datum: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 5,
        auteur_id: 2,
        naam: 'Tomorrowland',
        plaats_id: 2,
        datum: new Date(2021, 4, 9, 23, 0),
      },
      {
        id: 6,
        auteur_id: 2,
        plaats_id: 3,
        naam: 'Pukkelpop',
        datum: new Date(2021, 4, 22, 12, 0),
      },
      // User Nathan
      // ===========
      {
        id: 7,
        auteur_id: 3,
        plaats_id: 1,
        naam: 'ZogRock',
        datum: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 8,
        auteur_id: 3,
        plaats_id: 2,
        naam: 'Redalert',
        datum: new Date(2021, 4, 10, 10, 0),
      },
      {
        id: 9,
        auteur_id: 3,
        plaats_id: 3,
        naam: 'Blue',
        datum: new Date(2021, 4, 19, 11, 30),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
