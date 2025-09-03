import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData);
      fetchImages();
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/images`);
      setImages(res.data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container">
      <h1>📸 Image Uploader</h1>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div className="image-grid">
        {images.map((img, idx) => (
          <div className="image-card" key={idx}>
            <img src={img.url} alt={`uploaded-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
