
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


    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState('');

    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        setVideo(userData.user_org_video_url || '');
        setImage(userData.user_org_logo_url || '');
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
            setTimeout(()=>{
                setVideo(() => URL.createObjectURL(file))
            },1000)
            setVideo(() => '')
            
        }
    }
    const navigateBack = () => {
        history.push('/admin')
    }

    return <> <Header></Header>
        <Grid container justifyContent={'center'}>
            <Item
                sx={{
                    // px: 2,
                    // mx: 2,
                    m: 0,
                    p: 0,
                    width: '500px',
                    maxWidth: '100%',
                }}>
                <Grid container direction={'column'} sx={{  flexWrap: 'nowrap', overflowY: 'auto', m: 0, p: 1 }}>
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
                    <Divider sx={{ mb: 2, mt: 1 }} />
                    <Grid container alignItems={'center'} sx={{ mb: 4, p: 1 }}>
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
                    <Grid container sx={{ mb: 4, p: 1 }}>
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
                        <Grid item sx={12} md={6} sx={{ margin: 0, paddingTop: '0 !important', paddingLeft: '8px !important' }}>
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
                    <Grid container sx={{ mb: 4, p: 1 }}>
                        <Grid container xs={12} md={6} justifyContent={'center'} alignItems={'center'}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                size={'small'}
                                fullWidth
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
                        <Grid item xs={12} md={6} sx={{ margin: 0, paddingTop: '0 !important', paddingLeft: '8px !important' }}>
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
                </Grid>


            </Item>
        </Grid >
    </>
}