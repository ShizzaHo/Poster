/* -------------------------------------------------------------------------- */
/*                                   Модули                                   */
/* -------------------------------------------------------------------------- */

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
/* -------------------------------------------------------------------------- */
/*                            Express Конфигурация                            */
/* -------------------------------------------------------------------------- */

const app = express();
const jsonParser = express.json();
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                            MongoDB Конфигурация                            */
/* -------------------------------------------------------------------------- */

const client = new MongoClient("mongodb://127.0.0.1:27017/poster");

async function mongoConnect() {
  await client.connect();
  console.info("MongoDB успешно подключен");
}

const users = client.db().collection("users");
const sessions = client.db().collection("sessionList");

mongoConnect();

/* -------------------------------------------------------------------------- */
/*                             Тестовый вызов API                             */
/* -------------------------------------------------------------------------- */

app.get("/api/test", function (request, response) {
  console.info("[GET] Обращение к /api/test");

  response.json({
    type: "TYPE_TEST",
    payload: {
      status: "OK",
      data: {
        value: "API WORK!",
      },
    },
  });
});

/* -------------------------------------------------------------------------- */
/*                            Создание нового юзера                           */
/* -------------------------------------------------------------------------- */

app.post("/api/createUser", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/createUser");

  if (await isUniqueData(request.body)) {
    let createUser = new Promise(async function (resolve, reject) {
      users
        .insertOne({
          login: request.body.login,
          email: request.body.email,
          fullname: request.body.fullname,
          password: request.body.password,
          status: "default",
          accountInfo: {
            profileStatus: "",
            avatar: null,
            cover: null,
          },
          categories: ["Все посты"],
          posts: [],
        })
        .then(async (e) => {
          const userInfo = await users.findOne({ email: request.body.email });
          const id = { userId: await userInfo._id };
          resolve({
            status: "OK",
            data: {
              token: await generateSessionToken(userInfo._id),
            },
          });
        })
        .catch((e) => {
          reject({ status: "ERROR", data: "ERRORTYPE_INCORRECT_DATA" });
        });
    });

    response.json({
      type: "TYPE_CREATEUSER",
      payload: await createUser,
    });
  } else {
    response.json({
      type: "TYPE_CREATEUSER",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_NOT_UNIQUE_DATA",
      },
    });
  }
});

/* Проверка уникальности данных */

async function isUniqueData(data) {
  return (await users.findOne({ email: data.email })) == null;
}

/* -------------------------------------------------------------------------- */
/*                              Авторизация юзера                             */
/* -------------------------------------------------------------------------- */

