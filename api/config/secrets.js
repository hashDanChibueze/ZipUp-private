module.exports = {
    db: process.env.MONGODB|| 'mongodb://localhost/zipup-api',

    testdb: 'mongodb://localhost/test-zipup-api',

    sessionSecret: process.env.SESSION_SECRET || 'secretsecretsecretsecret',

    // distance in meters for the range of search
    maxDistance: 3500
};
