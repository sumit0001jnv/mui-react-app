import { useState } from 'react';
import {
    DataGrid,
    GridToolbarContainer,
    GridOverlay,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import axios from 'axios';

const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
    flexDirection: 'column',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));
// import Delete from '@mui/icons-material/Delete';



const rows = [
    // { id: 1, name: 'Sumit Kumar', email: 'abc@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "A" },
    // { id: 2, name: 'Avinash Patel', email: 'apddddddddddddd@gmail.com', password: "aafa-ms", mobile_no: '12351614151', group: "B" },
    { id: 3, name: 'Justin Biber', email: 'jb@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "Group C" },
    { id: 4, name: 'Ed Seeran', email: 'abc@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "Group A" },
    { id: 5, name: 'Salena Gomez', email: 'abc@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "Group A" }
];

rows.push(...rows, ...rows, ...rows, ...rows, ...rows, ...rows);
rows.push(...rows, ...rows, ...rows, ...rows, ...rows, ...rows)




function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}


function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box sx={{ mt: 1 }}>No Rows</Box>
        </StyledGridOverlay>
    );
}

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

export default function AdminHomePage() {
    const [drawerStatus, setDrawerStatus] = useState({
        right: false
    });
    const [actionLabel, setActionLabel] = useState('create')
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerStatus({ ...drawerStatus, right: open });
        // setState({ ...state, [anchor]: open });
    };

    function UserForm(props) {
        // const groups = [{ label: 'Group A', id: 1 },
        // { label: 'Group B', id: 2 },
        // { label: 'Group C', id: 3 },
        // { label: 'Group D', id: 4 }];
        const [actionLabel, setActionLabel] = useState(props.actionLabel);
        const groups = ['Group A',
            'Group B',
            'Group C',
            'Group D'];
        const [formData, setformData] = useState({
            ...props.formData,

            // name: '',
            // password: '',
            // confirm_password: '',
            // email: '',
            // group: 'Group A',
            // mobile_no: '',
            showPassword: false,
            showConfirmPassword: false,
            isValid: true
        });
        const handleSubmit = (event) => {
            event.preventDefault();
            // const data = new FormData(event.currentTarget);
            // // eslint-disable-next-line no-console
            // console.log(data);
            onDataChange({formData});
            setDrawerStatus({ ...drawerStatus, right: false });

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
                    // marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: "#fff",
                    // borderRadius: '4px',
                    padding: 3,
                    // boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;'
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
    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ padding: '16px', borderBottom: '1px solid #ccc', }}>
                <Grid container spacing={3}>
                    <Grid item sx={{ marginRight: 'auto' }} >
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Users
                        </Typography>
                    </Grid>
                    <Grid item sx={{}}>
                        <Button variant="outlined" onClick={addUserClick}>
                            + Add User
                        </Button>
                    </Grid>
                </Grid>

            </GridToolbarContainer>
        );
    }

    const addUserClick = () => {
        setDrawerStatus({ ...drawerStatus, right: true });
        setformData({
            name: '',
            password: '',
            confirm_password: '',
            email: '',
            group: 'Group A',
            mobile_no: '',
            showPassword: false,
            showConfirmPassword: false,
            isValid: true
        })
        setActionLabel('create')

    }


    const onDataChange = (data) => {
        console.log(data)
    }
    const [formData, setformData] = useState(
        {
            name: '',
            password: '',
            confirm_password: '',
            email: '',
            group: 'Group A',
            mobile_no: '',
            showPassword: false,
            showConfirmPassword: false,
            isValid: true
        }
    )
    const handleClick = (data) => (type) => {
        console.log(data)
        setformData({ ...formData, ...data });
        setActionLabel(type);
        console.log(type);

        setDrawerStatus({ ...drawerStatus, right: true });
    }
    const columns = [
        //   { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            resizable:true
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'password',
            headerName: 'Password',
            width: 200,
        },
        {
            field: 'group',
            headerName: 'Group',
            width: 150,
        },
        {
            field: 'mobile_no',
            headerName: 'Mobile No',
            type: 'number',
            width: 200,
        },
        {
            field: 'tableAction',
            headerName: 'Actions',
            type: 'tableAction',
            width: 110,
            renderCell: (params) => <><EditIcon color={'secondary'} sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleClick(params.row)('edit')} /><DeleteIcon color={'error'} sx={{ cursor: 'pointer' }} onClick={() => handleClick(params.row)('delete')} /></>
        }
        //   {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params) =>
        //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        //   },
    ];

    return (
        <Typography variant="div" component="div" sx={{ margin: 4, backgroundColor: "#fff", display: 'flex', height: 'calc(100vh - 64px)', flexGrow: 1 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pagination
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                    Pagination: CustomPagination,
                    LoadingOverlay: CustomLoadingOverlay,
                    Toolbar: CustomToolbar,
                    // Header:StyledTableCell

                }}
                componentsProps={{
                    footer: 'test',
                }}
                disableSelectionOnClick
            />


            <Drawer
                anchor={'right'}
                open={drawerStatus['right']}
                onClose={toggleDrawer('right', false)}
            >
                <UserForm actionLabel={actionLabel} formData={formData} onDataChange={onDataChange}></UserForm>
                {/* {list('right')} */}
            </Drawer>

        </Typography>


    );
}
