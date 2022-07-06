import { webInfo } from '../../info';
import "./login.scss";

import { useNavigate } from "react-router-dom";
import MaterialIcon from "material-icons-react";

import PosterTitle from "../../components/global/posterTitle/PosterTitle";
import LoaderBox from "../../components/global/loaderBox/loaderBox";

import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [closePanel, setClosePanel] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);

  return (
    <>
      {loginComplete ? <LoaderBox mode="show"/> : <></>}
      <div className={closePanel ? "fullscreenBlur_close" : "fullscreenBlur"}>
        <footer className="login__footer">
          <div className="login__footer__content">
            <div className="login__content__icon" onClick={back}>
              <MaterialIcon icon="arrow_back" color="#FFFFFF" />
            </div>
            <span className="login__content__text">Войти в POSTER</span>
          </div>
        </footer>
        <main className="login__main">
          <div className="login__main__content">
            <PosterTitle />
            <div className="login__content__buttons">
              <input
                type="email"
                pattern=".+@globex\.com"
                required
                placeholder="Почта"
                onChange={changeEmail}
                value={inputs.email}
                className="textBox"
              ></input>
              <br />
              <input
                type="password"
                placeholder="Пароль"
                onChange={changePassword}
                value={inputs.password}
                className="textBox"
              ></input>
              <br />
            </div>
            <button onClick={login} className="button">
              Войти
            </button>
          </div>
        </main>
      </div>
    </>
  );

  function back() {
    setClosePanel(true);
    setTimeout(() => {
      navigate("/", [navigate]);
    }, 1000);
  }

  function changeEmail(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      email: text,
    });
  }

  function changePassword(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      password: text,
    });
  }

  function login() {
    if (inputs.email !== "" && inputs.password !== "") {
      loginSend();
    } else {
      alert("Не все обязательные поля заполнены");
    }
  }

  async function loginSend() {
    let response = await fetch(webInfo.backendServer+"/api/loginUser", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: inputs.email,
        password: inputs.password,
      }),
    });

    if (response.ok) {
      let json = await response.json();
      if (json.payload.status === "OK") {
        nextPage(json)
      } else {
        alert(json.payload.data);
      }
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  function nextPage(json) {
    setLoginComplete(true);
    setTimeout(()=>{
      window.localStorage.setItem("SESSION_TOKEN", json.payload.data.token);
      window.localStorage.setItem("PASSWORD", inputs.password);
      navigate("/user/"+json.payload.data.login, [navigate]);
    }, 800)
  }
}
