import uiReducer from './uiReducer';
import { combineReducers } from 'redux';
const localStoreData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}')
const initialState = {
    isLogedIn: localStoreData.isLogin,
    user: {
        userName: localStoreData.userName || '',
        userCategory: localStoreData.userCategory || '',
        user_id: localStoreData.user_id || '',
        user_org_logo_url: localStoreData.user_org_logo_url || '',
        user_org_name: localStoreData.user_org_name || '',
        user_org_video_url: localStoreData.user_org_video_url || ''
    }
};
const loggedReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                isLogedIn: true
            };
        case 'LOG_OUT':
            return {
                ...state,
                isLogedIn: false
            };
        default:
            return state;
    }
};
export default combineReducers({
    uiReducer: uiReducer,
    login: loggedReducer
}, {});