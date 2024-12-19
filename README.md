# Examenopdracht Front-end Web Development & Web Services

- Student: Dylan De Man
- Studentennummer: 202396547
- E-mailadres: <mailto:dylan.deman@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Front-end

## Opstarten
### Maak een .env bestand aan met volgende:
* VITE_API_URL='http://localhost:9000/api'
* AUTH0_USERNAME='test@reboost.be'
* AUTH0_PASSWORD='Test123.'
* REACT_APP_AUTH0_DOMAIN='https://dev-eu5g8sejk0b6k23l.us.auth0.com'
* REACT_APP_AUTH0_AUDIENCE='https://dev-eu5g8sejk0b6k23l.us.auth0.com/api/v2/'
* REACT_APP_AUTH0_SCOPE='read:current_user'
* REACT_APP_AUTH0_CLIENTID='DsCO5tTYas6vWM3MrPCZ4h9Qw5IuXExs'

### Dependencies installeren
 * yarn install
### Front end opstarten
 * yarn dev
## Testen
* installeer alle dependencies: yarn

* Run de testen: yarn test

## Back-end
### Maak een .env bestand aan met volgende:
* NODE_ENV=development
* DATABASE_URL="mysql://root:root@localhost:3306/Reboost"
* AUTH_JWT_SECRET='Een lange string dat niemand kan raden'

  
## Opstarten
* Enable Corepack: corepack enable
### Dependencies installeren
 * yarn install
### Back end opstarten
* yarn migrate:dev
* yarn start:dev

## Testen
### Maak een .env.test bestand aan met volgende:
* NODE_ENV=testing
* DATABASE_URL="mysql://root:root@localhost:3306/Reboost_test"
### testen uitvoeren
* Run de migrations: yarn migrate:test
* Run de testen: yarn test
