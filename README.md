### Description
Web service that takes and parses MSISDN

#### Technologies used
##### - NestJs
one of the best and well-known frameworks to build scalable node.js applications
##### - TypeOrm
with PostgreSQL. Can be easily changed to MySQL or other supported DB
To make deploy, update and support of the database in the most productive way 

##### Other notes
- RateLimitGuard is used for rate limiting. I added weight parameter to use with different methods (as crypto binance api used)
- Model folder contains DB schema
- Carriers service is used to parse number. To make it as fast as possible, service preloads all codes and splits by one number
- BackExceptionFilter interceptor used to handle all errors, return in convenient format and without showing private information to the username
- Bonus tasks are in CarriersService

### Install
- clone
- yarn

### Setup
You will need to set env keys for postgres db
```
PGHOST=
PGPORT=
PGUSER=
PGPASSWORD=
PGDATABASE=
```

#### Create db schema via typeorm migration
```
npm run typeorm:migration:run
```
Also, you will need to add API key by hands to the api_keys table

### Run
dev
```
npm run start:dev
```
prod
```
npm run build
npm run start:prod
```

#### Urls
##### Hello
```
/?api=<api-key>
```
- returns hello world message
- 1 message per minute allowes (100 weight)
###### Errors
- RATE_LIMIT 

##### Parse phone
```
/phone?number=<number>&api=<api-key>
```
- returns parsed number as json 
- 100 messages per minute allowed (1 weight)
###### Errors
- WRONG_NUMBER_FORMAT
- RATE_LIMIT


### Tests
```
npm run test
npm run coverage
```
