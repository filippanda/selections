import React, { useState, useEffect } from 'react';

function App() {
    const [jobDescription, setJobDescription] = useState('');
    const [cvSummaries, setCvSummaries] = useState([]);
    const [selectedCv, setSelectedCv] = useState('');

    useEffect(() => {
        fetchJobDescription();
        fetchCvSummaries();
    }, []);

    function refreshPage() {
        saveCvSelection(selectedCv).then(r => window.location.reload())
        ;
    }

    const saveCvSelection = async (cvSummary) => {
        var all_choices_ids = cvSummaries.map(obj => obj.id);

        try {
            await fetch('http://localhost:25000/save_selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobDescriptionId: jobDescription.id,
                    cvSummaryId: cvSummary.id,
                    choices: all_choices_ids,
                }),
            });
            console.log('Selection stored in the database');
        } catch (error) {
            console.log('Error storing selection:', error);
        }
    };



    const fetchJobDescription = async () => {
        try {
            const response = await fetch('http://localhost:25000/job_description');
            if (response.ok) {
                const data = await response.json();
                setJobDescription(data);
            } else {
                throw new Error('Error fetching job description');
            }
        } catch (error) {
            console.log('Error fetching job description:', error);
        }
    };

    const fetchCvSummaries = async () => {
        try {
            const response = await fetch('http://localhost:25000/cv_summaries');
            if (response.ok) {
                const data = await response.json();
                setCvSummaries(data);
            } else {
                throw new Error('Error fetching CV summaries');
            }
        } catch (error) {
            console.log('Error fetching CV summaries:', error);
        }
    };

    const handleCvSelection = async (cvSummary) => {
        setSelectedCv(cvSummary);

        // try {
        //     await fetch('http://localhost:25000/save_selection', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             jobDescriptionId: jobDescription.id,
        //             cvSummaryId: cvSummary.id,
        //         }),
        //     });
        //     console.log('Selection stored in the database');
        // } catch (error) {
        //     console.log('Error storing selection:', error);
        // }
    };

    return (
        <div>
            <h1>Job Description:</h1>
            <p>{jobDescription.job_description}</p>

            <h2>CV Summaries:</h2>
            <ul>
                {cvSummaries.map((cvSummary) => (
                    <li key={cvSummary.id}>
                        <button onClick={() => handleCvSelection(cvSummary)}>{cvSummary.cv_summary}</button>
                    </li>
                ))}
            </ul>

            <h3>Selected CV:</h3>
            <p>{selectedCv ? selectedCv.cv_summary : 'No CV selected'}</p>

            <div>
                <button onClick={refreshPage}>Get new items!</button>
            </div>
        </div>
    );
}

export default App;
