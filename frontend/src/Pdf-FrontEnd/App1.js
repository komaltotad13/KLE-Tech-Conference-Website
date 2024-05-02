import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import "./App1.css";
import { useNavigate, useLocation } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App1(props) {
  const userEmail = props.user.email;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(""); // New state for selected domain
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const [submitted, setSubmitted] = useState(false); // State to track whether PDF is submitted
  useEffect(() => {
    getPdf();
  }, [submitted]);

  const getPdf = async () => {
    const result = await axios.get("http://localhost:7500/get-files");
    console.log(result.data.data);

    // Assuming userEmail is the email of the currently logged-in user
    const currentUserEmail = props.user.email;

    // Filter the data based on the current user's email
    const userPdf = result.data.data.filter(
      (data) => data.email === currentUserEmail
    );

    setAllImage(userPdf);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("domain", selectedDomain); // Include domain in form data
    formData.append("email", userEmail);
    console.log(title, file, selectedDomain, userEmail);

    const result = await axios.post(
      "http://localhost:7500/upload-files",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
    if (result.data.status === "ok") {
      // alert("Uploaded Successfully!!!");
      setSubmitted(true); // Set submitted to true after successful upload
      getPdf();
    } else if (result.data.status === "error") {
      // alert("You have already uploaded PDF once!");
      navigate("/authorConsole");
    }
  };

  const showPdf = (pdf) => {
    // setPdfFile(`http://localhost:7500/files/${pdf}`); // Within page
    window.open(`http://localhost:7500/files/${pdf}`, "_blank", "noreferrer"); // Outside page
  };

  return (
    <>
      <h2>{userEmail}</h2>
      <div className="container mt-4">
        <form className="formStyle" onSubmit={submitImage}>
          <h4>Upload Pdf in React</h4>
          <br />
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          {/* Dropdown for selecting domain */}
          <div className="mb-3">
            <select
              className="form-control"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              required
            >
              <option value="">Select Domain</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Cloud">Cloud</option>
              <option value="Medical Science">Medical Science</option>
              <option value="Maths">Maths</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        <div className="uploaded mt-4">
          <h4>Uploaded PDF:</h4>
          <div className="output-div">
            {allImage === null
              ? ""
              : allImage.map((data, index) => (
                  <div className="inner-div mb-3" key={index}>
                    <h6>Title: {data.title}</h6>
                    <p>Email: {data.email}</p>
                    <p>Domain: {data.domain}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.pdf)}
                    >
                      Show Pdf
                    </button>
                  </div>
                ))}
          </div>
        </div>
        <PdfComp pdfFile={pdfFile} />
        <br></br>

        {submitted && (
          <>
            <h4 className="text-center text-success">
              Form submitted successfully!
            </h4>
            <br />
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/authorConsole")}
            >
              Go to Author Console
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default App1;
