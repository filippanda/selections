-- Create the table for job descriptions
CREATE TABLE job_descriptions (
                                  id SERIAL PRIMARY KEY,
                                  summary TEXT,
                                  title TEXT,
                                  category TEXT
);

-- Create the table for CV summaries
CREATE TABLE cvs (
                     id SERIAL PRIMARY KEY,
                     summary TEXT
);

-- Create the table for user selections
CREATE TABLE user_selections (
                                 id SERIAL PRIMARY KEY,
                                 job_description_id INTEGER REFERENCES job_descriptions(id),
                                 cv_summary_id INTEGER REFERENCES cvs(id)
);
