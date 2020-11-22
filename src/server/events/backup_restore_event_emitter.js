const { EventEmitter } = require('events');

export default class BackupRestoreEventEmitter extends EventEmitter {
    constructor() {
        super();
    }

    emitEvent(job) {
        this.emit('restore', job);
    }
}
