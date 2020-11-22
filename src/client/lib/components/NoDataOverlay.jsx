import React from 'react';

const NoDataOverlay = ({ message }) => {
    return (
        <div className='no-data-overlay'>{message}</div>
    );
};

export default NoDataOverlay;
