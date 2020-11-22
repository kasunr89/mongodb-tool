import React, { Fragment } from 'react';
import Wrapper from './lib/components/Wrapper';

import './App.css';

const App = () => {
    return (
        <div className={'container'}>
            <div className='tool-title'>Mongo Database Tool</div>
            <div className='backup-table-section'>
                <Wrapper />
            </div>
        </div>
    );
}

export default App;
