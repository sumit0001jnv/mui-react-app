
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import uiAction from '../../store/actions/uiAction';
import Header from '../../commons/components/header/Header';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLocation } from "react-router-dom";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import IconButton from '@mui/material/IconButton';
import ImageIcon from '@mui/icons-material/Image';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { a11yProps, TabPanel } from '../../commons/components/tab-panel/TabPanel';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export default function Setting(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [tableData, setTableData] = useState([{ title: 'Application Title', key: 'org_name', value: 'Sielo App' },
    { title: 'Application Logo', key: 'org_logo', value: '' },
    { title: 'Application Homepage Video', key: 'org_video', value: '' }
    ]);

    const [cedantData, setCedant] = useState({ email_subject: '', email_greeting: '', email_body: '' });
    const [insurerData, setInsurerData] = useState([
        { email_subject: '', email_greeting: '', email_body: '' },
        { email_subject: '', email_greeting: '', email_body: '' },
        { email_subject: '', email_greeting: '', email_body: '' },
        { email_subject: '', email_greeting: '', email_body: '' }]);


    const [image, setImage] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState('');

    const [tabIndex, setTabIndex] = useState(0);
    const [horizontalTabIndex, setHorizontalTabIndex] = useState(0);

    const handleTabChange = (event, newValue, type = 'vertical') => {
        if (type === 'vertical') {
            setTabIndex(newValue);
        } else {
            setHorizontalTabIndex(newValue);
        }
    };


    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        setVideo(userData.user_org_video_url || '');
        setImage(userData.user_org_logo_url || '');
        setUserId(userData.user_id || '');
        // if (userData.user_org_logo_url && userData.user_org_video_url) {
        //     setTableData((data) => {
        //         data[1].value = userData.user_org_logo_url;
        //         data[2].value = userData.user_org_video_url;
        //         return [...data];
        //     })
        // }
    }, [])
    const handleText = (value, rowIndex) => {
        setTableData((data) => {
            data[rowIndex].value = value;
            return [...data];
        })
    }

    const handleCedant = (value, key) => {
        setCedant((data) => {
            return { ...data, [key]: value };
        })
    }
    const handleInsurer = (value, index, key) => {
        setInsurerData((data) => {
            data[index][key] = value;
            return [...data];
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        let bodyFormData = new FormData();
        tableData.forEach(row => {
            bodyFormData.append([row.key], row.value);
        })
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        bodyFormData.append('user_id', userData.user_id);
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-org-data',
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            console.log(res);
            setLoading(false);
            dispatch(uiAction.showSnackbar({ type: 'success', message: res.data?.message || 'User setting updated successfully' }));
        }).catch(err => {
            console.log(err);
            setLoading(false);
            dispatch(uiAction.showSnackbar({ type: 'error', message: 'Something went wrong.Please try after some time' }));
        });
    }
    const handleInput = (event, type) => {
        const file = event.target.files[0];
        if (type === 'img') {
            setTableData((data) => {
                data[1].value = file;
                return [...data];
            })
            setImage(URL.createObjectURL(file));
        } else {
            setTableData((data) => {
                data[2].value = file;
                return [...data];
            })
            setTimeout(() => {
                setVideo(() => URL.createObjectURL(file))
            }, 1000)
            setVideo(() => '')

        }
    }
    const navigateBack = () => {
        history.push('/admin')
    }

    const handleUpdate = (index) => {
        setLoading(true);
        let url = '';
        let data = {
            user_id: userId
        };
        switch (index) {
            case -1: {
                url = 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-g1-user-acknowledgement-email';
                data={...data,...cedantData}
                break;
            }
            case 0: {
                url = 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-g3-user-initial-quote-email'
                break
            }
            case 1: {
                url = 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-g3-user-negotiation-reply-email'
                break
            }
            case 2: {
                url = 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-g3-user-quote-accept-email'
                break
            }
            case 3: {
                url = 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-g3-user-quote-decline-email'
                break
            }
        }


        if (index !== -1) {
            data = { ...data, ...insurerData[index] }
        }


        if (url) {
            axios({
                method: 'post',
                url,
                data
            }).then(res => {
                console.log(res);
                setLoading(false);
                dispatch(uiAction.showSnackbar({ type: 'success', message: res.data?.message || '' }));
            }).catch(err => {
                console.log(err);
                setLoading(false);
                dispatch(uiAction.showSnackbar({ type: 'error', message: 'Something went wrong.Please try after some time' }));
            });
        }
    }

    return <> <Header></Header>
        <Grid container sx={{ p: 2, pt: 1 }}>
            <Item
                sx={{
                    width: '100%',
                }}>
                <Grid container direction={'column'} sx={{ flexWrap: 'nowrap', overflowY: 'auto', m: 0, p: 1 }}>
                    <Grid container alignItems={'center'}>
                        <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                        <Typography component="h1" variant="h5" sx={{ textAlign: 'initial', mr: 'auto' }}>
                            Configuration
                        </Typography>
                        <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Divider sx={{ mt: 1 }} />
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
                    >
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={tabIndex}
                            onChange={handleTabChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider', minWidth: '200px', py: 2 }}
                        >
                            <Tab label="Organization Details" {...a11yProps(0)} />
                            <Tab label="Cedant Email" {...a11yProps(1)} />
                            <Tab label="Insurer Email" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={tabIndex} index={1} sx={{ maxHeight: 'calc(100vh - 198px)', minHeight: 'calc(100vh - 198px)', overflowY: 'auto', width: '-webkit-fill-available' }}>
                            <Grid container direction={'column'} sx={{ px: 1 }}>
                                <Typography component="h1" variant="h6" sx={{ textAlign: 'initial', mr: 'auto', fontWeight: 300 }}>
                                    Cedant Email - Acknowledgement
                                </Typography>
                                <Divider sx={{ mb: 2, mt: 1 }} />
                                <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                                    <Grid item xs={12} md={4} alignItems={'center'}>
                                        <Typography component="span" variant="div" sx={{ textAlign: 'center', mr: 'auto', fontWeight: 300, pr: 4 }}>
                                            Email Subject
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={8} alignItems={'center'}>
                                        <TextField
                                            margin="normal"
                                            required
                                            id="name"
                                            label={''}
                                            name="name"
                                            type="text"
                                            autoFocus
                                            size={'small'}
                                            sx={{ mr: 2, width: '100%' }}
                                            value={cedantData.email_subject}
                                            onChange={(event) => handleCedant(event.target.value, 'email_subject')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                                    <Grid item xs={12} md={4} alignItems={'center'}>
                                        <Typography component="span" variant="div" sx={{ textAlign: 'center', mr: 'auto', fontWeight: 300, pr: 4 }}>
                                            Email Greeting
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={8} alignItems={'center'}>
                                        <TextField
                                            margin="normal"
                                            required
                                            id="name"
                                            label={''}
                                            name="name"
                                            type="text"
                                            autoFocus
                                            size={'small'}
                                            sx={{ mr: 2, width: '100%' }}
                                            value={cedantData.email_greeting}
                                            onChange={(event) => handleCedant(event.target.value, 'email_greeting')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                                    <Grid item xs={12} md={4} alignItems={'center'}>
                                        <Typography component="span" variant="div" sx={{ textAlign: 'center', mr: 'auto', fontWeight: 300, pr: 4 }}>
                                            Email Body
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={8} alignItems={'center'}>
                                        <TextField
                                            margin="normal"
                                            required
                                            id="name"
                                            label={''}
                                            name="name"
                                            type="text"
                                            autoFocus
                                            size={'small'}
                                            sx={{ mr: 2, width: '100%' }}
                                            value={cedantData.email_body}
                                            onChange={(event) => handleCedant(event.target.value, 'email_body')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction={'row'} justifyContent={'center'} sx={{ pt: 4 }}>
                                    <LoadingButton
                                        type="submit"
                                        loading={loading}
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => handleUpdate(-1)}
                                    >
                                        Update
                                    </LoadingButton>
                                </Grid>

                            </Grid>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2} sx={{ maxHeight: 'calc(100vh - 198px)', minHeight: 'calc(100vh - 198px)', overflowY: 'auto', width: '-webkit-fill-available' }}>
                            <Grid container direction={'column'} sx={{ px: 1 }}>
                                <Typography component="h1" variant="h6" sx={{ textAlign: 'initial', mr: 'auto', fontWeight: 300 }}>
                                    Insurer Email - Acknowledgement
                                </Typography>
                                <Divider sx={{ mt: 1 }} />
                                <Tabs
                                    variant="scrollable"
                                    value={horizontalTabIndex}
                                    onChange={(event, newValue) => handleTabChange(event, newValue, 'horizontal')}
                                    aria-label="Horizontal tabs"
                                    sx={{ borderBottom: 1, borderColor: 'divider', minWidth: '200px' }}
                                >
                                    <Tab label="Initial Quote" {...a11yProps(0)} />
                                    <Tab label="Negotiation Reply" {...a11yProps(1)} />
                                    <Tab label="Quote Acceptance" {...a11yProps(2)} />
                                    <Tab label="Quote Decline" {...a11yProps(3)} />
                                </Tabs>
                                {[0, 1, 2, 3].map(tabIndex => {
                                    return <TabPanel value={horizontalTabIndex} index={tabIndex} key={'tabIndex' + tabIndex} sx={{ maxHeight: 'calc(100vh - 230px)', minHeight: 'calc(100vh - 230px)', flexWrap: 'nowrap', overflowY: 'auto', width: '-webkit-fill-available' }}>
                                        <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                                            <Grid item xs={12} md={4} alignItems={'center'}>
                                                <Typography component="span" variant="div" sx={{ textAlign: 'center', mr: 'auto', fontWeight: 300, pr: 4 }}>
                                                    Email Subject
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8} alignItems={'center'}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    id="name"
                                                    label={''}
                                                    name="name"
                                                    type="text"
                                                    autoFocus
                                                    size={'small'}
                                                    sx={{ mr: 2, width: '100%' }}
                                                    value={insurerData[tabIndex].email_subject}
                                                    onChange={(event) => handleInsurer(event.target.value, tabIndex, 'email_subject')}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                                            <Grid item xs={12} md={4} alignItems={'center'}>
                                                <Typography component="span" variant="div" sx={{ textAlign: 'center', mr: 'auto', fontWeight: 300, pr: 4 }}>
                                                    Email Greeting
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8} alignItems={'center'}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    id="name"
                                                    label={''}
                                                    name="name"
                                                    type="text"
                                                    autoFocus
                                                    size={'small'}
                                                    sx={{ mr: 2, width: '100%' }}
                                                    value={insurerData[tabIndex].email_greeting}
                                                    onChange={(event) => handleInsurer(event.target.value, tabIndex, 'email_greeting')}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                                            <Grid item xs={12} md={4} alignItems={'center'}>
                                                <Typography component="span" variant="div" sx={{ textAlign: 'center', mr: 'auto', fontWeight: 300, pr: 4 }}>
                                                    Email Body
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8} alignItems={'center'}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    id="name"
                                                    label={''}
                                                    name="name"
                                                    type="text"
                                                    autoFocus
                                                    size={'small'}
                                                    sx={{ mr: 2, width: '100%' }}
                                                    value={insurerData[tabIndex].email_body}
                                                    onChange={(event) => handleInsurer(event.target.value, tabIndex, 'email_body')}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container direction={'row'} justifyContent={'center'} sx={{ pt: 4 }}>
                                            <LoadingButton
                                                type="submit"
                                                loading={loading}
                                                loadingPosition="start"
                                                startIcon={<SaveIcon />}
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                                onClick={() => handleUpdate(tabIndex)}
                                            >
                                                Update
                                            </LoadingButton>
                                        </Grid>
                                    </TabPanel>
                                })}

                            </Grid>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={0} sx={{ maxHeight: 'calc(100vh - 198px)', minHeight: 'calc(100vh - 198px)', flexWrap: 'nowrap', overflowY: 'auto', width: '-webkit-fill-available' }}>
                            <Typography component="h1" variant="h6" sx={{ textAlign: 'initial', mr: 'auto', fontWeight: 300, px: 1 }}>
                                Organization Detail
                            </Typography>
                            <Divider sx={{ mt: 1 }} />
                            <Grid container alignItems={'center'} sx={{ mb: 4, p: 1, px: 4 }}>
                                <Grid item xs={12}
                                >
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label={tableData[0].title}
                                        name="name"
                                        type="text"
                                        autoFocus
                                        size={'small'}
                                        sx={{ mr: 2, width: '100%' }}
                                        value={tableData[0].value}
                                        onChange={(event) => handleText(event.target.value, 0)}
                                    />
                                </Grid>
                            </Grid>
                            <Divider sx={{ mb: 2, mt: 1 }} />
                            <Grid container sx={{ mb: 4, p: 1, px: 4 }}>
                                <Grid container xs={12} md={6} alignItems={'center'} justifyContent={'flex-end'}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        size={'small'}
                                        startIcon={<CameraAltIcon />}
                                    >
                                        Change Logo
                                        <input
                                            accept="image/*"
                                            id="raised-button-file"
                                            type="file"
                                            hidden
                                            onChange={(event) => handleInput(event, 'img')}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ margin: 0, paddingTop: '0 !important', paddingLeft: '32px !important' }}>
                                    <Box sx={{
                                        maxHeight: '100px',
                                        height: '100px',
                                        width: '180px',
                                        border: '1px solid #ccc',
                                        alignSelf: 'center'
                                    }}>
                                        {image ? <img src={image} style={{
                                            maxHeight: '100px',
                                            height: '100px',
                                            maxWidth: '180px',
                                        }} alt='logo'></img> : <Box sx={{
                                            height: '100px',
                                            width: '180px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}><ImageIcon /></Box>}
                                    </Box>

                                </Grid>
                            </Grid>
                            <Divider sx={{ mb: 2, mt: 1 }} />
                            <Grid container sx={{ mb: 4, p: 1, px: 4 }}>
                                <Grid container xs={12} md={6} justifyContent={'center'} alignItems={'center'}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        size={'small'}
                                        startIcon={<VideoCameraBackIcon />}
                                    >
                                        Change Background Video
                                        <input
                                            accept="video/*"
                                            id="raised-button-file-2"
                                            type="file"
                                            hidden
                                            onChange={(event) => handleInput(event, 'video')}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ margin: 0, paddingTop: '0 !important', paddingLeft: '32px !important' }}>
                                    <Box sx={{
                                        maxHeight: '100px',
                                        height: '100px',
                                        width: '180px',
                                        border: '1px solid #ccc',
                                    }}>
                                        {video ? <video key={video} style={{
                                            maxHeight: '100px',
                                            height: '100px',
                                            width: '180px',
                                        }} id="background-video" autoPlay loop muted>
                                            <source src={video} type="video/mp4" />
                                            <source src={video} type="video/ogg" />
                                            Your browser does not support the video tag.
                                        </video> : <Box sx={{
                                            height: '100px',
                                            width: '180px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}><VideoFileIcon color="primary" /></Box>}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mb: 2, mt: 1 }} />
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                            >
                                Save
                            </LoadingButton>
                        </TabPanel>
                    </Box>
                </Grid>
            </Item>
        </Grid>
    </>
}