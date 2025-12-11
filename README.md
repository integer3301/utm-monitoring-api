<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UTM Мониторинг</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
    h1, h2, h3 { color: #2c3e50; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    ul { margin-bottom: 20px; }
    li { margin-bottom: 5px; }
    .folder { color: #2980b9; }
    .file { color: #27ae60; }
  </style>
</head>
<body>
  <h1>UTM Мониторинг</h1>
  <p>Приложение на NestJS для мониторинга UTM и сбора метрик. Архитектура модульная с выделением отдельных модулей для мониторинга, метрик и работы с базой данных.</p>

  <h2>Структура проекта</h2>
  <pre>
<span class="folder">src/</span>
├── <span class="file">app.module.ts</span>            # Главный модуль приложения
├── <span class="file">app.controller.ts</span>       # Главный контроллер (health check и др.)
├── <span class="file">app.service.ts</span>          # Главный сервис
├── <span class="folder">database/</span>             # Модуль работы с БД
│   ├── <span class="file">database.module.ts</span>
│   └── <span class="file">database.service.ts</span> # Подключение к PostgreSQL
├── <span class="folder">modules/</span>
│   └── <span class="folder">monitoring/</span>
│       ├── <span class="file">monitoring.module.ts</span>
│       ├── <span class="folder">poller/</span>
│       │   ├── <span class="file">poller.module.ts</span>
│       │   ├── <span class="file">poller.service.ts</span>
│       │   └── <span class="file">utm-client.ts</span> # Клиент для запроса UTM
│       └── <span class="folder">metrics/</span>
│           ├── <span class="file">metrics.module.ts</span>
│           ├── <span class="file">metrics.service.ts</span>
│           ├── <span class="file">metrics.repository.ts</span>
│           └── <span class="file">utm.repository.ts</span> # CRUD для таблицы utms
├── <span class="folder">shared/</span>
│   └── <span class="folder">types/</span>            # Общие типы и интерфейсы
└── <span class="folder">api/</span>
    └── <span class="file">utm.controller.ts</span>   # REST API для работы с UTM
  </pre>

  <h2>Рекомендации по модулям</h2>
  <ul>
    <li><strong>database.service.ts</strong> – подключение к PostgreSQL и функция query()</li>
    <li><strong>utm.repository.ts</strong> – CRUD таблицы <code>utms</code>, без вычислений</li>
    <li><strong>metrics.repository.ts</strong> – сохранение метрик и выборка последних данных</li>
    <li><strong>metrics.service.ts</strong> – обёртка над репозиториями, логика сохранения метрик после опроса</li>
    <li><strong>poller.service.ts</strong> – опрос всех UTM, вычисление RSA/GOST дней, сохранение метрик через <code>metrics.service</code></li>
    <li><strong>utm-client.ts</strong> – слой для обращения к API UTM</li>
    <li><strong>utm.controller.ts</strong> – API для фронтенда или внешних сервисов, использует только сервисы</li>
  </ul>

  <h2>Пример SQL для базы</h2>
  <pre>
CREATE TABLE utms (
  id SERIAL PRIMARY KEY,
  utm_id VARCHAR(50) UNIQUE NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  utm_id VARCHAR(50) REFERENCES utms(utm_id),
  rsa_days INT,
  gost_days INT,
  version VARCHAR(50),
  doc_buffer TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
  </pre>

  <h2>Запуск проекта локально</h2>
  <ul>
    <li>Склонировать репозиторий</li>
    <li>Установить зависимости: <code>npm install</code></li>
    <li>Создать базу PostgreSQL и таблицы</li>
    <li>Создать <code>.env</code> с настройками БД и POLLER_INTERVAL</li>
    <li>Запустить: <code>npm run start:dev</code></li>
  </ul>
</body>
</html>
