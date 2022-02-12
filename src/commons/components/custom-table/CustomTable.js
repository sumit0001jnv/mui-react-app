import { useState, useEffect } from 'react';
import {
    DataGrid,
} from '@mui/x-data-grid';
import CustomLoadingOverlay from './CustomeLoadingOverlay';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import CustomPagination from './CustomPagination';
import CustomToolbar from './CustomToolbar';
import UserForm from './UserForm';
import Header from '../header/Header';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import axios from 'axios';

export default function CustomTable(props) {
    const [drawerState, setDrawerState] = useState({
        right: false
    });

    const [columns, setColumns] = useState(props.columns);
    useEffect(() => {
        let { formData, type, drawerState } = props.actionData;
        if (formData) {
            handleClick(formData)(type);
        }
    }, [props.actionData]);

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTable, setRefreshTable] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios({
            method: 'post',
            url: props.apiUrl,
        }).then(res => {
            let _tableData = (res.data.users_list || []).map(row => {
                return {
                    username: row[2],
                    email: row[1],
                    password: row[3],
                    group: row[5],
                    mobile_number: row[4],
                    id: row[0]
                }
            })

            setTableData([..._tableData]);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
    }, [refreshTable]);

    const [actionLabel, setActionLabel] = useState('create')
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerState({ right: open });
        // setState({ ...state, [anchor]: open });
    };



    const addUserClick = () => {
        setDrawerState({ right: true });
        setformData({
            username: '',
            password: '',
            'confirm-password': '',
            email: '',
            group: 'Group A',
            mobile_number: '',
            showPassword: false,
            showConfirmPassword: false,
            isValid: true
        })
        setActionLabel('create')

    }


    const onDataChange = (data) => {
        // console.log(data);

        const formData = data.formData;
        // http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/user-login
        let bodyFormData = new FormData();

        bodyFormData.append('username', formData.username);
        bodyFormData.append('password', formData.password);
        // bodyFormData.append('confirm-password', formData["confirm-password"]);
        bodyFormData.append('email', formData.email);
        bodyFormData.append('user_group', formData.group);
        bodyFormData.append('mobile_number', formData.mobile_number);
        axios({
            method: 'post',
            url: "http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/user-registration",
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            // setRefreshTable(!refreshTable);
        }).catch(err => {
            console.log(err);
            setLoading(true);
        })
    }
    const [formData, setformData] = useState(
        {
            username: '',
            password: '',
            'confirm-password': '',
            email: '',
            group: 'Group A',
            mobile_number: '',
            showPassword: false,
            showConfirmPassword: false,
            isValid: true
        }
    )
    const handleClick = (data) => (type) => {
        console.log(data)
        setformData({ ...formData, ...data });
        setActionLabel(type);
        setDrawerState({ right: true });
    }

    const onRefresh = () => {
        setRefreshTable(!refreshTable);
    }

    return (
        <>
            <Header></Header>
            <Typography variant="div" component="div" sx={{ margin: 4, backgroundColor: "#fff", display: 'flex', height: 'calc(100vh - 128px)', flexGrow: 1 }}>
                <DataGrid
                    rows={tableData}
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
                    loading={loading}
                    componentsProps={{
                        toolbar: { addUserClick, onRefresh }
                    }}
                    disableSelectionOnClick
                />
                <Drawer
                    anchor={'right'}
                    open={drawerState['right']}
                    onClose={toggleDrawer('right', false)}
                >
                    <UserForm actionLabel={actionLabel} formData={formData} onDataChange={onDataChange} closeDrawer={toggleDrawer('right', false)}></UserForm>
                </Drawer>

            </Typography>
        </>

    );
}
