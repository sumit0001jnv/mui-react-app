import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PdfViewer from '../cropper-component/PdfViewer';

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
        if (pageNo == 0) {
            pageNo = numPages;
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
            >
                <DialogTitle id="scroll-dialog-title">Attachment </DialogTitle>
                <Grid container>
                    <Grid container xs={12} alignItems={'center'} >
                        <Button onClick={() => pageChange(pageNumber - 1)}>Previous</Button>
                        <Typography variant="div" gutterBottom component="div">
                            Page {pageNumber} of {numPages}
                        </Typography>
                        <Button onClick={() => pageChange(pageNumber + 1)} sx={{ mr: 'auto' }}>Next</Button>
                        <Button onClick={() => zoom(zoomVal + 0.5)}>Zoom In</Button>
                        <Button onClick={() => zoom(zoomVal - 0.5)}>Zoom Out</Button>
                    </Grid>
                </Grid>

                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <PdfViewer url={props.url} pageNumber={pageNumber} zoomVal={zoomVal} onSetNumPages={onSetNumPages}></PdfViewer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* <Button color="success" onClick={handleClose}>ok</Button> */}
                </DialogActions>
            </Dialog>
        </div>
    );
}