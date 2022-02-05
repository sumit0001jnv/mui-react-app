// import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useHistory, useLocation } from "react-router-dom";
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function Header(props) {
  const location = useLocation();
  const history = useHistory();
  const [login, setlogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  useEffect(() => {
    setlogin(location?.state?.login);
    setUserName(location?.state?.userName);
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type) => (eventType) => {
    console.log(type);
    setAnchorEl(null);
    switch(type){
      case 'login':{
        history.push("/sign-in");
        break;
      }
      case 'logout':{
        // history.push("/sign-in");
        setlogin(false);
        break;
      }
      case 'profile':{
        history.push("/profile");
        break;
      }
      case 'register':{
        history.push("/sign-up");
        break;
      }

    }
  };

  return (
    <>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar sx={{ bgcolor: '#2E3B55' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Company Name
            </Typography>
            {
              login ? (<>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="div" component="div" sx={{ flexGrow: 1, pr: 1 }}>
                    Hi {userName}
                  </Typography><StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    onClick={handleClick}
                  >
                    <Avatar alt="Remy Sharp" src="images/2.jpg" />
                  </StyledBadge></Box></>) :
                <><Button color="inherit" onClick={handleClick}>Login/Register</Button></>}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose()}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {login ? <><MenuItem onClick={handleClose('profile')}>Profile</MenuItem>
                <MenuItem onClick={handleClose('logout')}>Logout</MenuItem></>
                : <><MenuItem onClick={handleClose('login')}>Login</MenuItem>
                  <MenuItem onClick={handleClose('register')}>Register</MenuItem></>
              }
            </Menu>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
        <Box sx={{ my: 2 }}>
        </Box>
      </Container>
    </>
  );
}
