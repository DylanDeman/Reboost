import supertest from 'supertest';
import { prisma } from '../../src/data';
import createServer from '../../src/createServer'; 
import type { Server } from '../../src/createServer'; 
import Role from '../../src/core/roles';
import { generateJWT } from '../../src/core/jwt';

const data = {
  gebruikers: [
    { id: 1, naam: 'Dylan De Man', wachtwoord: 'hashedpassword123', roles: JSON.stringify([Role.ADMIN, Role.USER]) },
    { id: 2, naam: 'Maxime Jacobs', wachtwoord: 'hashedpassword456', roles: JSON.stringify([Role.USER]) },
    { id: 3, naam: 'Jade Janssens', wachtwoord: 'hashedpassword789', roles: JSON.stringify([Role.USER]) },
  ],
  plaatsen: [
    { id: 1, naam: 'Verhaeghe, Michiels and Lemmens Theater', straat: 'Felixdreef', huisnummer: '426', postcode: '5267', gemeente: 'Zarlardingevijve' },
    { id: 2, naam: 'Peeters NV Convention Center', straat: 'Hermansplein', huisnummer: '18', postcode: '9642', gemeente: 'Oetingengem' },
    { id: 3, naam: 'Verhaeghe, Smets and Thijs Convention Center', straat: 'Gillesstraat', huisnummer: '404a', postcode: '6076', gemeente: 'Erondegem' },
  ],
  evenementen: [
    { id: 1, naam: 'Distributed Structure Expo', datum: new Date(2025, 10, 24, 15, 13, 57), auteur_id: 1, plaats_id: 1 },
    { id: 2, naam: 'Global Metalen Forum', datum: new Date(2025, 7, 21, 11, 22, 30), auteur_id: 2, plaats_id: 2 },
    { id: 3, naam: 'Innovate Kleding Forum', datum: new Date(2026, 2, 2, 9, 13, 12), auteur_id: 3, plaats_id: 3 },
    { id: 4, naam: 'Digital Conference', datum: new Date(2025, 8, 15, 10, 0, 0), auteur_id: 1, plaats_id: 1 },
    { id: 5, naam: 'Tech Summit', datum: new Date(2025, 9, 5, 13, 30, 0), auteur_id: 2, plaats_id: 2 },
    { id: 6, naam: 'Annual Expo', datum: new Date(2026, 1, 10, 9, 0, 0), auteur_id: 3, plaats_id: 1 },
    { id: 7, naam: 'Industry Convention', datum: new Date(2026, 4, 20, 11, 0, 0), auteur_id: 1, plaats_id: 2 },
    { id: 8, naam: 'Innovation Forum', datum: new Date(2025, 11, 12, 14, 0, 0), auteur_id: 2, plaats_id: 3 },
    { id: 9, naam: 'Professional Workshop', datum: new Date(2026, 3, 25, 9, 30, 0), auteur_id: 3, plaats_id: 2 },
  ],
  gereedschappen: [
    { id: 1, naam: 'Videomuur', beschrijving: 'Grootschalige LED videomuur voor dynamische visuele effecten en presentaties.', beschikbaar: true },
    { id: 2, naam: 'Draadloze Presenter', beschrijving: 'Draadloze afstandsbediening voor het bedienen van diavoorstellingen en presentaties.', beschikbaar: true },
    { id: 3, naam: 'Cateringstation', beschrijving: 'Volledig uitgerust cateringstation voor het serveren van eten en dranken.', beschikbaar: true },
  ],
};

// Helper function to clean up the database
const clearDatabase = async () => {
  await prisma.gereedschap.updateMany({ 
    where: {}, 
    data: { evenement_id: null },
  });
  await prisma.evenement.deleteMany({});
  await prisma.gereedschap.deleteMany({});
  await prisma.gebruiker.deleteMany({});
  await prisma.plaats.deleteMany({});
};

