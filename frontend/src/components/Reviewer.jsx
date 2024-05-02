import React, { useEffect, useState } from "react";
import axios from "axios";
import './Reviewer.css'

const Reviewer = () => {
  const [reviewedPapers, setReviewedPapers] = useState(null);
  const domain = "Maths";
  const [newValues, setNewValues] = useState({}); // Object to store individual new values
  const [comments, setComments] = useState({}); // Object to store individual comments



  useEffect(() => {
    getPdf();
  }, []);

  const handleUpdate = async (email) => {
    try {
      const newValue = newValues[email];
      const comment = comments[email];

      // Send a POST request to the backend with the document ID, new value, and comments
      const response = await axios.post('https://wt-project-backend.vercel.app/updateAttribute', {
        email: email,
        newPaperStatus: newValue,
        comments: comment,
      });

      console.log(response.data);

      // Clear the input fields after updating
      setNewValues({ ...newValues, [email]: '' });
      setComments({ ...comments, [email]: '' });
    } catch (error) {
      console.error('Error updating attribute:', error);
    }
  };

  const getPdf = async () => {
    const result = await axios.get(`https://wt-project-backend.vercel.app/get-reviewed-papers/${domain}`);
    setReviewedPapers(result.data.data);
  };

  const showPdf = (data) => {
    if (data) {
      window.open(`https://wt-project-backend.vercel.app/files/17059592444031.ANN.pdf`, "_blank", "noreferrer");
    } else {
      console.error("PDF file not found. Check if the 'paper' property is correctly populated in the server response.");
    }
  };

  return (
    <div>
      <h4>Review Papers</h4>
      <div className="outer-div">
        {reviewedPapers == null
          ? ''
          : reviewedPapers.map((data) => {
            const email = data.email;
            console.log("rrrrrrrrrrrrr" + data.domain)
            return (
              <div className="inner-div" key={data.email}>
                <h6>Domain: {data.domain}</h6>
                <h6>Paper: {data.title}</h6>
                <h6>Email Id: {email}</h6>
                <button className="btn btn-primary" onClick={() => showPdf(data)}>
                  Show pdf
                </button>
                <label>New Value: </label>
                <select
                  className="dropdown-field"
                  value={newValues[email] || ''}
                  onChange={(e) => setNewValues({ ...newValues, [email]: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Accepted">Accept</option>
                  <option value="Rejected">Reject</option>
                </select>

                <label>Comments: </label>
                <input
                  className="input-field"
                  type="text"
                  value={comments[email] || ''}
                  onChange={(e) => setComments({ ...comments, [email]: e.target.value })}
                />

                <button className="update-button" onClick={() => handleUpdate(email)}>
                  Update Attribute
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Reviewer;
