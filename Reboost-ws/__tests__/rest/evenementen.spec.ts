import supertest from 'supertest';
import { prisma } from '../../src/data';
import createServer from '../../src/createServer'; 
import type { Server } from '../../src/createServer'; 
//import testAuthHeader from '../helpers/testAuthHeader';

const dataToDelete = {
  evenementen: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  plaatsen: [1, 2, 3],
  gebruikers: [1, 2, 3],
};

const data = {
  gebruikers: [
    {
      id: 1,
      naam: 'Dylan De Man',
      wachtwoord: 'hashedpassword123',
    },
    {
      id: 2,
      naam: 'Steve Schwing',
      wachtwoord: 'hashedpassword456',
    },
    {
      id: 3,
      naam: 'Nathan Van Heirseele',
      wachtwoord: 'hashedpassword789',
    },
  ],
  plaatsen: [
    {
      id: 1,
      naam: 'Het klokhuis',
      straat: 'Kaaiplein',
      huisnummer: '18',
      postcode: '9220',
      gemeente: 'Hamme',
    },
    {
      id: 2,
      naam: 'JH Snuffel',
      straat: 'Hamsesteenweg',
      huisnummer: '1',
      postcode: '9200',
      gemeente: 'Dendermonde',
    },
    {
      id: 3,
      naam: 'JH Zenith',
      straat: 'Otterstraat',
      huisnummer: '58',
      postcode: '9200',
      gemeente: 'Dendermonde',
    },
  ],
  evenementen: [
    {
      id: 1,
      naam: 'Disco Dasco',
      datum: new Date(2021, 4, 25, 0, 0),
      auteur_id: 1,
      plaats_id: 1,
    },
    {
      id: 2,
      naam: 'Nacht van de jeugdbeweging',
      datum: new Date(2021, 4, 8, 0, 0),
      auteur_id: 1,
      plaats_id: 2,
    },
    {
      id: 3,
      naam: 'Fantasia',
      datum: new Date(2021, 4, 21, 0, 0),
      auteur_id: 1,
      plaats_id: 3,
    },
    {
      id: 4,
      naam: 'Gentse feesten',
      datum: new Date(2021, 4, 25, 0, 0),
      auteur_id: 2,
      plaats_id: 1,
    },
    {
      id: 5,
      naam: 'Tomorrowland',
      datum: new Date(2021, 4, 9, 0, 0),
      auteur_id: 2,
      plaats_id: 2,
    },
    {
      id: 6,
      naam: 'Pukkelpop',
      datum: new Date(2021, 4, 22, 0, 0),
      auteur_id: 2,
      plaats_id: 3,
    },
    {
      id: 7,
      naam: 'ZogRock',
      datum: new Date(2021, 4, 25, 0, 0),
      auteur_id: 3,
      plaats_id: 1,
    },
    {
      id: 8,
      naam: 'Redalert',
      datum: new Date(2021, 4, 10, 0, 0),
      auteur_id: 3,
      plaats_id: 2,
    },
    {
      id: 9,
      naam: 'Blue',
      datum: new Date(2021, 4, 19, 0, 0),
      auteur_id: 3,
      plaats_id: 3,
    },
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
      try {
        await prisma.plaats.createMany({ data: data.plaatsen });
        await prisma.gebruiker.createMany({ data: data.gebruikers });
        await prisma.evenement.createMany({ data: data.evenementen });
      } catch (error) {
        console.error('Error setting up test data:', error);
        throw error;
      }
    });

    afterAll(async () => {
      await prisma.evenement.deleteMany({
        where: { id: { in: dataToDelete.evenementen } },
      });
      await prisma.plaats.deleteMany({
        where: { id: { in: dataToDelete.plaatsen } },
      });
      await prisma.gebruiker.deleteMany({
        where: { id: { in: dataToDelete.gebruikers } },
      });
    });

    it('moet een 200 en alle evenementen teruggeven', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(9);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          
          {
            'auteur': {
              'id': 1,
              'naam': 'Dylan De Man',
            },
            'datum': '2021-05-24T22:00:00.000Z',
            'id': 1,
            'naam': 'Disco Dasco',
            'plaats': {
              'gemeente': 'Hamme',
              'huisnummer': '18',
              'id': 1,
              'naam': 'Het klokhuis',
              'postcode': '9220',
              'straat': 'Kaaiplein',
            },
          },
          {
            'auteur': {
              'id': 1,
              'naam': 'Dylan De Man',
            },
            'datum': '2021-05-07T22:00:00.000Z',
            'id': 2,
            'naam': 'Nacht van de jeugdbeweging',
            'plaats': {
              'gemeente': 'Dendermonde',
              'huisnummer': '1',
              'id': 2,
              'naam': 'JH Snuffel',
              'postcode': '9200',
              'straat': 'Hamsesteenweg',
            },
          },
          {
            'auteur': {
              'id': 1,
              'naam': 'Dylan De Man',
            },
            'datum': '2021-05-20T22:00:00.000Z',
            'id': 3,
            'naam': 'Fantasia',
            'plaats': {
              'gemeente': 'Dendermonde',
              'huisnummer': '58',
              'id': 3,
              'naam': 'JH Zenith',
              'postcode': '9200',
              'straat': 'Otterstraat',
            },
          },
          {
            'auteur': {
              'id': 2,
              'naam': 'Steve Schwing',
            },
            'datum': '2021-05-24T22:00:00.000Z',
            'id': 4,
            'naam': 'Gentse feesten',
            'plaats': {
              'gemeente': 'Hamme',
              'huisnummer': '18',
              'id': 1,
              'naam': 'Het klokhuis',
              'postcode': '9220',
              'straat': 'Kaaiplein',
            },
          },
          {
            'auteur': {
              'id': 2,
              'naam': 'Steve Schwing',
            },
            'datum': '2021-05-08T22:00:00.000Z',
            'id': 5,
            'naam': 'Tomorrowland',
            'plaats': {
              'gemeente': 'Dendermonde',
              'huisnummer': '1',
              'id': 2,
              'naam': 'JH Snuffel',
              'postcode': '9200',
              'straat': 'Hamsesteenweg',
            },
          },
          {
            'auteur': {
              'id': 2,
              'naam': 'Steve Schwing',
            },
            'datum': '2021-05-21T22:00:00.000Z',
            'id': 6,
            'naam': 'Pukkelpop',
            'plaats': {
              'gemeente': 'Dendermonde',
              'huisnummer': '58',
              'id': 3,
              'naam': 'JH Zenith',
              'postcode': '9200',
              'straat': 'Otterstraat',
            },
          },
          {
            'auteur': {
              'id': 3,
              'naam': 'Nathan Van Heirseele',
            },
            'datum': '2021-05-24T22:00:00.000Z',
            'id': 7,
            'naam': 'ZogRock',
            'plaats': {
              'gemeente': 'Hamme',
              'huisnummer': '18',
              'id': 1,
              'naam': 'Het klokhuis',
              'postcode': '9220',
              'straat': 'Kaaiplein',
            },
          },
          {
            'auteur': {
              'id': 3,
              'naam': 'Nathan Van Heirseele',
            },
            'datum': '2021-05-09T22:00:00.000Z',
            'id': 8,
            'naam': 'Redalert',
            'plaats': {
              'gemeente': 'Dendermonde',
              'huisnummer': '1',
              'id': 2,
              'naam': 'JH Snuffel',
              'postcode': '9200',
              'straat': 'Hamsesteenweg',
            },
          },
          {
            'auteur': {
              'id': 3,
              'naam': 'Nathan Van Heirseele',
            },
            'datum': '2021-05-18T22:00:00.000Z',
            'id': 9,
            'naam': 'Blue',
            'plaats': {
              'gemeente': 'Dendermonde',
              'huisnummer': '58',
              'id': 3,
              'naam': 'JH Zenith',
              'postcode': '9200',
              'straat': 'Otterstraat',
            },
          },
        ],
          
        ),
      );
    });
  });
});
