import { useState, useEffect } from 'react';
import axios from 'axios';
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
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';


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
    const [isInitialQuote, setIsInitialQuote] = useState(false);
    const [g3Users, setG3Users] = useState([]);
    const [selectedG3Users, setSelectedG3Users] = useState([]);
    const [selectedG3User, setSelectedG3User] = useState({});
    const [loggedInUser, setLoggedInUser] = useState('');
    const [projectId, setProjectId] = useState('');
    const [conversationArr, setConversationArr] = useState([
        { name: 'Mike', time: '5th march 2022, 01:30', type: 'u1' },
        { name: 'Anish', time: '6th march 2022, 01:30', type: 'u2' },
        { name: 'Mike', time: '7th march 2022, 11:20', type: 'u1' },
        { name: 'Anish', time: '8th march 2022, 11:40', type: 'u2' }]);


    useEffect(() => {
        const search = location.search; // could be '?foo=bar'
        const params = new URLSearchParams(search);
        const project_id = params.get('project_id'); // bar
        const isInitialQuote = params.get('isInitialQuote') === 'true'; // bar
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        setLoggedInUser(userData.user_id || '');

        setIsInitialQuote(() => isInitialQuote);

        setProjectId(() => project_id);

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

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-g3-user-list',
            data: { project_id }
        }).then(res => {
            if (res.data.status) {
                let x = res.data.users_list.map(row => { return { id: row[0], name: row[1] } });
                // let x = [{ id: '1', name: 'User1' }, { id: '2', name: 'User2' }, { id: '3', name: 'User 3' },
                // { id: '4', name: 'User 4' }, { id: '5', name: 'User 5' }]
                setG3Users(() => {
                    return [...x];
                })
            }
            // setTableData(() => {
            //     return res.data.data.map(row => {
            //         return {
            //             attribute: row.name,
            //             value: row.text
            //         }
            //     })
            // })

        }).catch(err => {
            console.log(err);
        })

    }, []);
    const addRow = () => {
        setTableData((data) => {
            return [{ attribute: '', value: '' }, ...data];
        })
    }

    const columns = [
        {
            field: 'attribute',
            headerName: 'Attribute',
            flex: 5
        },
        {
            field: 'value',
            headerName: 'Value',
            flex: 5
        },
        {
            field: 'action',
            headerName: <IconButton color="secondary" aria-label="upload picture" sx={{ p: 0 }} component="span" onClick={addRow}>
                <AddIcon />
            </IconButton>,
            flex: 2
        },
    ];

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
        // console.log(tableData);
        let obj = {};
        tableData.forEach(row => {
            obj[row.attribute] = row.value;
        })
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/send-new-quote',
            data: { project_id: projectId, g3_user_list: selectedG3Users.map(row => row.id), project_data: obj }
        }).then(res => {
            if (res.data.status) {
                dispatch(uiAction.showSnackbar({ message: res.data.message || 'New Quote sent to Insurers successfully.', type: 'success' }));
            } else {
                dispatch(uiAction.showSnackbar({ message: res.data.message || 'Fail to save quote', type: 'error' }));
            }

        }).catch(err => {
            console.log(err);
            dispatch(uiAction.showSnackbar({ message: err.message || 'Fail to save quote', type: 'error' }));
        })
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

    const handleAccept = (isAccepted) => {
        console.log(isAccepted);
    }


    const onG2UserChange = (g3User) => {
        setSelectedG3User(() => g3User);
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-project-chat-data',
            data: { project_id: projectId, g2b_user_id: loggedInUser, g3_user_id: g3User.id }
        }).then(res => {

            console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }



    return <>
        <Header hideNotification></Header>
        <Item sx={{ m: 2, px: 2, }}>
            <Grid container spacing={0} justifyContent={'center'} sx={{ height: 'calc(100vh - 116px)' }}>
                <Grid item container xs={12} md={isInitialQuote ? 12 : 5} justifyContent={'center'}>
                    <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', border: '1px solid #ccc' }}>
                        <Grid container justifyContent={'flex-end'} alignItems={'center'} sx={{ px: 1, py: 2 }}>
                            <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                            <Typography variant='h6' sx={{ ml: 0, mr: 'auto' }}>Quote Requested</Typography>

                            {!isInitialQuote ? <><Autocomplete
                                sx={{ mx: 2, width: 100, flexGrow: 1, height: '40px', maxHeight: '40px' }}
                                size={'small'}
                                disablePortal
                                options={g3Users}
                                getOptionLabel={(option) => option.name}
                                disableClearable
                                defaultValue={g3Users[0]?.name}
                                onChange={(event, newInputValue) => onG2UserChange(newInputValue)}
                                renderInput={(params) => <TextField {...params} label="Group 3 Users" placeholder='Select Group 3 user' />}
                            />
                            </> : ''
                            }
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
                            {isInitialQuote ? <><Autocomplete
                                sx={{ mr: 2, width: 200, flexGrow: 1, height: '40px', maxHeight: '40px' }}
                                size={'small'}
                                disablePortal
                                multiple
                                id="multiple-limit-tags"
                                limitTags={2}
                                options={g3Users}
                                getOptionLabel={(option) => option.name}
                                disableClearable
                                onChange={(event, newInputValue) => {
                                    setSelectedG3Users(() => [...newInputValue])
                                }}
                                renderInput={(params) => <TextField {...params} label="Group 3 Users" placeholder='Select Group 3 user' />}
                            />
                                <Button variant='contained' color={'success'} onClick={sendData}>Send</Button></> :
                                <>
                                    <Button variant='contained' color={'primary'} sx={{ mr: 2 }} onClick={() => handleAccept(false)}>Decline</Button>
                                    <Button variant='contained' color={'primary'} onClick={() => handleAccept(true)}>Accept</Button>
                                </>}

                        </Grid>
                    </Grid>
                </Grid>
                {!isInitialQuote ? <>
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

                    </Grid></> : ''}
            </Grid>
        </Item>
    </>;
}
