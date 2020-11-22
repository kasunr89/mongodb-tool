import BackupRestoreEventEmitter from './backup_restore_event_emitter';
import BackupRestoreEventListener from './backup_restore_event_listener';

let eventEmitter = null;

export function registerEvents() {
    eventEmitter = new BackupRestoreEventEmitter();

    eventEmitter.on('restore', BackupRestoreEventListener);
}

export function emitRestoreEvent(data) {
    eventEmitter.emitEvent(data);
}
