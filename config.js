var config = {};

config.email = {};
config.email.email = process.env.email;
config.email.authorEmail = process.env.authorEmail;
config.email.password = process.env.emailPassword;
config.email.host = process.env.emailHost;
config.email.service = process.env.emailService;
config.email.clientID = process.env.emailClientID;
config.email.clientSecret = process.env.emailClientSecret;
config.email.refreshToken = process.env.emailRefreshToken;
config.email.accessToken = process.env.emailAccessToken;

config.database = {};
config.database.user = process.env.databaseUser;
config.database.password = process.env.databasePassword;
config.database.name = process.env.databaseName;
config.database.port = process.env.databasePort;
config.database.host = process.env.databaseHost;
config.database.ssl = process.env.databaseSsl;

config.stripe = {};
config.database.publishableKey = process.env.stripePublishableKey;
config.database.secretKey = process.env.stripeSecretKey;

config.adminPassword = process.env.adminPassword
config.adminUsername = process.env.adminUsername
module.exports = config;