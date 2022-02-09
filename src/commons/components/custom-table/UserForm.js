import { useState } from 'react';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
export default function UserForm(props) {
    const [actionLabel, setActionLabel] = useState(props.actionLabel);
    const groups = ['Group A',
        'Group B',
        'Group C',
        'Group D'];
    const [formData, setformData] = useState({
        ...props.formData,
        showPassword: false,
        showConfirmPassword: false,
        isValid: true
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        props.onDataChange({formData});
        props.closeDrawer();
        // props.setDrawerStatus({ ...drawerStatus, right: false });

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
    return <Container sx={{ bgcolor: "#fff" }} maxWidth="xs">
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: "#fff",
                padding: 3,
            }}
        >
            <Typography component="h1" variant="h5">
                {actionLabel.charAt(0).toUpperCase() + actionLabel.substr(1)}  User
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
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
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={groups}
                    // sx={{ width: 300 }}
                    // value={formData.group}
                    defaultValue={formData.group || groups[0]}
                    // onChange={handleChange('group')}
                    onInputChange={(event, newInputValue) => {
                        setformData({ ...formData, group: newInputValue })
                    }}
                    renderInput={(params) => <TextField {...params} label="Group" />}
                />
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
                <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
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
                    color={actionLabel === 'edit' ? 'secondary' : (actionLabel === 'create' ? 'primary' : 'error')}
                    sx={{ mt: 3, mb: 2 }}
                >
                    {actionLabel} User
                </Button>
            </Box>
        </Box>
    </Container>
}