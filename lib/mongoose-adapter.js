const { MongoWithMongooseDatabase } = require("./adapter/mongo");
const { MongoWithMongooseDatabaseWrapper } = require("./adapter/wrapper");

module.exports.MongoWithMongooseDatabase = MongoWithMongooseDatabase;
module.exports.MongoWithMongooseDatabaseWrapper = MongoWithMongooseDatabaseWrapper;
