import fs from 'fs';
import * as sinon from 'sinon';
import { expect } from 'chai';
import * as BackupService from '../../../../src/server/services/backup_service';


const sandbox = sinon.createSandbox();

describe('backup service tests', () => {
	describe('retrieve backups tests', () => {
		let fsReaddirSyncStub;

		beforeEach(() => {
			fsReaddirSyncStub = sandbox
				.stub(fs, 'readdirSync')
				.callsFake(() => [
					'1001.archive.gz',
					'1002.archive.gz'
				]);
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('if retrieving files successful then return response', async () => {
			const result = await BackupService.getBackups();

			sinon.assert.calledOnce(fsReaddirSyncStub);

			expect(result).to.deep.equal([
				{ filename: '1001.archive.gz' },
  				{ filename: '1002.archive.gz' }
			]);
		});

		it('if no files retrieved then return empty array', async () => {
			fsReaddirSyncStub.callsFake(() => []);

			const result = await BackupService.getBackups();
			
			expect(result).to.deep.equal([]);
		});

		it('if retrieving files failed then throw error', async () => {
			fsReaddirSyncStub.callsFake(() => { throw new Error('error occurred')});

			let error;
			try {
				await BackupService.getBackups();
			} catch(e) {
				error = e;
			}

			expect(error.code).to.eql(500);
			expect(error.message).to.eql('Operation failed');
		});
	});
});
