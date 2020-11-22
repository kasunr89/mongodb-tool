import * as sinon from 'sinon';
import { expect } from 'chai';
import * as JobRepository from '../../../../src/server/repositories/mongo/job_repository';
import * as model from '../../../../src/server/repositories/mongo/core/mongo/schemas/job';

const sandbox = sinon.createSandbox();

describe('job repository tests', () => {
	describe('create job repository tests', () => {
		let modelStub;

		const jobResponse = {
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		};

		beforeEach(() => {
			modelStub = sandbox
				.stub(model, 'getModel')
				.callsFake(() => {
					return {
						create: () => {
							return {
								...jobResponse,
								_id: 1
							}
						}
					}
				});
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if create job successful then return response', async () => {
			const result = await JobRepository.createJob(jobResponse);

			sinon.assert.calledOnce(modelStub);

			expect(result).to.deep.equal({
				...jobResponse,
				_id: 1
			});
		});
	});

	describe('retrieve job repository tests', () => {
		let modelStub;

		const jobResponse = {
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		};

		beforeEach(() => {
			modelStub = sandbox
				.stub(model, 'getModel')
				.callsFake(() => {
					return {
						findById: () => {
							return {
								...jobResponse,
								_id: 1
							}
						}
					}
				});
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if retrieved job successful then return response', async () => {
			const result = await JobRepository.getJobById(1);

			sinon.assert.calledOnce(modelStub);

			expect(result).to.deep.equal({
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				_id: 1
			});
		});

		it('if not retrieved a job then throw error', async () => {
			modelStub.callsFake(() => {
				return {
					findById: () => {
						return null
					}
				}
			});

			let error;
			try {
				const result = await JobRepository.getJobById(1);
			} catch (e) {
				error = e;
			}

			expect(error.code).to.eql(404);
			expect(error.message).to.eql('Job not found');
		});
	});

	describe('update job repository tests', () => {
		let modelStub;

		const jobResponse = {
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		};

		beforeEach(() => {
			modelStub = sandbox
				.stub(model, 'getModel')
				.callsFake(() => {
					return {
						updateOne: () => {
							return {
								...jobResponse,
								_id: 1
							}
						}
					}
				});
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if update job successful then return response', async () => {
			const result = await JobRepository.updateJob(jobResponse);

			sinon.assert.calledOnce(modelStub);

			expect(result).to.deep.equal({
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				_id: 1,
			});
		});
	});

	describe('retrieve last updated job repository tests', () => {
		let modelStub;

		const jobResponse = [{
			_id: 1,
			backupName: '1.archive.gz',
			database: 'locations',
			status: 'pending',
			createdAt: 10313100310,
			updatedAt: 10313100310
		}];

		beforeEach(() => {
			modelStub = sandbox
				.stub(model, 'getModel')
				.callsFake(() => {
					return {
						find: () => {
							return {
								sort: () => {
									return {
										limit: () => {
											return jobResponse
										}
									}
								}
							}
						},
						
					}
				});
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if retrieved last updated job successful then return response', async () => {
			const result = await JobRepository.getLastUpdatedJob();

			sinon.assert.calledOnce(modelStub);

			expect(result).to.deep.equal([{
				backupName: '1.archive.gz',
				database: 'locations',
				status: 'pending',
				createdAt: 10313100310,
				updatedAt: 10313100310,
				_id: 1
			}]);
		});
	});
});
