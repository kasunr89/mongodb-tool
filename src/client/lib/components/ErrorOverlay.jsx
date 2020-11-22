import React from 'react';

const ErrorOverlay = ({ error }) => {
    return (
        <div className='error-overlay'>{error}</div>
    );
};

export default ErrorOverlay;
