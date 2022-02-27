import { createTheme } from '@mui/material/styles';
import { green, orange, purple, red, blue,indigo ,grey} from '@mui/material/colors';

export default createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        },
        orange: {
            main: orange[500]
        },
        red: {
            main: red[500]
        },
        blue: {
            main: blue[700]
        },
        indigo: {
            main: indigo[500]
        },
        grey: {
            main: grey[500]
        }
    },
});