import {
    GridToolbarContainer,
} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
export default function CustomToolbar(props) {
    const addUserClick = () => {
        props.addUserClick()
    }
    const refreshTable = () => {
        props.onRefresh()
    }
    return (
        <GridToolbarContainer sx={{ padding: '16px', borderBottom: '1px solid #ccc', }}>
            <Grid container spacing={3}>
                <Grid item sx={{ marginRight: 'auto' }} >
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {props.title || ''}
                    </Typography>
                </Grid>
                <Grid item sx={{}}>
                    <IconButton variant="text" onClick={refreshTable}>
                        <RefreshIcon />
                    </IconButton>
                    {props.hideBtn ?
                        '' :
                        <Button variant="text" onClick={addUserClick}>
                            + Add User
                        </Button>
                    }


                </Grid>
            </Grid>

        </GridToolbarContainer>
    );
}