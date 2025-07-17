import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url"; // ✅ Vite Fix
import "./ats.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null); // ✅ Reference for Dragging

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile));
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const checkATSScore = () => {
    setAtsScore(Math.floor(Math.random() * 100));
  };

  // ✅ Make PDF Preview Draggable
  const handleDrag = (event) => {
    event.preventDefault();
    const preview = previewRef.current;
    let posX = 0, posY = 0, prevX = event.clientX, prevY = event.clientY;

    const onMouseMove = (e) => {
      posX = prevX - e.clientX;
      posY = prevY - e.clientY;
      prevX = e.clientX;
      prevY = e.clientY;
      preview.scrollLeft += posX;
      preview.scrollTop += posY;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="ats-wrapper">
      <div className="input-panel">
        <h2>Upload Your Resume</h2>
        <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
        <button className="upload-btn" onClick={openFilePicker}>📂 Upload Resume</button>
        <button className="check-btn" onClick={checkATSScore}>✅ Check ATS Score</button>
        {atsScore !== null && <p className="ats-score">ATS Score: {atsScore}%</p>}
      </div>

      <div className="preview-panel">
        <h2>Resume Preview</h2>
        <div className="resume-preview" ref={previewRef} onMouseDown={handleDrag}>
          {file ? (
            <Document file={file}>
              <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          ) : (
            <p>Drag to move the resume preview...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;
