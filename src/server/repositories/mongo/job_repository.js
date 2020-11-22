
import { getModel } from './core/mongo/schemas/job';
import { NotFoundError } from '../../lib/error-handler';

export async function createJob(job)  {
    return await getModel()
        .create(job);
};

export async function getJobById(id) {
    const job = await getModel()
            .findById(id);

    if (!job) {
        throw new NotFoundError('Job not found');
    }

    return job;
};

export async function updateJob(id, job) {
    return await getModel()
        .updateOne(
            { _id: id },
            { ...job }
        );
};

export async function getLastUpdatedJob() {
    return await getModel()
        .find({})
        .sort([['updatedAt', -1]])
        .limit(1);
}
