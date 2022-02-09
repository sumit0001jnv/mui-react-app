import { useState } from 'react';
import axios from 'axios';
import CustomTable from '../../commons/components/custom-table/CustomTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function AdminHomePage() {
    const columns = [
        // { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 250,
            // resizable:true
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: 'password',
            headerName: 'Password',
            width: 150,
        },
        {
            field: 'group',
            headerName: 'Group',
            width: 120,
        },
        {
            field: 'mobile_no',
            headerName: 'Mobile No',
            type: 'number',
            width: 150,
        },
        {
            field: 'tableAction',
            headerName: 'Actions',
            type: 'tableAction',
            width: 100,
            renderCell: (params) => <><EditIcon color={'secondary'} sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleClick(params.row)('edit')} /><DeleteIcon color={'error'} sx={{ cursor: 'pointer' }} onClick={() => handleClick(params.row)('delete')} /></>
        }
    ];

    const handleClick = (data) => (type) => {
        console.log(data)
        // setformData({ ...formData, ...data });
        // setActionLabel(type);
        // console.log(type);

        // setDrawerState({ right: true });
    }



    return (
        <CustomTable columns={columns} apiUrl={'https://jsonplaceholder.typicode.com/posts'}></CustomTable>
    );
}
