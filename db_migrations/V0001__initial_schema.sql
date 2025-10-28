CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'used')),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  is_preorder BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  total_orders INTEGER DEFAULT 0,
  discount_tier INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, condition, price, description, image_url, stock) VALUES
('iPhone 15 Pro Max', 'iPhone', 'new', 119990, 'Новейший флагман Apple с титановым корпусом, чипом A17 Pro и камерой 48 МП', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium.jpg', 10),
('iPhone 14', 'iPhone', 'new', 79990, 'iPhone 14 с чипом A15 Bionic, камерой 12 МП и дисплеем Super Retina XDR', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue.jpg', 15),
('iPhone 13 Pro', 'iPhone', 'used', 59990, 'Б/У iPhone 13 Pro в отличном состоянии, батарея 95%, ProMotion дисплей 120 Гц', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-blue-select.jpg', 5),
('MacBook Pro 16"', 'Mac', 'new', 289990, 'MacBook Pro 16" с чипом M3 Max, 36 ГБ RAM, 1 ТБ SSD', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301.jpg', 8),
('MacBook Air 13"', 'Mac', 'new', 109990, 'Тонкий и легкий MacBook Air с чипом M2, 8 ГБ RAM, 256 ГБ SSD', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402.jpg', 12),
('iPad Pro 12.9"', 'iPad', 'new', 129990, 'iPad Pro с дисплеем Liquid Retina XDR, чип M2, поддержка Apple Pencil', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210.jpg', 7),
('Apple Watch Series 9', 'Watch', 'new', 44990, 'Apple Watch Series 9 с дисплеем Always-On, датчиками здоровья', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-s9-202309.jpg', 20),
('AirPods Pro 2', 'Accessories', 'new', 24990, 'AirPods Pro второго поколения с активным шумоподавлением', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83.jpg', 25),
('iPhone 12', 'iPhone', 'used', 39990, 'Б/У iPhone 12 в хорошем состоянии, батарея 88%, все функции работают', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-purple-select-2021.jpg', 8),
('iPad Air', 'iPad', 'used', 44990, 'Б/У iPad Air с чипом M1, 64 ГБ, в отличном состоянии', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203.jpg', 6);

INSERT INTO reviews (customer_name, rating, comment, source) VALUES
('Дмитрий Соколов', 5, 'Отличный магазин! Купил iPhone 15 Pro, все подлинное, быстрая доставка.', 'yandex'),
('Елена Морозова', 5, 'Приобрела MacBook Air, ребята помогли с выбором, все объяснили. Рекомендую!', 'yandex'),
('Александр Петров', 4, 'Взял б/у iPhone 13 Pro, состояние действительно отличное, как и обещали.', 'yandex'),
('Ольга Иванова', 5, 'Лучший магазин Apple техники в Вологде! Цены адекватные, персонал вежливый.', 'yandex'),
('Сергей Волков', 5, 'Купил Apple Watch и AirPods, все оригинал. Спасибо за бонусную скидку!', 'yandex');