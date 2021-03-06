import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from "react-router-dom";
import { deepOrange } from '@mui/material/colors';
import theme from '../../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import loginAction from '../../../store/actions/loginAction';
import uiAction from '../../../store/actions/uiAction';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';



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
  const dispatch = useDispatch();
  const history = useHistory();
  const [login, setlogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [logo, setLogo] = useState('images/company-logo.jpeg');
  const [orgName, setOrgName] = useState('Sielo App');
  const open = Boolean(anchorEl);
  const [userCategory, setUserCategory] = useState('');
  const abbreviateWord = (word = '') => {
    let abbrWord = ''
    word.split(" ").forEach(w => abbrWord = abbrWord + (w[0] || '').toUpperCase());
    return abbrWord;
  }

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
    setlogin(userData.isLogin);
    setUserName(userData.userName);
    setUserCategory(userData.userCategory);
    setOrgName(userData.user_org_name);
    setLogo(userData.user_org_logo_url);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type) => (eventType) => {
    setAnchorEl(null);
    switch (type) {
      case 'login': {
        history.push("/sign-in");
        break;
      }
      case 'logout': {
        history.push("/");
        setlogin(false);
        setUserName('');
        setUserCategory('');
        localStorage.removeItem('pdf_parser_app');
        dispatch(loginAction.logOut());
        dispatch(uiAction.showSnackbar({ message: 'User logged out successfully', type: 'info' }));
        break;
      }
      case 'profile': {
        history.push("/profile");
        break;
      }
      // case 'register': {
      //   history.push("/sign-up");
      //   break;
      // }
      default: {
        // history.push("/");
      }

    }
  };

  const onSignIn = () => {
    history.push("/sign-in");
  }

  const handleSetting = () => {
    history.push("/setting");
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <HideOnScroll {...props}>
          <AppBar sx={{ background: '#fff' }}>
            <Toolbar>
              {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
              {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Company Name
            </Typography> */}
              {/* <Avatar sx={{ bgcolor: '#fff' }} variant="rounded">
            </Avatar> */}
              <img src={logo || 'images/company-logo.jpeg'} width="60" alt="company-logo"></img>
              {/* <Avatar sx={{ width: 56, height: 56 }} alt="App logo" src="images/company-logo.jpeg" /> */}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 2, color: 'rgb(26 33 77)', textTransform: 'capitalize' }}>
                {orgName || 'Sielo App'}
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              </Typography>
              {'admin' === userCategory ?
                <IconButton
                  size="large"
                  edge="start"
                  color="grey"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleSetting}
                >
                  <SettingsIcon />
                </IconButton> : ''}
              {['g2', 'g2b'].includes(userCategory) && !props.hideNotification ?
                <Badge color="error" badgeContent={props.notificationCount || 10} sx={{ mx: 4 }}>
                  <NotificationsIcon sx={{ color: '#3f51b5', width: "30px", height: "30px" }} />
                </Badge> : ''}
              {/* {userCategoryKeys.includes(userCategory) ? <Button color="inherit" sx={{
                mr: 2,
                ':hover': {
                  bgcolor: '#fff',
                  color: '#000'
                },
                color: 'rgb(26 33 77)',
                textTransform: 'capitalize'
              }} to="/create-template">Create Template</Button> : ''}
              {(userCategoryKeys.includes(userCategory)) ? <Button color="inherit" sx={{
                mr: 2,
                ':hover': {
                  bgcolor: '#fff',
                  color: '#000'
                },
                color: 'rgb(26 33 77)',
                textTransform: 'capitalize'
              }} to="/parse-pdf">Parse PDF</Button> : ''} */}
              {
                login ? (<>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      onClick={(event)=>handleClick(event)}
                    >
                      <Avatar sx={{ bgcolor: deepOrange[500] }}>{abbreviateWord(userName)}</Avatar>
                    </StyledBadge></Box></>) :
                  <><Button variant="contained" color="orange" sx={{
                    mr: 2,
                    ':hover': {
                      color: '#000',
                      backgroundColor: "#ffb74d",
                    },
                    textTransform: 'capitalize'
                  }} onClick={onSignIn}>Login</Button></>}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose()}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {login ?
                  <>
                    <MenuItem onClick={handleClose('profile')}>Profile</MenuItem>
                    <MenuItem onClick={handleClose('logout')}>Logout</MenuItem>
                  </>
                  : <>
                    <MenuItem onClick={handleClose('login')}>Login</MenuItem>
                  </>
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
      </ThemeProvider>
    </>
  );
}
