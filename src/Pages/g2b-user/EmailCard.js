import { useState, Fragment } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomMuiDialogue from '../../commons/components/custom-mui-dialogue/CustomMuiDialogue';

export default function EmailCard(props) {
    const [attachment, setAttachment] = useState({
        show: false,
        url: ''
    });
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        const arr = name.split(' ');
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${arr[0][0]}${arr[1] ? arr[1][0] : ''}`,
        };
    }

    function onAttachmentClick(e, isClickable = true, attachment) {
        if (isClickable) {
            setAttachment({ show: true, url: attachment })
        }
        e.stopPropagation();
    }

    function onSetOpenDialogue(state) {
        setAttachment(() => { return { ...attachment, show: state } });
    }

    const disableProp = (isDisable) => {
        if (isDisable) {
            return {
                opacity: 0.4,
                cursor: 'auto'
            }
        } else {
            return {

            }
        }
    }

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Accordion defaultExpanded={props.expanded}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Grid container direction={'row'} sx={{ p: 0 }} justifyContent='start'>
                            <Avatar {...stringAvatar(props.user.name)} />
                            <Grid direction={'column'} justifyContent={'flex-start'} sx={{ ml: 1, mr: 'auto', textAlign: 'start' }} >
                                <Typography variant="body2" sx={{ fontSize: '0.725rem', fontWeight: 500, pr: 1, width: 'fit-content' }} >
                                    {props.user.name}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.725rem', width: 'fit-content' }} >
                                    {`<${props.user.name.toLowerCase().replace(" ", "_")}@gmail.com>`}
                                </Typography>
                            </Grid>
                            <Grid direction={'column'}>
                                <Typography variant="body2" sx={{ fontSize: '0.725rem', textAlign: 'end' }} >
                                    {props.user.time}
                                </Typography>
                                <Grid container sx={{ p: 0, pt: 1, borderColor: 'primary.main' }} >
                                    <Badge badgeContent={props.user.attachments.pdf.length} color="error" onClick={(e) => onAttachmentClick(e, props.user.attachments.pdf.length, props.user.attachments.pdf[0])}
                                        sx={{ opacity: props.user.attachments.pdf.length ? '' : '0.4' }}>
                                        <Avatar src={'/images/pdf-icon.svg'} variant="rounded">
                                        </Avatar>
                                    </Badge>
                                    <Badge badgeContent={props.user.attachments.docx.length} color="error" sx={{ ...disableProp(!props.user.attachments.docx.length) }}
                                        onClick={(e) => e.stopPropagation()}>
                                        <Avatar src={'/images/google_docs.svg'} sx={{ width: 50, height: 40 }} variant="rounded">
                                        </Avatar>
                                    </Badge>
                                    <Badge disabled={!props.user.attachments.excel.length} badgeContent={props.user.attachments.excel.length} color="error" sx={{ ...disableProp(!props.user.attachments.docx.length) }}
                                        onClick={(e) => e.stopPropagation()}>
                                        <Avatar src={'/images/office_excel.svg'} variant="rounded">
                                        </Avatar>
                                    </Badge>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid direction={'column'}>
                            <Divider></Divider>
                            <Typography bottomGutter variant="body2" component="div" sx={{ textAlign: 'initial', p: 2, pb: 0, fontSize: '0.725rem', fontWeight: 300, color: "#000" }}>
                                {props.user.subject}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'initial', p: 2, fontSize: '0.725rem', fontWeight: 300, color: "#000" }}>
                                {props.user.message}
                            </Typography>

                        </Grid>
                    </AccordionDetails>

                </Accordion>
            </Box>
            <CustomMuiDialogue url={attachment.url} show={attachment.show} onSetOpenDialogue={onSetOpenDialogue}></CustomMuiDialogue>
        </>

    );
}