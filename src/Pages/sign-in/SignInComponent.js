// import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {

  const history = useHistory();
  const userCategories = ['Admin', 'Group 1', 'Group 2', 'Group 2B', 'Group 3'];
  const [formData, setformData] = useState({ email: 'avinash@compdomname.com', password: '123456', userCategory: 'Admin' })
  const handleSubmit = (event) => {
    event.preventDefault();
    let obj = { login: true, userName: 'Avinash', pathname: '/', userCategory: 'Admin' }
    switch (formData.userCategory) {
      case 'Admin': {
        obj.pathname = '/admin';
        obj.userCategory = 'Admin';
        break;
      }
      case 'Group 1':
      case 'Group 2':
      case 'Group 2B':
      case 'Group 3': {
        obj.pathname = '/create-template';
        obj.userCategory = formData.userCategory;
        break;
      }
      // case 'Group 2': {
      //   obj.pathname = '/create-template';
      //   obj.userCategory = 'Group 2';
      //   break;
      // }
      // case 'Group 2B': {
      //   obj.pathname = '/create-template';
      //   obj.userCategory = 'Group 2B';
      //   break;
      // }
      // case 'Group 3': {
      //   obj.pathname = '/create-template';
      //   obj.userCategory = 'Group 3';
      //   break;
      // }

    }
    history.push({
      pathname: obj.pathname,
      state: obj
    })

  };

  const handleChange = (prop) => (event) => {
    setformData({ ...formData, [prop]: event.target.value });
  };
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ bgcolor: "aliceblue" }} maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: "#fff",
            borderRadius: '4px',
            padding: 3,
            boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;'
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
            <TextField
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
            />
            <Autocomplete
              sx={{ mt: 2 }}
              disablePortal
              id="combo-box-demo"
              options={userCategories}
              // sx={{ width: 300 }}
              // value={formData.group}
              defaultValue={formData.userCategory || userCategories[0]}
              // onChange={handleChange('group')}
              onInputChange={(event, newInputValue) => {
                setformData({ ...formData, userCategory: newInputValue })
              }}
              renderInput={(params) => <TextField disabled {...params} label="User Category" />}
            />
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
            <Grid container>
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
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}