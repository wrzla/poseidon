from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)

if not os.path.exists('instance'):
    os.makedirs('instance')

def get_db_connection():
    conn = sqlite3.connect('instance/hotel.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        check_in_date TEXT NOT NULL,
        check_out_date TEXT NOT NULL,
        room_type TEXT NOT NULL,
        guest_name TEXT NOT NULL,
        guest_email TEXT,
        guest_phone TEXT,
        created_at TEXT NOT NULL
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_type TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image_path TEXT
    )
    ''')
    
    cursor.execute("SELECT COUNT(*) FROM rooms")
    if cursor.fetchone()[0] == 0:
        rooms = [
            ('Эконом', 'Уютный номер с основными удобствами для комфортного отдыха.', 2000, '/poseidonNI/images/economy-room.jpg'),
            ('Средний', 'Просторный номер с дополнительными удобствами и прекрасным видом на лес.', 3000, '/poseidonNI/images/standard-room.jpg'),
            ('Люкс', 'Премиальный номер с панорамными окнами, джакузи и всеми возможными удобствами.', 4000, '/poseidonNI/images/luxury-room.jpg')
        ]
        cursor.executemany("INSERT INTO rooms (room_type, description, price, image_path) VALUES (?, ?, ?, ?)", rooms)
    
    conn.commit()
    conn.close()

init_db()

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.json
    
    required_fields = ['checkInDate', 'checkOutDate', 'roomType', 'guestName']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO bookings (check_in_date, check_out_date, room_type, guest_name, guest_email, guest_phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                data['checkInDate'],
                data['checkOutDate'],
                data['roomType'],
                data['guestName'],
                data.get('guestEmail', ''),
                data.get('guestPhone', ''),
                datetime.now().isoformat()
            )
        )
        conn.commit()
        booking_id = cursor.lastrowid
        
        return jsonify({
            'success': True,
            'message': 'Бронирование успешно создано',
            'bookingId': booking_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
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

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
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
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)

print("Flask server is running on http://127.0.0.1:5000")
