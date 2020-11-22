import { exec as exeCb } from 'child_process';
import { promisify } from 'util';
import * as Commands from '../lib/commands';
import * as JobService from '../services/job_service';
import * as BackupService from '../services/backup_service';

const exec = promisify(exeCb);

export function registerRoutes(router) {
    router.get(
        '/jobs/:id',
        async (req, res, next) => {
            try {
                const jobs = await JobService.getJob({
                    id: req.params.id
                });

                return res.status(200).send(jobs);
            } catch (error) {
                next(error);
            }
        }
    );

	router.get(
		'/backups',
        async (req, res, next) => {
            try {
                const backups = await BackupService.getBackups();

                return res.status(200).send(backups);
            } catch (error) {
                next(error);
            }
        }
    );

    router.get(
        '/last-job',
        async (req, res, next) => {
            try {
                const jobs = await JobService.getLastUpdatedJob();

                return res.status(200).send(jobs);
            } catch (error) {
                next(error);
            }
        }
    );

    router.post(
        '/jobs',
        async (req, res, next) => {
            try {
                const job = await JobService.createJob(
                    {
                        backupName: req.body.backupName,
                        database: req.body.database
                    }
                );

                return res.status(200).send(job);
            } catch (error) {
                next(error);
            }
        }
    );

    router.get(
        '/dump/database/:database/backup/:backup',
        async (req, res) => {
            try {
                await exec(Commands.getDumpDbCommand(req.params.backup, req.params.database));

                return res.status(200).send('done');
            } catch (error) {
                next(error);
            }
        }
    );

	return router;
}
