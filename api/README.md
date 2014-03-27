### Running locally

Make sure you have mongodb installed.

    npm install
    mongod --dbpath data/
    node app.js

#### All API methods require a valid user session.

# API methods:

- [User authentication and account management](#user-authentication-and-account-management)
- [Working with bathroom and reviews](#working-with-bathrooms)


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

### Add a vote by the current logged in user to the bathroom

`POST /addvote`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| bid | String | ID of the bathroom | Y |
| voteDir | String | The direction of vote (1/-1) | Y |

**Success JSON**

    {
        "response": "ok",
        "user": {
            "__v": 0,
            "_id": "533487c02be76b0000000011",
            "email": "test1@test.com",
            "password": "$2a$05$U8VghFfYJpKLbHq6m.aaUuNT.KEbKww0FKeKQhcmLuzGiLejMBqIi",
            "voted_bathrooms": [
                "533487c02be76b0000000011",
                "533488652be76b0000000014",
                "5333d5165553830000000006"
            ],
            "profile": {
                "location": "",
                "name": ""
            },
            "created_at": "2014-03-27T20:19:12.784Z"
        }
    }

### Add a review to a bathroom

`POST /addreview`

**Parameters**

| Field | Value | Description | Required |
| ----- | ----- | ------------ | --------|
| bid | String | ID of the bathroom | Y |
| cleanliness | String | Amount of cleanliness (1-5) | Y |
| review | String | The review (10-2000 chars) | Y |

**Success JSON**

    {
        "response": "ok",
        "bathroom": {
            "__v": 0,
            "_id": "53349c4b9ac7a50000000018",
            "access": 0,
            "downvotes": 1,
            "gender": 0,
            "name": "adaa",
            "upvotes": 0,
            "reviews": [
                "53349c629ac7a50000000019",
                "5334a16505ae858802000001"
            ],
            "location": {
                "lat": 123.2,
                "lng": 232
            },
            "created_at": "2014-03-27T21:46:51.414Z"
        }
    }

### Get all reviews for the bathroom

`GET /getreviews/:bid`

**Success JSON**

    {
        "response": "ok",
        "bathroom": {
            "__v": 0,
            "_id": "5334b3a5a34df3111c000002",
            "access": 0,
            "downvotes": 1,
            "gender": 0,
            "name": "adaa",
            "upvotes": 0,
            "reviews": [
                {
                    "cleanliness": 3,
                    "review": "Awesome teooooo",
                    "_id": "5334b3b1a34df3111c000003",
                    "__v": 0,
                    "left_by": [
                        "5334b3a2a34df3111c000001"
                    ],
                    "created_at": "2014-03-27T23:26:41.433Z"
                }
            ],
            "location": {
                "lat": 123.2,
                "lng": 232
            },
            "created_at": "2014-03-27T23:26:29.547Z"
        }
    }


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
