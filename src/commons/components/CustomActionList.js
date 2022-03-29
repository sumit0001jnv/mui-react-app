import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

export default function CustomActionList(props) {

    const [columns, setColumns] = useState(props.columns || []);
    const [tableData, setTableData] = useState(props.tableData || []);

    useEffect(() => {
        setTableData([...props.tableData])
    }, [props.tableData])

    useEffect(() => {
        setColumns([...props.columns])
    }, [props.columns])

    const handleText = (event, rowIndex, field) => {
        let data = tableData;
        data[rowIndex][field] = event.target.value;
        props.onDataChange([...data]);
    }

    const removeRow = (index) => {
        let data = tableData;
        data.splice(index, 1);
        props.onDataChange([...data]);
    }

    const sendData = () => {
        props.onSave([...tableData])
    }

    function reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
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
        padding: '0',
        width: '800px',
        maxWidth: '100%',
        height: 'calc(100% - 118px)',
        maxHeight: 'calc(100% - 118px)',
        flexWrap: 'nowrap',
        overflowY: 'auto'
    });

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

    return <Grid container spacing={0} direction="column" sx={{ width: '800px', maxWidth: '100%', height: "calc(100vh - 222px)", maxHeight: "calc(100vh - 222px)", border: '1px solid #ccc' }}>
        <Grid container justifyContent={'center'}>
            {(props.columns || []).map((col) => {
                return <>
                    <Grid item xs={col.flex} key={col.headerName} sx={{ p: 2, borderBottom: '1px solid #ccc', bgcolor: "turquoise" }}>
                        <div style={{ fontWeight: 600 }}>{col.headerName}</div>
                    </Grid>
                </>
            })}
        </Grid>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) =>
                    <Grid {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)} container spacing={0} direction="column">
                        {(tableData || []).map((row, i) => {
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
                                            )} container justifyContent={'center'}>
                                            {columns.map((col, index) => {
                                                return <>
                                                    <Grid item xs={col.flex} key={col.headerName + index} sx={{ px:(index===2?0: 2),py:2, borderBottom: '1px solid #ccc' }}>
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
                }</Droppable>
        </DragDropContext>
        <Grid container justifyContent={'flex-end'} sx={{ p: 1 }}>
            <LoadingButton
                variant='contained'
                loading={props.loadingBtn}
                startIcon={<SaveIcon />}
                loadingPosition="start"
                color={'success'}
                onClick={sendData}
                sx={{ mr: 2 }}>{props.actionBtnText || "Send"}</LoadingButton>
        </Grid>
    </Grid>
}