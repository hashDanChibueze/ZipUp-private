### Running locally

Make sure you have mongodb installed.

    npm install
    mongod --dbpath data/
    node app.js

#### All API methods require a valid user session.

### API methods:

### `POST /signup`

    email
    password
    confirmPassword

**Success JSON:**

    {
        "status": "ok",
        "user": {
            "__v": 0,
            "email": "test@test.com",
            "password": "$2a$05$P0kkoScYQ1ra5c/Qy1741uEsKAgbkrFFW/xdXY8e0nHrgGyi2Lp0e",
            "_id": "532e822cd7f5a20000000002",
            "profile": {
                "location": "",
                "name": ""
            }
        }
    }

### `POST /signin`

    email
    password

**Success JSON:**

    {
        "status": "ok",
        "user": {
            "email": "test@test.com",
            "password": "$2a$05$P0kkoScYQ1ra5c/Qy1741uEsKAgbkrFFW/xdXY8e0nHrgGyi2Lp0e",
            "_id": "532e822cd7f5a20000000002",
            "__v": 0,
            "profile": {
                "location": "",
                "name": ""
            }
        }
    }

### `GET /signout`

**Success JSON:**

    {
        "status": "ok"
    }

### `GET /account`

Get details about the logged in user

**Success JSON:**

    {
        "status": "ok",
        "user": {
            "email": "test@test.com",
            "password": "$2a$05$P0kkoScYQ1ra5c/Qy1741uEsKAgbkrFFW/xdXY8e0nHrgGyi2Lp0e",
            "_id": "532e822cd7f5a20000000002",
            "__v": 0,
            "profile": {
                "location": "",
                "name": ""
            }
        }
    }

### `POST /account/profile`

Change profile info

Returns same object as above.

### `POST /account/password`

Change password

**Success JSON:**

    {
        "status": "ok"
    }

### `POST /forgot`

    email

Generate a token and send email to user with reset instructions.

**Success JSON:**

    {
        "status": "ok"
    }

### `GET /reset/:token`

Users click on this is the email, checks if token is valid or not. If valid, 

    {
        "status": "ok"
    }

### `POST /reset/:token`

    password
    confirmPassword

Reset the user's password to given password.

**Success JSON:**

    {
        "status": "ok"
    }

-----------------

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
