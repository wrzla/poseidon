from flask import Flask, request, jsonify, g
import sqlite3
import os
import json
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATABASE = 'poseidon.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.route('/api/init', methods=['GET'])
def initialize_database():
    try:
        init_db()
        return jsonify({"message": "Database initialized successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.json
        required_fields = ['checkIn', 'checkOut', 'roomType', 'guestName', 'guestEmail']
        
        # Validate required fields
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Add additional fields
        data['status'] = 'pending'
        data['createdAt'] = datetime.now().isoformat()
        
        # Insert into database
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            '''
            INSERT INTO bookings (
                checkIn, checkOut, roomType, guestName, guestEmail, 
                guestPhone, status, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                data['checkIn'], data['checkOut'], data['roomType'],
                data['guestName'], data['guestEmail'], data.get('guestPhone'),
                data['status'], data['createdAt']
            )
        )
        db.commit()
        
        # Get the inserted ID
        data['id'] = cursor.lastrowid
        
        return jsonify(data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM bookings ORDER BY createdAt DESC')
        bookings = [dict(row) for row in cursor.fetchall()]
        return jsonify(bookings), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,))
        booking = cursor.fetchone()
        
        if booking is None:
            return jsonify({"error": "Booking not found"}), 404
            
        return jsonify(dict(booking)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings/<int:booking_id>/status', methods=['PATCH'])
def update_booking_status(booking_id):
    try:
        data = request.json
        if 'status' not in data:
            return jsonify({"error": "Status field is required"}), 400
            
        status = data['status']
        if status not in ['pending', 'confirmed', 'cancelled']:
            return jsonify({"error": "Invalid status value"}), 400
            
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            'UPDATE bookings SET status = ? WHERE id = ?',
            (status, booking_id)
        )
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Booking not found"}), 404
            
        return jsonify({"message": "Booking status updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        with app.app_context():
            init_db()
    app.run(debug=True, port=5000)