describe('Evenementen', () => {
  let server: Server;
  let request: supertest.Agent;
  let token: string;

  beforeAll(async () => {
    server = await createServer(); 
    request = supertest(server.getApp().callback());
    
    // Generate JWT token for authentication
    token = await generateJWT({
      id: 1,
      naam: 'Dylan De Man',
      roles: [Role.ADMIN, Role.USER],
      wachtwoord: '123456789',
    });
  });

  afterAll(async () => {
    await clearDatabase();
    await server.stop();
  });

  const url = '/api/evenementen'; 
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  describe('GET /api/evenementen', () => {
    beforeEach(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.gereedschap.createMany({ data: data.gereedschappen });
      await prisma.evenement.createMany({ data: data.evenementen });
    });

    afterEach(async () => {
      await clearDatabase();
    });

    it('moet een 200 en alle evenementen teruggeven', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(9);
      expect(response.body.items[0]).toHaveProperty('id');
      expect(response.body.items[0]).toHaveProperty('naam');
      expect(response.body.items[0]).toHaveProperty('datum');
      expect(response.body.items[0]).toHaveProperty('plaats');
      expect(response.body.items[0]).toHaveProperty('auteur');
      expect(response.body.items[0]).toHaveProperty('gereedschappen');
      expect(response.body.items[0].plaats).toHaveProperty('naam');
      expect(response.body.items[0].auteur).toHaveProperty('naam');
    });

    it('moet een lege lijst teruggeven als er geen evenementen zijn', async () => {
      await prisma.evenement.deleteMany({});
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
    });
  });

  describe('GET /api/evenementen/:id', () => {
    beforeEach(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.gereedschap.createMany({ data: data.gereedschappen });
      await prisma.evenement.createMany({ data: data.evenementen });
    });

    afterEach(async () => {
      await clearDatabase();
    });

    it('moet een 404 geven als het evenement niet bestaat', async () => {
      const response = await request
        .get(`${url}/999`)
        .set(authHeader());
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Er bestaat geen evenement met dit Id');
    });

    it('moet een 200 en het evenement teruggeven', async () => {
      const response = await request
        .get(`${url}/1`)
        .set(authHeader());
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('naam');
      expect(response.body).toHaveProperty('datum');
      expect(response.body).toHaveProperty('plaats');
      expect(response.body).toHaveProperty('auteur');
      expect(response.body).toHaveProperty('gereedschappen');
      expect(response.body.auteur).toHaveProperty('naam');
      expect(response.body.plaats).toHaveProperty('naam');
    });

    it('moet een 400 geven als het id ongeldig is', async () => {
      const response = await request
        .get(`${url}/not-a-number`)
        .set(authHeader());
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('validatie gefaald');
    });
  });

  describe('POST /api/evenementen', () => {
    beforeEach(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.gereedschap.createMany({ data: data.gereedschappen });
    });

    afterEach(async () => {
      await clearDatabase();
    });

    it('moet een 200 geven bij het succesvol aanmaken van een evenement', async () => {
      const nieuwEvenement = {
        naam: 'Nieuw Evenement',
        datum: '2025-05-25T00:00:00.000Z',
        auteur_id: 1,
        plaats_id: 1,
        gereedschap_ids: [1, 2],
      };
      
      const response = await request
        .post(url)
        .set(authHeader())
        .send(nieuwEvenement);
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe('Nieuw Evenement');
      expect(response.body.datum).toBe('2025-05-25T00:00:00.000Z');
      expect(response.body.plaats).toEqual(expect.objectContaining({
        id: 1, 
        naam: 'Verhaeghe, Michiels and Lemmens Theater',
      }));
      expect(response.body.auteur).toEqual(expect.objectContaining({
        id: 1, 
        naam: 'Dylan De Man',
      }));
      
      // Check if gereedschappen are linked
      const updatedGereedschap1 = await prisma.gereedschap.findUnique({ 
        where: { id: 1 },
      });
      const updatedGereedschap2 = await prisma.gereedschap.findUnique({ 
        where: { id: 2 },
      });
      expect(updatedGereedschap1?.beschikbaar).toBe(false);
      expect(updatedGereedschap2?.beschikbaar).toBe(false);
    });

    it('moet een 400 geven als verplichte velden ontbreken', async () => {
      const response = await request
        .post(url)
        .set(authHeader())
        .send({ naam: 'Incompleet Evenement' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('validatie gefaald');
    });
  });

  describe('PUT /api/evenementen/:id', () => {
    beforeEach(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.gereedschap.createMany({ data: data.gereedschappen });
      await prisma.evenement.createMany({ data: data.evenementen });
      
      // Connect gereedschap to the evenement
      await prisma.gereedschap.update({ 
        where: { id: 1 }, 
        data: { evenement_id: 1, beschikbaar: false }, 
      });
    });
  
    afterEach(async () => {
      await clearDatabase();
    });
  
    it('moet een 200 geven bij het succesvol bijwerken van een evenement', async () => {
      const bijgewerktEvenement = {
        naam: 'Bijgewerkt Evenement',
        datum: '2025-06-25T00:00:00.000Z',
        auteur_id: 2,
        plaats_id: 2,
        gereedschap_ids: [2, 3], // Changing from gereedschap 1 to 2 and 3
      };
  
      const response = await request
        .put(`${url}/1`)
        .set(authHeader())
        .send(bijgewerktEvenement);
  
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.naam).toBe('Bijgewerkt Evenement');
      expect(response.body.datum).toBe('2025-06-25T00:00:00.000Z');
      expect(response.body.auteur.id).toBe(2);
      expect(response.body.plaats.id).toBe(2);
      
      // Check if gereedschap relationships were updated correctly
      const updatedGereedschap1 = await prisma.gereedschap.findUnique({ 
        where: { id: 1 },
      });
      const updatedGereedschap2 = await prisma.gereedschap.findUnique({ 
        where: { id: 2 },
      });
      const updatedGereedschap3 = await prisma.gereedschap.findUnique({ 
        where: { id: 3 },
      });
      
      expect(updatedGereedschap1?.beschikbaar).toBe(true);
      expect(updatedGereedschap1?.evenement_id).toBeNull();
      expect(updatedGereedschap2?.beschikbaar).toBe(false);
      expect(updatedGereedschap2?.evenement_id).toBe(1);
      expect(updatedGereedschap3?.beschikbaar).toBe(false);
      expect(updatedGereedschap3?.evenement_id).toBe(1);
    });
  
    it('moet een 404 geven als het evenement niet bestaat', async () => {
      const bijgewerktEvenement = {
        naam: 'Niet bestaand Evenement',
        datum: '2025-06-25T00:00:00.000Z',
        auteur_id: 1,
        plaats_id: 1,
      };
  
      const response = await request
        .put(`${url}/999`)
        .set(authHeader())
        .send(bijgewerktEvenement);
  
      expect(response.status).toBe(404);
      expect(response.body.code).toBe('NOT_FOUND');
    });
  
    it('moet een 500 geven als een ongeldige plaats_id wordt opgegeven', async () => {
      const bijgewerktEvenement = {
        naam: 'Evenement met Ongeldige Plaats',
        datum: '2025-06-25T00:00:00.000Z',
        auteur_id: 1,
        plaats_id: 999,
      };
  
      const response = await request
        .put(`${url}/1`)
        .set(authHeader())
        .send(bijgewerktEvenement);
  
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/evenementen/:id', () => {
    beforeEach(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.gereedschap.createMany({ data: data.gereedschappen });
      await prisma.evenement.createMany({ data: data.evenementen });
      
      // Connect gereedschap to evenement before testing deletion
      await prisma.gereedschap.update({ 
        where: { id: 1 }, 
        data: { evenement_id: 1, beschikbaar: false }, 
      });
    });

    afterEach(async () => {
      await clearDatabase();
    });

    it('moet een 204 geven bij het succesvol verwijderen van een evenement', async () => {
      const response = await request
        .delete(`${url}/1`)
        .set(authHeader());
      expect(response.status).toBe(204);
      
      // Verify evenement is deleted
      const evenement = await prisma.evenement.findUnique({ where: { id: 1 } });
      expect(evenement).toBeNull();
      
      // Verify gereedschap is now available after evenement deletion
      const gereedschap = await prisma.gereedschap.findUnique({ where: { id: 1 } });
      expect(gereedschap?.evenement_id).toBeNull();
      expect(gereedschap?.beschikbaar).toBe(true);
    });
    
    it('moet een 404 geven als het evenement niet bestaat', async () => {
      const response = await request
        .delete(`${url}/999`)
        .set(authHeader());
      expect(response.status).toBe(404);
    });
  });
});
  
