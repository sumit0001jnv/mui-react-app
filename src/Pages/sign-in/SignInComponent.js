// import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import loginAction from '../../store/actions/loginAction';
import uiAction from '../../store/actions/uiAction';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '} */}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {

  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setformData] = useState({ email: '', password: '', showPassword: false });
  const [video, SetVideo] = useState('videos/home-video-3.mp4');
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
    SetVideo(userData.user_org_video_url);
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    let obj = { login: true, userName: '', pathname: '/', userCategory: '' }
    let bodyFormData = new FormData();
    bodyFormData.append('username', formData.email);
    bodyFormData.append('password', formData.password);
    axios({
      method: 'post',
      url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/user-login',
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // data: {
      //   username: formData.email,
      //   password: formData.password
      // }
    }).then(res => {
      if (!res.data.status) {
        dispatch(uiAction.showSnackbar({ type: 'error', message: res.data.message }));
        return;
      }

      const data = res.data.user_data;
      obj.userName = data.user_name;
      dispatch(loginAction.logIn());
      dispatch(uiAction.showSnackbar({ type: 'success', message: res.data.message || 'User logged in successfully' }));
      let store = localStorage.getItem('pdf_parser_app');
      if (!store) {
        localStorage.setItem('pdf_parser_app', '{}');
        store = localStorage.getItem('pdf_parser_app');
      }

      let parsedStore = JSON.parse(store);
      parsedStore.userName = data.user_name;
      parsedStore.isLogin = true;
      parsedStore.userCategory = data.user_group;
      parsedStore.user_id = data.user_uuid;
      parsedStore.email = data.user_id;
      parsedStore.user_org_name = data.user_org_name;
      parsedStore.user_org_logo_url = data.user_org_logo_url;
      parsedStore.user_org_video_url = data.user_org_video_url;
      dispatch(loginAction.setUser(parsedStore));
      localStorage.setItem('pdf_parser_app', JSON.stringify(parsedStore));

      switch (parsedStore.userCategory) {
        case 'admin': {
          obj.pathname = '/admin';
          break;
        }
        case 'g2':
          {
            obj.pathname = '/g2-user';
            break;
          }
        case 'g2b':
          {
            obj.pathname = '/g2b-user';
            break;
          }
        case 'g3': {
          obj.pathname = '/g3-user';
          break;
        }
        default: {
          obj.pathname = '/'
        }
      }
      obj.userCategory = parsedStore.userCategory
      history.push({
        pathname: obj.pathname,
        state: obj
      })
    }).catch(err => {
      console.log(err);
      dispatch(uiAction.showSnackbar({ type: 'error', message: 'Something went wrong.Please try after some time' }));
    });


  };

  const handleChange = (prop) => (event) => {
    setformData({ ...formData, [prop]: event.target.value });
  };

  const handleClickShowPassword = (prop) => () => {
    setformData({
      ...formData,
      [prop]: !formData[prop],
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        item
        xs={false}
        sm={4}
        md={4}
        sx={{
          display: { xs: 'none', sm: 'block' },
          m: 0,
          p: 0,
          height: "calc(100vh)",
          position: 'absolute'
        }}
      >
        <video style={{
          height: "100%",
        }} id="background-video" autoPlay loop muted>
          <source src={video || "videos/home-video-3.mp4"} type="video/mp4" />
          <source src={video || "videos/home-video-3.mp4"} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </Grid>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            height: "100%",
          }}
        >
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} sx={{ zIndex: 2 }} elevation={6} square>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 8,
              py: 2,
              // boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange('email')}
              />
              {/* <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange('password')}
              /> */}
              <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={formData.showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange('password')}

                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('showPassword')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/sign-up" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
            </Box>
          </Box>
          <Copyright sx={{ mt: 4, mb: 4 }} />
        </Grid>
      </Grid>

    </ThemeProvider>
  );
}