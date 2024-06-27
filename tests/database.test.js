/* eslint-disable no-underscore-dangle */
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");

const { MongoWithMongooseDatabase } = require("..");

const COLLECTION_NAME = "testAdapter";
const COLLECTION_SCHEMA = new mongoose.Schema({ name: String, email: String });

const daoClass = {
    options: {
        name: COLLECTION_NAME,
        modelSchema: COLLECTION_SCHEMA,
    },
};

describe("[DULARNO] Mongodb adapter", () => {
    let mongod = null;
    let mongodUri = null;
    let mongoDatabase = null;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        mongodUri = mongod.getUri();
    });

    afterAll(async () => {
        await mongod.stop();
    });

    beforeEach(async () => {
        mongoDatabase = new MongoWithMongooseDatabase({
            mongoose,
            url: mongodUri,
        });

        await mongoDatabase.connect();
    });

    afterEach(async () => {
        await mongoDatabase.disconnect();
    });

    test("Should create collection", async () => {
        await mongoDatabase.initializeModel(daoClass, {
            name: COLLECTION_NAME,
            modelSchema: COLLECTION_SCHEMA,
        });
        expect(daoClass.model !== undefined).toBe(true);
    });

    test("Should create document in colllection", async () => {
        await mongoDatabase.initializeModel(daoClass, {
            name: COLLECTION_NAME,
            modelSchema: COLLECTION_SCHEMA,
        });

        const c = await daoClass.model.create({ name: "test", email: "email" });
        expect(c).not.toBe(null);
        expect(c._id !== undefined).toBe(true);
    });
});
