# Auth Microservice

Микросервис аутентификации и авторизации, построенный на основе NestJS, Bun, Prisma и PostgreSQL.

## Описание проекта

Данный микросервис является частью более крупного приложения и отвечает за:

- 👤 **Управление пользователями** - регистрация, обновление профилей, управление учетными записями
- 🔐 **Аутентификация** - вход в систему с использованием JWT токенов
- 🛡️ **Авторизация** - система ролей и разрешений для контроля доступа
- 🌐 **gRPC API** - микросервисная архитектура для взаимодействия с другими сервисами
- 🍪 **Управление сессиями** - безопасная работа с cookie

### Технологический стек

- **Runtime**: Bun - быстрая JavaScript/TypeScript среда выполнения
- **Framework**: NestJS - масштабируемый Node.js фреймворк
- **База данных**: PostgreSQL с Prisma ORM
- **Аутентификация**: JWT (JSON Web Tokens)
- **API**: gRPC для межсервисного взаимодействия
- **Язык**: TypeScript
- **Линтинг**: Prettier + Husky для автоматического форматирования

### Архитектура базы данных

Система включает следующие основные сущности:

- `User` - пользователи системы
- `Role` - роли пользователей
- `Permission` - разрешения/права доступа
- `UserRole` - связь пользователей и ролей
- `RolePermission` - связь ролей и разрешений

## Инструкция по развертыванию локально

### Предварительные требования

Убедитесь, что у вас установлены:

- **Bun** >= 1.0.0 - [Инструкция по установке](https://bun.sh/docs/installation)
- **PostgreSQL** >= 14 - [Скачать PostgreSQL](https://www.postgresql.org/download/)
- **Git** - для клонирования репозитория

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd auth-microservice
```

### 2. Установка зависимостей

```bash
bun install
```

### 3. Настройка окружения

Скопируйте файл конфигурации и настройте переменные окружения:

```bash
cp .env.dist .env
```

Отредактируйте `.env` файл, указав ваши настройки:

```env
# Подключение к базе данных
DATABASE_USERNAME='your_username'
DATABASE_PASSWORD='your_password'
DATABASE_HOSTNAME='localhost'
DATABASE_PROVIDER='postgresql'
DATABASE_NAME='auth_db'
DATABASE_PORT=5432

# Формируется автоматически на основе переменных выше
DATABASE_URL=${DATABASE_PROVIDER}://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public

# RabbitMQ (если используется)
RABBITMQ_HOSTNAME='localhost'
RABBITMQ_PORT=5672
RABBITMQ_QUEUE='users'

# Настройки сервера
PORT=3000
MODE='development'
DOMAIN='.mirum7.dev'

# JWT настройки
JWT_SECRET='your_super_secret_jwt_key_here'
JWT_EXPIRES_IN='1h'

# Cookie настройки
COOKIE_SECRET='your_cookie_secret_here'
```

### 4. Настройка базы данных

Создайте базу данных PostgreSQL:

```bash
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE auth_db;

# Создайте пользователя (опционально)
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO your_username;
```

### 5. Применение миграций

Сгенерируйте Prisma Client и примените миграции:

```bash
# Генерация Prisma Client
bunx prisma generate

# Применение миграций к базе данных
bunx prisma db push

# Или создание новой миграции (при изменении схемы)
bunx prisma migrate dev --name init
```

### 6. Запуск приложения

```bash
# Разработка (с автоперезагрузкой)
bun run dev

# Продакшн
bun run start

# Или собрать и запустить оптимизированную версию
bun run build
bun run start:prod
```

Приложение будет доступно по адресу:

- **HTTP API**: http://localhost:3000
- **gRPC**: localhost:4000

## Доступные скрипты

В проекте доступны следующие скрипты для управления и разработки:

### Основные команды

| Команда              | Описание                                                      |
| -------------------- | ------------------------------------------------------------- |
| `bun run dev`        | Запуск в режиме разработки с автоперезагрузкой при изменениях |
| `bun run start`      | Запуск приложения в обычном режиме                            |
| `bun run build`      | Сборка оптимизированной версии приложения                     |
| `bun run start:prod` | Запуск собранной продакшн версии                              |
| `bun run prepare`    | Подготовка окружения (Husky + Prisma генерация)               |

### Команды для работы с базой данных

| Команда                      | Описание                                           |
| ---------------------------- | -------------------------------------------------- |
| `bunx prisma generate`       | Генерация Prisma Client на основе схемы            |
| `bunx prisma db push`        | Применение изменений схемы к базе данных           |
| `bunx prisma migrate dev`    | Создание и применение новой миграции               |
| `bunx prisma migrate deploy` | Применение миграций в продакшне                    |
| `bunx prisma studio`         | Запуск веб-интерфейса для просмотра данных         |
| `bunx prisma db seed`        | Заполнение базы тестовыми данными (если настроено) |

### Команды для разработки

| Команда                   | Описание                     |
| ------------------------- | ---------------------------- |
| `bunx prettier --write .` | Форматирование всего кода    |
| `bunx prettier --check .` | Проверка форматирования кода |

### Дополнительные команды Bun

| Команда                | Описание                     |
| ---------------------- | ---------------------------- |
| `bun install`          | Установка зависимостей       |
| `bun add <package>`    | Добавление новой зависимости |
| `bun remove <package>` | Удаление зависимости         |
| `bun update`           | Обновление всех зависимостей |

## Структура проекта

```
auth-microservice/
├── src/                    # Исходный код приложения
│   ├── app/               # Настройка и запуск приложения
│   ├── modules/           # Модули приложения
│   │   ├── auth/         # Модуль аутентификации
│   │   ├── users/        # Модуль управления пользователями
│   │   ├── roles/        # Модуль управления ролями
│   │   ├── permissions/  # Модуль управления разрешениями
│   │   └── prisma/       # Prisma конфигурация
│   └── shared/           # Общие компоненты и утилиты
├── prisma/               # Схема базы данных и миграции
├── bin/                  # CLI скрипты
├── patchs/              # Патчи для зависимостей
├── .env.dist            # Шаблон переменных окружения
├── package.json         # Зависимости и скрипты
├── tsconfig.json        # Конфигурация TypeScript
├── build.config.ts      # Конфигурация сборки
└── README.md           # Документация проекта
```

## Разработка

### Добавление новых зависимостей

```bash
# Обычная зависимость
bun add package-name

# Зависимость для разработки
bun add -d package-name

# Глобальная установка
bun add -g package-name
```

### Работа с миграциями

При изменении схемы базы данных в `prisma/schema.prisma`:

```bash
# Создать и применить миграцию
bunx prisma migrate dev --name description_of_changes

# Сгенерировать новый Prisma Client
bunx prisma generate
```

### Форматирование кода

Проект использует Prettier и Husky для автоматического форматирования:

```bash
# Проверить форматирование
bunx prettier --check .

# Исправить форматирование
bunx prettier --write .
```

## Полезные ссылки

- [Документация Bun](https://bun.sh/docs)
- [Документация NestJS](https://docs.nestjs.com/)
- [Документация Prisma](https://www.prisma.io/docs)
- [Документация PostgreSQL](https://www.postgresql.org/docs/)
