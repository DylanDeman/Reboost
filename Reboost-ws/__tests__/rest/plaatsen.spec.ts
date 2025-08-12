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

describe('Plaatsen', () => {
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

  const url = '/api/plaatsen';
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  describe('GET /api/plaatsen', () => {
    beforeAll(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.evenement.createMany({ data: data.evenementen });
    });

    afterAll(async () => {
      await clearDatabase();
    });

    it('moet een 200 en alle plaatsen teruggeven', async () => {
      const response = await request.get(url);
      
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(3);
      expect(response.body.items[0]).toHaveProperty('id');
      expect(response.body.items[0]).toHaveProperty('naam');
      expect(response.body.items[0]).toHaveProperty('straat');
      expect(response.body.items[0]).toHaveProperty('huisnummer');
      expect(response.body.items[0]).toHaveProperty('postcode');
      expect(response.body.items[0]).toHaveProperty('gemeente');
      expect(response.body.items[0]).toHaveProperty('_count');
      expect(response.body.items[0]._count).toHaveProperty('evenementen');
    });

    it('moet een lege lijst teruggeven als er geen plaatsen zijn', async () => {
      await prisma.evenement.deleteMany({});
      await prisma.plaats.deleteMany({});
      
      const response = await request.get(url);
      
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
    });
  });

  describe('GET /api/plaatsen/:id', () => {
    beforeAll(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.evenement.createMany({ data: data.evenementen });
    });

    afterAll(async () => {
      await clearDatabase();
    });

    it('moet een 200 en de plaats details teruggeven', async () => {
      const response = await request
        .get(`${url}/1`)
        .set(authHeader());
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('naam', 'Verhaeghe, Michiels and Lemmens Theater');
      expect(response.body).toHaveProperty('straat', 'Felixdreef');
      expect(response.body).toHaveProperty('huisnummer', '426');
      expect(response.body).toHaveProperty('postcode', '5267');
      expect(response.body).toHaveProperty('gemeente', 'Zarlardingevijve');
      expect(response.body).toHaveProperty('evenementen');
      expect(Array.isArray(response.body.evenementen)).toBe(true);
    });

    it('moet een foutmelding geven als de plaats niet bestaat', async () => {
      const response = await request
        .get(`${url}/999`)
        .set(authHeader());
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Er bestaat geen plaats met dit id');
    });
  });

  describe('POST /api/plaatsen', () => {
    beforeAll(async () => {
      await clearDatabase();
      
      // Insert test data for users
      await prisma.gebruiker.createMany({ data: data.gebruikers });
    });

    afterAll(async () => {
      await clearDatabase();
    });

    it('moet een 201 geven bij het succesvol aanmaken van een plaats', async () => {
      const nieuwePlaats = {
        naam: 'Nieuwe Evenementenlocatie',
        straat: 'Stationsstraat',
        huisnummer: '10',
        postcode: '9000',
        gemeente: 'Gent',
      };
      
      const response = await request
        .post(url)
        .set(authHeader())
        .send(nieuwePlaats);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('naam', 'Nieuwe Evenementenlocatie');
      expect(response.body).toHaveProperty('straat', 'Stationsstraat');
      expect(response.body).toHaveProperty('huisnummer', '10');
      expect(response.body).toHaveProperty('postcode', '9000');
      expect(response.body).toHaveProperty('gemeente', 'Gent');
    });

    it('moet een foutmelding geven als de authenticatie ontbreekt', async () => {
      const nieuwePlaats = {
        naam: 'Ongeautoriseerde Plaats',
        straat: 'Teststraat',
        huisnummer: '1',
        postcode: '1000',
        gemeente: 'Brussel',
      };
      
      const response = await request
        .post(url)
        .send(nieuwePlaats);
      
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/plaatsen/:id', () => {
    beforeAll(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
    });

    afterAll(async () => {
      await clearDatabase();
    });

    it('moet een 200 geven bij het succesvol bijwerken van een plaats', async () => {
      const bijgewerktePlaats = {
        naam: 'Bijgewerkte Evenementenlocatie',
        straat: 'Nieuwe Straat',
        huisnummer: '25',
        postcode: '9300',
        gemeente: 'Aalst',
      };
      
      const response = await request
        .put(`${url}/1`)
        .set(authHeader())
        .send(bijgewerktePlaats);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('naam', 'Bijgewerkte Evenementenlocatie');
      expect(response.body).toHaveProperty('straat', 'Nieuwe Straat');
      expect(response.body).toHaveProperty('huisnummer', '25');
      expect(response.body).toHaveProperty('postcode', '9300');
      expect(response.body).toHaveProperty('gemeente', 'Aalst');
    });

    it('moet een foutmelding geven als de plaats niet bestaat', async () => {
      const bijgewerktePlaats = {
        naam: 'Niet-bestaande Plaats',
        straat: 'Teststraat',
        huisnummer: '1',
        postcode: '1000',
        gemeente: 'Brussel',
      };
      
      const response = await request
        .put(`${url}/999`)
        .set(authHeader())
        .send(bijgewerktePlaats);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Er bestaat geen plaats met dit id');
    });
  });

  describe('DELETE /api/plaatsen/:id', () => {
    beforeAll(async () => {
      await clearDatabase();
      
      // Insert test data
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
    });

    afterAll(async () => {
      await clearDatabase();
    });

    it('moet een 204 geven bij het succesvol verwijderen van een plaats', async () => {
      const response = await request
        .delete(`${url}/3`) // Using plaats with id 3 which has no evenementen
        .set(authHeader());
      
      expect(response.status).toBe(204);
      
      // Verify the plaats is deleted
      const plaats = await prisma.plaats.findUnique({ where: { id: 3 } });
      expect(plaats).toBeNull();
    });

    it('moet een foutmelding geven bij het verwijderen van een plaats met gekoppelde evenementen', async () => {
      // First create an evenement linked to plaats with id 1
      await prisma.evenement.create({
        data: {
          naam: 'Test Evenement',
          datum: new Date(),
          auteur_id: 1,
          plaats_id: 1,
        },
      });
      
      const response = await request
        .delete(`${url}/1`)
        .set(authHeader());
      
      // Should fail because there's a foreign key constraint
      expect(response.status).toBe(409);
      expect(response.body.message).toContain('Deze plaats bestaat niet of is nog gelinkt aan evenementen');
    });

    it('moet een foutmelding geven als de plaats niet bestaat', async () => {
      const response = await request
        .delete(`${url}/999`)
        .set(authHeader());
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Er bestaat geen plaats met dit id');
    });
  });
});
 