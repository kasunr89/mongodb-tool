import * as sinon from 'sinon';
import BackupRestoreEE from '../../../../src/server/events/backup_restore_event_emitter';

describe('event emitter tests', () => {
	it('if restore event emits then listener will receive payload', async () => {
		const spy = sinon.spy();
		const emitter = new BackupRestoreEE();

		emitter.on('restore', spy);
		emitter.emit('restore', {
			id: 1,
			backupName: '1.archive.gz',
			database: 'locations'
		});

		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, {
			id: 1,
			backupName: '1.archive.gz',
			database: 'locations'
		});
	});
});
