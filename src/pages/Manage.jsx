import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchData, addData, saveChanges, deleteData, uploadExcelData } from "../firebase";
import "./Manage.css";

const Manage = () => {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const fieldTypes = {
    jobs: { title: "", company: "", location: "", salary: "", description: "", link: "", jobRole: "" },
    internships: { title: "", company: "", location: "", duration: "", stipend: "", description: "", link: "", jobRole: "" },
    courses: { title: "", provider: "", duration: "", price: "", description: "", skillsCovered: "", link: "", jobRole: "" },
    skills: { name: "", category: "", level: "" },
    careerRoadmaps: { title: "", steps: "", duration: "" }
  };

  const [newItem, setNewItem] = useState(fieldTypes[type] || {});

  useEffect(() => {
    fetchData(type, setItems);
  }, [type]);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }
    setFile(selectedFile);
  };

  const uploadDataFromFile = async () => {
    if (!file) return alert("Please select an Excel file.");

    setUploadStatus("Uploading... Please wait.");
    setUploadProgress(0);

    await uploadExcelData(file, type, setItems, setUploadProgress);

    setUploadStatus("Upload Successful!");
    setFile(null);
  };

  const handleAddData = () => {
    if (Object.values(newItem).some((value) => value.trim() === "")) {
      alert("Please fill in all fields before adding.");
      return;
    }
    addData(type, newItem);
    setNewItem(fieldTypes[type] || {});
  };

  return (
    <div className="manage-container">
      <h2>Manage {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      
      {/* Add New Data */}
      <div className="manage-actions">
        {Object.keys(newItem).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={newItem[key]}
            onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
          />
        ))}
        <button onClick={handleAddData}>➕ Add {type}</button>
      </div>
      
      {/* Upload Excel File */}
      <div className="upload-section">
        <h3>Upload Excel File</h3>
        <input type="file" accept=".xlsx, .csv" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
        <button onClick={handleFileUploadClick}>📂 Select File</button>
        <button onClick={uploadDataFromFile} disabled={!file}>⬆️ Upload Data</button>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        <p>{uploadStatus}</p>
      </div>
      
      {/* Data Table */}
      <table className="manage-table">
        <thead>
          <tr>
            {items.length > 0 && Object.keys(items[0]).map((key) => (
              key !== "id" && <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {Object.entries(item).map(([key, value]) => (
                key !== "id" && (
                  <td key={key}>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => saveChanges(type, item.id, { ...item, [key]: e.target.value })}
                    />
                  </td>
                )
              ))}
              <td><button onClick={() => deleteData(type, item.id)}>🗑️ Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Manage;
