import { useState } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import theme from '../../theme/customTheme';
import clsx from 'clsx';
import { ThemeProvider } from '@mui/material/styles';


export default function AdminHomePage() {
    const columns = [
        {
            field: 'username',
            headerName: 'Name',
            minWidth: 300,
            flex: 2,
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 300,
            flex: 2,
        },
        {
            field: 'password',
            headerName: 'Password',
            minWidth: 150,
            flex: 2,
        },
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
    let [actionData, setActionData] = useState({ formData: null, type: 'create', drawerState: { right: false } })

    const handleClick = (data) => (type) => {
        console.log(data)
        setActionData({ formData: data, type: type, drawerState: { right: true } });
        // setformData({ ...formData, ...data });
        // setActionLabel(type);
        // console.log(type);

        // setDrawerState({ right: true });
    }



    return (
        <ThemeProvider theme={theme}>
            <CustomTable actionData={actionData} columns={columns} apiUrl={'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/get-user-list'}></CustomTable>
        </ThemeProvider>
    );
}
