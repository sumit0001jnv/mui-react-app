const showSnackbar = (userObj) => {
    return {
        type: "SHOW_SNACKBAR",
        payload: userObj
    }
}

const clearSnackBar = () => {
    return {
        type: "SNACKBAR_CLEAR"
    }
}

export default {
    showSnackbar,
    clearSnackBar
} 