import React from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';

import * as MongoBackupApi from '../api';

const TableBody = ({ backups }) => {

    const dispatch = useDispatch();
    const hasActiveJob = useSelector((state) => state.hasActiveJob);

    const pollingCurrentJob = (jobId) => {
        MongoBackupApi.polling(jobId)
                .then((jobData) => {
                    batch(() => {
                        dispatch({
                            type: 'SET_LAST_JOB',
                            payload: {
                                lastJob: jobData
                            }
                        }),
                        dispatch({
                            type: 'UPDATE_ACTIVE_JOB_STATUS',
                            payload: {
                                hasActiveJob: false
                            }
                        })
                    });
                });
    }

    const handleRestoreBackup = async (filename) => {
        if (hasActiveJob) {
            return false;  
        }

        try {
            dispatch({
                type: 'UPDATE_ACTIVE_JOB_STATUS',
                payload: {
                    hasActiveJob: true
                }
            });

            const { data: { id: jobId } } = await MongoBackupApi.addRestoreJob(filename);

            pollingCurrentJob(jobId);
        } catch (e) {
            dispatch({
                type: 'UPDATE_ACTIVE_JOB_STATUS',
                payload: {
                    hasActiveJob: false
                }
            });
        }
    };

    return (
        <tbody>
            {backups.map((data, index) =>
                <tr key={index}>
                    <td>{data.filename}</td>
                    <td>
                        <button 
                            disabled={hasActiveJob ? true : false} 
                            className={hasActiveJob ? 'disabled' : ''} 
                            onClick={() => handleRestoreBackup(data.filename)}>Restore</button>
                    </td>
                </tr>
            )}
        </tbody>  
    );
};

export default TableBody;
