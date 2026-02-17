Приложение по поиску статистики футболистов. Расширено: добавлена аутентификация с использованием токенов и шифрованием данных при передаче

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
http://localhost:8001, 
в браузере:
http://localhost:5501

Сервис статистики по адресу:
http://localhost:8002, 
в браузере:
http://localhost:5500


