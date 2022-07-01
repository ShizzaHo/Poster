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

const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017/poster");

async function mongoConnect (){
    await client.connect();
    console.info("MongoDB успешно подключен");
}

const users = client.db().collection("users");
const sessions = client.db().collection("sessionList");

mongoConnect();

/* -------------------------------------------------------------------------- */
/*                             Тестовый вызов API                             */
/* -------------------------------------------------------------------------- */

app.get("/api/test", function(request, response){
    console.info("[GET] Обращение к /api/test");

    response.json({
        type: "TYPE_TEST", 
        payload: {
			status: "OK",
            data: {
				value: "API WORK!",
			}
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
                login: request.body.login,
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
                    data: {
                        token: await generateSessionToken(userInfo._id)
                    }
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

/* Проверка уникальности данных */

async function isUniqueData(data) {
    return await users.findOne({email: data.email}) == null;
}

/* -------------------------------------------------------------------------- */
/*                              Авторизация юзера                             */
/* -------------------------------------------------------------------------- */

app.post("/api/loginUser", jsonParser, async function(request, response){
    console.info("[POST] Обращение к /api/loginUser");

    const findedUser = await users.findOne({email: request.body.email});

    if (findedUser !== null) {
        if(await findedUser.password === request.body.password){
            response.json({
                type: "TYPE_LOGINUSER", 
                payload: {
                    status: "OK",
                    data: {
                        token: await generateSessionToken(findedUser._id)
                    }
                }
            });
        } else {
            response.json({
                type: "TYPE_LOGINUSER", 
                payload: {
                    status: "ERROR",
                    data: "ERRORTYPE_INCORRECT_DATA"
                }
            });
        }
    } else {
        response.json({
            type: "TYPE_LOGINUSER", 
            payload: {
                status: "ERROR",
                data: "ERRORTYPE_USER_NONEXISTENT"
            }
        });
    }
});

/* -------------------------------------------------------------------------- */
/*                   Генерация новой сессии и токена сессии                   */
/* -------------------------------------------------------------------------- */

let rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

async function generateSessionToken(userId) {
    const findedUser = await users.findOne({_id: ObjectId(userId)});
    const TOKEN = rand() + rand() + rand() + rand();

    sessions.insertOne({
        userID: await findedUser._id,
        sessionToken: TOKEN
    })

    return TOKEN;
}

/* -------------------------------------------------------------------------- */
/*                        Получить данные пользователя                        */
/* -------------------------------------------------------------------------- */

app.get("/api/getUserInfo", jsonParser, async function(request, response){
    console.info("[GET] Обращение к /api/getUserInfo");

    const findedUser = async () => {
        if (await request.query.login !== undefined) {
            return await users.findOne({login: request.query.login})
        } else if (await request.query.token !== undefined) {
            return await users.findOne({_id: ObjectId(request.query.token)})
        } else if (await request.query.session !== undefined) {
            const user = await sessions.findOne({sessionToken: request.query.session});
            if (user !== null) {
                return await users.findOne({_id: ObjectId(await user.userID)});
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    const user = await findedUser();

    if (await user !== null) {
        response.json({
            type: "TYPE_GETUSERINFO", 
            payload: {
                status: "OK",
                data: {
                    login: await user.login,
                    fullname: await user.fullname,
                    status: await user.status,
                    email: await user.email,
                    accountInfo: await user.accountInfo,
                }
            }
        });
    } else {
        response.json({
            type: "TYPE_GETUSERINFO", 
            payload: {
                status: "ERROR",
                data: "ERRORTYPE_USER_NONEXISTENT"
            }
        });
    }
});

/* -------------------------------------------------------------------------- */
/*                        Изменить данные пользователя                        */
/* -------------------------------------------------------------------------- */

app.post("/api/editUserData", jsonParser, async function(request, response){
    console.info("[POST] Обращение к /api/editUserData");

    const findedUser = await users.findOne({login: request.body.userLogin});
    
    if (findedUser !== null) {
        if(await users.findOne({login: request.body.global.login}) == null){
            await users.updateOne({login: request.body.userLogin}, {
                $set: {
                    login: request.body.global.login,
                    fullname: request.body.global.fullname,
                    email: request.body.global.email,
                    accountInfo: {
                        profileStatus: request.body.other.profileStatus
                    }
                }
            });
            response.json({
                type: "TYPE_EDITUSERDATA", 
                payload: {
                    status: "OK",
                    data: {
                        newLogin: request.body.global.login
                    },
                }
            });
        } else {
            response.json({
                type: "TYPE_EDITUSERDATA", 
                payload: {
                    status: "ERROR",
                    data: "ERRORTYPE_LOGIN_ALREADY_TAKEN"
                }
            });
        }
    } else {
        response.json({
            type: "TYPE_EDITUSERDATA", 
            payload: {
                status: "ERROR",
                data: "ERRORTYPE_USER_NONEXISTENT"
            }
        });
    }
    
});

app.listen(3001);
