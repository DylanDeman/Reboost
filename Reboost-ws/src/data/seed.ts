import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../core/password';

const prisma = new PrismaClient();

async function main() {
  const PASSWORD = await hashPassword('123456789');

  // Create users

  const gebruikers = [];

  const gebruiker = await prisma.gebruiker.create({
    data: {
      naam: 'Dylan De Man',
      wachtwoord: PASSWORD,
      roles: JSON.stringify(['user', 'admin']),
    },
  });
  gebruikers.push(gebruiker);

  for (let i = 0; i < 10; i++) {
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
  for (let i = 0; i < 50; i++) {
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

  function generateEventName() {
  // Pick a random style to mix it up
    const styles = [
      () => `${faker.company.catchPhraseAdjective()} ${faker.company.catchPhraseNoun()} Conference`,
      () => `${faker.company.catchPhraseAdjective()} ${faker.commerce.department()} Summit`,
      () => `${faker.company.catchPhrase()} Workshop`,
      () => `${faker.company.buzzAdjective()} ${faker.company.catchPhraseNoun()} Expo`,
      () => `${faker.commerce.productMaterial()} Technology Forum`,
      () => `${faker.company.catchPhraseDescriptor()} ${faker.company.catchPhraseNoun()} Meetup`,
    ];

    const generate = faker.helpers.arrayElement(styles);
    return toTitleCase(generate());
  }

  // Create events
  const evenementen = [];
  for (let i = 0; i < 30; i++) {
    const auteur = faker.helpers.arrayElement(gebruikers);
    const plaats = faker.helpers.arrayElement(plaatsen);

    const evenement = await prisma.evenement.create({
      data: {
        naam: generateEventName(),
        datum: faker.date.future(),
        auteur_id: auteur.id,
        plaats_id: plaats.id,
      },
    });
    evenementen.push(evenement);
  }

  const eventEquipmentList = [
    { naam: 'Speaker', beschrijving: 'High-quality audio speaker suitable for large venues and outdoor events.' },
    { naam: 'Wireless Microphone', beschrijving: 'Reliable wireless microphone with noise-cancellation and long battery life.' },
    { naam: 'Mixing Panel', beschrijving: 'Digital mixing console with multiple channels and advanced sound control.' },
    { naam: 'Projector', beschrijving: 'HD projector capable of displaying crisp images on large screens.' },
    { naam: 'LED Stage Light', beschrijving: 'Energy-efficient LED stage lighting with adjustable colors and brightness.' },
    { naam: 'Video Camera', beschrijving: 'Professional video camera for recording events in high definition.' },
    { naam: 'Exhibition Booth', beschrijving: 'Modular exhibition booth suitable for trade shows and product displays.' },
    { naam: 'Podium', beschrijving: 'Sturdy podium designed for speakers and presentations.' },
    { naam: 'Folding Chair', beschrijving: 'Comfortable and lightweight folding chair for event seating.' },
    { naam: 'Round Table', beschrijving: 'Durable round table ideal for dining or discussion groups.' },
    { naam: 'Banner Stand', beschrijving: 'Portable banner stand perfect for promotional displays and signage.' },
    { naam: 'Wi-Fi Router', beschrijving: 'High-speed Wi-Fi router ensuring reliable internet connectivity for attendees.' },
    { naam: 'Power Generator', beschrijving: 'Portable power generator providing backup electricity for event operations.' },
    { naam: 'Audio Cable', beschrijving: 'High-quality audio cable for connecting sound equipment with minimal interference.' },
    { naam: 'Laptop', beschrijving: 'Laptop computer used for presentations, streaming, and event management.' },
    { naam: 'Headset for Translation', beschrijving: 'Wireless headset for simultaneous translation during multilingual events.' },
    { naam: 'Stage Backdrop', beschrijving: 'Customizable stage backdrop enhancing event branding and visuals.' },
    { naam: 'Catering Station', beschrijving: 'Fully equipped catering station for serving food and beverages.' },
    { naam: 'Security Scanner', beschrijving: 'Handheld security scanner for event access control and safety checks.' },
    { naam: 'Registration Kiosk', beschrijving: 'Self-service registration kiosk to streamline attendee check-in processes.' },
    { naam: 'First Aid Kit', beschrijving: 'Comprehensive first aid kit for handling medical emergencies onsite.' },
    { naam: 'Stage Monitor', beschrijving: 'Audio stage monitor for performers to hear themselves clearly during presentations.' },
    { naam: 'Video Switcher', beschrijving: 'Professional video switcher for live event video mixing and transitions.' },
    { naam: 'Lighting Console', beschrijving: 'Control console for programming and managing stage lighting effects.' },
    { naam: 'Podium Microphone', beschrijving: 'High-sensitivity microphone designed for podium speeches and presentations.' },
    { naam: 'Wireless Presenter', beschrijving: 'Remote wireless presenter for controlling slideshows and presentations.' },
    { naam: 'Backdrop Frame', beschrijving: 'Sturdy frame used to support large event backdrops and banners.' },
    { naam: 'Event Tent', beschrijving: 'Weather-resistant event tent providing shelter for outdoor activities.' },
    { naam: 'Charging Station', beschrijving: 'Multi-device charging station for attendee convenience.' },
    { naam: 'Video Wall', beschrijving: 'Large-scale LED video wall for dynamic visuals and presentations.' },
  ];

  // Shuffle a copy of the array and pick unique ones
  const shuffledEquipment = faker.helpers.shuffle(eventEquipmentList);

  for (let i = 0; i < 30; i++) {
    const evenement = faker.helpers.arrayElement(evenementen);
    const equipment = shuffledEquipment[i % shuffledEquipment.length]; // cycle through unique names

    await prisma.gereedschap.create({
      data: {
        naam: equipment.naam, 
        beschrijving: equipment.beschrijving,
        beschikbaar: faker.datatype.boolean(),
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
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

