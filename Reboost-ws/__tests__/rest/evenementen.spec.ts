import supertest from 'supertest';
import { prisma } from '../../src/data';
import createServer from '../../src/createServer'; 
import type { Server } from '../../src/createServer'; 
import Role from '../../src/core/roles';

const dataToDelete = {
  evenementen: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  plaatsen: [1, 2, 3],
  gebruikers: [1, 2, 3],
};

const data = {
  gebruikers: [
    { id: 1, naam: 'Dylan De Man', wachtwoord: 'hashedpassword123', roles: JSON.stringify([Role.ADMIN, Role.USER]) },
    { id: 2, naam: 'Steve Schwing', wachtwoord: 'hashedpassword456', roles: JSON.stringify([Role.USER]) },
    { id: 3, naam: 'Nathan Van Heirseele', wachtwoord: 'hashedpassword789' , roles: JSON.stringify([Role.USER])},
  ],
  plaatsen: [
    { id: 1, naam: 'Het klokhuis', straat: 'Kaaiplein', huisnummer: '18', postcode: '9220', gemeente: 'Hamme' },
    { id: 2, naam: 'JH Snuffel', straat: 'Hamsesteenweg', huisnummer: '1', postcode: '9200', gemeente: 'Dendermonde' },
    { id: 3, naam: 'JH Zenith', straat: 'Otterstraat', huisnummer: '58', postcode: '9200', gemeente: 'Dendermonde' },
  ],
  evenementen: [
    { id: 1, naam: 'Disco Dasco', datum: new Date(2021, 4, 25, 0, 0), auteur_id: 1, plaats_id: 1 },
    { id: 2, naam: 'Nacht van de jeugdbeweging', datum: new Date(2021, 4, 8, 0, 0), auteur_id: 1, plaats_id: 2 },
    { id: 3, naam: 'Fantasia', datum: new Date(2021, 4, 21, 0, 0), auteur_id: 1, plaats_id: 3 },
    { id: 4, naam: 'Gentse feesten', datum: new Date(2021, 4, 25, 0, 0), auteur_id: 2, plaats_id: 1 },
    { id: 5, naam: 'Tomorrowland', datum: new Date(2021, 4, 9, 0, 0), auteur_id: 2, plaats_id: 2 },
    { id: 6, naam: 'Pukkelpop', datum: new Date(2021, 4, 22, 0, 0), auteur_id: 2, plaats_id: 3 },
    { id: 7, naam: 'ZogRock', datum: new Date(2021, 4, 25, 0, 0), auteur_id: 3, plaats_id: 1 },
    { id: 8, naam: 'Redalert', datum: new Date(2021, 4, 10, 0, 0), auteur_id: 3, plaats_id: 2 },
    { id: 9, naam: 'Blue', datum: new Date(2021, 4, 19, 0, 0), auteur_id: 3, plaats_id: 3 },
  ],
};

