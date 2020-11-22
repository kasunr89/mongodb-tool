const mongoHost = process.env.MONGO_HOST;
const backupLocation = process.env.BACKUP_LOCATION;

export function getRestoreDbCommand(backupName) {
    return [
        'mongorestore',
        `--host ${mongoHost}`,
        `--archive=${backupLocation}/${backupName}`,
        '--gzip',
    ].join(' ');
};

export function getDumpDbCommand(backupName, database) {
    return [
		'mongodump',
        `--host ${mongoHost}`,
        `--db ${database}`,
		`--archive=${backupLocation}/${backupName}`,
		'--gzip',
    ].join(' ');
};

export function getDropDbCommand(database) {
    return [
		'mongo',
		`--host "mongodb://${mongoHost}/${database}"`,
		'--eval "db.dropDatabase()"',
	].join(' ');
};
