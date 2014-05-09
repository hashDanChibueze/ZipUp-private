module.exports = {
    db: process.env.MONGODB|| 'mongodb://localhost/zipup-api',

    testdb: 'mongodb://localhost/test-zipup-api',

    sessionSecret: process.env.SESSION_SECRET || 'secretsecretsecretsecret',

    resetPassword: {
        hostName: process.env.EMAIL_HOSTNAME || 'amigo.atomicwebhosting.com',
        secureConnection: true,
        portN: 465,
        user: {
            username: 'karan@goel.im',
            password: 'pass3309'
        }
    },

    // distance in meters for the range of search
    maxDistance: 3500
};
