### Running locally

Make sure you have mongodb installed.

    npm install
    mongod --dbpath data/
    node app.js

#### All API methods require a valid user session.

### API methods:

`/get/bathrooms/`
return all bathrooms near passed location

`/b/:id`
return specific bathroom details

`/add/bathroom`
Add a new bathroom

`/get/reviews/:id`
returns reviews of the bathroom

`/add/review/:id`
post a review to id bathroom
