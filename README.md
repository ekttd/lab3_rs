Приложение по поиску статистики футболистов.

В начале надо создать .env с MONGO_URL, DATABASE_NAME=players_db, SERVICE_PORT=8001

Запуск:
1. Виртуальное окружение
   python -m venv venv
2. Активация
   venv\Scripts\activate
3. Установка зависимостей
  pip install -r requirements.txt

Запуск бекэнда:
1. cd player_service
2. python -m app.main
3. cd stat_service
4. python -m app.main
   
Запуск фронта:
1. cd player_service/frontend
2. python -m http.server 5501
3. cd stat_service/frontend
4. python -m http.server 5500

Основной сервис по адресу:
http://127.0.0.1:8001, 
в браузере:
http://localhost:5501

Сервис статистики по адресу:
http://127.0.0.1:8002, 
в браузере:
http://localhost:5500

REST API
1. GET /players - получить всех игроков
2. POST /players - добавить игрока
3. POST /statistics/by-name - добавить статистику игроку по имени
4. GET /players/search/{name} - поиск по имени
5. GET /players/{player_id} - поиск по id
6. GET /statistics - получить статистику всех игроков
7. GET /statistics/by-name/{name} - получить статистику по имени
