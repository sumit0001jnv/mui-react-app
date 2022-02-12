const initialState = {
    message: "",
    open: false,
    type: ""
    // successSnackbarOpen: false,
    // errorSnackbarOpen: false,
    // infoSnackbarOpen: false
};
const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW_SNACKBAR":
            return {
                ...initialState,
                type: action.payload.type,
                open: true,
                message: action.payload.message
            };
        case "SNACKBAR_CLEAR":
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default uiReducer;