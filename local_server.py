import pandas as pd
import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


def init_db():
    """Initialize the SQLite database from CSV"""
    # Read the CSV file
    df = pd.read_csv("fitness_tracker_dataset.csv")

    # Create SQLite database
    conn = sqlite3.connect("fitness_data.db")

    # Write the data to SQLite
    df.to_sql("fitness_data", conn, if_exists="replace", index=False)
    conn.close()


def get_db():
    """Get database connection"""
    conn = sqlite3.connect("fitness_data.db")
    return conn


@app.route("/data", methods=["GET"])
def get_data():
    """Return all data as JSON"""
    conn = get_db()
    df = pd.read_sql_query("SELECT * FROM fitness_data", conn)
    conn.close()
    return jsonify(df.to_dict(orient="records"))


@app.route("/stats", methods=["GET"])
def get_stats():
    """Return basic statistics about the dataset"""
    conn = get_db()
    df = pd.read_sql_query("SELECT * FROM fitness_data", conn)
    conn.close()

    stats = {
        "total_records": len(df),
        "columns": list(df.columns),
        "summary": df.describe().to_dict(),
    }
    return jsonify(stats)


@app.route("/get_user_ids", methods=["GET"])
def get_user_ids():
    """Return list of unique user IDs"""
    conn = get_db()
    df = pd.read_sql_query("SELECT DISTINCT user_id FROM fitness_data", conn)
    conn.close()
    return jsonify(df["user_id"].tolist())


@app.route("/get_user_data/<user_id>", methods=["GET"])
def get_user_data(user_id):
    """Return data for a specific user"""
    conn = get_db()
    df = pd.read_sql_query(
        f"SELECT * FROM fitness_data WHERE user_id = ?", conn, params=[user_id]
    )
    conn.close()

    # Calculate workout distribution
    workout_distribution = df["workout_type"].value_counts().to_dict()

    # Get steps and sleep data for the last 7 days
    recent_data = df.sort_values("date", ascending=False).head(7)
    dates = recent_data["date"].tolist()
    steps_data = recent_data["steps"].tolist()
    sleep_data = recent_data["sleep_hours"].tolist()

    # Calculate averages
    avg_stats = {
        "avg_steps": df["steps"].mean(),
        "avg_calories": df["calories_burned"].mean(),
        "avg_sleep": df["sleep_hours"].mean(),
        "avg_heart_rate": df["heart_rate_avg"].mean(),
        "workout_distribution": workout_distribution,
        "dates": dates,
        "steps_data": steps_data,
        "sleep_data": sleep_data,
    }

    return jsonify(avg_stats)


@app.route("/get_first_row", methods=["GET"])
def get_first_row():
    """Return first row of data"""
    conn = get_db()
    df = pd.read_sql_query("SELECT * FROM fitness_data LIMIT 1", conn)
    conn.close()
    return jsonify(df.iloc[0].to_dict())


if __name__ == "__main__":
    # Initialize the database if it doesn't exist
    if not os.path.exists("fitness_data.db"):
        init_db()

    # Run the Flask app
    app.run(host="0.0.0.0", port=5000, debug=True)
