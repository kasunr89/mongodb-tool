import mongoose from 'mongoose';

const schemaName = 'jobs';
let model = null;

export function getModel() {
    if (model) {
        return model;
    }

    model = mongoose.model(schemaName, getSchema());
    return model;
}

function getSchema() {
    return new mongoose.Schema(
        {
            backupName: {
                type: String,
                required: true
            },
            database: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            createdAt: {
                type: Number,
                required: true
            },
            updatedAt: {
                type: Number,
                required: true
            }
        },
        {
            versionKey: false,
            writeConcern: {
                j: true,
                w: 'majority',
                wtimeout: 10000
            }
        }
    );
}
