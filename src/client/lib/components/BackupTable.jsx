import React from 'react';
import { useSelector } from 'react-redux';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import NoDataOverlay from './NoDataOverlay';

const BackupTable = () => {
    const backups = useSelector(state => state.backups);

    if (backups && !backups.length) {
        return <NoDataOverlay message={'No backups available to restore'} />
    }

    return (
        <table className="mongo-tool-table">
            <TableHeader />
            <TableBody backups={backups} />
        </table>
    );
};

export default BackupTable;
