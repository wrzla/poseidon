from flask import Flask, request, jsonify, render_template
import sqlite3
import os
from datetime import datetime

# Создаем экземпляр Flask
app = Flask(__name__, static_folder='.', static_url_path='')

# Путь к базе данных
DATABASE = 'poseidon.db'

# Добавьте описания, связанные с Утришем, в базу данных
def init_db():
    # Проверяем, существует ли файл базы данных
    if not os.path.exists(DATABASE):
        # Подключаемся к базе данных
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Создаем таблицу для номеров
        cursor.execute('''
        CREATE TABLE rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT
        )
        ''')
        
        # Создаем таблицу для бронирований
        cursor.execute('''
        CREATE TABLE bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_type TEXT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            guest_name TEXT,
            guest_email TEXT,
            guest_phone TEXT,
            booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Добавляем типы номеров с описаниями, связанными с Утришем
        rooms = [
            ('economy', 2000, 'Уютный номер с основными удобствами и видом на можжевеловый лес Утриша. Идеально для ценителей природы.'),
            ('standard', 3500, 'Просторный номер с балконом и видом на живописные пейзажи Утриша. В номере есть все необходимое для комфортного отдыха.'),
            ('luxury', 5000, 'Премиальный номер с панорамным видом на море и реликтовый лес Утриша. Роскошный интерьер и максимальный комфорт.')
        ]
        
        cursor.executemany('INSERT INTO rooms (type, price, description) VALUES (?, ?, ?)', rooms)
        
        # Сохраняем изменения и закрываем соединение
        conn.commit()
        conn.close()
        
        print("База данных успешно создана с описаниями Утриша")

# Инициализируем базу данных при запуске приложения
init_db()

# Маршрут для главной страницы
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Маршрут для обработки бронирований
@app.route('/book', methods=['POST'])
def book_room():
    try:
        # Получаем данные из запроса
        data = request.json
        check_in = data.get('checkIn')
        check_out = data.get('checkOut')
        room_type = data.get('roomType')
        
        # Проверяем наличие обязательных полей
        if not check_in or not check_out or not room_type:
            return jsonify({'success': False, 'message': 'Не все обязательные поля заполнены'}), 400
        
        # Проверяем корректность дат
        try:
            check_in_date = datetime.strptime(check_in, '%Y-%m-%d')
            check_out_date = datetime.strptime(check_out, '%Y-%m-%d')
            
            if check_in_date >= check_out_date:
                return jsonify({'success': False, 'message': 'Дата выезда должна быть позже даты заезда'}), 400
            
            if check_in_date < datetime.now():
                return jsonify({'success': False, 'message': 'Дата заезда не может быть в прошлом'}), 400
        except ValueError:
            return jsonify({'success': False, 'message': 'Некорректный формат даты'}), 400
        
        # Проверяем доступность номера на указанные даты
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Проверяем, есть ли уже бронирования на эти даты для выбранного типа номера
        cursor.execute('''
        SELECT COUNT(*) FROM bookings 
        WHERE room_type = ? 
        AND (
            (check_in <= ? AND check_out > ?) OR
            (check_in < ? AND check_out >= ?) OR
            (check_in >= ? AND check_out <= ?)
        )
        ''', (room_type, check_out, check_in, check_out, check_in, check_in, check_out))
        
        count = cursor.fetchone()[0]
        
        # Предположим, что у нас ограниченное количество номеров каждого типа
        max_rooms = {'economy': 5, 'standard': 3, 'luxury': 2}
        
        if count >= max_rooms.get(room_type, 0):
            conn.close()
            return jsonify({'success': False, 'message': 'Нет свободных номеров выбранного типа на указанные даты'}), 400
        
        # Добавляем бронирование в базу данных
        cursor.execute('''
        INSERT INTO bookings (room_type, check_in, check_out)
        VALUES (?, ?, ?)
        ''', (room_type, check_in, check_out))
        
        # Получаем ID созданного бронирования
        booking_id = cursor.lastrowid
        
        # Сохраняем изменения и закрываем соединение
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'bookingId': booking_id})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Запускаем приложение
if __name__ == '__main__':
    app.run(debug=True)

