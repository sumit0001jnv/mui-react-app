import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
// import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
// import MuiPhoneNumber from "material-ui-phone-number";


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
export default function SignUpComponent() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log(data);
  };
  const [formData, setformData] = React.useState({
    name: '',
    password: '',
    confirm_password: '',
    email: '',
    mobile_no: '',
    showPassword: false,
    showConfirmPassword: false,
    isValid: true
  });

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
        <Container  sx={{bgcolor:"aliceblue",}} maxWidth="xs">
          {/* <CssBaseline /> */}
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor:"#fff",
              borderRadius: '4px',
              padding:3,
              boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;'
            }}
          >

            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar sx={{ width: 20, height: 20, m: 1, border: `2px solid ${theme.palette.background.paper}`, bgcolor: 'secondary.main' }}>
                  <EditIcon sx={{ width: 12, height: 12, }} />
                </Avatar>
              }
            >
              {/* <Avatar alt="Travis Howard" src="images/2.jpg" /> */}
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
            </Badge>
            <Typography component="h1" variant="h5">
              Create Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                helperText={!formData.isValid && !formData.name ? "This field is required*" : ""}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                type="text"
                autoFocus
                sx={{ mr: 2 }}
                value={formData.name}
                onChange={handleChange('name')}
              />
              <TextField
                helperText={!formData.isValid && !formData.email ? "This field is required*" : ""}
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
              <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  helperText={!formData.isValid && !formData.name ? "This field is required*" : ""}
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
              <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput
                  helperText={!formData.isValid && !formData.name ? "This field is required*" : ""}
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirm Password"
                  type={formData.showPassword ? 'text' : 'password'}
                  id="confirm_password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange('confirm_password')}

                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('showConfirmPassword')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {/* <MuiPhoneNumber
              defaultCountry={"us"}
              onChange={e => handleChange('mobile_no',e)}
            /> */}
              <TextField
                helperText={!formData.isValid && !formData.email ? "This field is required*" : ""}
                margin="normal"
                required
                fullWidth
                id="mobile_no"
                label="Mobile No"
                name="mobile_no"
                autoComplete="mobile_no"
                autoFocus
                type="number"
                value={formData.mobile_no}
                onChange={handleChange('mobile_no')}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create User
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/sign-in" variant="body2">
                    {"Already have an account? Sign In"}
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