import { useState, useEffect } from 'react';
import axios from 'axios';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../../commons/components/header/Header';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import uiAction from '../../store/actions/uiAction';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Typography from '@mui/material/Typography';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



export default function CustomActionList(props) {

    const columns = useState(props.columns || []);
    const tableData = useState(props.tableData || []);
    const handleText = (event, rowIndex, field) => {
        // props.setTableData((data) => {
        let data = tableData;
        data[rowIndex][field] = event.target.value;
        return [...data];
        // })
    }

    const addRow = () => {
        // props.setTableData((data) => {
        return [{attribute: '', value: '' }, ...tableData];
        // })
    }

    const removeRow = (index) => {
        // props.setTableData((data) => {
        let data = tableData;
        data.splice(index, 1)
        return [...data];
        // })
    }

    const sendData = () => {
    }

    return <Grid container spacing={0} justifyContent={'center'} sx={{ height: '100%', px: 1 }}>
        <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', border: '1px solid #ccc' }}>
            <Grid container justifyContent={'center'}>
                {(props.columns || []).map((col) => {
                    return <>
                        <Grid item xs={col.flex} sx={{ p: 2, borderBottom: '1px solid #ccc', bgcolor: "turquoise" }}>
                            <div style={{ fontWeight: 600 }}>{col.headerName}</div>
                        </Grid>
                    </>
                })}
            </Grid>
            <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', maxHeight: 'calc(100% - 118x)', height: 'calc(100% - 118px)', flexWrap: 'nowrap', overflowY: 'auto' }}>
                {(tableData || []).map((row, i) => {
                    return <>
                        <Grid container justifyContent={'center'}>
                            {columns.map((col, index) => {
                                return <>
                                    <Grid item xs={col.flex} sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
                                        {index == 2 ? <IconButton color="error" aria-label="add an alarm" onClick={() => removeRow(i)}>
                                            <DeleteIcon />
                                        </IconButton> : <TextField id="outlined-size-normal" size={'small'} value={row[col.field]} onChange={(event) => handleText(event, i, col.field)} sx={{ width: '100%', color: "#ccc" }} />}
                                    </Grid>
                                </>
                            })}
                        </Grid>
                    </>
                })}
            </Grid>
            <Grid container justifyContent={'flex-end'} sx={{ p: 1 }}>
                <Button variant='contained' color={'success'} onClick={sendData} sx={{ mr: 2 }}>{props.actionBtnText || "Send"}</Button>
            </Grid>
        </Grid>
    </Grid>
}