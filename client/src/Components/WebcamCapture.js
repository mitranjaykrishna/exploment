import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";

const WebcamCapture = () => {
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);
  const [output, setOutput] = useState();

  const captureImage = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const file = dataURLtoFile(imageSrc, "captured_image.png");
    await sendFileToServer(file);
  }, []);

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const sendFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setOutput(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file to S3:", error);
    }
  };
  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="row">
      <div className="row">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode }}
        />
      </div>
      <div className="row">
        <button onClick={captureImage}>Capture</button>
      </div>
      <div className="row">
        <button onClick={toggleFacingMode}>Toggle Camera</button>
      </div>
      <div className="row d-flex justify-content-center">
        <p>fff{output}</p>
      </div>
    </div>
  );
};

export default WebcamCapture;
