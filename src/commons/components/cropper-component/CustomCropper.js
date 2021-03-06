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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PreviewIcon from '@mui/icons-material/Preview';
import CustomActionList from '../CustomActionList';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function CustomCropper() {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    const [cropper, setCropper] = useState();
    let [url, setUrl] = useState('');
    let [boxUrl, setBoxUrl] = useState('');
    let [user_id, setUserId] = useState('');
    const [templates, setTemplates] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [fileName, setFileName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [value, setValue] = useState(0);
    const [exitingTemplates, setExitingTemplates] = useState([]);
    const [isPreviewed, setIsPreviewed] = useState(false);
    const [quoteTableData, setQuoteTableData] = useState([]);
    const [templateId, setTemplateId] = useState('');
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [zoomVal, setZoomVal] = useState(1);
    // const [loading, setLoading] = useState(false);

    const columns = [
        {
            field: 'attribute',
            headerName: 'Attribute',
            flex: 5
        },
        {
            field: 'value',
            headerName: 'Value',
            flex: 6
        },
        {
            field: 'action',
            headerName: '',
            flex: 1
        },
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTemplateId(null);
        setIsPreviewed(false);
    };

    const getCanvasFromUrl = async (url, page = 1) => {
        return new Promise((resolve, reject) => {
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext("2d");
            var myImg = new Image();
            myImg.onload = function () {
                canvas.width = myImg.width;
                canvas.height = myImg.height;
                ctx.drawImage(myImg, 0, 0, myImg.width, myImg.height);
                var context = canvas.getContext('2d');
                context.beginPath();
                // context.setLineDash([5, 15]);
                if (isPreviewed) {
                    for (let template of quoteTableData) {
                        if (Number(template.page_num) === page) {
                            const pos = template.annotationBox;
                            context.rect(pos[0], pos[1], pos[2], pos[3]);
                        }
                    }
                } else {
                    for (let template of templates) {
                        if (template.page_num === page) {
                            const pos = template.annotationBox.split(",");
                            context.rect(pos[0], pos[1], pos[2], pos[3]);
                        }
                    }
                }

                // context.rect(571.27, 506.82, 151.02, 27);
                // context.rect(571.27, 806.82, 151.02, 27);
                context.lineWidth = 2;
                context.strokeStyle = 'red';
                context.stroke();
                resolve(canvas.toDataURL())
            };
            myImg.src = url;
            // myImg.src = 'https://images.unsplash.com/photo-1572800578930-fd1013b506c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80';
            myImg.crossOrigin = "anonymous"
        })

    }

    useEffect(() => {
        getCanvasFromUrl(url, pageNo).then(res2 => {
            setBoxUrl(res2);
        })
    }, [templates, isPreviewed, quoteTableData])

    const onPageChange = (page) => {
        if (projectId) {
            axios({
                method: 'post',
                url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-page',
                data: { project_id: projectId, page_num: page }
            }).then(res => {
                if (res.data.message === 'Failed') {
                    dispatch(uiAction.showSnackbar({ message: res.data.message, type: 'error' }));
                    return;
                }
                setUrl(res.data.file_url);
                setPageNo(() => res.data.page_num);
                getCanvasFromUrl(res.data.file_url, res.data.page_num).then(res2 => {
                    setBoxUrl(res2);
                })
                setFileName(() => res.data.file_name);
            }).catch(err => {
                console.log(err);
                setFileName(() => '');
                dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
            })
        }
    }
    useEffect(() => {
        const search = location.search; // could be '?foo=bar'
        const params = new URLSearchParams(search);
        const project_id = params.get('project_id'); // bar
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        const user_id = userData.user_id;
        setUserId(user_id);
        setProjectId(project_id);

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-page',
            data: { project_id, page_num: pageNo }
        }).then(res => {
            if (res.data.message === 'Failed') {
                dispatch(uiAction.showSnackbar({ message: res.data.message, type: 'error' }));
                return;
            }
            setUrl(res.data.file_url);
            getCanvasFromUrl(res.data.file_url, res.data.page_num).then(res2 => {
                setBoxUrl(res2);
            })
            setPageNo(() => res.data.page_num);
            setFileName(() => res.data.file_name);

        }).catch(err => {
            console.log(err);
            setFileName(() => '');
            dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
        })

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/get-user-templates',
            data: { user_id }
        }).then(res => {
            if (res.data.message === 'Failed') {
                dispatch(uiAction.showSnackbar({ message: res.data.message, type: 'error' }));
                return;
            }

            const templates = res.data.templates
                .filter(template => template[2])
                .map(template => {
                    return { id: template[0], name: template[1] }
                });

            setExitingTemplates([...templates]);

        }).catch(err => {
            console.log(err);
            dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
        })



    }, [])

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            templates,
            result.source.index,
            result.destination.index
        );

        setTemplates(() =>
            items
        );
    }

    function reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const getCropData = () => {

        if (typeof cropper !== 'undefined') {
            const { x, y, width, height } = cropper.getData();
            // const { left2, top2, width2, height2 } = cropper.getCropBoxData();
            var rounded = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

            let obj = { id: ID(), cropData: cropper.getCroppedCanvas().toDataURL(), annotationBox: `${rounded(x)},${rounded(y)},${rounded(width)},${rounded(height)}`, annotationName: selectedText, page_num: pageNo, key: selectedText || '' }
            setTemplates([obj, ...templates]);
            setSelectedText('');
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
        setLoadingBtn(true);
        setTemplateId(null);
        const data = templates.map(template => {
            const { page_num, annotationName, annotationBox } = template;
            return { page_num, annotationName, annotationBox };
        })
        let payload = {
            project_id: projectId,
            template_name: selectedTemplate,
            user_id,
            data
        }

        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/save-annotation',
            data: payload
        }).then(res => {
            setLoadingBtn(false);
            setTemplateId(() => res.data.template_id);
            dispatch(uiAction.showSnackbar({ message: res?.data?.message || 'Template saved successfully', type: 'success' }));
        }).catch(err => {
            console.log(err);
            setLoadingBtn(false);
            dispatch(uiAction.showSnackbar({ message: err?.data?.message || 'Something went wrong.Please try after some time', type: 'error' }));
        })

    }

    function ID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const onPreview = (templateId) => {
        setTemplateId(templateId);
        setIsPreviewed(true);
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/extract-data',
            data: { project_id: projectId, template_id: templateId }
        }).then(res => {
            if (!res.data.status) {
                dispatch(uiAction.showSnackbar({ message: res.data.message, type: 'error' }));
                return;
            }
            setQuoteTableData(() => [...res.data.data.map(row => {
                return {
                    attribute: row.name,
                    value: row.text,
                    annotationBox: row.loc,
                    page_num: row.page_num,
                    id: ID()
                }
            })])
        }).catch(err => {
            console.log(err);
            dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
        })

    }

    const onSetTableData = (data) => {
        setQuoteTableData(() => [...data]);
    }

    const onSaveQuote = (data) => {
        setLoadingBtn(true);
        let obj = {};
        data.forEach(element => {
            obj[element.attribute] = element.value;
        });
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/save-g2-project-data',
            data: { project_id: projectId, template_id: templateId, project_data: obj }
        }).then(res => {
            setLoadingBtn(false);
            if (res.data.message === 'Failed') {
                dispatch(uiAction.showSnackbar({ message: res.data.message, type: 'error' }));
                return;
            }
            dispatch(uiAction.showSnackbar({ message: res.data.message, type: 'success' }));
        }).catch(err => {
            console.log(err);
            setLoadingBtn(false);
            dispatch(uiAction.showSnackbar({ message: 'Something went wrong.Please try after some time', type: 'error' }));
        })
    }

    const addRow = () => {
        setQuoteTableData((data) => [{ attribute: '', value: '', annotationBox: '', page_num: '' }, ...data]);
    }


    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: '4px',
        // margin: `0 0 ${4}px 0`,

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "#fff",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "#fff",
        padding: '4px',
        maxWidth: '100%',
        height: 'calc(100vh - 310px)',
        height: 'calc(100vh - 310px)',
        flexWrap: 'nowrap',
        overflowY: 'auto'
    });

    function zoom(isZoomable = true) {
        // if (value < 0.1) value = 0.1;
        // if (value > 4.5) value = 4.5;
        // setZoomVal(value)
        if (isZoomable) {
            cropper.zoom(0.1);
        } else {
            cropper.zoom(-0.1);

        }
    }


    return (
        <>
            <Grid container spacing={2} sx={{ px: 2 }}>
                <Grid item xs={7}>
                    <Item>
                        <Grid container spacing={0} alignItems={'center'}>
                            <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                            <Typography variant='h6' sx={{ ml: 1, mr: 'auto' }}>Create Template</Typography>
                            <Button color={'primary'} size="small" variant="outlined" endIcon={<ZoomInIcon />} sx={{ mr: 1 }} aria-label="upload picture" component="span" onClick={() => zoom()}>
                                Zoom In
                            </Button>
                            <Button color={'primary'} size="small" variant="outlined" endIcon={<ZoomOutIcon />} sx={{ mr: 1 }} aria-label="upload picture" component="span" onClick={() => zoom(false)}>
                                Zoom Out
                            </Button>
                            <Button variant="outlined" size="small" sx={{}} onClick={clearCrop} >Clear crop box</Button>

                        </Grid>
                        <Typography variant="div" title={fileName} gutterBottom component="div" sx={{
                            pt: 0, mr: 'auto',
                            lineHeight: 2,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',

                        }}>
                            Attachement: <i>{fileName}</i>
                        </Typography>
                        <Divider />

                        <Cropper
                            style={{ height: 'calc(100vh - 232px)', width: '100%' }}
                            // initialAspectRatio={16 / 9}
                            preview=".img-preview"
                            guides={true}
                            src={boxUrl}
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
                        <Box conatiner sx={{ width: "100%", display: 'flex', justifyContent: "center" }}>
                            <Button size="small" onClick={handleBack}>
                                <KeyboardArrowLeft />
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
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            centered>
                            <Tab label="Add Template" />
                            <Tab label="Existing Templates" />
                        </Tabs>

                        <TabPanel value={value} index={0}>
                            {!isPreviewed ? <>
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
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) =>
                                            <Grid  {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)} container
                                                direction="column"
                                            >
                                                {templates.map((temp, index) => {
                                                    return <Draggable key={temp.id} draggableId={temp.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <Grid ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )} container alignItems={'center'} spacing={0} sx={{ mb: 2, p: 1, borderBottom: '1px solid #ccc' }}>
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
                                                            </Grid>)}
                                                    </Draggable>
                                                })}
                                                {provided.placeholder}
                                            </Grid>
                                        }
                                    </Droppable>
                                </DragDropContext>
                                <Grid container direction={'row'} spacing={0} sx={{ my: 1 }}>
                                    <Grid item xs={6}>
                                        <TextField id="outlined-basic"
                                            sx={{ display: 'flex', mx: 1, p: 0 }}
                                            label="Template Name" variant="outlined" size="small"
                                            value={selectedTemplate} onChange={handleTemplateName}
                                        />
                                    </Grid>
                                    <Grid item direction={'row'} sx={{ ml: 'auto', p: 0 }}>
                                        <Button variant='contained' sx={{ mr: 1 }} color={'success'} disabled={!(selectedTemplate && templates.length)} onClick={onSave}>Save</Button>
                                        <Button variant="contained" disabled={!templateId} startIcon={<PreviewIcon />} sx={{ mr: 1 }} onClick={() => onPreview(templateId)}>
                                            Preview
                                        </Button>
                                    </Grid>
                                </Grid>
                            </> : <>
                                <Grid container alignItems={'center'} spacing={0} sx={{ mb: 1, p: 0 }}>
                                    <IconButton aria-label="add an alarm" sx={{ p: 0, m: 0 }} onClick={() => setIsPreviewed(false)}>
                                        <KeyboardBackspaceIcon />
                                    </IconButton>
                                    <Typography variant='span' sx={{ display: "flex", justifyContent: "flex-start", ml: 1, mr: 'auto', fontWeight: "500" }}>Quote Detail</Typography>
                                    <Button variant='contained' size={'small'} sx={{ mr: 1 }} onClick={addRow}>Add</Button>
                                </Grid>
                                <Grid container
                                    sx={{ maxHeight: 'calc(100vh - 216px)' }}
                                    direction="column"
                                >
                                    <CustomActionList columns={columns} tableData={quoteTableData} onDataChange={onSetTableData}
                                        actionBtnText='Confirm' onSave={onSaveQuote} loadingBtn={loadingBtn}></CustomActionList>
                                </Grid></>}







                        </TabPanel>
                        <TabPanel value={value} index={1} sx={{ m: 1 }}>
                            {!isPreviewed ? <><Typography variant='span' sx={{ display: "flex", justifyContent: "flex-start", ml: 1, mb: 1, fontWeight: "500" }}>Existing Templates</Typography>
                                <Grid container
                                    sx={{ height: 'calc(100vh - 210px)', flexWrap: 'nowrap', overflowY: 'auto' }}
                                    direction="column"
                                >
                                    {exitingTemplates.map((temp) => {
                                        return <Grid container alignItems={'center'} spacing={0} sx={{ mb: 2, p: 1 }}>
                                            <Grid item sx={{ flexGrow: 1, mr: 2 }}>
                                                <TextField
                                                    disabled
                                                    id="outlined-basic"
                                                    sx={{ display: 'flex', mr: 0, p: 0, bgcolor: "#fff" }}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={temp.name} />
                                            </Grid>
                                            <Grid item xs sx={{ m: 0, p: 0 }} >
                                                <Button variant="contained" startIcon={<PreviewIcon />} onClick={() => onPreview(temp.id)}>
                                                    Preview
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    })}
                                </Grid> </> : <>
                                <Grid container alignItems={'center'} spacing={0} sx={{ mb: 1, p: 0 }}>
                                    <IconButton aria-label="add an alarm" sx={{ p: 0, m: 0 }} onClick={() => setIsPreviewed(false)}>
                                        <KeyboardBackspaceIcon />
                                    </IconButton>
                                    <Typography variant='span' sx={{ display: "flex", justifyContent: "flex-start", ml: 1, mr: 'auto', fontWeight: "500" }}>Quote Detail</Typography>
                                    <Button variant='contained' size={'small'} sx={{ mr: 1 }} onClick={addRow}>Add</Button>
                                </Grid>
                                <Grid container
                                    sx={{ maxHeight: 'calc(100vh - 216px)' }}
                                    direction="column"
                                >
                                    <CustomActionList columns={columns} tableData={quoteTableData} onDataChange={onSetTableData}
                                        actionBtnText='Confirm' onSave={onSaveQuote} loadingBtn={loadingBtn}></CustomActionList>
                                </Grid>
                            </>}
                        </TabPanel>
                    </Item>
                </Grid>
            </Grid>
        </>

    );
};