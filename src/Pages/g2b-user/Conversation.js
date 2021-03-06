import { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import EmailCard from './EmailCard';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import uiAction from '../../store/actions/uiAction';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { multiLineEllipsis, stringAvatar } from '../../utility/helper'

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: 0,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default function Conversation(props) {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [chatUsers, setChatUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [projectId, setProjectId] = useState('');
    const [selectedG3User, setSelectedG3User] = useState({ name: '', id: '' });
    const [projectStatus, setProjectStatus] = useState('');
    // const [chatUsers, setChatUsers] = useState([{
    //     id: generateID(), name: 'Jenifer Fritz', descrpition: 'I am a developer', time: '3:15 PM'
    // },
    // {
    //     id: generateID(), name: 'Laney Gray', descrpition: 'I am looking for designer', time: '5:15 PM'
    // }, {
    //     id: generateID(), name: 'Oscar Thomsan', descrpition: 'Responding', time: '11:15 PM'
    // }, {
    //     id: generateID(), name: 'Kendra Lord', descrpition: 'Five short years at MIT', time: '21 Jan'
    // }, {
    //     id: generateID(), name: 'Gatlin Huber', descrpition: 'Working the way developers work | Working the way developers work', time: '01 Jan'
    // }, {
    //     id: generateID(), name: 'Timothy Gunter', descrpition: 'Full stack developer', time: '31 Dec'
    // }, {
    //     id: generateID(), name: 'Jahlil Kyle', descrpition: 'Career path', time: '20 Dec'
    // }]);
    const [chats, setChats] = useState([
        //     {
        //     name: chatUsers[0].name,
        //     subject: 'Hi Sir',
        //     message: 't has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,'
        // }
    ])

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
                setChats(() =>
                    (res.data.message_data || []).map(row => {
                        return { name: row[9], time: row[7], type: row[3] == g2b_user_id ? 'u1' : 'u2', message: row[5], subject: row[4], attachments: { pdf: (row[6] || []).filter(f => f.endsWith('.pdf')), excel: (row[6] || []).filter(f => f.endsWith('.excel')), docx: (row[6] || []).filter(f => f.endsWith('.docx')) } }
                    })
                )
            } else {
                setChats(() => []);
                dispatch(uiAction.showSnackbar({ message: res.data.message || 'No data found', type: 'error' }));
            }
        }).catch(err => {
            console.log(err);
        })

    }

    useEffect(() => {
        const search = location.search; // could be '?foo=bar'
        const params = new URLSearchParams(search);
        const project_id = params.get('project_id'); // bar
        const isInitialQuote = params.get('isInitialQuote') === 'true'; // bar
        setProjectStatus(params.get('status') || '');
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        setLoggedInUser(userData.user_id || '');


        setProjectId(() => project_id);

        let url = isInitialQuote ? `http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-g3-user-list` : `http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-project-g3-user-list`
        axios({
            method: 'post',
            url,
            data: { project_id }
        }).then(res => {
            if (res.data.status) {
                let x = res.data.users_list.map(row => { return { id: row[2], name: row[1], descrpition: row[0], time: '3:15 PM' } });
                // id: generateID(), name: 'Jenifer Fritz', descrpition: 'I am a developer', time: '3:15 PM'
                // let x = [{ id: '1', name: 'User1' }, { id: '2', name: 'User2' }, { id: '3', name: 'User 3' },
                // { id: '4', name: 'User 4' }, { id: '5', name: 'User 5' }]
                setChatUsers(() => {
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

        }).catch(err => {
            console.log(err);
        })

    }, []);
    


    const navigateBack = () => {
        history.push('/g2b-user')
    }
    const handleAcceptDeclineReply = (isReply) => {
        history.push({ pathname: '/final-quote-detail', search: `?project_id=${projectId}&g3User=${JSON.stringify(selectedG3User)}&reply=${isReply}` })
    }
    function submitForm(event) {
        event.preventDefault();
        console.log(event.target[0].value);
        const searchUser = event.target[0].value;
        setSearchUsers(() => chatUsers.filter(user => user.name.toLowerCase().includes(searchUser.toLowerCase())));

    }
    const getColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Declined':
                return 'error';
            case 'Quote Requested':
                return 'primary';
            default:
                return 'error';

        }
    }
    return (
        <Fragment>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, m: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} >
                        <Item>
                            <Grid contaniner direction={'column'} >
                                <Box
                                    component="form"
                                    sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                                        <KeyboardBackspaceIcon />
                                    </IconButton>
                                    <Typography variant='h6' sx={{ ml: 0, mr: 'auto' }}>Insurer Response</Typography>
                                    <Chip label={projectStatus || 'Pending'} color={getColor(projectStatus)} size="small" sx={{ width: '120px' }} />
                                </Box>
                                <Divider></Divider>
                                <Box
                                    component="form"
                                    sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                                    onSubmit={submitForm}
                                >

                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search"
                                        inputProps={{ 'aria-label': 'Search' }}
                                        size={'small'}
                                    />
                                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </Box>
                                <Divider></Divider>
                                <Grid direction={'column'} sx={{ maxHeight: 'calc(100vh - 218px)', height: 'calc(100vh - 218px)', flexWrap: 'nowrap', overflowY: 'auto' }}>
                                    {(searchUsers || chatUsers).map(user => {
                                        return <>
                                            <Stack direction="row" spacing={2} sx={{ p: 2, cursor: 'pointer', bgcolor: user.id === selectedG3User.id ? '#f3e5f5' : '' }} key={user.id} onClick={() => onG2UserChange(user, projectId, loggedInUser)}>
                                                {/* <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar> */}
                                                <Avatar {...stringAvatar(user.name)} />
                                                <Stack item direction="column" sx={{ width: '100%', maxWidth: 'calc(100% - 57px)' }} alignItems={'center'}>
                                                    <Grid container direction={'row'}>
                                                        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1, mr: 'auto', textAlign: 'initial' }}>
                                                            {user.name}
                                                        </Typography>
                                                        {/* <Typography variant="caption" display="block" sx={{ maxWidth: '60px' }} >
                                                            {user.time}
                                                        </Typography> */}
                                                    </Grid>
                                                    <Grid container direction={'row'}>
                                                        <div sx={{ mt: 0, textAlign: 'initial', ...multiLineEllipsis }}>
                                                            {user.descrpition}
                                                        </div>
                                                    </Grid>
                                                </Stack>
                                                <img
                                                    src={`/images/test.logo.svg`}
                                                    width={40}
                                                    alt={'org demo'}
                                                    loading="lazy"
                                                />
                                            </Stack>
                                            <Divider></Divider>
                                        </>
                                    })}
                                </Grid>

                            </Grid>
                        </Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>
                            <Grid contaniner direction={'column'}>
                                <Grid direction={'column'} sx={{ maxHeight: 'calc(100vh - 164px)', height: 'calc(100vh - 164px)', flexWrap: 'nowrap', overflowY: 'auto' }}>
                                    {chats.map((user, index) => <EmailCard user={user} expanded={index === 0} />)}
                                </Grid>
                                <Item>
                                    <Grid container justifyContent={'flex-end'} sx={{ p: 2 }}>
                                        <Button disabled={!(selectedG3User.id && chats.length)} variant='contained' color={'primary'} size={'small'} sx={{ mr: 2 }} onClick={() => handleAcceptDeclineReply(true)}>Reply</Button>
                                        <Button disabled={!(selectedG3User.id && chats.length)} variant='contained' color={'primary'} size={'small'} onClick={() => handleAcceptDeclineReply(false)}>Accept/Decline</Button>
                                    </Grid>
                                </Item>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    );
}