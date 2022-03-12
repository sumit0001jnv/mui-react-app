import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

export default function PdfViewer(props) {
  function onDocumentLoadSuccess({ numPages }) {
    props.onSetNumPages(numPages);
  }

  return <>
    <Document file={props.url} onLoadSuccess={onDocumentLoadSuccess} style={{ height: '300px', maxHeight: '300px', overflow: 'auto' }}>
      {/* <Box sx={{ height: '400px', maxHeight: '400px', overflow: 'auto' }}> */}
      <Page pageNumber={props.pageNumber} scale={props.zoomVal} />
      {/* </Box> */}
    </Document>
    {/* <Grid container>
      <Grid item xs={12}>
        <Button onClick={() => pageChange(pageNumber - 1)}>Previous</Button>
        <Button onClick={() => pageChange(pageNumber + 1)}>Next</Button>
        <Button onClick={() => zoom(zoomVal + 0.5)}>Zoom In</Button>
        <Button onClick={() => zoom(zoomVal - 0.5)}>Zoom Out</Button>
      </Grid>
      <Grid item xs={12}>
        Page {pageNumber} of {numPages}
      </Grid>
    </Grid> */}
  </>;
}