import * as sinon from 'sinon';
import { expect } from 'chai';
import { NotFoundError } from '../../../../src/server/lib/error-handler';
import * as JobService from '../../../../src/server/services/job_service';
import * as JobRepository from '../../../../src/server/repositories/mongo/job_repository';
import * as EventEmitter from '../../../../src/server/events/event_emitter';

const sandbox = sinon.createSandbox();

describe('job service tests', () => {
	describe('create job service tests', () => {
		let jobRepositoryCreateJobStub;
		let eventEmitterStub;
		const jobPayload = {
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		};

		beforeEach(() => {
			jobRepositoryCreateJobStub = sandbox
				.stub(JobRepository, 'createJob')
				.callsFake(() => Promise.resolve({
					...jobPayload,
					_id: 1,
				}));

			eventEmitterStub = sandbox
				.stub(EventEmitter, 'emitRestoreEvent')
				.callsFake(() => {});
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if create job successful then return response', async () => {
			const result = await JobService.createJob({
				backupName: '1.archive.gz',
				database: 'locations'
			});

			sinon.assert.calledOnce(jobRepositoryCreateJobStub);
			sinon.assert.calledOnce(eventEmitterStub);
			sinon.assert.calledWith(eventEmitterStub, {
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				id: 1,
			});

			expect(result).to.deep.equal({
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				id: 1
			});
		});

		it('if create job repository failed throw error', async () => {
			jobRepositoryCreateJobStub.callsFake(() => Promise.reject('error occurred'));

			let error;
			try {
				await JobService.createJob({
					backupName: '1.archive.gz',
					database: 'locations'
				});
			} catch(e) {
				error = e;
			}

			sinon.assert.notCalled(eventEmitterStub);
			expect(error.code).to.eql(500);
			expect(error.message).to.eql('Operation failed');
		});

		it('if emit event failed throw error', async () => {
			eventEmitterStub.callsFake(() => { throw new Error('error occurred')});

			let error;
			try {
				await JobService.createJob({
					backupName: '1.archive.gz',
					database: 'locations'
				});
			} catch(e) {
				error = e;
			}

			expect(error.code).to.eql(500);
			expect(error.message).to.eql('Operation failed');
		});
	});

	describe('retrieve job service tests', () => {
		let jobRepositoryGetJobStub;
		const jobPayload = {
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		};

		beforeEach(() => {
			jobRepositoryGetJobStub = sandbox
				.stub(JobRepository, 'getJobById')
				.callsFake(() => Promise.resolve({
					...jobPayload,
					_id: 1
				}));
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if retrieve job successful then return response', async () => {
			const result = await JobService.getJob({
				id: 1
			});

			sinon.assert.calledOnce(jobRepositoryGetJobStub);
			sinon.assert.calledOnceWithExactly(jobRepositoryGetJobStub, 1);

			expect(result).to.deep.equal({
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				id: 1
			});
		});

		it('if retrieve job repository failed throw error', async () => {
			jobRepositoryGetJobStub.callsFake(() => Promise.reject('error occurred'));

			let error;
			try {
				await JobService.getJob({
					id: 1
				});
			} catch(e) {
				error = e;
			}

			expect(error.code).to.eql(500);
			expect(error.message).to.eql('Operation failed');
		});

		it('if job not found then throw error', async () => {
			jobRepositoryGetJobStub.callsFake(() => Promise.reject(new NotFoundError('job not found')));

			let error;
			try {
				await JobService.getJob({
					backupName: '1.archive.gz',
					database: 'locations'
				});
			} catch(e) {
				error = e;
			}

			expect(error.code).to.eql(404);
			expect(error.message).to.eql('job not found');
		});
	});

	describe('retrieve last updated job service tests', () => {
		let jobRepositoryGetLastJobStub;
		const jobPayload = {
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		};

		beforeEach(() => {
			jobRepositoryGetLastJobStub = sandbox
				.stub(JobRepository, 'getLastUpdatedJob')
				.callsFake(() => Promise.resolve([{
					...jobPayload,
					_id: 1
				}]));
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if retrieve last updated job successful then return response', async () => {
			const result = await JobService.getLastUpdatedJob();

			sinon.assert.calledOnce(jobRepositoryGetLastJobStub);

			expect(result).to.deep.equal({
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				id: 1
			});
		});

		it('if retrieve last updated job repository failed throw error', async () => {
			jobRepositoryGetLastJobStub.callsFake(() => Promise.reject('error occurred'));

			let error;
			try {
				await JobService.getLastUpdatedJob();
			} catch(e) {
				error = e;
			}

			expect(error.code).to.eql(500);
			expect(error.message).to.eql('Operation failed');
		});

		it('if not jobs available then return empty object', async () => {
			jobRepositoryGetLastJobStub.callsFake(() => Promise.resolve([]));

			const result = await JobService.getLastUpdatedJob();

			sinon.assert.calledOnce(jobRepositoryGetLastJobStub);

			expect(result).to.deep.equal({});
		});
	});
});
