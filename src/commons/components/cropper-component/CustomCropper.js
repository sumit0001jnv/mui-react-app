import { useState, useRef, useEffect } from 'react';
import 'cropperjs/dist/cropper.css';
import { Cropper } from 'react-cropper';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import uiAction from '../../../store/actions/uiAction';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function CustomCropper() {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    const [cropper, setCropper] = useState();
    let [url, setUrl] = useState('');
    const [templates, setTemplates] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [projectId, setProjectId] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedCropData, setSelectedCropData] = useState('');

    const onPageChange = (page) => {
        if (projectId) {
            axios({
                method: 'post',
                url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-page',
                data: { project_id: projectId, page_num: page }
            }).then(res => {
                setUrl(res.data.file_url);
                setPageNo(() => res.data.page_num);
            }).catch(err => {
                console.log(err);
                dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
            })
        }
    }
    // const imageToBaseUrl = (url) => {
    //     let image;
    //     image = new Image();
    //     image.crossOrigin = 'Anonymous';
    //     image.addEventListener('load', function () {
    //         let canvas = document.createElement('canvas');
    //         let context = canvas.getContext('2d');
    //         canvas.width = image.width;
    //         canvas.height = image.height;
    //         context.drawImage(image, 0, 0);
    //         try {
    //             setUrl(canvas.toDataURL('image/png'));
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     });
    //     image.src = url;
    // }

    useEffect(() => {
        const search = location.search; // could be '?foo=bar'
        const params = new URLSearchParams(search);
        const project_id = params.get('project_id'); // bar
        setProjectId(project_id);

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-page',
            data: { project_id, page_num: pageNo }
        }).then(res => {
            // imageToBaseUrl(res.data.file_url);
            setUrl(res.data.file_url);
            setPageNo(() => res.data.page_num);

        }).catch(err => {
            console.log(err);
            dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
        })

    }, [])

    const getCropData = () => {

        if (typeof cropper !== 'undefined') {
            const { x, y, width, height } = cropper.getData();
            // const { left2, top2, width2, height2 } = cropper.getCropBoxData();
            var rounded = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
            let obj = { cropData: cropper.getCroppedCanvas().toDataURL(), annotationBox: `${rounded(x)},${rounded(y)},${rounded(width)},${rounded(height)}`, annotationName: selectedText, page_num: pageNo, key: selectedText || '' }
            setTemplates([obj, ...templates]);
            setSelectedText('');
            setSelectedCropData('');
            cropper.setDragMode("move");
            cropper.clear();
            // setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };

    const deleteKey = (index) => {
        templates.splice(index, 1);
        setTemplates([...templates]);
    }

    const clearCrop = () => {
        if (typeof cropper !== 'undefined') {
            cropper.clear()
        }
    }

    const navigateBack = () => {
        history.push('/g2-user')
    }

    const theme = useTheme();



    const handleNext = () => {
        onPageChange(pageNo + 1)
    };

    const handleBack = () => {
        onPageChange(pageNo - 1)
    };

    const handleText = (event) => {
        setSelectedText(event.target.value);
    }

    const handleTemplateName = (event) => {
        setSelectedTemplate(event.target.value);
    }

    const enableCrop = () => {
        if (typeof cropper !== 'undefined') {
            cropper.setDragMode("crop");
        }
    }

    const onSave = () => {
        const data = templates.map(template => {
            const { page_num, annotationName, annotationBox } = template;
            return { page_num, annotationName, annotationBox };
        })
        let payload = {
            project_id: projectId,
            template_name: selectedTemplate,
            data
        }

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/save-annotation',
            data: payload
        }).then(res => {
            console.log(res);
            dispatch(uiAction.showSnackbar({ message: 'Template saved successfully', type: 'success' }));
        }).catch(err => {
            console.log(err);
            dispatch(uiAction.showSnackbar({ message: err?.data?.msg || 'Something went wrong.Please try after some time', type: 'error' }));
        })

    }

    return (
        <>
            <Grid container spacing={2} sx={{ px: 2 }}>
                <Grid item xs={7}>
                    <Item>
                        <Grid container spacing={0} alignItems={'center'}>
                            {/* <Button variant="outlined" size="small" sx={{ mb: 1, mr: 1 }} onClick={setCropData} startIcon={<CropIcon />}>Crop Image</Button> */}
                            <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                            <Typography variant='h6' sx={{ ml: 1, mr: 'auto' }}>Create Template</Typography>
                            <Button variant="outlined" size="small" sx={{ mb: 1, mr: 1 }} onClick={clearCrop} >Clear crop box</Button>
                            {/* <Button variant="outlined" size="small" sx={{ mb: 1 }} onClick={restCrop}>Reset crop box</Button> */}
                        </Grid>
                        <Divider />

                        <Cropper
                            style={{ height: 'calc(100vh - 200px)', width: '100%' }}
                            // initialAspectRatio={16 / 9}
                            preview=".img-preview"
                            guides={true}
                            src={url}
                            // src={'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/static/pdfimg/938c575b-9fd1-4f8c-ba3f-e1738a9089b8.png'}
                            ref={imageRef}
                            dragMode={'move'}
                            autoCrop={false}
                            checkCrossOrigin={false}
                            crossOrigin={'anonymous'}
                            checkOrientation={true}
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                        />
                        {/* <MobileStepper
                            variant="dots"
                            steps={10}
                            position="static"
                            activeStep={activeStep}
                            sx={{ flexGrow: 1 }}
                            nextButton={
                                <Button size="small" onClick={handleNext} disabled={activeStep === 10}>
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
                        /> */}
                        <Box conatiner sx={{ width: "100%", display: 'flex', justifyContent: "center" }}>
                            <Button size="small" onClick={handleBack}>
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight />
                                ) : (
                                    <KeyboardArrowLeft />
                                )}
                                Back
                            </Button>
                            <div style={{ fontWeight: 600, lineHeight: 2, padding: '8px' }}>Page No: {pageNo}</div>
                            <Button size="small" onClick={handleNext}>
                                Next
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </Button>
                        </Box>


                    </Item>
                </Grid>
                <Grid item xs={5}>
                    <Item sx={{ height: 'calc(100vh - 116px)' }}>
                        <Typography variant='h6' sx={{ display: "flex", justifyContent: "flex-start", ml: 1 }}>Add Template</Typography>
                        <Grid container spacing={0} sx={{ my: 1 }}>
                            <Grid item xs={7}>
                                <TextField id="outlined-basic" sx={{ display: 'flex', mx: 1, p: 0 }} label="Key" value={selectedText} onChange={handleText} variant="outlined" size="small" />
                            </Grid>
                            <Grid item xs={5} sx={{ m: 0, p: 0 }}>
                                <Button variant='contained' sx={{ mr: 1 }} onClick={enableCrop}>Select</Button>
                                <Button disabled={!(selectedText)} variant='contained' onClick={getCropData}>Add</Button>
                            </Grid>
                        </Grid>
                        <Divider sx={{ mb: 1 }} />
                        <Grid container
                            sx={{ height: 'calc(100vh - 265px)', flexWrap: 'nowrap', overflowY: 'auto' }}
                            direction="column"
                        >
                            {templates.map((temp, index) => {
                                return <Grid container alignItems={'center'} spacing={0} sx={{ mb: 2, p: 1 }}>
                                    <Grid item xs={5}>
                                        <TextField
                                            disabled id="outlined-basic"
                                            sx={{ display: 'flex', mx: 1, p: 0, bgcolor: "#fff" }}
                                            label="Key"
                                            variant="outlined"
                                            size="small"
                                            value={temp.key} />
                                    </Grid>
                                    <Grid container xs={7} spacing={0} sx={{ m: 0, p: 0 }} >
                                        <img style={{ width: "calc(100% - 60px)", minHeight: "40px", maxHeight: "100px", marginRight: "4px", padding: "4px" }} src={temp.cropData} crossOrigin="anonymous" alt="cropped image" />
                                        <IconButton color="secondary" aria-label="add an alarm" onClick={() => deleteKey(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            })}
                        </Grid>
                        <Grid container spacing={0} sx={{ my: 1 }}>
                            <Grid item sx={{ flexGrow: 1 }}>
                                <TextField id="outlined-basic"
                                    sx={{ width: "100%", display: 'flex', mx: 1, p: 0 }}
                                    label="Template Name" variant="outlined" size="small"
                                    value={selectedTemplate} onChange={handleTemplateName}
                                />
                            </Grid>
                            <Grid item xs sx={{ m: 0, p: 0 }}>
                                <Button variant='contained' sx={{ mr: 1 }} color={'success'} disabled={!(selectedTemplate && templates.length)} onClick={onSave}>Save</Button>
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
            </Grid>
        </>

    );
};