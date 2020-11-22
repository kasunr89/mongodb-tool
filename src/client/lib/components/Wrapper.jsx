import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import ActiveJobDisplay from './ActiveJobDisplay';
import BackupTable from './BackupTable';
import ErrorOverlay from './ErrorOverlay';
import Loader from './Loader';

import * as MongoBackupApi from '../api';

const Wrapper = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: backups = [] } = await MongoBackupApi.getAllMongoBackups();

                dispatch({
                    type: 'SET_BACKUP_DATA',
                    payload: {
                        backups
                    }
                });

                setIsLoading(false);

            } catch (e) {
                setError(true);
            }
        }
        
        fetchData();
    }, []);

    if (error) {
        return <ErrorOverlay error={'Error occurred when loading backups'} />
    }

    if (isLoading) {
        return <Loader />
    }
    
    return (
        <Fragment>
            <ActiveJobDisplay />
            <BackupTable />
        </Fragment>
    );
};

export default Wrapper;
