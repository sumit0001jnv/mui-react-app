import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import Chip from '@mui/material/Chip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../commons/components/header/Header';
import renderCellExpand from '../../commons/components/grid-cell-expand/GridCellExpand';

export default function G2bLandingPage() {
    const history = useHistory();
    const statusMap = {
        "0": "Error",
        "1": "Pending",
        "2": "Quote Requested",
        "3": "Accepted",
        "4": "Declined"
    }
    const getColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Declined':
                return 'error';
            case 'Quote Requested':
                return 'primary';
            default:
                return 'error';

        }
    }
    const columns = [
        // {
        //     field: 'group',
        //     headerName: 'Group',
        //     minWidth: 200,
        //     flex: 2,
        // },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            flex: 2,
            renderCell: renderCellExpand
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            flex: 2,
            renderCell: renderCellExpand
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 2,
            renderCell: (params) => <><Chip label={params?.row?.status || 'Pending'} color={getColor(params?.row.status)} size="small" /></>,
            // renderCell: (params) => <><Chip label={params?.row?.status ||'pending'} color={params?.row?.status||'success'} size="small" /></>,
        },
        {
            field: 'date',
            headerName: 'Date',
            minWidth: 150,
            flex: 2,
            renderCell: renderCellExpand
        },
        {
            field: 'message',
            headerName: 'Message',
            minWidth: 300,
            flex: 2,
            renderCell: renderCellExpand
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
    const [notificationCount, setNotificationCount] = useState(0);
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
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-g2b-user-projects',
        }).then(res => {
            let _tableData = (res.data.projects_data || []).map((row, i) => {
                return {
                    name: row[1],
                    email: row[2],
                    status: statusMap[row[5]],
                    message: row[3],
                    subject: row[3],
                    body: row[3],
                    date: row[4],
                    id: row[0]
                }
            })
            setNotificationCount(_tableData.filter(row => row.status === 'Pending').length);
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
        history.push({
            pathname: '/quote-detail',
            // state: { project_id: row.id },
            search: `?project_id=${row.id}&isInitialQuote=${row.status == 'Pending'}`,
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
            <Header notificationCount={notificationCount}></Header>
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
