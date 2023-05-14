-- Create the table for job descriptions
CREATE TABLE job_descriptions (
                                  id SERIAL PRIMARY KEY,
                                  summary TEXT
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

insert into cvs values (1, 'the Best');
insert into cvs values (2, 'the Coolest');
insert into cvs values (3, 'the Awesomest');
insert into cvs values (4, 'the Funniest');
insert into cvs values (5, 'the Nicest');
insert into cvs values (6, 'the Sleepiest');
insert into cvs values (7, 'the Goofiest');
insert into cvs values (8, 'the Snackiest');
insert into cvs values (9, 'the Danceyest');
insert into cvs values (10, 'the Hottest');

insert into job_descriptions values (1, 'Helena je');
insert into job_descriptions values (2, 'Filip je');
insert into job_descriptions values (3, 'Mi smo');