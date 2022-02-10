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
            field: 'name',
            headerName: 'Name',
            minWidth: 300,
            flex: 3,
            // cellClassName: clsx('odd-column-cell-color'),
            // headerClassName:'odd-column-cell-color'
        },
        {
            field: 'email',
            headerName: 'Email',
            // width: 250,
            // minWidth: 'auto',
            minWidth: 300,
            flex: 3
        },
        {
            field: 'password',
            headerName: 'Password',
            minWidth: 150,
            flex: 1,
            // cellClassName: clsx('odd-column-cell-color'),
            // headerClassName:'odd-column-cell-color'
        },
        {
            field: 'group',
            headerName: 'Group',
            // width: 120,
            minWidth: 120,
            flex: 1,

        },
        {
            field: 'mobile_no',
            headerName: 'Mobile No',
            type: 'number',
            minWidth: 120,
            flex: 1,
            // cellClassName: clsx('odd-column-cell-color'),
            // headerClassName:'odd-column-cell-color'
        },
        {
            field: 'tableAction',
            headerName: 'Actions',
            type: 'tableAction',
            minWidth: 130,
            renderCell: (params) => <><IconButton size="small" onClick={() => handleClick(params.row)('edit')}><EditIcon color={'secondary'} /></IconButton><IconButton size="small" onClick={() => handleClick(params.row)('delete')}><DeleteIcon color={'red'} /></IconButton></>,
            flex: 1
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
            <CustomTable actionData={actionData} columns={columns} apiUrl={'https://jsonplaceholder.typicode.com/posts'}></CustomTable>
        </ThemeProvider>
    );
}
