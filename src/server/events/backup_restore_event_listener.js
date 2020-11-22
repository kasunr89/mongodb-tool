import { exec as exeCb } from "child_process";
import { promisify } from "util";
import moment from 'moment';
import * as commands from "../lib/commands";
import constants from "../lib/constants";
import * as JobRepository from "../repositories/mongo/job_repository";

const exec = promisify(exeCb);

export default async function restore(job) {
    try {
        await JobRepository.updateJob(job.id, {
            updatedAt: moment().unix(),
            status: constants.JOB_STATUS.INPROGRESS,
        });

        await exec(commands.getDropDbCommand(job.database));
        await exec(commands.getRestoreDbCommand(job.backupName));

        await JobRepository.updateJob(job.id, {
            updatedAt: moment().unix(),
            status: constants.JOB_STATUS.COMPLETED,
        });
    } catch {
        await JobRepository.updateJob(job.id, {
            updatedAt: moment().unix(),
            status: constants.JOB_STATUS.ERROR,
        });
    }
}