app.post("/api/loginUser", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/loginUser");

  const findedUser = await users.findOne({ email: request.body.email });

  if (findedUser !== null) {
    if ((await findedUser.password) === request.body.password) {
      response.json({
        type: "TYPE_LOGINUSER",
        payload: {
          status: "OK",
          data: {
            token: await generateSessionToken(findedUser._id),
            login: await findedUser.login,
          },
        },
      });
    } else {
      response.json({
        type: "TYPE_LOGINUSER",
        payload: {
          status: "ERROR",
          data: "ERRORTYPE_INCORRECT_DATA",
        },
      });
    }
  } else {
    response.json({
      type: "TYPE_LOGINUSER",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                   Генерация новой сессии и токена сессии                   */
/* -------------------------------------------------------------------------- */

let rand = function () {
  return Math.random().toString(36).substr(2); // remove `0.`
};

async function generateSessionToken(userId) {
  const findedUser = await users.findOne({ _id: ObjectId(userId) });
  const TOKEN = rand() + rand() + rand() + rand();

  sessions.insertOne({
    userID: await findedUser._id,
    sessionToken: TOKEN,
  });

  return TOKEN;
}

/* -------------------------------------------------------------------------- */
/*                        Получить данные пользователя                        */
/* -------------------------------------------------------------------------- */

app.get("/api/getUserInfo", jsonParser, async function (request, response) {
  console.info("[GET] Обращение к /api/getUserInfo");

  const findedUser = async () => {
    if ((await request.query.login) !== undefined) {
      return await users.findOne({ login: request.query.login });
    } else if ((await request.query.token) !== undefined) {
      return await users.findOne({ _id: ObjectId(request.query.token) });
    } else if ((await request.query.session) !== undefined) {
      const user = await sessions.findOne({
        sessionToken: request.query.session,
      });
      if (user !== null) {
        return await users.findOne({ _id: ObjectId(await user.userID) });
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const user = await findedUser();

  if ((await user) !== null) {
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
          categories: await user.categories,

          posts: await user.posts.reverse(), // TODO: ПЕРЕПИСАТЬ В ОТДЕЛЬНЫЙ МЕТОД!!!
        },
      },
    });
  } else {
    response.json({
      type: "TYPE_GETUSERINFO",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                        Изменить данные пользователя                        */
/* -------------------------------------------------------------------------- */

app.post("/api/editUserData", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/editUserData");

  const findedUser = await users.findOne({ login: request.body.userLogin });

  if (findedUser !== null) {
    if (await findedUser.password === request.body.password) {
      if (request.body.userLogin === request.body.global.login || await users.findOne({ login: request.body.global.login }) === null) {
        await users.updateOne(
          { login: request.body.userLogin },
          {
            $set: {
              login: request.body.global.login,
              fullname: request.body.global.fullname,
              email: request.body.global.email,
              accountInfo: {
                profileStatus: request.body.other.profileStatus,
                avatar: request.body.other.avatar,
                cover: request.body.other.cover,
              },
            },
          }
        );
        response.json({
          type: "TYPE_EDITUSERDATA",
          payload: {
            status: "OK",
            data: {
              newLogin: request.body.global.login,
            },
          },
        });
      } else {
        response.json({
          type: "TYPE_EDITUSERDATA",
          payload: {
            status: "ERROR",
            data: "ERRORTYPE_LOGIN_ALREADY_TAKEN",
          },
        });
      }
    } else {
      response.json({
        type: "TYPE_EDITUSERDATA",
        payload: {
          status: "ERROR",
          data: "ERRORTYPE_ACCESS_BLOCKED",
        },
      });
    }
  } else {
    response.json({
      type: "TYPE_EDITUSERDATA",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                        Изменить пароль пользователя                        */
/* -------------------------------------------------------------------------- */

app.post("/api/editUserPassword", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/editUserPassword");

  const findedUser = await users.findOne({ login: request.body.login });

  if (findedUser !== null) {
    if (request.body.newPassword === request.body.newPasswordRepeat) {
      if (findedUser.password === request.body.oldPassword) {
        await users.updateOne(
          { login: request.body.login },
          {
            $set: {
              password: request.body.newPassword
            },
          }
        );
        response.json({
          type: "TYPE_EDITUSERPASSWORD",
          payload: {
            status: "OK",
          },
        });
      } else {
        response.json({
          type: "TYPE_EDITUSERPASSWORD",
          payload: {
            status: "ERROR",
            data: "ERRORTYPE_PASSWORDS_DO_NOT_MATCH",
          },
        });
      }
    } else {
      response.json({
        type: "TYPE_EDITUSERPASSWORD",
        payload: {
          status: "ERROR",
          data: "ERRORTYPE_ACCESS_BLOCKED",
        },
      });
    }
  } else {
    response.json({
      type: "TYPE_EDITUSERPASSWORD",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                       Завершение всех активных сессий                      */
/* -------------------------------------------------------------------------- */

app.post("/api/closeAllSessions", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/closeAllSessions");

  const findedUser = await users.findOne({ login: request.body.login });
  const findedSessions = await sessions.find({ userID: await findedUser._id });

  if (findedUser !== null) {
    if (request.body.password === findedUser.password) {
      if (findedSessions !== null) {
        await sessions.deleteMany({ userID: await findedUser._id });
        response.json({
          type: "TYPE_CLOSEALLSESSIONS",
          payload: {
            status: "OK",
          },
        });
      } else {
        response.json({
          type: "TYPE_CLOSEALLSESSIONS",
          payload: {
            status: "ERROR",
            data: "ERRORTYPE_SESSIONS_NONEXISTENT",
          },
        });
      }
    } else {
      response.json({
        type: "TYPE_CLOSEALLSESSIONS",
        payload: {
          status: "ERROR",
          data: "ERRORTYPE_ACCESS_BLOCKED",
        },
      });
    }
  } else {
    response.json({
      type: "TYPE_CLOSEALLSESSIONS",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }

});

/* -------------------------------------------------------------------------- */
/*                              Удаление аккаунта                             */
/* -------------------------------------------------------------------------- */

app.post("/api/deleteAccount", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/deleteAccount");

  const findedUser = await users.findOne({ login: request.body.login });

  if (findedUser !== null) {
    if (request.body.password === findedUser.password) {
      await users.deleteOne({ login: request.body.login });
      await sessions.deleteMany({ userID: await findedUser._id });
      response.json({
        type: "TYPE_DELETEACCOUNT",
        payload: {
          status: "OK",
        },
      });
    } else {
      response.json({
        type: "TYPE_DELETEACCOUNT",
        payload: {
          status: "ERROR",
          data: "ERRORTYPE_ACCESS_BLOCKED",
        },
      });
    }
  } else {
    response.json({
      type: "TYPE_DELETEACCOUNT",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                              Публикация поста                              */
/* -------------------------------------------------------------------------- */

app.post("/api/publishPost", jsonParser, async function (request, response) {
  console.info("[POST] Обращение к /api/publishPost");

  // TODO: Временный API метод, нужно переделать

  const findedUser = await users.findOne({ login: request.body.login });
  const data = new Date();

  if (findedUser !== null) {
    if (request.body.password === findedUser.password) {
      await users.updateOne(
        { login: request.body.login },
        {
          $push: {
            posts: [{
              data: data.toLocaleDateString("ru-RU"),
              title: await request.body.title,
              content: await request.body.message,
              addedResources: [],
              likes: 0,
              readings: 0,
            }],
          },
        }
      );
      response.json({
        type: "TYPE_PUBLISHPOST",
        payload: {
          status: "OK",
        },
      });
    } else {
      response.json({
        type: "TYPE_PUBLISHPOST",
        payload: {
          status: "ERROR",
          data: "ERRORTYPE_ACCESS_BLOCKED",
        },
      });
    }
  } else {
    response.json({
      type: "TYPE_PUBLISHPOST",
      payload: {
        status: "ERROR",
        data: "ERRORTYPE_USER_NONEXISTENT",
      },
    });
  }
});

app.listen(3001);
