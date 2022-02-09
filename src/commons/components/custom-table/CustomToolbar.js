import {
    GridToolbarContainer,
} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
export default function CustomToolbar(props) {
    const addUserClick = () => {
        props.addUserClick()
    }
    return (
        <GridToolbarContainer sx={{ padding: '16px', borderBottom: '1px solid #ccc', }}>
            <Grid container spacing={3}>
                <Grid item sx={{ marginRight: 'auto' }} >
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Users
                    </Typography>
                </Grid>
                <Grid item sx={{}}>
                    <Button variant="text" onClick={addUserClick}>
                        + Add User
                    </Button>
                </Grid>
            </Grid>

        </GridToolbarContainer>
    );
}