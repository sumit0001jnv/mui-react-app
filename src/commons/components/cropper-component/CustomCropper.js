import { useState, useRef, useEffect } from 'react';
import 'cropperjs/dist/cropper.css';
import { Cropper } from 'react-cropper';
import { Document, Page, pdfjs } from 'react-pdf';

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

    return (
        <>
            <div>
                <div className="main">
                    <div className="main">
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <div>
                            <div className="pagec">
                                Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                            </div>
                            <div className="buttonc">
                                <button
                                    type="button"
                                    disabled={pageNumber <= 1}
                                    onClick={previousPage}
                                    className="Pre"

                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={pageNumber >= numPages}
                                    onClick={nextPage}

                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%' }}>
                    <input type="file" onChange={onChange} />
                    {/* <button>Use default img</button> */}
                    <br />
                    <br />
                    <Cropper
                        style={{ height: 400, width: '100%' }}
                        initialAspectRatio={16 / 9}
                        preview=".img-preview"
                        guides={true}
                        src={image}
                        ref={imageRef}
                        dragMode={'move'}
                        checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                    />
                </div>
                <div>
                    {/* <div className="box" style={{ width: '50%', float: 'right' }}>
                    <h1>Preview</h1>
                    <div className="img-preview" style={{ width: '100%', float: 'left', height: 300 }} />
                </div> */}
                    <div className="box" style={{ width: '50%', float: 'right' }}>
                        <h1>
                            <span>Crop</span>
                            <button style={{ float: 'right' }} onClick={getCropData}>
                                Crop Image
                            </button>
                        </h1>
                        <img style={{ width: '100%' }} src={cropData} alt="cropped image" />
                    </div>
                </div>
                <br style={{ clear: 'both' }} />
            </div>
        </>

    );
};