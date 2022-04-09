import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PdfViewer from '../cropper-component/PdfViewer';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function CustomMuiDialogue(props) {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    // const [url, setUrl] = useState('/pdf-file.pdf');
    const [zoomVal, setZoomVal] = useState(1);

    // const handleClickOpen = (scrollType) => () => {
    //     setOpen(true);
    //     setScroll(scrollType);
    // };

    const handleClose = () => {
        // setOpen(false);
        props.onSetOpenDialogue(false);
    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        setOpen(props.show);

    }, [props.show]);

    function pageChange(pageNo) {
        if (pageNo <= 0) {
            pageNo = numPages;
        }
        if (!(pageNo % (numPages + 1))) {
            pageNo = 1;
        }
        setPageNumber(pageNo % (numPages + 1));
    }

    function onSetNumPages(num) {
        setNumPages(num);
    }

    function zoom(value) {
        if (value < 0.5) value = 0.5;
        if (value > 4.5) value = 4.5;
        setZoomVal(value)
    }


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                minWidth={'xl'}
                width={'xl'}
                maxWidth={'xl'}

            >
                {/* <DialogTitle id="scroll-dialog-title">Attachment </DialogTitle> */}
                {props.url && <Grid container>
                    <Grid container xs={12}>
                        <Typography variant='h6' sx={{ p: 2, mr: 'auto' }} component={'div'}>Attachment</Typography>
                        <Typography variant="div" gutterBottom component="div" sx={{ pt: 2, mr: 'auto', lineHeight: 2 }}>
                            {props.url.split("/")[props.url.split("/").length - 1]}
                        </Typography>
                        <IconButton aria-label="upload picture" component="span" onClick={handleClose}>
                            <CloseIcon sx={{ fontSize: '34px' }} />
                        </IconButton>
                        {/* <Button onClick={() => zoom(zoomVal + 0.5)}>Zoom In</Button> */}
                        {/* <Button onClick={() => zoom(zoomVal - 0.5)}>Zoom Out</Button> */}
                    </Grid>
                </Grid>}

                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        sx={{ p: 0, m: 0 }}
                    >
                        <PdfViewer url={props.url} pageNumber={pageNumber} zoomVal={zoomVal} onSetNumPages={onSetNumPages}></PdfViewer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/* <Box sx={{ ml: 'auto' }}></Box> */}
                    <IconButton aria-label="upload picture" component="span" onClick={() => pageChange(pageNumber - 1)}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography variant="div" gutterBottom component="div">
                        Page {pageNumber} of {numPages}
                    </Typography>
                    <IconButton aria-label="upload picture" component="span" onClick={() => pageChange(pageNumber + 1)}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <Box sx={{ mr: 'auto' }}></Box>
                    <Button color={'primary'} variant="outlined" endIcon={<ZoomInIcon />} aria-label="upload picture" component="span" onClick={() => zoom(zoomVal + 0.5)}>
                        Zoom In
                    </Button>
                    <Button color={'primary'} variant="outlined" endIcon={<ZoomOutIcon />} sx={{}} aria-label="upload picture" component="span" onClick={() => zoom(zoomVal - 0.5)}>
                        Zoom Out
                    </Button>
                    {/* <Button onClick={handleClose}>Cancel</Button> */}
                </DialogActions>
            </Dialog>
        </div >
    );
}