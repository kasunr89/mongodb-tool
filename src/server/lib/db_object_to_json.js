export function convertJob(dbObject) {
    return {
        id: dbObject._id,
        backupName: dbObject.backupName,
        database: dbObject.database,
        status: dbObject.status,
        createdAt: dbObject.createdAt,
        updatedAt: dbObject.updatedAt
    }
}