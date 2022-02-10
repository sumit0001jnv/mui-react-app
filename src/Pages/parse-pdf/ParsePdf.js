
import Button from '@mui/material/Button';
import Header from '../../commons/components/header/Header';
export default function ParsePdf() {
    return <>
        <Header></Header>
        <Button
            variant="contained"
            component="label"
        >
            Upload File
            <input
                type="file"
                hidden
            />
        </Button></>
}