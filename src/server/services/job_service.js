import moment from 'moment';
import Constant from '../lib/constants';
import ErrorHandler from '../lib/error-handler';
import * as JobRepository from '../repositories/mongo/job_repository';
import * as dboToJson from '../lib/db_object_to_json';
import * as eventEmitter from '../events/event_emitter';

export async function createJob(json) {
    try {
        const jobJson = {
            backupName: json.backupName,
            database: json.database,
            status: Constant.JOB_STATUS.PENDING,
            createdAt: moment().unix(),
            updatedAt: moment().unix()
        };

        const job = await JobRepository.createJob(jobJson);
        const jobResponse = dboToJson.convertJob(job);
        
        eventEmitter.emitRestoreEvent(jobResponse);

        return jobResponse;
    }  catch(error) {
        throw ErrorHandler(error);
    }
}

export async function getJob({ id }) {
    try {
        const job = await JobRepository.getJobById(id);

        return dboToJson.convertJob(job);
    } catch (error) {
        throw ErrorHandler(error);
    }
}

export async function getLastUpdatedJob() {
    try {
        const job = await JobRepository.getLastUpdatedJob();

        if (job && job.length) {
            return dboToJson.convertJob(job[0]);
        }

        return {};
    } catch (error) {
        throw ErrorHandler(error);
    }
}
