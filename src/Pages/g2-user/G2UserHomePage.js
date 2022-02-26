import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import Chip from '@mui/material/Chip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function G2UserHomePage() {
    const history = useHistory();
    const getColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'error':
                return 'error';
            default:
                return 'error';

        }
    }
    const columns = [
        {
            field: 'group',
            headerName: 'Group',
            minWidth: 300,
            flex: 2,
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 300,
            flex: 2,
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 150,
            flex: 2,
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 2,
            renderCell: (params) => <><Chip label={params?.row?.status || 'success'} color={getColor(params?.row.status)} size="small" /></>,
            // renderCell: (params) => <><Chip label={params?.row?.status ||'pending'} color={params?.row?.status||'success'} size="small" /></>,
        },
        {
            field: 'message',
            headerName: 'Message',
            minWidth: 200,
            flex: 2,
        },
        {
            field: 'tableAction',
            headerName: 'Actions',
            type: 'tableAction',
            minWidth: 110,
            renderCell: (params) => <>
                <Chip variant="outlined" onClick={() => onViewClick(params.row)} color="warning" size="small" label='View' icon={<VisibilityIcon color={'red'} />} />
            </>,
            flex: 2,
        }
    ];
    const initialState = {
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
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-g2-user-projects',
        }).then(res => {
            let _tableData = (res.data.projects_data || []).map((row, i) => {
                return {
                    group: "Group 1",
                    name: row[3],
                    email: row[3],
                    status: i % 3 == 0 ? "pending" : i % 3 == 1 ? "completed" : "error",
                    message: row[5],
                    subject: row[4],
                    body: row[6],
                    id: row[1]
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

    const onViewClick = (row) => {
        // console.log(row.id)
        // pathname: obj.pathname,
        //     state: obj
        history.push({
            pathname: '/create-template',
            // state: { project_id: row.id },
            search: `?project_id=${row.id}`,
        }
        )
    }

    const onRefresh = () => {
        setRefreshTable(!refreshTable);
    }
    const onDrawerStateChange = (data) => {
        setDrawerState({ ...data });
    }
    return (
        <ThemeProvider theme={theme}>
            <CustomTable
                tableData={tableData}
                columns={columns}
                actionLabel={actionLabel}
                actionFormData={formData}
                loading={loading}
                refreshTable={onRefresh}
                showToolbar
                hideActionBtn
                toolbarTitle='Project Details'
                toolBarBtnClick={addUserOnClick}></CustomTable>
        </ThemeProvider>
    );
}
