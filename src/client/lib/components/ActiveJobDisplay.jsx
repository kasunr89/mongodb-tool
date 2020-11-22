import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import Constants from '../constants';
import NoDataOverlay from './NoDataOverlay';

import * as MongoBackupApi from '../api';

const ActiveJobDisplay = () => {

    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const lastJob = useSelector((state) => state.lastJob);

    const pollingLastJob = (id) => {
        dispatch({
            type: 'UPDATE_ACTIVE_JOB_STATUS',
            payload: {
                hasActiveJob: true
            }
        });

        MongoBackupApi.polling(id)
            .then((jobData) => {
                batch(() => {
                    dispatch({
                        type: 'UPDATE_ACTIVE_JOB_STATUS',
                        payload: {
                            hasActiveJob: false
                        }
                    }),
                    dispatch({
                        type: 'SET_LAST_JOB',
                        payload: {
                            lastJob: jobData
                        }
                    })
                });
            });
    }

    useEffect(() => {
        const fetchLastJob = async () => {
            try {
                const { data: lastRestoreJob = null } = await MongoBackupApi.getLastJob();

                if (lastRestoreJob && lastRestoreJob.status) {
                    dispatch({
                        type: 'SET_LAST_JOB',
                        payload: {
                            lastJob: !_.isEmpty(lastRestoreJob) ? lastRestoreJob : null
                        }
                    });

                    setIsLoading(false);

                    if ([Constants.JOB_STATUS.INPROGRESS, Constants.JOB_STATUS.PENDING].includes(lastRestoreJob.status)) {
                        pollingLastJob(lastRestoreJob.id);
                    }
                } else {
                    setIsLoading(false);
                    dispatch({
                        type: 'UPDATE_ACTIVE_JOB_STATUS',
                        payload: {
                            hasActiveJob: false
                        }
                    });
                }
            } catch (e) {
                setError(true);
            }
        }

        fetchLastJob();
    }, []);

    if (isLoading || error) {
        return false;
    }

    if (!lastJob) {
        return <NoDataOverlay message={'No previous restore jobs have been executed'} />;
    } 
    
    return (
        <table className="mongo-tool-table">
            <thead>
                <tr>
                    <th>Last Executed Database Restore</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Backup Name</td>
                    <td>{lastJob.backupName}</td>
                </tr>
                <tr>
                    <td>Executed At</td>
                    <td>{moment.unix(lastJob.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td>{lastJob.status}</td>
                </tr>
            </tbody> 
        </table>
    );
};

export default ActiveJobDisplay;
