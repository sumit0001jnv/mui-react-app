import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import uiAction from '../../store/actions/uiAction';
import Header from '../../commons/components/header/Header';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getUser } from '../../utility/helper'

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function UserProfileComponent(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const defaultUser = { userName: '', email: '', userCategory: '', mobileNo: '' }
    const [user, setUser] = useState(defaultUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        setLoading(true);
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-user-info',
            data: { user_id: userData.user_id },
        }).then(res => {
            console.log(res);
            const [email, ,mobileNo, userCategory] = res.data.user_info;

            setUser(() => {
                return {
                    ...(userData || defaultUser),
                    email, userCategory,
                    mobileNo
                }
            })
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            dispatch(uiAction.showSnackbar({ type: 'error', message: 'Something went wrong.Please try after some time' }));
        });
    }, [])

    const navigateBack = () => {
        if (user.userCategory === 'g2') {
            history.push('/g2-user')
        } else if (user.userCategory === 'g2b') {
            history.push('/g2b-user')
        }
    }



    return (<>
        <Header></Header>
        <Grid container sx={{ p: 2, pt: 1 }}>
            <Item
                sx={{
                    width: '100%',
                    mx: 10
                }}>
                <Grid container direction={'column'} sx={{ flexWrap: 'nowrap', overflowY: 'auto', m: 0, p: 1 }}>
                    <Grid container alignItems={'center'}>
                        <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                        <Typography component="h1" variant="h5" sx={{ textAlign: 'initial', mr: 'auto' }}>
                            Profile
                        </Typography>
                        <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Divider sx={{ mt: 1 }} />
                    <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                        <Grid item xs={12} md={4} alignItems={'flex-end'} sx={{ textAlign: 'end' }}>
                            <Typography component="span" variant="div" sx={{ textAlign: 'end', ml: 'auto', fontWeight: 300, pr: 4 }}>
                                Name
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} alignItems={'center'}>
                            <TextField
                                margin="normal"
                                disabled
                                required
                                id="name"
                                label={''}
                                name="name"
                                type="text"
                                autoFocus
                                size={'small'}
                                sx={{ mr: 2, width: '80%' }}
                                value={user.userName}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                        <Grid item xs={12} md={4} alignItems={'flex-end'} sx={{ textAlign: 'end' }}>
                            <Typography component="span" variant="div" sx={{ textAlign: 'end', ml: 'auto', fontWeight: 300, pr: 4 }}>
                                Email
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} alignItems={'center'}>
                            <TextField
                                margin="normal"
                                disabled
                                required
                                id="name"
                                label={''}
                                name="name"
                                type="text"
                                autoFocus
                                size={'small'}
                                sx={{ mr: 2, width: '80%' }}
                                value={user.email}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                        <Grid item xs={12} md={4} alignItems={'flex-end'} sx={{ textAlign: 'end' }}>
                            <Typography component="span" variant="div" sx={{ textAlign: 'end', ml: 'auto', fontWeight: 300, pr: 4 }}>
                                User type
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} alignItems={'center'}>
                            <TextField
                                margin="normal"
                                disabled
                                required
                                id="name"
                                label={''}
                                name="name"
                                type="text"
                                autoFocus
                                size={'small'}
                                sx={{ mr: 2, width: '80%' }}
                                value={getUser(user.userCategory)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4 }}>
                        <Grid item xs={12} md={4} alignItems={'flex-end'} sx={{ textAlign: 'end' }}>
                            <Typography component="span" variant="div" sx={{ textAlign: 'end', ml: 'auto', fontWeight: 300, pr: 4 }}>
                                Mobile No
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} alignItems={'center'}>
                            <TextField
                                margin="normal"
                                disabled
                                required
                                id="name"
                                label={''}
                                name="name"
                                type="text"
                                autoFocus
                                size={'small'}
                                sx={{ mr: 2, width: '80%' }}
                                value={user.mobileNo}
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction={'row'} alignItems={'center'} sx={{ px: 4, mt: 2 }}>
                        <Grid item xs={12} md={4} alignItems={'flex-end'} sx={{ textAlign: 'end' }}>
                            <Typography component="span" variant="div" sx={{ textAlign: 'end', ml: 'auto', fontWeight: 300, pr: 4 }}>
                                Company Logo
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} alignItems={'center'}>
                            <Box sx={{
                                maxHeight: '100px',
                                height: '100px',
                                width: '180px',
                                border: '1px solid #ccc',
                                alignSelf: 'center',
                                ml: 5
                            }}>
                                <img src={'/images/test.logo.svg'} style={{
                                    maxHeight: '100px',
                                    height: '100px',
                                    maxWidth: '180px',
                                }} alt='logo'></img>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Item>
        </Grid>
    </>)
}