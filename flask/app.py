from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import time
from psycopg2.extras import Json

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) to allow requests from the frontend

# Configure PostgreSQL connection
d = {
    'host':"db",
    'database':"default",
    'user':"user",
    'password':"password"
}
time.sleep(5)
from datetime import datetime, timezone
print(datetime.now())

conn = psycopg2.connect(
    host="db",
    database="default",
    user="user",
    password="password"
)

# Route to retrieve a random job description summary
@app.route("/job_description", methods=["GET"])
def get_job_description():
    print("Job description called")
    cursor = conn.cursor()
    cursor.execute("SELECT id, summary, title, category FROM job_descriptions ORDER BY RANDOM() LIMIT 1;")
    row = cursor.fetchone()
    id = row[0]
    job_description = row[1]
    title = row[2]
    category = row[3]
    cursor.close()
    job_description_dict = {
        "id": id,
        "job_description": job_description,
        "title": title,
        "category": category
    }

    cv_summaries_query = f'''
        select id, category, summary from (
            SELECT id, category, summary FROM cvs 
            where category = '{category}'
            ORDER BY RANDOM() LIMIT 3
        ) a
        union all
        select id, category, summary from (
            SELECT id, category, summary FROM cvs 
            where category != '{category}'
            ORDER BY RANDOM() LIMIT 2
        ) b
    '''

    cursor = conn.cursor()
    cursor.execute(cv_summaries_query)
    cv_summaries = [{"id": row[0], "cv_category": row[1], "cv_summary": row[2]} for row in cursor.fetchall()]

    return jsonify({
        "job_description": job_description_dict,
        "cv_summaries": cv_summaries
    })

# Route to retrieve five random CV summaries
@app.route("/cv_summaries", methods=["GET"])
def get_cv_summaries():
    cursor = conn.cursor()
    cursor.execute("SELECT id, summary FROM cvs ORDER BY RANDOM() LIMIT 5;")
    cv_summaries = [{"id": row[0], "cv_summary": row[1]} for row in cursor.fetchall()]
    cursor.close()
    return jsonify(cv_summaries)

# Route to save user selection
@app.route("/save_selection", methods=["POST"])
def save_selection():
    data = request.get_json()
    job_description_id = data["jobDescriptionId"]
    cv_summary_id = data["cvSummaryId"] if "cvSummaryId" in data.keys() else -2
    choices = Json(data["choices"])
    username = data["username"]
    date_created = datetime.now() #timezone.utc

    cursor = conn.cursor()
    cursor.execute("INSERT INTO user_selections (job_description_id, cv_summary_id, choices, username, date_created) VALUES (%s, %s, %s, %s, %s);",
                   (job_description_id, cv_summary_id, choices, username, date_created))
    conn.commit()
    cursor.close()

    return jsonify({"message": "Selection saved successfully"})

# Route to save user
@app.route("/save_user", methods=["POST"])
def save_user():
    data = request.get_json()
    username = data["user"]

    cursor = conn.cursor()
    cursor.execute("INSERT INTO usernames (username) VALUES (%s);",
                   (username))
    conn.commit()
    cursor.close()

    return jsonify({"message": "Selection saved successfully"})

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
