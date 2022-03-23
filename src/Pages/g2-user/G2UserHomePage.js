import { useState, useEffect, memo, useRef } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import theme from '../../theme/customTheme';
import { ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../commons/components/header/Header';
import renderCellExpand from '../../commons/components/grid-cell-expand/GridCellExpand';



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
            minWidth: 120,
            flex: 2,
            renderCell: (params) => <><Chip label={params?.row?.status || 'success'} color={getColor(params?.row.status)} size="small" /></>,
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
            minWidth: 240,
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
    const [drawerState, setDrawerState] = useState({ [initialDrawerPos]: false });
    const [notificationCount, setNotificationCount] = useState(0);

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
                    name: row[1],
                    email: row[2],
                    status: row[5] === "0" ? "error" : row[5] == "1" ? "pending" : "completed",
                    message: row[3],
                    date: row[4],
                    body: row[6],
                    id: row[0]
                }
            })
            setNotificationCount(_tableData.filter(row => row.status === 'pending').length);

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
