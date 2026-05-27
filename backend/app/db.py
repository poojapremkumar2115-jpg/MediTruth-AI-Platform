import os
import sqlite3
import datetime

# Resolve database path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "meditruth.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create scans table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        text TEXT NOT NULL,
        prediction TEXT NOT NULL,
        confidence REAL NOT NULL,
        risk_level REAL NOT NULL,
        explanation TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)
    
    # Create feedback table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id INTEGER NOT NULL,
        rating TEXT NOT NULL,
        comment TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (scan_id) REFERENCES scans(id)
    )
    """)
    
    conn.commit()
    conn.close()
    print("[MediTruth AI Database] Local SQLite database initialized successfully.")

# Run database setup on import
init_db()

def save_scan(user_email: str, text: str, prediction: str, confidence: float, risk_level: float, explanation: str) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    timestamp = datetime.datetime.utcnow().isoformat()
    cursor.execute("""
    INSERT INTO scans (user_email, text, prediction, confidence, risk_level, explanation, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_email, text, prediction, confidence, risk_level, explanation, timestamp))
    
    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Ready for Firebase sync fallback
    # if firebase_active:
    #     db.collection("scans").document(str(scan_id)).set({ ... })
    
    return scan_id

def get_history(user_email: str = None, limit: int = 20):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if user_email:
        cursor.execute("""
        SELECT * FROM scans 
        WHERE user_email = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
        """, (user_email, limit))
    else:
        cursor.execute("""
        SELECT * FROM scans 
        ORDER BY timestamp DESC 
        LIMIT ?
        """, (limit,))
        
    rows = cursor.fetchall()
    conn.close()
    
    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "user_email": r["user_email"],
            "text": r["text"],
            "prediction": r["prediction"],
            "confidence": r["confidence"],
            "risk_level": r["risk_level"],
            "explanation": r["explanation"],
            "timestamp": r["timestamp"]
        })
    return history

def get_db_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total count
    cursor.execute("SELECT COUNT(*) FROM scans")
    total_scans = cursor.fetchone()[0]
    
    # Real vs Fake counts
    cursor.execute("SELECT COUNT(*) FROM scans WHERE prediction = 'REAL'")
    real_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM scans WHERE prediction = 'FAKE'")
    fake_count = cursor.fetchone()[0]
    
    # Average confidence
    cursor.execute("SELECT AVG(confidence) FROM scans")
    avg_confidence = cursor.fetchone()[0] or 0.0
    
    # Recent scan list
    cursor.execute("SELECT prediction, timestamp FROM scans ORDER BY timestamp DESC LIMIT 10")
    recent = [{"prediction": r[0], "timestamp": r[1]} for r in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_scans": total_scans,
        "real_count": real_count,
        "fake_count": fake_count,
        "avg_confidence": round(avg_confidence, 2),
        "recent_activity": recent
    }

def save_feedback(scan_id: int, rating: str, comment: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    timestamp = datetime.datetime.utcnow().isoformat()
    try:
        cursor.execute("""
        INSERT INTO feedback (scan_id, rating, comment, timestamp)
        VALUES (?, ?, ?, ?)
        """, (scan_id, rating, comment, timestamp))
        conn.commit()
        success = True
    except Exception as e:
        print(f"[MediTruth AI Database] Error saving feedback: {e}")
        success = False
    finally:
        conn.close()
        
    return success
