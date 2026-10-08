from flask import Flask, request, jsonify, send_from_directory
import psycopg2
import random
import os 
from datetime import datetime

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(
        os.environ.get("DATABASE_URL")
    )


@app.route("/")
def home():
    return send_from_directory(".","index.html")


@app.route("/test-report")
def test_report():
    year = datetime.now().year
    civic_fix_id = f"CF-{year}-{random.randint(100000, 999999)}"

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO reports
        (civic_fix_id, category, problem, description, location,
         severity, name, mobile, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        civic_fix_id,
        "Road & Transportation",
        "Pothole",
        "Test report from Civic Fix backend",
        "Thanjavur",
        "High",
        "Test User",
        "9999999999",
        "Thanjavur"
    ))

    connection.commit()
    cursor.close()
    connection.close()

    return f"Test report saved successfully! Civic Fix ID: {civic_fix_id}"


@app.route("/api/reports", methods=["POST"])
def create_report():
    data = request.get_json()

    year = datetime.now().year
    civic_fix_id = f"CF-{year}-{random.randint(100000, 999999)}"

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO reports
        (civic_fix_id, category, problem, description, location,
         latitude, longitude, severity, name, mobile, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        civic_fix_id,
        data.get("category"),
        data.get("problem"),
        data.get("description"),
        data.get("location"),
        data.get("latitude"),
        data.get("longitude"),
        data.get("severity"),
        data.get("name"),
        data.get("mobile"),
        data.get("address")
    ))

    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "civicFixId": civic_fix_id
    })

@app.route("/api/reports/<civic_fix_id>", methods=["GET"])
def get_report(civic_fix_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT civic_fix_id, category, problem, description,
               location, latitude, longitude, severity,
               name, mobile, address, status, submitted_at
        FROM reports
        WHERE civic_fix_id = %s
    """, (civic_fix_id,))

    report = cursor.fetchone()

    cursor.close()
    connection.close()

    if report is None:
        return jsonify({
            "success": False,
            "error": "Report not found."
        }), 404

    return jsonify({
        "success": True,
        "report": {
            "civicFixId": report[0],
            "category": report[1],
            "problem": report[2],
            "description": report[3],
            "location": report[4],
            "latitude": report[5],
            "longitude": report[6],
            "severity": report[7],
            "name": report[8],
            "mobile": report[9],
            "address": report[10],
            "status": report[11],
            "submittedAt": report[12].isoformat()
        }
    })

@app.route("/api/reports", methods=["GET"])
def get_all_reports():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT civic_fix_id, category, problem, location,
               severity, status, submitted_at
        FROM reports
        ORDER BY submitted_at DESC
    """)

    reports = cursor.fetchall()

    cursor.close()
    connection.close()

    report_list = []

    for report in reports:
        report_list.append({
            "civicFixId": report[0],
            "category": report[1],
            "problem": report[2],
            "location": report[3],
            "severity": report[4],
            "status": report[5],
            "submittedAt": report[6].isoformat()
        })

    return jsonify({
        "success": True,
        "reports": report_list
    })

if __name__ == "__main__":
    app.run(debug=True)