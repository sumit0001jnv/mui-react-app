import { useState, useRef, useEffect } from 'react';
import 'cropperjs/dist/cropper.css';
import { Cropper } from 'react-cropper';
import { Document, Page, pdfjs } from 'react-pdf';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CropIcon from '@mui/icons-material/Crop';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const defaultSrc = 'image/company-logo.jpeg';

export default function CustomCropper() {
    const [image, setImage] = useState(defaultSrc);
    const [cropData, setCropData] = useState('#');
    const imageRef = useRef(null);
    const [cropper, setCropper] = useState();
    let [url, setUrl] = useState('');
    // const [instance, update] = usePDF({ document });
    pdfjs.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    /*To Prevent right click on screen*/
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    /*When document gets loaded successfully*/
    function onDocumentLoadSuccess(obj) {
        // obj.getPage(1).then(x => {
        //     console.log(x);
        // });
        setTimeout(() => {
            obj.getPage(1).then((page) => {
                var scale = 1.5;
                var viewport = page.getViewport(scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                // var canvas = document.getElementsByClassName('react-pdf__Page__canvas')[0];
                var canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                //
                // Render PDF page into canvas context
                //
                var task = page.render({ canvasContext: context, viewport: viewport })
                task.promise.then(function () {
                    console.log(canvas.toDataURL('image/png'));
                });
            });
        }, 1000)
        setNumPages(obj.numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }


    ///////////

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        const base64toBlob = (data) => {
            // Cut the prefix `data:application/pdf;base64` from the raw base 64
            const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

            const bytes = atob(base64WithoutPrefix);
            let length = bytes.length;
            let out = new Uint8Array(length);

            while (length--) {
                out[length] = bytes.charCodeAt(length);
            }

            return new Blob([out], { type: 'application/pdf' });
        };
        reader.onload = () => {
            // setImage(pdfAsArray[0]);
            const blob = base64toBlob(reader.result);
            const url = URL.createObjectURL(blob);
            // setImage(url);
            setUrl(url)

        };

        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropper !== 'undefined') {
            setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };

    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <Grid container spacing={2} sx={{ px: 2 }}>
                <Grid item xs={7}>
                    <Item>
                        <Button variant="outlined" sx={{ mb: 1 }} onClick={getCropData} startIcon={<CropIcon />}>Crop Image</Button>
                        <Cropper
                            style={{ height: 'calc(100vh - 208px)', width: '100%' }}
                            // initialAspectRatio={16 / 9}
                            preview=".img-preview"
                            guides={true}
                            src={'/test.png'}
                            ref={imageRef}
                            dragMode={'move'}
                            checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                        />
                        <MobileStepper
                            variant="dots"
                            steps={10}
                            position="static"
                            activeStep={activeStep}
                            sx={{ flexGrow: 1 }}
                            nextButton={
                                <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
                                    Next
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                    ) : (
                                        <KeyboardArrowRight />
                                    )}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}
                                    Back
                                </Button>
                            }
                        />
                    </Item>
                </Grid>
                <Grid item xs={5}>
                    <Item>
                        <Grid container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            <div xs={6}>Text here</div>
                            <img xs={6} style={{ width: '100%' }} src={cropData} alt="cropped image" />
                        </Grid>
                    </Item>
                </Grid>
            </Grid>
        </>

    );
};