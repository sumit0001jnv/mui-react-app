import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../commons/components/header/Header';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Divider } from '@mui/material';
import ConfirmationDialogue from '../../commons/components/confirmation-dialogue/ConfirmationDialogue';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function FinalQuoteDecision(props) {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);
    const [saving, setSaving] = useState(false);
    const [g3User, setG3user] = useState({ id: '', name: '' });
    const [isReply, setIsReply] = useState(true);
    const [openConfirmationDialogue, setOpenConfirmationDialogue] = useState(false);
    const [dialogueBody, setDialogueBody] = useState({ header: '', content: '' });
    const [projectId, setProjectId] = useState('');

    ////

    const columns = [
        {
            field: 'attribute',
            headerName: 'Attribute',
            flex: 5
        },
        {
            field: 'value',
            headerName: 'Value',
            flex: 5
        },
        {
            field: 'action',
            headerName: <IconButton color="secondary" aria-label="upload picture" sx={{ p: 0 }} component="span" onClick={addRow}>
                <AddIcon />
            </IconButton>,
            flex: 2
        },
    ];

    ////


    function ID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const navigateBack = () => {
        history.push(`/quote-detail?project_id=${projectId}&isInitialQuote=false&g3User=${JSON.stringify(g3User)}`);
    }

    function addRow() {
        setTableData((data) => {
            return [{ attribute: '', value: '', id: ID() }, ...data];
        })
    }

    const removeRow = (index) => {
        setTableData((data) => {
            data.splice(index, 1)
            return [...data];
        })
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            tableData,
            result.source.index,
            result.destination.index
        );

        setTableData(() =>
            items
        );
    }

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "#fff",
        // padding: '4px',
        width: '900px',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 320px)',
        height: 'calc(100vh - 320px)',
        flexWrap: 'nowrap',
        overflowY: 'auto'
    });

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        // padding: '4px',

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "#fff",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const handleText = (event, rowIndex, field) => {
        setTableData((data) => {
            data[rowIndex][field] = event.target.value;
            return [...data];
        })
    }

    function onReply() {
        setOpenConfirmationDialogue(true);
        setDialogueBody({ header: 'Reply', content: 'Are you sure you want to reply?' });
    }

    function handleAccept(accepted) {
        setOpenConfirmationDialogue(true);
        setDialogueBody({ header: accepted ? 'Accept' : 'Decline', content: `Are you sure you want to ${accepted ? 'Accept' : 'Decline'} this quote?` });

    }

    function onClose(isAgree) {
        if (isAgree) {
        }
        console.log(isAgree);
        setOpenConfirmationDialogue(false);
    }

    ///

    useEffect(() => {
        const search = location.search;
        const params = new URLSearchParams(search);
        const project_id = params.get('project_id');
        const g3User = JSON.parse(params.get('g3User'));
        const isReply = params.get('reply') === 'true';
        setG3user(() => { return { ...g3User } });
        setIsReply(isReply);
        setProjectId(project_id);
        axios({
            method: 'post',
            url: 'http://ec2-3-71-77-204.eu-central-1.compute.amazonaws.com/api/extract-data',
            data: { project_id }
        }).then(res => {
            setTableData(() => {
                return (res.data.data || []).map(row => {
                    return {
                        attribute: row.name,
                        value: row.text,
                        id: ID()
                    }
                })
            })

        }).catch(err => {
            console.log(err);
        })
    }, [])

    return <>
        <Header hideNotification></Header>
        <Item sx={{ m: 2, px: 2, }}>
            <Grid container spacing={0} justifyContent={'center'} sx={{ height: 'calc(100vh - 116px)' }}>
                <Grid item container xs={12} justifyContent={'center'}>
                    <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', border: '1px solid #ccc' }}>
                        <Grid container justifyContent={'flex-end'} alignItems={'center'} sx={{ px: 1, py: 2 }}>
                            <IconButton aria-label="add an alarm" onClick={() => navigateBack()}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                            <Typography variant='h6' sx={{ ml: 0, mr: 'auto' }}>Requested Quote</Typography>
                        </Grid>
                        <Grid container justifyContent={'center'}>
                            {columns.map((col) => {
                                return <>
                                    <Grid item xs={col.flex} sx={{ p: 2, borderBottom: '1px solid #ccc', bgcolor: "turquoise" }}>
                                        <div style={{ fontWeight: 600 }}>{col.headerName}</div>
                                    </Grid>
                                </>
                            })}
                        </Grid>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) =>
                                    <Grid  {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)} container spacing={0} direction="column">
                                        {tableData.map((row, i) => {
                                            return <>
                                                <Draggable key={row.id} draggableId={row.id} index={i}>
                                                    {(provided, snapshot) => (

                                                        <Grid
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                            container justifyContent={'center'}>
                                                            {columns.map((col, index) => {
                                                                return <>
                                                                    <Grid item xs={col.flex} sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
                                                                        {index == 2 ? <IconButton color="error" aria-label="add an alarm" onClick={() => removeRow(i)}>
                                                                            <DeleteIcon />
                                                                        </IconButton> : <TextField id="outlined-size-normal" size={'small'} value={row[col.field]} onChange={(event) => handleText(event, i, col.field)} sx={{ width: '100%', color: "#ccc" }} />}
                                                                    </Grid>
                                                                </>
                                                            })}
                                                        </Grid>
                                                    )}
                                                </Draggable>
                                            </>
                                        })}
                                        {provided.placeholder}
                                    </Grid>
                                }
                            </Droppable>
                        </DragDropContext>
                        <Divider></Divider>
                        <Grid container justifyContent={'flex-end'} sx={{ p: 2 }}>
                            <TextField disabled size={'small'} sx={{ flexGrow: 1, mr: 2 }} value={'test g3 user'} label="Group 3 User" placeholder='Select Group 3 user' />
                            {isReply ? <LoadingButton
                                loading={saving}
                                loadingPosition="start"
                                endIcon={<SendIcon />}
                                variant="contained"
                                onClick={onReply}
                                size={'small'}
                                disabled={!tableData.length}
                            >
                                Reply
                            </LoadingButton> : <>
                                <LoadingButton
                                    loading={saving}
                                    loadingPosition="start"
                                    endIcon={<SendIcon />}
                                    variant="contained"
                                    onClick={() => handleAccept(false)}
                                    size={'small'}
                                    disabled={!tableData.length}
                                    sx={{ mr: 2 }}
                                    color={'error'}
                                >
                                    Decline
                                </LoadingButton>
                                <LoadingButton
                                    loading={saving}
                                    loadingPosition="start"
                                    endIcon={<SendIcon />}
                                    variant="contained"
                                    onClick={() => handleAccept(true)}
                                    size={'small'}
                                    disabled={!tableData.length}
                                    color={'success'}
                                >
                                    Accept
                                </LoadingButton>
                            </>}

                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Item>
        <ConfirmationDialogue open={openConfirmationDialogue} close={onClose} header={dialogueBody.header || 'Reply'} content={dialogueBody.content || 'Are you sure you want to reply?'}></ConfirmationDialogue>
    </>
}