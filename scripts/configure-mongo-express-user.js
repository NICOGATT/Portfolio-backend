const databaseName = process.env.MONGO_DB || 'portfolio';
const username = process.env.MONGO_EXPRESS_DB_USER;
const password = process.env.MONGO_EXPRESS_DB_PASSWORD;

if (!username || !password) {
    throw new Error(
        'MONGO_EXPRESS_DB_USER and MONGO_EXPRESS_DB_PASSWORD are required'
    );
}

const targetDatabase = db.getSiblingDB(databaseName);
const roles = [{ role: 'readWrite', db: databaseName }];

if (targetDatabase.getUser(username)) {
    targetDatabase.updateUser(username, { pwd: password, roles });
    print(`Updated Mongo Express user for database: ${databaseName}`);
} else {
    targetDatabase.createUser({ user: username, pwd: password, roles });
    print(`Created Mongo Express user for database: ${databaseName}`);
}
