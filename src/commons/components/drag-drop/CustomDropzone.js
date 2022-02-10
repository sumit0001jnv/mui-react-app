import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';

export default function CustomDropzone() {
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true,
        multiple: false ,
        accept: '.pdf'
    });

    const files = acceptedFiles.map(file => (
        <li key={file.path} style={{ color: '#d2691e' }}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <>
            <Container sx={{bgcolor:'#f58700',p:6}}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: '2px dashed #42aaee', p: 4, bgcolor: '#fff',borderRadius:'8px' }}
                    {...getRootProps()}>
                    <Grid item sx={{ mb: 1 }}>
                        <img src="/images/pdf-icon.svg" alt="pdf file" width="60"></img>
                    </Grid>
                    <Grid item sx={{ mb: 2 }}>
                        <input {...getInputProps()}/>
                        <Button onClick={open} variant={'contained'}>
                            Choose PDF file
                        </Button>
                    </Grid>
                    <Grid item >
                        <Typography variant='div' sx={{ textAlign: 'center' }}>Or Drag 'n' drop PDF file here</Typography>
                    </Grid>
                    <Grid item xs>
                        <ul>{files}</ul>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}