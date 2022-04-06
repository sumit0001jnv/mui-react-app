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
import CustomMuiDialogue from '../../commons/components/custom-mui-dialogue/CustomMuiDialogue';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Divider from '@mui/material/Divider';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function NonInitialQuoteDetail() {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);
    const [isInitialQuote, setIsInitialQuote] = useState(true);
    const [g3Users, setG3Users] = useState([]);
    const [selectedG3Users, setSelectedG3Users] = useState([]);
    const [selectedG3User, setSelectedG3User] = useState({ name: '', id: '' });
    const [loggedInUser, setLoggedInUser] = useState('');
    const [projectId, setProjectId] = useState('');
    const [conversationArr, setConversationArr] = useState([]);
    const [saving, setSaving] = useState(false);
    const [messageObj, setMessageObj] = useState({ message: '', show: false, subject: '' });
    const [attachment, setAttachment] = useState({
        show: false,
        url: ''
    });



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
            setTableData(() => {
                // return getItems(10);
                return (res.data.data || []).map(row => {
                    return {
                        attribute: row.name,
                        value: row.text,
                        id: ID()
                    }
                })
            })

        }).catch(err => {
            console.log(err);
        })

        let url = isInitialQuote ? `http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-g3-user-list` : `http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-project-g3-user-list`
        axios({
            method: 'post',
            url,
            data: { project_id }
        }).then(res => {
            if (res.data.status) {
                let x = res.data.users_list.map(row => { return { id: row[2], name: row[1] } });
                // let x = [{ id: '1', name: 'User1' }, { id: '2', name: 'User2' }, { id: '3', name: 'User 3' },
                // { id: '4', name: 'User 4' }, { id: '5', name: 'User 5' }]
                setG3Users(() => {
                    return [...x];
                })
                // setSelectedG3User(x[0]);
                if (!isInitialQuote) {
                    const user = params.get('g3User') ? JSON.parse(params.get('g3User')) : x[0];
                    if (user) {
                        onG2UserChange(user, project_id, userData.user_id);
                    }
                }
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
            return [{ attribute: '', value: '', id: ID() }, ...data];
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

    function ID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const sendData = () => {
        // console.log(tableData);
        let obj = {};
        setSaving(true);
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
            setSaving(false);

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


    const handleAcceptDeclineReply = (isReply) => {
        history.push({ pathname: '/final-quote-detail', search: `?project_id=${projectId}&g3User=${JSON.stringify(selectedG3User)}&reply=${isReply}` })
    }


    function onG2UserChange(g3User, projId, g2User) {
        setSelectedG3User(() => g3User);
        const project_id = projectId || projId;
        const g2b_user_id = loggedInUser || g2User;
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-project-chat-data',
            data: { project_id: project_id, g2b_user_id, g3_user_id: g3User.id }
        }).then(res => {
            if (res.data.status) {
                setConversationArr(() =>
                    (res.data.message_data || []).map(row => {
                        return { name: row[8], time: row[7], type: row[3] == g2b_user_id ? 'u1' : 'u2', message: row[5], subject: row[4], attachment: row[6] }
                    })
                )
            } else {
                setConversationArr(() => []);
                dispatch(uiAction.showSnackbar({ message: res.data.message || 'No data found', type: 'error' }));
            }
        }).catch(err => {
            console.log(err);
        })

    }

    function onAttachmentClick(attachment) {
        setAttachment({ show: true, url: attachment[0] })
    }
    function onMessageChange(subject, message) {
        setMessageObj({ subject, message, show: true })

    }

    function onSetOpenDialogue(state) {
        setAttachment(() => { return { ...attachment, show: state } });
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            tableData,
            result.source.index,
            result.destination.index
        );

        setTableData(() =>
            items
        );
    }

    function reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: '4px',
        // margin: `0 0 ${4}px 0`,

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "#fff",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "#fff",
        padding: '4px',
        // width: 250,
        // display: 'flex',
        // 'flex-direction': 'column',
        width: '900px',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 310px)',
        height: 'calc(100vh - 310px)',
        flexWrap: 'nowrap',
        overflowY: 'auto'
    });

    return <>
        <Grid container spacing={0} justifyContent={'center'} sx={{ height: 'calc(100vh - 116px)' }}>
            <Grid item container xs={12} md={5} justifyContent={'center'}>
                <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', border: '1px solid #ccc' }}>
                    <Grid container justifyContent={'flex-end'} alignItems={'center'} sx={{ px: 1, py: 2 }}>
                        <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                        <Typography variant='h6' sx={{ ml: 0, mr: 'auto' }}>Quote Requested</Typography>
                        <Autocomplete
                            sx={{ mx: 2, width: 100, flexGrow: 1, height: '40px', maxHeight: '40px' }}
                            size={'small'}
                            disablePortal
                            options={g3Users}
                            getOptionLabel={(option) => option.name}
                            disableClearable
                            defaultValue={g3Users[0]}
                            value={selectedG3User}
                            onChange={(event, newInputValue) => onG2UserChange(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="Insurer" placeholder='Select Insurer' />}
                        />

                    </Grid>

                    <Grid container spacing={0} direction="column" sx={{ maxHeight: 'calc(100vh - 260px)', height: 'calc(100vh - 260px)', flexWrap: 'nowrap', overflowY: 'auto' }}>
                        {selectedG3User.id && conversationArr.length && messageObj.show ?
                            <>
                                <Divider></Divider>
                                <Typography bottomGutter variant="h6" component="div" sx={{ textAlign: 'initial', p: 2 }}>
                                    {messageObj.subject}
                                </Typography>
                                <Divider></Divider>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'initial', p: 2 }}>
                                    {messageObj.message}
                                </Typography>

                            </> : ''}
                    </Grid>
                    <Divider></Divider>
                    <Grid container justifyContent={'flex-end'} sx={{ p: 2 }}>
                        {selectedG3User.id && conversationArr.length ?
                            <>
                                <Button variant='contained' color={'primary'} sx={{ mr: 2 }} onClick={() => handleAcceptDeclineReply(true)}>Reply</Button>
                                <Button variant='contained' color={'primary'} onClick={() => handleAcceptDeclineReply(false)}>Accept/Decline</Button>
                            </> : ''}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={7}>
                <Grid container direction={'column'} className="test" sx={{ height: 'calc(100vh - 120px)', maxHeight: 'calc(100vh - 120px)', overflow: 'auto', flexWrap: 'nowrap' }}>
                    {conversationArr.map((user) => {
                        return <Grid container alignItems={'center'} >
                            <Grid xs={'auto'} item container alignItems={'center'} direction={'row'} sx={{ mr: 'auto' }}>
                                <Box sx={{ ...commonStyles, borderColor: 'primary.main' }} >
                                    {user.name}
                                </Box>
                                <Avatar sx={{ bgcolor: user.type == 'u1' ? deepOrange[500] : deepPurple[500], width: 30, height: 30 }}>{abbreviateWord(user.name)}</Avatar>
                            </Grid>
                            <Grid item container alignItems={'center'} direction='column' xs={'auto'} sx={{ minWidth: '180px', flexGrow: '1 !important', mr: 'auto' }} >
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
                            <Grid item xs={5} sx={{ ...commonStyles, p: 0, p: 1, borderColor: 'primary.main', maxWidth: '355px' }} >
                                <Button size="small" sx={{ mr: 1, my: 1 }} variant='contained' onClick={() => onMessageChange(user.subject, user.message)} > Message</Button>
                                <Button size="small" sx={{ mr: 1, my: 1 }} disabled={!user.attachment || !user.attachment.filter(f => f.endsWith('.pdf')).length} variant='contained' onClick={() => onAttachmentClick(user.attachment)}> PDF({(user.attachment && user.attachment.filter(f => f.endsWith('.pdf')).length) ? 1 : 0})</Button>
                                <Button size="small" sx={{ mr: 1, my: 1 }} disabled={!user.attachment || !user.attachment.filter(f => f.endsWith('.docx')).length} variant='contained' onClick={() => onAttachmentClick(user.attachment)}> Docx({(user.attachment && user.attachment.filter(f => f.endsWith('.docx')).length) ? 1 : 0})</Button>
                                <Button size="small" sx={{ my: 1 }} disabled={!user.attachment || !user.attachment.filter(f => f.endsWith('.excel')).length} variant='contained' onClick={() => onAttachmentClick(user.attachment)}> Excel({(user.attachment && user.attachment.filter(f => f.endsWith('.excel')).length) ? 1 : 0})</Button>
                            </Grid>
                        </Grid>
                    })}
                    {!conversationArr.length ? <Grid container justifyContent={'center'} alignItems={'center'} sx={{ height: '100%' }}>
                        {selectedG3User.id ? 'No data found' : 'Please Select Insurer'}</Grid> : ''}
                </Grid>

            </Grid>
        </Grid>
        <CustomMuiDialogue url={attachment.url} show={attachment.show} onSetOpenDialogue={onSetOpenDialogue}></CustomMuiDialogue>
    </>;
}
