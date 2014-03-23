### Running locally

Make sure you have mongodb installed.

    npm install
    mongod --dbpath data/
    node app.js


### API methods:
`/get/bathrooms/`
return all bathrooms in db (uuhhhhh)!!!!

`/b/:id`
return specific bathroom details

`/add/bathroom`
Add a new bathroom

`/get/reviews/:id`
returns reviews of the bathroom

`/add/review/:id`
post a review to id bathroom
