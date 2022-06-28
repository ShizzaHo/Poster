/* -------------------------------------------------------------------------- */
/*                                   Модули                                   */
/* -------------------------------------------------------------------------- */

const express = require("express");
const cors = require('cors');
const jsonParser = express.json();

/* -------------------------------------------------------------------------- */
/*                            Express Конфигурация                            */
/* -------------------------------------------------------------------------- */

const app = express();
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                            MongoDB Конфигурация                            */
/* -------------------------------------------------------------------------- */

const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017/poster");

async function mongoConnect (){
    await client.connect();
    console.info("MongoDB успешно подключен");
}

const users = client.db().collection("users");

mongoConnect();

/* -------------------------------------------------------------------------- */
/*                             Тестовый вызов API                             */
/* -------------------------------------------------------------------------- */

app.get("/api/test", function(request, response){
    console.info("[GET] Обращение к /api/test");

    response.json({
        type: "TYPE_TEST", 
        payload: {
            response: "API WORK!"
        }
    });
});

/* -------------------------------------------------------------------------- */
/*                            Создание нового юзера                           */
/* -------------------------------------------------------------------------- */

app.post("/api/createUser", jsonParser, async function(request, response){
    console.info("[POST] Обращение к /api/createUser");

    if (await isUniqueData(request.body)) {
        let createUser = new Promise(async function(resolve, reject) {
            users.insertOne({
                name: request.body.name,
                email: request.body.email,
                fullname: request.body.fullname,
                password: request.body.password,
                status: "default",
                accountInfo: {
                    profileStatus: ""
                },
            }).then(async e => {
                const userInfo = await users.findOne({email: request.body.email});
                const id = {userId: await userInfo._id};
                resolve({
                    status: "OK", 
                    data: await id
                })
            }).catch(e => {
                reject({status: "ERROR", data: "ERRORTYPE_INCORRECT_DATA"})
            });
        })

        response.json({
            type: "TYPE_CREATEUSER", 
            payload: await createUser 
        });
    } else {
        response.json({
            type: "TYPE_CREATEUSER", 
            payload: {
                status: "ERROR",
                data: "ERRORTYPE_NOT_UNIQUE_DATA"
            }
        });
    }

    
});

/* Проверка уникальности данныз */

async function isUniqueData(data) {
    return await users.findOne({email: data.email}) == null;
}

app.listen(3001);