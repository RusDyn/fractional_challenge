### Senior backend coding challenge for Fractional Art
https://fractional.art/

@fractional-company
```
1. Create an application with following requirements (anticipate large amounts of requests):
- takes MSISDN as an input
- returns MNO identifier, country dialling code, subscriber number and country identifier as defined with ISO 3166-1-alpha-2
- Write all needed tests.
2. Expose the package through an REST API. Limit the usage (API key).
3. Design a SQL database that logs usage of the API
4. (Bonus) Write simple SQL queries to get the following data.
- AVG number of requests per specific timeframe
- Sum of all request in specific time frame
- 3 hour time period for specific api key, when the usage is the highest (Example: 3:00pm to 6:00pm)
- Most used API key (with num of req)
5. Write a high-level description (1 page) explaining your solution. Explanation should include:
- A description of what you've built
- Which technologies you've used and how they tie together
- Your reasons for high-level decisions
```


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
- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE

#### Create db schema via typeorm migration
```
npm run typeorm:migration:run
```
Also, you will need to add API key by hands to the api_keys table

### Run
```
// dev
npm run start:dev

// prod
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
