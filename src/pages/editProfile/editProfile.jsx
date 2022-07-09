import { webInfo } from "../../info";
import "./editProfile.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoaderBox from "../../components/global/loaderBox/loaderBox";
import LeftMenu from "../../components/global/leftMenu/leftMenu";

export default function User(props) {
  const [userData, setUserData] = useState({});
  const [accountInfo, setAccountInfo] = useState({});

  const [userEditLogin, setUserEditLogin] = useState(null);
  const [userPassword, setUserPassword] = useState();

  const [menuSelected, setMenuSelected] = useState("BASIC");

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const userSession = localStorage.getItem("SESSION_TOKEN");
      let response = await fetch(
        webInfo.backendServer +
          "/api/getUserInfo?session=" +
          (await userSession)
      );

      if (response.ok) {
        let json = await response.json();
        if (json.payload.status === "OK") {
          setUserData(json.payload.data);
          setAccountInfo(json.payload.data.accountInfo);
          setUserEditLogin(json.payload.data.login);
          setUserPassword(localStorage.getItem("PASSWORD"));
        } else {
          errorPage();
        }
      } else {
        alert("Ошибка HTTP: " + response.status);
      }
    };
    getData();
  }, []);

  let opennedPage = <></>;

  switch (menuSelected) {
    case "BASIC":
      opennedPage = (
        <div className="editProfile__pageBasic">
          <input
            value={userData.login}
            onChange={loginEdit}
            placeholder="Логин"
          ></input>
          <br></br>
          <input
            value={userData.fullname}
            onChange={fullnameEdit}
            placeholder="Полное имя"
          ></input>
          <br></br>
          <input
            value={userData.email}
            onChange={emailEdit}
            placeholder="Электронная почта"
          ></input>
          <br></br>
          <br></br>
          <input
            value={accountInfo.profileStatus}
            onChange={profileStatsEdit}
            placeholder="Статус"
          ></input>
          <br></br>
          <input
            value={accountInfo.avatar}
            onChange={avatarEdit}
            placeholder="Аватар"
          ></input>
          <br></br>
          <br></br>
          <button onClick={save}>Сохранить</button>
        </div>
      );
      break;
    case "STYLE":
      opennedPage = (
        <div className="editProfile__pageBasic">
          <input
            value={accountInfo.cover}
            onChange={coverEdit}
            placeholder="Обложка"
          ></input>
          <br></br>
          <br></br>
          <button onClick={save}>Сохранить</button>
        </div>
      );
      break;
    case "SECURITY":
      opennedPage = (
        <div className="editProfile__pageBasic">
          <a href="#" onClick={editPassword}>
            Изменить пароль аккаунта
          </a>
          <br></br>
          <br></br>
          <button onClick={save}>Сохранить</button>
        </div>
      );
      break;
    case "CONTROL":
      opennedPage = (
        <div className="editProfile__pageBasic">
          <a href='#' onClick={closeAllSessions}>Завершить все активные сессии</a><br></br>
          <a href='#' onClick={deleteAccount}>Удалить аккаунт</a><br></br>
        </div>
      );
      break;
    default:
      opennedPage = (
        <div className="editProfile__pageBasic">
          Выберите страницу настроек, для продолжения работы
        </div>
      );
      break;
  }

  return (
    <>
      <LoaderBox mode="hide" />
      <LeftMenu />
      <main className="editProfile__main">
        <div className="editProfile__main__content">
          <div className="editProfile__content__menu">
            <ul className="editProfile__menu__items">
              <li
                onClick={() => {
                  setMenuSelected("BASIC");
                }}
              >
                Основные настройки
              </li>
              <li
                onClick={() => {
                  setMenuSelected("STYLE");
                }}
              >
                Внешний вид страницы
              </li>
              <li
                onClick={() => {
                  setMenuSelected("SECURITY");
                }}
              >
                Безопасность
              </li>
              <li
                onClick={() => {
                  setMenuSelected("CONTROL");
                }}
              >
                Управление страницей
              </li>
            </ul>
          </div>
          {opennedPage}
        </div>
      </main>
    </>
  );

  async function save() {
    let response = await fetch(webInfo.backendServer + "/api/editUserData", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userLogin: userEditLogin,
        password: userPassword,
        global: userData,
        other: accountInfo,
      }),
    });

    if (response.ok) {
      let json = await response.json();
      if (json.payload.status === "OK") {
        navigate("/user/" + json.payload.data.newLogin, [navigate]);
      } else {
        alert(json.payload.data);
      }
      console.log(json);
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  function loginEdit(e) {
    setUserData({
      ...userData,
      login: e.target.value,
    });
  }

  function fullnameEdit(e) {
    setUserData({
      ...userData,
      fullname: e.target.value,
    });
  }

  function emailEdit(e) {
    setUserData({
      ...userData,
      email: e.target.value,
    });
  }

  function profileStatsEdit(e) {
    setAccountInfo({
      ...accountInfo,
      profileStatus: e.target.value,
    });
  }

  function avatarEdit(e) {
    setAccountInfo({
      ...accountInfo,
      avatar: e.target.value,
    });
  }

  function coverEdit(e) {
    setAccountInfo({
      ...accountInfo,
      cover: e.target.value,
    });
  }

  async function editPassword() {
    const oldPassword = await prompt("Введите текущий пароль");
    const newPassword = await prompt("Введите новый пароль");
    const newPasswordRepeat = await prompt("Повторите новый пароль");

    let response = await fetch(
      webInfo.backendServer + "/api/editUserPassword",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: await userEditLogin,
          oldPassword: await oldPassword,
          newPassword: await newPassword,
          newPasswordRepeat: await newPasswordRepeat,
        }),
      }
    );

    if (response.ok) {
      let json = await response.json();
      if (json.payload.status === "OK") {
        alert("Пароль успешно изменен");
      } else {
        alert(json.payload.data);
      }
      console.log(json);
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  async function closeAllSessions() {
        const password = await prompt("Введите ваш пароль");

        let response = await fetch(webInfo.backendServer+"/api/closeAllSessions", {
            method: "post",
            headers: {
            Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: await userData.login,
                password: await password,
            }),
        });

        if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                localStorage.setItem("SESSION_TOKEN", undefined);
                navigate('/', [navigate])
            } else {
                alert("Не удалось удалить все сессии")
                alert(json.payload.data)
            }
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    async function deleteAccount() {
        const password = await prompt("Введите ваш пароль");

        let response = await fetch(webInfo.backendServer+"/api/deleteAccount", {
            method: "post",
            headers: {
            Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: await userData.login,
                password: await password,
            }),
        });

        if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                localStorage.setItem("SESSION_TOKEN", undefined);
                localStorage.setItem("PASSWORD", undefined);
                navigate('/', [navigate])
            } else {
                alert("Не удалось удалить аккаунт")
                alert(json.payload.data)
            }
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

  function errorPage() {
    window.location.href = "/";
  }
}
