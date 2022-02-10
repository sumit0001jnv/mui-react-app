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
const tableData = [
    { id: 1, name: 'Sumit Kumar', email: 'abc@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "A" },
    { id: 2, name: 'Avinash Patel', email: 'apddddddddddddd@gmail.com', password: "aafa-ms", mobile_no: '12351614151', group: "B" },
    { id: 3, name: 'Justin Biber', email: 'jb@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "Group C" },
    { id: 4, name: 'Ed Seeran', email: 'abc@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "Group A" },
    { id: 5, name: 'Salena Gomez', email: 'abc@gmail.com', password: "aafa-ms", mobile_no: '42451614151', group: "Group A" }
];

export default function CustomTable(props) {
    const [drawerState, setDrawerState] = useState({
        right: false
    });

    const [columns, setColumns] = useState(props.columns);
    // const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then((data) => data.json())
            .then((data) => {
                console.log('data',data)
                // setTableData(data);
                setLoading(false);
            })
    }, []);
    
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

        setDrawerState({ right: true });
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
                        toolbar: { addUserClick }
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
