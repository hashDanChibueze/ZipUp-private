### Running locally

Make sure you have mongodb installed.

    npm install
    mongod --dbpath data/
    node app.js

#### All API methods require a valid user session.

# API methods:

- [User authentication and account management](#user-authentication-and-account-management)


## User authentication and account management

### Register a new user

`POST /signup`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| email | String | The email of the user | Y |
| password | String | Password to use | Y |

**Success JSON:**

    {
        "response": "ok",
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

### Sign a user in

`POST /signin`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| email | String | The email of the user | Y |
| password | String | Password to use | Y |

**Success JSON:**

    {
        "response": "ok",
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

### Sign out a user and destroy session

`GET /signout`

**Success JSON:**

    {
        "response": "ok"
    }

### Get details about the logged in user

`GET /account`

**Success JSON:**

    {
        "response": "ok",
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

### Change profile info 

`POST /account/profile`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| email | String | The email of the user | N |
| name | String | Name of the person | N |
| location | String | Location of the person | N |

**Success JSON:**

    {
        "response": "ok",
        "user": {
            "email": "test@test.com",
            "password": "$2a$05$P0kkoScYQ1ra5c/Qy1741uEsKAgbkrFFW/xdXY8e0nHrgGyi2Lp0e",
            "_id": "532e822cd7f5a20000000002",
            "__v": 0,
            "profile": {
                "location": "Seattle, WA",
                "name": ""
            }
        }
    }

### Change password for logged in user

`POST /account/password`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| password | String | Password to use | Y |

**Success JSON:**

    {
        "response": "ok"
    }

### Generate a token and send email to user with reset instructions.

`POST /forgot`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| email | String | The email of the user | Y |

**Success JSON:**

    {
        "response": "ok"
    }

### Checks if token valid or not

`GET /reset/:token`

Users click on this is the email, checks if token is valid or not. If valid, 

    {
        "response": "ok"
    }

### Reset the user's password to given password.

`POST /reset/:token`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| password | String | Password to use | Y |

**Success JSON:**

    {
        "response": "ok"
    }

## Working with bathrooms

### Add a new bathroom

`POST /addbathroom`

    **Parameters**

    | Field | Value | Description | Required |
    | ----- | ----- | ------------ | --------|
    | lat | Number | Latitude of location | Y |
    | lng | Number | Longitude of location | Y |
    | bathroom_name | String | Location name | Y |
    | bathroom_access | String | 0 public, 1 private | Y |
    | gender | String | 0 male, 1 female, 2 unisex | Y |
    | voteDir | String | -1 or 1 | Y |

**Success JSON:**

    {
        "response": "ok"
    }

### Get details of a particular bathroom

`GET /getbathroom/:id`

**Success JSON**

    {
        "response": "ok",
        "bathroom": {
            "downvotes": 0,
            "upvotes": 1,
            "name": "xyz",
            "access": 0,
            "_id": "5333cd6f91eec30000000001",
            "reviews": [],
            "__v": 0,
            "location": {
                "lat": 123.2,
                "lng": 232
            },
            "created_at": "2014-03-27T07:04:15.522Z"
        }
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

---------------------

    **Parameters**

    | Field | Value | Description | Required |
    | ----- | ----- | ------------ | --------|
    |  | String |  | Y |
    |  | String |  | Y |
    |  | String |  | Y |




    **Parameters**

    | Field | Value | Description | Required |
    | ----- | ----- | ------------ | --------|
    | email | String | The email of the user | Y |
    | password | String | Password to use | Y |
