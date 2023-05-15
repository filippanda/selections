import React, { useState, useEffect } from 'react';
import './App.css';

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
        <div className='outerContainer'>

            <p className='title'>JOB - CV matching </p>
            <p className='instructionText'>Select the most suitable CV/person for the following job description:</p>
            <p className='jobText'> {jobDescription.title} <br /> {jobDescription.category} </p>
            <p className='normalText'>{jobDescription.job_description}</p>

            <p className='innerTitle'>CV Summaries:</p>
            <div>
                {cvSummaries.map((cvSummary) => (
                    <div className='summaryContainer' key={cvSummary.id}>
                        <button className={selectedCv.id === cvSummary.id ? 'clickedSummaryButton' : 'summaryButton'} onClick={() => handleCvSelection(cvSummary)}>
                            <p className='summaryButtonText'>{cvSummary.cv_summary}</p>
                        </button>
                    </div>
                ))}
            </div>

            <p className='innerTitle'>Selected CV:</p>
            <p className='jobText'>{selectedCv ? selectedCv.cv_summary : 'No CV selected'}</p>

            <div className='confirmContainer'>
                <button className='confirmButton' onClick={refreshPage}>
                    <p className='confirmText'>
                        CONFIRM & GET NEW ITEMS!
                    </p>
                </button>
            </div>
        </div>
    );
}

export default App;
