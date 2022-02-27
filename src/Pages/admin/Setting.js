
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
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export default function Setting(props) {
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([{ title: 'Application Title', key: 'org_name', value: 'Sielo App' },
    { title: 'Application Logo', key: 'org_logo', value: '' },
    { title: 'Application Homepage Video', key: 'org_video', value: '' }
    ]);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState('');
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
            // data: {
            //   username: formData.email,
            //   password: formData.password
            // }
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
            setImage(URL.createObjectURL(file))

            console.log(file);
        } else {
            setTableData((data) => {
                data[2].value = file;
                return [...data];
            })
            setVideo(URL.createObjectURL(file))
        }

    }
    return <> <Header></Header>
        <Item
            sx={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                m: 2,

            }}>
            <Grid container spacing={0} sx={{ height: 'calc(100vh - 116px)', maxHeight: 'calc(100vh - 116px)', width: '500px', maxWidth: '100%', flexWrap: 'nowrap', overflowY: 'auto' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        id="name"
                        label={tableData[0].title}
                        name="name"
                        type="text"
                        autoFocus
                        sx={{ mr: 2, width: '100%' }}
                        value={tableData[0].value}
                        onChange={(event) => handleText(event.target.value, 0)}
                    />
                    <Grid container justifyContent="flex-start"
                        alignItems="center">
                        <Grid item xs={'auto'}>
                            <Button
                                variant="outlined"
                                component="label"
                                xs={12}
                                sx={{ my: 2 }}
                                startIcon={<CameraAltIcon />}
                            >
                                Upload Image
                                <input
                                    accept="image/*"
                                    id="raised-button-file"
                                    type="file"
                                    hidden
                                    onChange={(event) => handleInput(event, 'img')}
                                />
                            </Button>
                        </Grid>


                        {image ? <Grid xs={12} container
                            direction="row"
                            justifyContent="flex-start"
                            sx={{ mb: 2 }}
                            alignItems="center"><img src={image} width="120px" alt='logo'></img></Grid> : ''}
                    </Grid>
                    <Grid container>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<VideoCameraBackIcon />}
                        >
                            Upload Video
                            <input
                                accept="video/*"
                                id="raised-button-file-2"
                                type="file"
                                hidden
                                onChange={(event) => handleInput(event, 'video')}
                            />
                        </Button>
                        {video ? <Grid xs={12} container
                            direction="row"
                            justifyContent="flex-start"
                            sx={{ my: 2 }}
                            alignItems="center"><video style={{
                                maxWidth: '120px',
                            }} id="background-video" autoPlay loop muted>
                                <source src={video} type="video/mp4" />
                                <source src={video} type="video/ogg" />
                                Your browser does not support the video tag.
                            </video></Grid> : ''}

                    </Grid>

                    {/* <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                    </Button> */}
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                    </LoadingButton>

                </Box>
            </Grid>
        </Item></>
}