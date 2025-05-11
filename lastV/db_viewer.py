import sqlite3
import os
import webbrowser
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)

DB_PATH = 'instance/hotel.db'

def check_database():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}")
        print("Please run the main application first to initialize the database.")
        return False
    return True

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/bookings')
def get_bookings():
    if not check_database():
        return jsonify({"error": "Database not found"}), 404
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    bookings = cursor.execute("SELECT * FROM bookings ORDER BY created_at DESC").fetchall()
    conn.close()
    
    booking_list = []
    for booking in bookings:
        booking_list.append({
            'id': booking['id'],
            'checkInDate': booking['check_in_date'],
            'checkOutDate': booking['check_out_date'],
            'roomType': booking['room_type'],
            'guestName': booking['guest_name'],
            'guestEmail': booking['guest_email'],
            'guestPhone': booking['guest_phone'],
            'createdAt': booking['created_at']
        })
    
    return jsonify(booking_list)

@app.route('/api/rooms')
def get_rooms():
    if not check_database():
        return jsonify({"error": "Database not found"}), 404
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    rooms = cursor.execute("SELECT * FROM rooms").fetchall()
    conn.close()
    
    room_list = []
    for room in rooms:
        room_list.append({
            'id': room['id'],
            'roomType': room['room_type'],
            'description': room['description'],
            'price': room['price'],
            'imagePath': room['image_path']
        })
    
    return jsonify(room_list)

@app.route('/')
def index():
    return send_from_directory('.', 'admin.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    if check_database():
        print("Database found. Starting database viewer...")
        webbrowser.open('http://127.0.0.1:5001')
        app.run(port=5001, debug=True)
    else:
        print("Exiting...")
