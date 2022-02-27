import uiReducer from './uiReducer';
import {  combineReducers } from 'redux';
const initialState = {
    isLogedIn: false,
    user: {
        userName: "",
        userCategory: '',
        user_id: '',
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