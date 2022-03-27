import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

export default function PdfViewer(props) {
  function onDocumentLoadSuccess({ numPages }) {
    props.onSetNumPages(numPages);
  }

  return <>
    <Document file={props.url} onLoadSuccess={onDocumentLoadSuccess} style={{ height: '300px', maxHeight: '300px', overflow: 'auto' }}>
      <Page pageNumber={props.pageNumber} scale={props.zoomVal} />
    </Document>
  </>;
}