## Requirements

I expect the following software to be installed:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Front-end

## Starting
### Create a .env file with the following:
* VITE_API_URL='http://localhost:9000/api'

### Install Dependencies
 * yarn install
### Start Front-end
 * yarn dev
## Testing
* Install all dependencies: yarn

* Run the tests: yarn test

## Back-end
### Create a .env file with the following:
* NODE_ENV=development
* DATABASE_URL="mysql://root:root@localhost:3306/Reboost"
* AUTH_JWT_SECRET='A long string that nobody can guess'

  
## Starting
* Enable Corepack: corepack enable
### Install Dependencies
 * yarn install
### Start Back-end
* yarn migrate:dev
* yarn start:dev

## Testing
### Create a .env.test file with the following:
* NODE_ENV=testing
* DATABASE_URL="mysql://root:root@localhost:3306/Reboost_test"
### Run Tests
* Run the migrations: yarn migrate:test
* Run the tests: yarn test
