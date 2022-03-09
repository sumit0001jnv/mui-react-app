import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../../commons/components/header/Header';


export default function AdminHomePage() {
    const userMap = { 'admin': 'Admin', g1: 'Group 1', g2: 'Group 2', g2b: 'Group 2B', g3: 'Group 3' }
    const columns = [
        {
            field: 'username',
            headerName: 'Name',
            minWidth: 300,
            flex: 3,
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 300,
            flex: 3,
        },
        // {
        //     field: 'password',
        //     headerName: 'Password',
        //     options: {
        //         display: false,
        //       },
        //     minWidth: 150,
        //     flex: 2,
        // },
        {
            field: 'group',
            headerName: 'Group',
            minWidth: 150,
            flex: 2,

        },
        {
            field: 'mobile_number',
            headerName: 'Mobile No',
            minWidth: 200,
            flex: 2,
        },
        {
            field: 'tableAction',
            headerName: 'Actions',
            type: 'tableAction',
            minWidth: 110,
            renderCell: (params) => <><IconButton size="small" onClick={() => handleClick(params.row)('edit')}><EditIcon color={'secondary'} /></IconButton><IconButton size="small" onClick={() => handleClick(params.row)('delete')}><DeleteIcon color={'red'} /></IconButton></>,
            flex: 2,
        }
    ];
    const initialState = {
        username: '',
        password: '',
        'confirm-password': '',
        email: '',
        group: 'Group 1',
        mobile_number: '',
        showPassword: false,
        showConfirmPassword: false,
        isValid: true
    }
    const initialDrawerPos = 'right';
    const [formData, setFormData] = useState({ ...initialState });
    const [actionLabel, setActionLabel] = useState('create');
    const [drawerState, setDrawerState] = useState({ [initialDrawerPos]: false });

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTable, setRefreshTable] = useState(true);
    const handleClick = (data) => (type) => {
        setFormData({ ...formData, ...data });
        setActionLabel(type);
        setDrawerState({ [initialDrawerPos]: true });
    }
    useEffect(() => {
        setLoading(true);
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-user-list',
        }).then(res => {
            let _tableData = (res.data.users_list || []).reverse().map(row => {
                return {
                    username: row[2],
                    email: row[1],
                    password: row[3],
                    group: userMap[row[5]],
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

    const addUserOnClick = () => {
        setFormData({
            ...initialState
        })
        setActionLabel('create');
        setDrawerState({ [initialDrawerPos]: true })
    }
    const onDataChange = (data) => {

        const formData = data.formData;
        let bodyFormData = new FormData();
        bodyFormData.append('username', formData.username);
        bodyFormData.append('password', formData.password);
        bodyFormData.append('email', formData.email);
        bodyFormData.append('user_group', formData.group);
        bodyFormData.append('mobile_number', formData.mobile_number);
        axios({
            method: 'post',
            url: "http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/user-registration",
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            console.log("User Added")
        }).catch(err => {
            console.log(err);
            setLoading(true);
        })
    }

    const onRefresh = () => {
        setRefreshTable(!refreshTable);
    }
    const onDrawerStateChange = (data) => {
        setDrawerState({ ...data });
    }
    return (
        <ThemeProvider theme={theme}>
            <Header></Header>
            <CustomTable
                tableData={tableData}
                columns={columns}
                actionLabel={actionLabel}
                actionFormData={formData}
                submitFormAction={onDataChange}
                loading={loading}
                refreshTable={onRefresh}
                drawerState={drawerState}
                drawer={{ type: initialDrawerPos }}
                onDrawerStateChange={onDrawerStateChange}
                showToolbar
                toolbarTitle='Users'
                toolBarBtnClick={addUserOnClick}></CustomTable>
        </ThemeProvider>
    );
}