describe('Evenementen', () => {

  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer(); 
    request = supertest(server.getApp().callback()); 
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/evenementen'; 

  describe('GET /api/evenementen', () => {
    beforeAll(async () => {
  
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.evenement.createMany({ data: data.evenementen });
     
    });

    afterAll(async () => {
      await prisma.evenement.deleteMany({ where: { id: { in: dataToDelete.evenementen } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.gebruikers } } });
      await prisma.plaats.deleteMany({ where: { id: { in: dataToDelete.plaatsen } } });
     
    });

    it('moet een 200 en alle evenementen teruggeven', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(9);
      expect(response.body.items[0]).toHaveProperty('id');
      expect(response.body.items[0].plaats).toHaveProperty('naam');
    });

    it('moet een lege lijst teruggeven als er geen evenementen zijn', async () => {
      await prisma.evenement.deleteMany({});
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
    });
  });

  describe('GET /api/evenementen/:id', () => {
    beforeAll(async () => {
      await prisma.plaats.createMany({ data: data.plaatsen });
      await prisma.gebruiker.createMany({ data: data.gebruikers });
      await prisma.evenement.createMany({ data: data.evenementen });
    });

    afterAll(async () => {
      await prisma.evenement.deleteMany({ where: { id: { in: dataToDelete.evenementen } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.gebruikers } } });
      await prisma.plaats.deleteMany({ where: { id: { in: dataToDelete.plaatsen } } });
 
    });

    it('moet een 404 geven als het evenement niet bestaat', async () => {
      const response = await request.get(`${url}/999`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Er bestaat geen evenement met dit Id');
    });

    it('moet een 200 en het evenement teruggeven', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body.auteur).toHaveProperty('naam');
    });

    it('moet een 400 geven als het id ongeldig is', async () => {
      const response = await request.get(`${url}/not-a-number`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('validatie gefaald');
    });
  });

  describe('POST /api/evenementen', () => {
    beforeAll(async () => {
      await prisma.plaats.createMany({ data: data.plaatsen});
      await prisma.gebruiker.createMany({ data: data.gebruikers});
      await prisma.evenement.createMany({ data: data.evenementen});
    });

    afterAll(async () => {
      await prisma.evenement.deleteMany({ where: { id: { in: dataToDelete.evenementen } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.gebruikers } } });
      await prisma.plaats.deleteMany({ where: { id: { in: dataToDelete.plaatsen } } });

    });

    it('moet een 201 geven bij het succesvol aanmaken van een evenement', async () => {
      const nieuwEvenement = {
        naam: 'Nieuw Evenement',
        datum: '2021-05-25T00:00:00.000Z',
        auteur_id: 1,
        plaats_id: 1,
      };
      
      const response = await request.post(url).send(nieuwEvenement);
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe('Nieuw Evenement');
      expect(response.body.datum).toBe('2021-05-25T00:00:00.000Z');
      expect(response.body.plaats).toEqual({
        id: 1, 
        naam: 'Het klokhuis', 
        straat: 'Kaaiplein', 
        huisnummer: '18', 
        postcode: '9220', 
        gemeente: 'Hamme' },
      );
      expect(response.body.auteur).toEqual({
        id: 1, 
        naam: 'Dylan De Man', 
      });
    });

    it('moet een 400 geven als verplichte velden ontbreken', async () => {
      const response = await request.post(url).send({ naam: 'Incompleet Evenement' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('validatie gefaald');
    });
  });

  describe('PUT /api/evenementen/:id', () => {
    beforeAll(async () => {
      await prisma.plaats.createMany({ data: data.plaatsen, skipDuplicates: true });
      await prisma.gebruiker.createMany({ data: data.gebruikers, skipDuplicates: true });
      await prisma.evenement.createMany({ data: data.evenementen, skipDuplicates: true });
    });
  
    afterAll(async () => {
      await prisma.evenement.deleteMany({ where: { id: { in: dataToDelete.evenementen } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.gebruikers } } });
      await prisma.plaats.deleteMany({ where: { id: { in: dataToDelete.plaatsen } } });
    });
  
    it('moet een 200 geven bij het succesvol bijwerken van een evenement', async () => {
      const bijgewerktEvenement = {
        naam: 'Bijgewerkt Evenement',
        datum: '2021-06-25T00:00:00.000Z',
        auteur_id: 2,
        plaats_id: 2,
      };
  
      const response = await request.put(`${url}/1`).send(bijgewerktEvenement);
  
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.naam).toBe('Bijgewerkt Evenement');
      expect(response.body.datum).toBe('2021-06-25T00:00:00.000Z');
      expect(response.body.auteur.id).toBe(2);
      expect(response.body.plaats.id).toBe(2);
    });
  
    it('moet een 404 geven als het evenement niet bestaat', async () => {
      const bijgewerktEvenement = {
        naam: 'Niet bestaand Evenement',
        datum: '2021-06-25',
        auteur_id: 1,
        plaats_id: 1,
      };
  
      const response = await request.put(`${url}/999`).send(bijgewerktEvenement);
  
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen evenement met dit id',
      });
    });
  
    it('moet een 500 geven als een ongeldige plaats_id wordt opgegeven', async () => {
      const bijgewerktEvenement = {
        naam: 'Evenement met Ongeldige Plaats',
        datum: '2021-06-25T00:00:00.000Z',
        auteur_id: 1,
        plaats_id: 999,
      };
  
      const response = await request.put(`${url}/1`).send(bijgewerktEvenement);
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Er bestaat geen plaats met dit id');
    });
  });

  describe('DELETE /api/evenementen/:id', () => {

    beforeAll(async () => {
      await prisma.plaats.createMany({ data: data.plaatsen, skipDuplicates: true });
      await prisma.gebruiker.createMany({ data: data.gebruikers, skipDuplicates: true });
      await prisma.evenement.createMany({ data: data.evenementen ,  skipDuplicates: true});
    });

    afterAll(async () => {
      await prisma.evenement.deleteMany({ where: { id: { in: dataToDelete.evenementen } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.gebruikers } } });
      await prisma.plaats.deleteMany({ where: { id: { in: dataToDelete.plaatsen } } });
    
    });

    it('moet een 204 geven bij het succesvol verwijderen van een evenement', async () => {
      const response = await request.delete(`${url}/1`);
      expect(response.status).toBe(204);
    });

  });
});
