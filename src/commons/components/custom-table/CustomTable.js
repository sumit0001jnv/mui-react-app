import {
    DataGrid,
} from '@mui/x-data-grid';
import CustomLoadingOverlay from './CustomeLoadingOverlay';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import CustomPagination from './CustomPagination';
import CustomToolbar from './CustomToolbar';
import UserForm from './UserForm';
import Header from '../header/Header';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';

export default function CustomTable(props) {
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        props.onDrawerStateChange({ [anchor]: open });
    };
    const addUserClick = () => {
        props.toolBarBtnClick();
    }
    const onDataChange = (data) => {
        props.submitFormAction(data);
    }
    const onRefresh = () => {
        props.refreshTable();
    }

    return (
        <>
            <Typography variant="div" component="div" sx={{ margin: 4, backgroundColor: "#fff", display: 'flex', height: 'calc(100vh - 128px)', flexGrow: 1 }}>
                <DataGrid
                    rows={props.tableData || []}
                    columns={props.columns || []}
                    pagination
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                        Pagination: CustomPagination,
                        LoadingOverlay: CustomLoadingOverlay,
                        Toolbar: props.showToolbar ? CustomToolbar : null,
                    }}
                    loading={props.loading}
                    componentsProps={{
                        toolbar: {
                            addUserClick,
                            onRefresh,
                            hideBtn: props.hideActionBtn,
                            title: props.toolbarTitle
                        }
                    }}
                    disableSelectionOnClick
                />
                {props.drawer ?
                    <Drawer
                        anchor={props.drawer.type}
                        open={props.drawerState[props.drawer.type]}
                        onClose={toggleDrawer(props.drawer.type, false)}
                    >
                        <UserForm actionLabel={props.actionLabel} formData={props.actionFormData} onFormSubmit={onDataChange} closeDrawer={toggleDrawer(props.drawer.type, false)}></UserForm>
                    </Drawer> : ''}


            </Typography>
        </>

    );
}
