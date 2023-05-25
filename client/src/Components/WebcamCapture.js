import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";

const WebcamCapture = () => {
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);
  const [output, setOutput] = useState();
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(false);

  const captureImage = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setScreenshot(imageSrc);
    setPreview(true);
    const file = dataURLtoFile(imageSrc, "captured_image.png");
    await sendFileToServer(file);
  }, []);

  const retakeImage=()=>{
    setPreview(false);
  }

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
    <Container className="mt-5">
      <div className="row" style={{display: !preview ? 'block' : 'none'}}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode }}
        />
      </div>
      {/* Preview Code */}
      <div className="row" style={{display: preview ? 'block' : 'none'}}>
        {screenshot && (
          <div>
            <img src={screenshot} alt="Screenshot" />
          </div>
        )}
      </div>
      <div className="row justify-content-center">
      <div className="row" style={{display: !preview ? 'block' : 'none'}}>
        <button onClick={captureImage} className="btn btn-primary btn-sm mb-2">
          Capture
        </button>
      </div>
      <div className="row" style={{display: preview ? 'block' : 'none'}}>
      <button onClick={retakeImage} className="btn btn-primary btn-sm mb-2">
          Retake
        </button>
      </div>
      <div className="row">
        <button onClick={toggleFacingMode} className="btn btn-secondary">Rotate Camera</button>
      </div>

      <div className="row ">
        <h1 className="text-center display-1">{output}</h1>
      </div>
      </div>
      
    </Container>
  );
};

export default WebcamCapture;
