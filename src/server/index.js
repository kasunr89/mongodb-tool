import express from 'express';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../../webpack.config.js';
import { createMongoClient } from './repositories/mongo/core/mongo';
import { registerRoutes } from './routes';
import { registerEvents } from './events/event_emitter';
import { setError } from './routes/error';

const startServer = async function () {
    const app = express();
    app.use(bodyParser.json())

    // setup dev middleware to watch and compile FE changes
    app.use(webpackDevMiddleware(webpack(config), {
        stats: 'minimal',
        publicPath: config.output.publicPath
    }));

    // initialize database connection
    await createMongoClient('backup_info');

    // register event backup event-listeners
    registerEvents();

    // register api routes
    app.use('/api', registerRoutes(express.Router()))

    //  set error middleware
    setError(app);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`App listening to ${PORT}`);
    });
}

startServer();


