import { useState, useEffect } from 'react';
import axios from 'axios';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../../commons/components/header/Header';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
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
import { deepOrange, deepPurple } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function G2bLandingPage() {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);
    const [conversationArr, setConversationArr] = useState([
        { name: 'Mike', time: '5th march 2022, 01:30', type: 'u1' },
        { name: 'Anish', time: '6th march 2022, 01:30', type: 'u2' },
        { name: 'Mike', time: '7th march 2022, 11:20', type: 'u1' },
        { name: 'Anish', time: '8th march 2022, 11:40', type: 'u2' }]);

    const columns = [
        {
            field: 'attribute',
            headerName: 'Attribute',
            flex: 5
        },
        {
            field: 'value',
            headerName: 'Value',
            flex: 6
        },
        {
            field: 'action',
            headerName: '',
            flex: 1
        },
    ];
    useEffect(() => {
        const search = location.search; // could be '?foo=bar'
        const params = new URLSearchParams(search);
        const project_id = params.get('project_id'); // bar

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/extract-data',
            data: { project_id }
        }).then(res => {
            console.log(res.data);
            setTableData(() => {
                return res.data.data.map(row => {
                    return {
                        attribute: row.name,
                        value: row.text
                    }
                })
            })

        }).catch(err => {
            console.log(err);
        })

    }, []);
    const addRow = () => {
        setTableData((data) => {
            return [{ attribute: '', value: '' }, ...data];
        })
    }

    const removeRow = (index) => {
        setTableData((data) => {
            data.splice(index, 1)
            return [...data];
        })
    }

    const handleText = (event, rowIndex, field) => {
        setTableData((data) => {
            data[rowIndex][field] = event.target.value;
            return [...data];
        })
    }

    const sendData = () => {
        console.log(tableData);
        dispatch(uiAction.showSnackbar({ message: 'Quote sent successfully' }));
    }

    const navigateBack = () => {
        history.push('/g2b-user')
    }
    const commonStyles = {
        bgcolor: 'background.paper',
        m: 1,
        border: '1px dashed',
        padding: '8px 16px',
        borderRadius: 2
    };

    const abbreviateWord = (word = '') => {
        let abbrWord = ''
        word.split(" ").forEach(w => abbrWord = abbrWord + (w[0] || '').toUpperCase());
        return abbrWord;
    }


    return <>
        {/* <ThemeProvider theme={theme}> */}
        <Header hideNotification></Header>
        <Item sx={{ m: 2, px: 2, }}>
            <Grid container spacing={0} justifyContent={'center'} sx={{ height: 'calc(100vh - 116px)' }}>
                <Grid item xs={12} md={5}>
                    <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', border: '1px solid #ccc' }}>
                        <Grid container justifyContent={'flex-end'} alignItems={'center'} sx={{ p: 2 }}>
                            <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                            <Typography variant='h6' sx={{ ml: 1, mr: 'auto' }}>Create Template</Typography>
                            <Button variant='contained' onClick={addRow}>Add</Button>
                        </Grid>
                        <Grid container justifyContent={'center'}>
                            {columns.map((col) => {
                                return <>
                                    <Grid item xs={col.flex} sx={{ p: 2, borderBottom: '1px solid #ccc', bgcolor: "turquoise" }}>
                                        <div style={{ fontWeight: 600 }}>{col.headerName}</div>
                                    </Grid>
                                </>
                            })}
                        </Grid>
                        <Grid container spacing={0} direction="column" sx={{ width: '900px', maxWidth: '100%', maxHeight: 'calc(100vh - 310px)', height: 'calc(100vh - 310px)', flexWrap: 'nowrap', overflowY: 'auto' }}>
                            {tableData.map((row, i) => {
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
                        <Grid container justifyContent={'flex-end'} sx={{ p: 2 }}>
                            <Button variant='contained' color={'success'} onClick={sendData}>Send</Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Grid container direction={'column'}>
                        {conversationArr.map((user) => {
                            return <Grid container alignItems={'center'} >
                                <Box sx={{ ...commonStyles, borderColor: 'primary.main' }} >
                                    {user.name}
                                </Box>
                                <Avatar sx={{ bgcolor: user.type == 'u1' ? deepOrange[500] : deepPurple[500], width: 30, height: 30 }}>{abbreviateWord(user.name)}</Avatar>
                                <Grid item alignItems={'center'} direction='column' sx={{ flexGrow: 1 }} >
                                    <div style={{
                                        lineHeight: 0
                                    }}>
                                        {user.time}

                                    </div>
                                    <div className='add-pseudo' style={{ 'display': 'flex', alignItems: 'center', width: '100%', }}>
                                        <div style={{
                                            width: '100%', borderBottom: '1px solid #ccc'
                                        }} />
                                    </div>
                                </Grid>

                                <Box sx={{ ...commonStyles, borderColor: 'primary.main' }} >
                                    <Button variant='contained' sx={{ mr: 1 }}> Message</Button>
                                    <Button variant='contained'> Attachment</Button>
                                </Box>


                                {/* <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar> */}
                            </Grid>
                        })}
                    </Grid>

                </Grid>
            </Grid>
        </Item>


        {/* </ThemeProvider> */}

    </>;
}
