import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "./App.css";
import { FaUser } from 'react-icons/fa';



function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvSummaries, setCvSummaries] = useState([]);
  const [selectedCv, setSelectedCv] = useState("");
  const [showModal, setShowModal] = useState(true);
  const savedData = localStorage.getItem("user");
  const [username, setUsername] = useState(savedData ? savedData : '');
  const API_URL = "http://localhost:25000";

  useEffect(() => {
    fetchJobDescription();
    fetchCvSummaries();
  }, []);

  function refreshPage(selected) {
    if(selected){
      saveCvSelection(selectedCv).then((r) => window.location.reload());
    } else {
      saveSkippedCvSelection().then((r) => window.location.reload());
    }

  }

  const saveCvSelection = async (cvSummary) => {
    var all_choices_ids = cvSummaries.map((obj) => obj.id);

    try {
      await fetch(`${API_URL}/save_selection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescriptionId: jobDescription.id,
          cvSummaryId: cvSummary.id,
          choices: all_choices_ids,
          username: username
        }),
      });
      console.log("Selection stored in the database");
    } catch (error) {
      console.log("Error storing selection:", error);
    }
  };

  const saveSkippedCvSelection = async () => {
    var all_choices_ids = cvSummaries.map((obj) => obj.id);

    try {
      await fetch(`${API_URL}/save_selection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescriptionId: jobDescription.id,
          cvSummaryId: -1,
          choices: all_choices_ids,
          username: username
        }),
      });
      console.log("Selection stored in the database");
    } catch (error) {
      console.log("Error storing selection:", error);
    }
  };

  const fetchJobDescription = async () => {
    try {
      const response = await fetch(`${API_URL}/job_description`);
      if (response.ok) {
        const data = await response.json();
        setJobDescription(data);
      } else {
        throw new Error("Error fetching job description");
      }
    } catch (error) {
      console.log("Error fetching job description:", error);
    }
  };

  const fetchCvSummaries = async () => {
    try {
      const response = await fetch(`${API_URL}/cv_summaries`);
      if (response.ok) {
        const data = await response.json();
        setCvSummaries(data);
      } else {
        throw new Error("Error fetching CV summaries");
      }
    } catch (error) {
      console.log("Error fetching CV summaries:", error);
    }
  };

  const handleCvSelection = async (cvSummary) => {
    setSelectedCv(cvSummary);
  };

  const handleConfirm = () => {
    console.log("Confirmed:", username);
    localStorage.setItem("user", username);
    setShowModal(false);
  };

  return (
    <div className="outerContainer">
      {showModal && !savedData && (
        <Modal>
          <div className="modalOuter">
            <p className="innerTitle">Hello!</p>
            <div className="modalContainer">
              <input
                type="text"
                className="inputUser"
                placeholder="Please enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="confirmButton" onClick={handleConfirm}>
                <p className="confirmText">Confirm</p>
              </button>
            </div>
          </div>
        </Modal>
      )}

    <div className="cornerContainer">
        <FaUser className="personIcon" />
        <p>{username}</p>
    </div>

      <p className="title">JOB - CV matching</p>
      <p className="instructionText">
        Select the most suitable CV/person for the following job description:
      </p>
      <p className="jobText">
        {" "}
        {jobDescription.title} <br /> {jobDescription.category}{" "}
      </p>
      <p className="normalText">{jobDescription.job_description}</p>

      <p className="innerTitle">CV Summaries:</p>
      <div>
        {cvSummaries.map((cvSummary) => (
          <div className="summaryContainer" key={cvSummary.id}>
            <button
              className={
                selectedCv.id === cvSummary.id
                  ? "clickedSummaryButton"
                  : "summaryButton"
              }
              onClick={() => handleCvSelection(cvSummary)}
            >
              <p className="summaryButtonText">{cvSummary.cv_summary}</p>
            </button>
          </div>
        ))}
      </div>

      <p className="innerTitle">Selected CV:</p>
      <p className="normalText">
        {selectedCv ? selectedCv.cv_summary : "No CV selected"}
      </p>

      <div className="refreshContainer">
        <button className="refreshButton" onClick={() => refreshPage(true)}>
          <p className="refreshText">CONFIRM & GET NEW ITEMS!</p>
        </button>
        <button className="refreshButton" onClick={() => refreshPage(false)}>
          <p className="refreshText">SKIP & GET NEW ITEMS!</p>
        </button>
      </div>
    </div>
  );
}

export default App;
