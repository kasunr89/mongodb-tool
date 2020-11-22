import axios from 'axios';
import Constants from '../../lib/constants';

const API_HOST = 'http://localhost:8080';
const BASE_URI = '/api';

function getBaseUrl() {
	return `${API_HOST}${BASE_URI}`;
}

export function getAllMongoBackups() {
	return axios.get(getBaseUrl() + '/backups');
};

export function addRestoreJob(filename) {
	return axios.post(getBaseUrl() + '/jobs', {
		database: 'locations',
		backupName: filename
	});
};

export function getLastJob() {
	return axios.get(getBaseUrl() + '/last-job');
}

export function getJobById(jobId) {
	return axios.get(getBaseUrl() + '/jobs/' + jobId);
};

export async function polling(jobId) {
	const { data } = await getJobById(jobId);

    if ([Constants.JOB_STATUS.ERROR, Constants.JOB_STATUS.COMPLETED].includes(data.status)) {
        return data;
    } else {
		await sleep(3000);
		return polling(jobId);
    }
};

async function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    });
};