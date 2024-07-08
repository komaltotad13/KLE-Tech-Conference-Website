import React from "react";
import "./submission.css"
import { useNavigate } from "react-router-dom";
import fraud from "./fraud.pdf";

const Submission = (props) => {
    const navigate = useNavigate();
    const user = props.user

    return (
        <>
            <h1>{user.email}</h1>
            <div className="submission-container">
                <div className="submission-content">
                    <h1 className="submission-title">ICPES Conference: Paper Submission Guidelines</h1>
                    <p className="submission-text">
                        Welcome to the ICPES Conference paper submission page. Authors are
                        requested to follow the guidelines below for submitting research
                        papers. This conference provides a platform for researchers to
                        present their latest work and exchange ideas on various topics.
                    </p>

                    <h2>Important Dates</h2>
                    <p className="submission-text">
                        Submission Deadline: April 30, 2024
                        <br />
                        Notification of Acceptance: June 15, 2024
                        <br />
                        Camera-Ready Paper Due: July 1, 2024
                    </p>

                    <h2>Paper Formatting Guidelines</h2>
                    <p className="submission-text">
                        Authors must follow the specified paper format for the ICPES
                        conference. Please download the paper format document{" "}
                        <a href="fraud" download="./fraud.pdf">Download </a>.
                    </p>

                    <h2>Review Process</h2>
                    <p className="submission-text">
                        Submitted papers will undergo a thorough review process. The review
                        committee will evaluate the papers based on quality, novelty, and
                        presentation.
                    </p>

                    <h2>Plagiarism Policy</h2>
                    <p className="submission-text">
                        Authors must check their papers for plagiarism using standard
                        software (e.g., Turnitin). Papers with less than 15% plagiarism will
                        be considered for the review process.
                    </p>
                </div>

                <div className="submission-button" onClick={() => navigate("/pdf", { state: { userEmail: user.email } })}>
                    <button type="button">Submit Your Paper</button>
                </div>
            </div >
        </>
    );
};

export default Submission;