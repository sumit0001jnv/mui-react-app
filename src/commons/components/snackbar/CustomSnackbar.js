import Snackbar from "@mui/material/Snackbar";
import { useState, useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import MuiAlert from '@mui/material/Alert';
import uiAction from '../../../store/actions/uiAction';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function CustomSnackbar(props) {
    const uiReducer = useSelector(state => state.uiReducer);
    const dispatch = useDispatch();
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(uiAction.clearSnackBar())
    };
    return <Snackbar open={uiReducer.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={uiReducer.type || 'info'} sx={{ width: '100%' }}>
            {uiReducer.message}
        </Alert>
    </Snackbar>
}