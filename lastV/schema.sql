-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    check_in_date TEXT NOT NULL,
    check_out_date TEXT NOT NULL,
    room_type TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    created_at TEXT NOT NULL
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_type TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image_path TEXT
);

-- Insert sample room data
INSERT INTO rooms (room_type, description, price, image_path) VALUES 
    ('Эконом', 'Уютный номер с основными удобствами для комфортного отдыха.', 3000, '/images/economy-room.jpg'),
    ('Средний', 'Просторный номер с дополнительными удобствами и прекрасным видом на лес.', 5000, '/images/standard-room.jpg'),
    ('Люкс', 'Премиальный номер с панорамными окнами, джакузи и всеми возможными удобствами.', 8000, '/images/luxury-room.jpg');
