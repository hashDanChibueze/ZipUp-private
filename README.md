ZipUp
=====

### Yelp for bathrooms..

Helping your business go down. Will be deployed on the interwebz when we work to make it less hacky.

### Stack

- **Backend**: node, express, mongodb
- **Frontend**: jQuery, Knockout.js

### Directory Structure

#### `api`

Holds all files for the API we use

#### `client/www`

All code used for client side app.

### Building Android app

Make sure you have Phonegap installed.

Then, `cd` into `client`, and run `cordova platform add android`. This command needs to be run only once unless you delete the `client/platforms/android` folder.

To test the app on phone, connect the phone and run `cordova run android`.
