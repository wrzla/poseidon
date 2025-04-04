from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'poseidon_secret_key'  # Для работы flash-сообщений

# Путь к базе данных
DATABASE = 'poseidon.db'

# Функция для подключения к базе данных
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Инициализация базы данных
def init_db():
    if not os.path.exists(DATABASE):
        conn = get_db_connection()
        with open('schema.sql') as f:
            conn.executescript(f.read())
        conn.commit()
        conn.close()
        print("База данных инициализирована")

# Контекстный процессор для добавления текущей даты во все шаблоны
@app.context_processor
def inject_now():
    return {'now': datetime.now()}

# Маршрут для главной страницы
@app.route('/')
def index():
    # Данные о номерах
    rooms = [
        {
            "title": "Эконом",
            "description": "Уютный номер с основными удобствами для комфортного проживания.",
            "image": "static/images/room-economy.jpg",
            "price": "3000",
            "type": "economy"
        },
        {
            "title": "Средний",
            "description": "Просторный номер с дополнительными удобствами и красивым видом.",
            "image": "static/images/room-standard.jpg",
            "price": "5000",
            "type": "standard"
        },
        {
            "title": "Люкс",
            "description": "Премиальный номер с максимальным комфортом и панорамным видом на лес.",
            "image": "static/images/room-luxury.jpg",
            "price": "8000",
            "type": "luxury"
        }
    ]
    return render_template('index.html', rooms=rooms)

# Маршрут для страницы номера
@app.route('/rooms/<room_type>')
def room_detail(room_type):
    room_types = {
        "economy": {
            "title": "Эконом",
            "description": "Уютный номер с основными удобствами для комфортного проживания. Идеально подходит для путешественников, которые планируют активно исследовать окрестности и используют номер преимущественно для отдыха.",
            "price": "3000",
            "image": "static/images/room-economy.jpg",
            "features": [
                "Площадь: 18 кв.м",
                "Одна двуспальная или две односпальные кровати",
                "Телевизор с плоским экраном",
                "Кондиционер",
                "Бесплатный Wi-Fi",
                "Ванная комната с душем",
                "Туалетные принадлежности",
                "Фен"
            ]
        },
        "standard": {
            "title": "Средний",
            "description": "Просторный номер с дополнительными удобствами и красивым видом на лес. Отличный выбор для тех, кто ценит комфорт и уют во время отдыха.",
            "price": "5000",
            "image": "static/images/room-standard.jpg",
            "features": [
                "Площадь: 25 кв.м",
                "Одна двуспальная или две односпальные кровати",
                "Телевизор с плоским экраном и кабельными каналами",
                "Кондиционер и отопление",
                "Высокоскоростной Wi-Fi",
                "Мини-бар",
                "Рабочий стол",
                "Сейф",
                "Ванная комната с душем или ванной",
                "Премиальные туалетные принадлежности",
                "Фен и халаты"
            ]
        },
        "luxury": {
            "title": "Люкс",
            "description": "Премиальный номер с максимальным комфортом и панорамным видом на лес. Идеальный выбор для тех, кто хочет получить незабываемые впечатления от пребывания в нашей гостинице.",
            "price": "8000",
            "image": "static/images/room-luxury.jpg",
            "features": [
                "Площадь: 40 кв.м",
                "Большая двуспальная кровать King-size",
                "Отдельная гостиная зона",
                "Панорамные окна с видом на лес",
                "Телевизор с плоским экраном и премиум-каналами",
                "Индивидуальный климат-контроль",
                "Высокоскоростной Wi-Fi",
                "Полностью укомплектованный мини-бар",
                "Кофемашина",
                "Рабочая зона с эргономичным креслом",
                "Электронный сейф",
                "Роскошная ванная комната с ванной и отдельным душем",
                "Премиальные туалетные принадлежности",
                "Фен, халаты и тапочки",
                "Услуга вечерней подготовки номера"
            ]
        }
    }
    
    if room_type not in room_types:
        return redirect(url_for('index'))
        
    return render_template('room_detail.html', room=room_types[room_type])

# Маршрут для страницы "О нас"
@app.route('/about')
def about():
    return render_template('about.html')

# Маршрут для обработки бронирования
@app.route('/book', methods=['POST'])
def book():
    if request.method == 'POST':
        check_in = request.form.get('check_in')
        check_out = request.form.get('check_out')
        room_type = request.form.get('room_type')
        guest_name = request.form.get('guest_name')
        guest_email = request.form.get('guest_email')
        guest_phone = request.form.get('guest_phone', '')  # Значение по умолчанию - пустая строка
        
        # Проверка обязательных полей
        if not all([check_in, check_out, room_type, guest_name, guest_email]):
            flash('Пожалуйста, заполните все обязательные поля', 'error')
            return redirect(url_for('index'))
        
        try:
            conn = get_db_connection()
            conn.execute('''
                INSERT INTO bookings (check_in, check_out, room_type, guest_name, guest_email, guest_phone, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (check_in, check_out, room_type, guest_name, guest_email, guest_phone, 'pending', datetime.now().isoformat()))
            conn.commit()
            conn.close()
            
            flash('Бронирование успешно отправлено!', 'success')
        except Exception as e:
            flash(f'Ошибка при бронировании: {str(e)}', 'error')
        
        return redirect(url_for('index'))

# Маршрут для административной панели
@app.route('/admin')
def admin():
    conn = get_db_connection()
    bookings = conn.execute('SELECT * FROM bookings ORDER BY created_at DESC').fetchall()
    conn.close()
    return render_template('admin.html', bookings=bookings)

# Маршрут для обновления статуса бронирования
@app.route('/admin/update_status/<int:booking_id>', methods=['POST'])
def update_status(booking_id):
    if request.method == 'POST':
        new_status = request.form.get('status')
        
        if new_status not in ['pending', 'confirmed', 'cancelled']:
            flash('Неверный статус', 'error')
            return redirect(url_for('admin'))
        
        try:
            conn = get_db_connection()
            conn.execute('UPDATE bookings SET status = ? WHERE id = ?', (new_status, booking_id))
            conn.commit()
            conn.close()
            flash('Статус бронирования обновлен', 'success')
        except Exception as e:
            flash(f'Ошибка при обновлении статуса: {str(e)}', 'error')
        
        return redirect(url_for('admin'))

if __name__ == '__main__':
    # Создаем папки, если они не существуют
    os.makedirs('static/images', exist_ok=True)
    
    # Инициализируем базу данных при запуске
    init_db()
    
    app.run(debug=True)

