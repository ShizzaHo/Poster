/* -------------------------------------------------------------------------- */
/*                                   Модули                                   */
/* -------------------------------------------------------------------------- */

const { MongoClient, ObjectId } = require("mongodb");

/* -------------------------------------------------------------------------- */
/*                            MongoDB Конфигурация                            */
/* -------------------------------------------------------------------------- */

// const client = new MongoClient("mongodb://127.0.0.1:27017/poster");

// async function mongoConnect() {
//   await client.connect();
//   console.info("MongoDB успешно подключен");
// }

// const users = client.db().collection("users");
// const sessions = client.db().collection("sessionList");

// mongoConnect();

/* -------------------------------------------------------------------------- */
/*                        Сообщение о ошибке аргументов                       */
/* -------------------------------------------------------------------------- */

function argsError(error) {
    console.log("\x1b[47m" +" Неправильно введены данные агументов " + "\x1b[0m");
    console.log("Шаблон заполнения аргументов: " + "\x1b[33m" + "npm run mongo <mongo-URL> <database-name>" + "\x1b[0m");
    console.log("Подробное описание ошибки: " + error + "\x1b[0m");
} 

/* -------------------------------------------------------------------------- */
/*                            Создание базы данных                            */
/* -------------------------------------------------------------------------- */

function createBase() {
    if (process.argv.length === 4) {
        const url = process.argv[2];
        const name = process.argv[3];
        const client = new MongoClient(url);
        async function mongoConnect() {
            console.info("Подключение к: " + url);
            await client.connect();
            console.info("MongoDB успешно подключен");
            const db = client.db(name);
            db.createCollection("users")
            db.createCollection("sessions")
            console.info("Настройка завершена");
            setTimeout(()=>process.exit(), 3000)
        }
        mongoConnect();
    } else {
        argsError("Неверные аргументы, или их отсутствие");
    }
}

createBase();