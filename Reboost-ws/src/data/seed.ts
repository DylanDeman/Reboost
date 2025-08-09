import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/nl_BE'; // Belgian Dutch locale
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
      roles: ['admin', 'user'],
    },
  });
  gebruikers.push(gebruiker);

  for (let i = 0; i < 10; i++) {
    const gebruiker = await prisma.gebruiker.create({
      data: {
        naam: faker.person.fullName(),
        wachtwoord: PASSWORD,
        roles: ['user'],
      },
    });
    gebruikers.push(gebruiker);
  }

  const suffixes = [
    'Convention Center',
    'Event Hall',
    'Grand Ballroom',
    'Expo Center',
    'Auditorium',
    'Garden Pavilion',
    'Palace',
    'Forum',
    'Arena',
    'Theater',
  ];

  const plaatsen = [];
  for (let i = 0; i < 50; i++) {
    const plaats = await prisma.plaats.create({
      data: {
        naam: `${faker.company.name()} ${faker.helpers.arrayElement(suffixes)}`,
        straat: faker.location.street(),
        huisnummer: faker.location.buildingNumber(),
        postcode: faker.location.zipCode(),
        gemeente: faker.location.city(),
      },
    });
    plaatsen.push(plaats);
  }

  const generatedEventNames = new Set();

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  function generateEventName() {
    const styles = [
      () => `${faker.company.catchPhraseAdjective()} ${faker.company.catchPhraseNoun()} Conference`,
      () => `${faker.company.catchPhraseAdjective()} ${faker.commerce.department()} Summit`,
      () => `${faker.company.catchPhrase()} Workshop`,
      () => `${faker.company.buzzAdjective()} ${faker.company.catchPhraseNoun()} Expo`,
      () => `${faker.commerce.productMaterial()} Technology Forum`,
      () => `${faker.company.catchPhraseDescriptor()} ${faker.company.catchPhraseNoun()} Meetup`,
      () => `Annual ${faker.company.buzzAdjective()} ${faker.commerce.product()} Symposium`,
      () => `${faker.company.catchPhraseAdjective()} ${faker.company.catchPhraseNoun()} Convention`,
      () => `${faker.location.city()} ${faker.company.catchPhraseNoun()} Gathering`,
      () => `${faker.company.buzzVerb()} ${faker.commerce.department()} Forum`,
      () => `International ${faker.company.catchPhraseDescriptor()} Summit`,
      () => `${faker.company.catchPhrase()} Networking Event`,
      () => `${faker.commerce.productAdjective()} Innovation Expo`,
      () => `${faker.company.buzzAdjective()} ${faker.company.catchPhraseNoun()} Roundtable`,
      () => `Global ${faker.commerce.productMaterial()} Forum`,
    ];

    let eventName;
    let attempts = 0;
    const maxAttempts = 50; // avoid infinite loops

    do {
      const generate = faker.helpers.arrayElement(styles);
      eventName = toTitleCase(generate());
      attempts++;
    } while (generatedEventNames.has(eventName) && attempts < maxAttempts);

    if (attempts === maxAttempts) {
      throw new Error('Unable to generate a unique event name after many attempts');
    }

    generatedEventNames.add(eventName);
    return eventName;
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
    { naam: 'Luidspreker', beschrijving: 'Hoogwaardige audioluidspreker geschikt voor grote venues en buitenevenementen.' },
    { naam: 'Draadloze Microfoon', beschrijving: 'Betrouwbare draadloze microfoon met ruisonderdrukking en lange batterijduur.' },
    { naam: 'Mengpaneel', beschrijving: 'Digitaal mengpaneel met meerdere kanalen en geavanceerde geluidsregeling.' },
    { naam: 'Projector', beschrijving: 'HD-projector die scherpe beelden kan weergeven op grote schermen.' },
    { naam: 'LED Podiumverlichting', beschrijving: 'Energiezuinige LED podiumverlichting met instelbare kleuren en helderheid.' },
    { naam: 'Videocamera', beschrijving: 'Professionele videocamera voor het opnemen van evenementen in hoge definitie.' },
    { naam: 'Tentoonstellingsstand', beschrijving: 'Modulaire tentoonstellingsstand geschikt voor beurzen en productpresentaties.' },
    { naam: 'Podium', beschrijving: 'Stevig podium ontworpen voor sprekers en presentaties.' },
    { naam: 'Klapstoel', beschrijving: 'Comfortabele en lichtgewicht klapstoel voor evenementenzitplaatsen.' },
    { naam: 'Ronde Tafel', beschrijving: 'Duurzame ronde tafel ideaal voor dineren of discussiegroepen.' },
    { naam: 'Bannerstandaard', beschrijving: 'Draagbare bannerstandaard perfect voor promotionele displays en bewegwijzering.' },
    { naam: 'Wi-Fi Router', beschrijving: 'Snelle Wi-Fi router die betrouwbare internetverbinding voor deelnemers verzekert.' },
    { naam: 'Stroomgenerator', beschrijving: 'Draagbare stroomgenerator die back-up elektriciteit levert voor evenementenactiviteiten.' },
    { naam: 'Audiokabel', beschrijving: 'Hoogwaardige audiokabel voor het verbinden van geluidsapparatuur met minimale interferentie.' },
    { naam: 'Laptop', beschrijving: 'Laptopcomputer gebruikt voor presentaties, streaming en evenementenbeheer.' },
    { naam: 'Headset voor Vertaling', beschrijving: 'Draadloze headset voor simultaanvertaling tijdens meertalige evenementen.' },
    { naam: 'Podiumachtergrond', beschrijving: 'Aanpasbare podiumachtergrond die evenementenbranding en visuele aspecten verbetert.' },
    { naam: 'Cateringstation', beschrijving: 'Volledig uitgerust cateringstation voor het serveren van eten en dranken.' },
    { naam: 'Beveiligingsscanner', beschrijving: 'Handheld beveiligingsscanner voor toegangscontrole en veiligheidscontroles bij evenementen.' },
    { naam: 'Registratiekiosk', beschrijving: 'Zelfbedieningsregistratiekiosk om het inchecken van deelnemers te stroomlijnen.' },
    { naam: 'EHBO-kit', beschrijving: 'Uitgebreide EHBO-kit voor het behandelen van medische noodgevallen ter plaatse.' },
    { naam: 'Podiummonitor', beschrijving: 'Audio podiummonitor voor artiesten om zichzelf duidelijk te horen tijdens presentaties.' },
    { naam: 'Videoswitscher', beschrijving: 'Professionele videoswitscher voor live evenementen video menging en overgangen.' },
    { naam: 'Lichtconsole', beschrijving: 'Bedieningsconsole voor het programmeren en beheren van podiumlichteffecten.' },
    { naam: 'Podiummicrofoon', beschrijving: 'Hooggevoelige microfoon ontworpen voor podiumspeeches en presentaties.' },
    { naam: 'Draadloze Presenter', beschrijving: 'Draadloze afstandsbediening voor het bedienen van diavoorstellingen en presentaties.' },
    { naam: 'Achtergrondframe', beschrijving: 'Stevig frame gebruikt om grote evenementenachtergronden en banners te ondersteunen.' },
    { naam: 'Evenemententent', beschrijving: 'Weerbestendige evenemententent die onderdak biedt voor buitenactiviteiten.' },
    { naam: 'Oplaadstation', beschrijving: 'Multi-device oplaadstation voor het gemak van deelnemers.' },
    { naam: 'Videomuur', beschrijving: 'Grootschalige LED videomuur voor dynamische visuele effecten en presentaties.' },
  ];

  const shuffledEquipment = faker.helpers.shuffle(eventEquipmentList);

  const batch1Equipment = shuffledEquipment.slice(0, 20);

  const batch2Equipment = shuffledEquipment.slice(20, 35);

  for (const equipment of batch1Equipment) {
    const evenement = faker.helpers.arrayElement(evenementen);

    await prisma.gereedschap.create({
      data: {
        naam: equipment.naam,
        beschrijving: equipment.beschrijving,
        beschikbaar: false,
        evenement_id: evenement.id,
      },
    });
  }

  // Insert batch 2
  for (const equipment of batch2Equipment) {
    await prisma.gereedschap.create({
      data: {
        naam: equipment.naam,
        beschrijving: equipment.beschrijving,
        beschikbaar: true,
        evenement_id: null,
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
