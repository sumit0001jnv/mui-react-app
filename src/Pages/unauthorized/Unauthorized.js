import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Unauthorized(props) {
    const history = useHistory();
    const navigateBack = (path) => {
        history.push(path)
    }
    return <>
        <Item item sx={{ m: 2, width: 'calc(100vw - 32px)', height: 'calc(100vh - 64px)' }}>
            <Grid container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '100%' }}>
                <Grid item>
                    <Typography gutterBottom variant="h3" component="div">
                        404 Unauthorized
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        You are not authorized to access this page
                    </Typography>
                    <Button size="small" variant='contained' onClick={() => navigateBack('/')} sx={{ mr: 2 }}>Home</Button>
                    <Button size="small" variant='contained' onClick={() => navigateBack('/sign-in')}>Sign In</Button>
                </Grid>


            </Grid>
        </Item>


    </>
}