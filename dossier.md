# Dossier

- Student: Dylan De Man
- Studentennummer: 202396547
- E-mailadres: <mailto:dylan.deman@student.hogent.be>
- Demo: [https://hogent.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=58cbab38-3b45-4b0e-9e8d-b24c0102c447&start=0](https://hogent.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=58cbab38-3b45-4b0e-9e8d-b24c0102c447&start=0)
- GitHub-repository: <https://github.com/HOGENT-frontendweb/frontendweb-2425-DylanDeman>
- Front-end Web Development
  - Online versie: [https://frontendweb-2425-dylandeman-1.onrender.com](https://frontendweb-2425-dylandeman-1.onrender.com)
- Web Services:
  - Online versie: [https://frontendweb-2425-dylandeman.onrender.com](https://frontendweb-2425-dylandeman.onrender.com)

## Logingegevens

### Lokaal

- Gebruikersnaam/e-mailadres: test@reboost.be
- Wachtwoord: Test123.

### Online

- Gebruikersnaam/e-mailadres: test@reboost.be
- Wachtwoord: Test123.


## Projectbeschrijving
Reboost is een bedrijf in de evenementensector gelegen in Hamme, in dit project geven we gebruikers de mogelijkheid om evenementen in te plannen op locaties, de locaties kunnen ook zelf aangemaakt worden.

## Screenshots

### Login:

![image](https://github.com/user-attachments/assets/becd15f5-c007-4272-bf71-7c8c3795b2fb)

![image](https://github.com/user-attachments/assets/fe411fe1-2e46-4368-8fdc-d419f11e7e93)

### Evenementen:

#### Toevoegen:

![image](https://github.com/user-attachments/assets/7922b503-6fb0-4926-8cf1-deeca04f8368)

![image](https://github.com/user-attachments/assets/928ee1e4-0c77-4468-876f-c8414953ee16)


#### Bewerken:
![image](https://github.com/user-attachments/assets/2434a673-67d2-4972-bde9-95adf64ad23e)
![image](https://github.com/user-attachments/assets/e43e2d37-bd6f-4258-bc52-3df4a9290338)
![image](https://github.com/user-attachments/assets/d5c525a7-a5f9-4cad-89dd-a51258265639)



#### Verwijderen:

![image](https://github.com/user-attachments/assets/455c0399-673b-4b10-b9d1-a50e43f234f3)

![image](https://github.com/user-attachments/assets/964e684c-59c1-4049-9174-52594260b645)

![image](https://github.com/user-attachments/assets/0c7779c1-f8b5-482d-9568-40046d6be8b0)

### Plaatsen:

#### Toevoegen:

![image](https://github.com/user-attachments/assets/faf63edc-87ce-4abb-9926-faa67a5e5370)

![image](https://github.com/user-attachments/assets/676dbfe6-0ce2-4ab0-9c8b-026a27ba8f61)



![image](https://github.com/user-attachments/assets/57e7d446-acb2-4428-9f1a-f20bd5969970)

#### Bewerken:

![image](https://github.com/user-attachments/assets/65fffa89-9dff-44b2-927f-56bbd64842df)

![image](https://github.com/user-attachments/assets/7f206369-c03c-454e-9529-9570e6c6179b)

#### Verwijderen:

![image](https://github.com/user-attachments/assets/c77c5b58-3d6a-47b7-8b36-aa6292f5ced0)

![image](https://github.com/user-attachments/assets/b13decd5-25cd-4e91-91cb-068f9ad1ff38)

![image](https://github.com/user-attachments/assets/a67bcfb9-61c4-438e-a019-8ffbe89366de)

### Dark mode / light mode

![image](https://github.com/user-attachments/assets/7f4d6052-129a-4a24-a7bc-d0cfbd640bc1)
![image](https://github.com/user-attachments/assets/4d71d589-efb2-4621-8373-dbb7f03a05be)
![image](https://github.com/user-attachments/assets/44502dbf-74bc-4b12-b4ee-795f13be1a19)




## API calls


### Evenementen
- `GET /api/evenementen`: alle evenementen ophalen
- `GET /api/evenementen/:id`: evenement met een bepaald id ophalen
- `POST /api/evenementen/`: Nieuw evenement toevoegen
- `PUT /api/evenementen/:id`: evenement met een bepaald id bewerken
- `DELETE /api/evenementen/:id`: evenement met een bepaald id verwijderen

### Plaatsen
- `GET /api/plaatsen`: alle plaatsen ophalen
- `GET /api/plaatsen/:id`: plaats met een bepaald id ophalen
- `POST /api/plaatsen/`: Nieuwe plaats toevoegen
- `PUT /api/plaatsen/:id`: plaats met een bepaald id bewerken
- `DELETE /api/plaatsen/:id`: plaats met een bepaald id verwijderen

### Gebruikers
- `GET /api/gebruikers`: alle gebruikers ophalen
- `GET /api/gebruikers/:id`: gebruiker met een bepaald id ophalen
- `POST /api/gebruikers/`: Nieuwe gebruiker toevoegen
- `PUT /api/gebruikers/:id`: gebruiker met een bepaald id bewerken
- `DELETE /api/gebruikers/:id`: gebruiker met een bepaald id verwijderen

## Behaalde minimumvereisten

### Front-end Web Development

#### Componenten

- [x] heeft meerdere componenten - dom & slim (naast login/register)
- [x] applicatie is voldoende complex
- [x] definieert constanten (variabelen, functies en componenten) buiten de component
- [x] minstens één form met meerdere velden met validatie (naast login/register)
- [x] login systeem

#### Routing

- [x] heeft minstens 2 pagina's (naast login/register)
- [x] routes worden afgeschermd met authenticatie en autorisatie

#### State management

- [x] meerdere API calls (naast login/register)
- [x] degelijke foutmeldingen indien API-call faalt
- [x] gebruikt useState enkel voor lokale state
- [x] gebruikt gepast state management voor globale state - indien van toepassing

#### Hooks

- [x] gebruikt de hooks op de juiste manier

#### Algemeen

- [x] een aantal niet-triviale én werkende e2e testen
- [x] minstens één extra technologie
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de applicatie draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

### Web Services

#### Datalaag

- [x] voldoende complex en correct (meer dan één tabel (naast de user tabel), tabellen bevatten meerdere kolommen, 2 een-op-veel of veel-op-veel relaties)
- [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
- [x] heeft migraties - indien van toepassing
- [x] heeft seeds

#### Repositorylaag

- [x] definieert één repository per entiteit - indien van toepassing
- [x] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
- [x] er worden kindrelaties opgevraagd (m.b.v. JOINs) - indien van toepassing

#### Servicelaag met een zekere complexiteit

- [x] bevat alle domeinlogica
- [x] er wordt gerelateerde data uit meerdere tabellen opgevraagd
- [x] bevat geen services voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] bevat geen SQL-queries of databank-gerelateerde code

#### REST-laag

- [x] meerdere routes met invoervalidatie
- [x] meerdere entiteiten met alle CRUD-operaties
- [x] degelijke foutboodschappen
- [x] volgt de conventies van een RESTful API
- [x] bevat geen domeinlogica
- [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] degelijke autorisatie/authenticatie op alle routes

#### Algemeen

- [x] er is een minimum aan logging en configuratie voorzien
- [x] een aantal niet-triviale én werkende integratietesten (min. 1 entiteit in REST-laag >= 90% coverage, naast de user testen)
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] minstens één extra technologie die we niet gezien hebben in de les
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de API draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

## Projectstructuur

### Front-end Web Development

![image](https://github.com/user-attachments/assets/df49b1d5-40e9-47c7-8308-facf3b047788)

De front end is opgedeeld in een components & pages structuur, hierbij worden ook contexts gebruikt

### Web Services

![image](https://github.com/user-attachments/assets/2616960c-14b2-446d-9672-dec339bce64f)

De api is opgedeeld in een data, rest & service laag

#### ERD
![image](https://github.com/user-attachments/assets/6f1f20dc-bd9c-4dac-8b89-172272a33374)


## Extra technologie

### Front-end Web Development

[Auth0](https://www.npmjs.com/package/auth0)

### Web Services

[apidoc](https://www.npmjs.com/package/apidoc)

## Reflectie

Het was leuk om zelf een project te mogen maken zonder extreme richtlijnen, ookal heb ik de tijdsdruk onderschat. 
Ik zou volgende keer meer doen doorheen het semester, aangezien ik nu nog veel heb moeten doen op het einde van het semester.
