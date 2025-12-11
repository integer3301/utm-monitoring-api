# УТМ Мониторинг

Это приложение на NestJS для мониторинга UTM и сбора метрик. Архитектура модульная с выделением отдельных модулей для мониторинга, метрик и работы с базой данных.

---

## Структура проекта

src/
├── app.module.ts # Главный модуль приложения
├── app.controller.ts # Главный контроллер
├── app.service.ts # Главный сервис
├── database/ # Модуль работы с базой данных
│ ├── database.module.ts
│ └── database.service.ts
├── modules/
│ └── monitoring/
│ ├── monitoring.module.ts
│ ├── poller/
│ │ ├── poller.module.ts
│ │ ├── poller.service.ts
│ │ └── utm-client.ts
│ └── metrics/
│ ├── metrics.module.ts
│ ├── metrics.service.ts
│ ├── metrics.repository.ts
│ └── utm.repository.ts
├── shared/
│ └── types/ # Общие типы и интерфейсы
└── api/
└── utm.controller.ts # Контроллер API для работы с UTM

