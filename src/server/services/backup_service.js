import fs from 'fs';
import path from 'path';
import ErrorHandler from '../lib/error-handler';

export function getBackups() {

    try {
        const files  = fs.readdirSync(`${path.resolve('.')}/${process.env.BACKUP_LOCATION}`);

        return files.map((filename) => {
            return {
                filename
            };
        });
    } catch (error) {
        throw ErrorHandler(error);
    }
}