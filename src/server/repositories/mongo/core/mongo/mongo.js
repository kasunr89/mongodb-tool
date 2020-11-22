import mongoose from 'mongoose';

export default class Mongo  {

	constructor(hostUri, db) {
        this.hostUri = hostUri;
        this.db = db;
    }

	async connect(hostUri, db) {
		const options = {
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true
        };

		await mongoose.connect(
			this.buildUri(hostUri || this.hostUri, db || this.db),
			options
		);
    }     

	buildUri(hostUri, db) {
		return `${hostUri}/${db}`;
	}
}
