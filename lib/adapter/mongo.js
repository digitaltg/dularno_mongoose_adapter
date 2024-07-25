/* eslint-disable no-param-reassign */
const { DatabaseInterface } = require("@dularno/definitions");

class MongoWithMongooseDatabase extends DatabaseInterface {
    constructor(config) {
        super(config);

        if (!config.mongoose) {
            throw new Error(
                "Mongoose instance or lib is required in config: { monggose: <mongoose instace> }",
            );
        }

        this.mongooseLib = config.mongoose;
    }

    /**
     * Connect to the database
     */
    async connect() {
        this.$connection = this.mongooseLib.createConnection(
            this.config.uri ?? this.config.url,
            this.config.options || {},
        ).asPromise();

        this.connection = await this.$connection;

        // TODO: Give the opportunity to select a database
        this.connected = true;
    }

    /**
     * Ensure that we have a connection to the given database
     */
    async #ensureConnection() {
        await this.$connection;
        if (!this.connected) {
            await this.connect();
        }
    }

    /**
     * Disconnect the current connection
     */
    async disconnect() {
        await this.connection?.close();
        this.connected = false;
    }

    async initializeModel(dao, modelOptions) {
        await this.#ensureConnection();

        const {
            name,
            modelSchema,
        } = modelOptions;

        dao.model = this.connection.model(name, modelSchema);
    }
}

module.exports.MongoWithMongooseDatabase = MongoWithMongooseDatabase;
