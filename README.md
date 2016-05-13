## Установка

Для работы приложения требуются NodeJS и MySQL, git.

1. Клонируйте репозитарий проекта:

```bash
git clone https://github.com/outbreak/para-billing.git
```


2. Переход в каталог проекта:

```bash
cd para-billing
```

3. Установка необходимых зависимостей проекта:

```bash
npm install
```


## Запуск загрузчика

Загрузчик запускается командой:

```bash
node loder.js
```

Чтобы очистить базу данных перед тем как загрузить данные:

```bash
TRUNCATE=true node loader.js
```

Доступны следующие переменные окружения, с помощью которых можно переопределить параметры используемые по умолчанию:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=para_billing
DB_USER=root
DB_PASSWORD=password

DATA_INPUT_FOLDER=data
DATA_OUTPUT_FOLDER=data/processed
DATA_REPORTS_FOLDER=data/reports
```

## Запуск вебсервера

Для запуска сервера выполните команду:

```bash
npm start
```

Также можно указать порт для вебсервера и множество других параметров через установку переменных окружения:

```bash
PORT=3000
ADMIN_LOGIN=admin
ADMIN_PASSWORD=password
```

