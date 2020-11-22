import Mongo from './mongo';

const mongoHost = process.env.MONGO_HOST;

export async function createMongoClient(dbName) {
    const mongo = new Mongo(`mongodb://${mongoHost}`, dbName);

    try {
        await mongo.connect();

    } catch (error) {
        throw error;
    }
}
