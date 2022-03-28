import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../../commons/components/header/Header';
import { useDispatch } from 'react-redux';
import uiAction from '../../store/actions/uiAction';

export default function AdminHomePage() {
    const userMap = { 'admin': 'Admin', g1: 'Cedant', g2: 'Broker', g2b: 'Senior Broker', g3: 'Insurer' }
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
        group: 'Cedant',
        mobile_number: '',
        showPassword: false,
        showConfirmPassword: false,
        isValid: true
    }
    const initialDrawerPos = 'right';
    const dispatch = useDispatch();
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
                    id: row[10]
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
        if (actionLabel == 'create') {
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
                if (res.data.status) {
                    dispatch(uiAction.showSnackbar({ message: res.data.message || 'User has been successfully registered!', type: 'success' }));
                } else {
                    dispatch(uiAction.showSnackbar({ message: res.data.message || 'Failed to register User', type: 'error' }));
                }
            }).catch(err => {
                console.log(err);
                dispatch(uiAction.showSnackbar({ message: err.message || 'Failed to register User', type: 'error' }));
                setLoading(true);
            })
        } else if (actionLabel == 'delete') {
            setLoading(true);
            const user_id = data.formData.id;
            axios({
                method: 'post',
                url: "http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/deactivate-user",
                data: { user_id },
            }).then(res => {
                if (res.data.status) {
                    dispatch(uiAction.showSnackbar({ message: res.data.message || 'User has been successfully deactivated!', type: 'success' }));
                } else {
                    dispatch(uiAction.showSnackbar({ message: res.data.message || 'Failed to deactivate User', type: 'error' }));
                }
                setLoading(false);
            }).catch(err => {
                console.log(err);
                dispatch(uiAction.showSnackbar({ message: err.message || 'Failed to deactivate User', type: 'error' }));
                setLoading(false);
            })
        } else {
            setLoading(true);
            const { email, id, password, username, group, mobile_number } = data.formData;
            let groupKey = '';
            for (const key in userMap) {
                if (group === userMap[key]) {
                    groupKey = key;
                    break;
                }
            }
            const user_detail = { user_id: id, user_name: username, email_id: email, password, user_group: groupKey, mobile_number }
            // console.log(user_detail)
            axios({
                method: 'post',
                url: "http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/update-user-details",
                data: user_detail,
            }).then(res => {
                if (res.data.status) {
                    dispatch(uiAction.showSnackbar({ message: res.data.message || 'User account details has been successfully updated!', type: 'success' }));
                } else {
                    dispatch(uiAction.showSnackbar({ message: res.data.message || 'Failed to update User', type: 'error' }));
                }
                setLoading(false);
            }).catch(err => {
                console.log(err);
                dispatch(uiAction.showSnackbar({ message: err.message || 'Failed to update User', type: 'error' }));
                setLoading(false);
            })

        }


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
