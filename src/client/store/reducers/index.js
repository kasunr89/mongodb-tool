const initialState = {
    backups: [],
    lastJob: null,
    hasActiveJob: false
}

export default function reducer(state = initialState, action) {

	if (action.type === 'SET_BACKUP_DATA') {
		return {
            ...state,
            backups: action.payload.backups
        };
    }

    if (action.type === 'UPDATE_ACTIVE_JOB_STATUS') {
        return {
			...state,
            hasActiveJob: action.payload.hasActiveJob
        };
    }

    if (action.type === 'SET_LAST_JOB') {
        return {
			...state,
            lastJob: action.payload.lastJob
        };
    }
    
    return state;
};