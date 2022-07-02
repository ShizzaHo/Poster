import "./register.scss";

import { useState } from "react";
import MaterialIcon from "material-icons-react";
import { useNavigate } from "react-router-dom";

import PosterTitle from "../../components/global/posterTitle/PosterTitle";

export default function Register() {
  const navigate = useNavigate();
  const [closePanel, setClosePanel] = useState(false);

  const [inputs, setInputs] = useState({
    login: "",
    email: "",
    fullname: "",
    password: "",
    passwordRepeat: "",
  });

  return (
    <div className={closePanel ? "fullscreenBlur_close" : "fullscreenBlur"}>
      <footer className="register__footer">
        <div className="register__footer__content">
          <div className="register__content__icon" onClick={back}>
            <MaterialIcon icon="arrow_back" color="#FFFFFF" />
          </div>
          <span className="register__content__text">Регистрация в POSTER</span>
        </div>
      </footer>
      <main>
        <div className="register__main__content">
          <PosterTitle />
          <div className="register__content__buttons">
            <input
              type="text"
              placeholder="Логин"
              onChange={changeLogin}
              value={inputs.login}
              className="textBox"
            ></input>
            <br />
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
              type="text"
              placeholder="Полное имя (по желанию)"
              onChange={changeFullname}
              value={inputs.fullname}
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
            <input
              type="password"
              placeholder="Повторите пароль"
              onChange={changePasswordRepeat}
              value={inputs.passwordRepeat}
              className="textBox"
            ></input>
            <br />
          </div>
          <button onClick={registration} className="button">
            Зарегестрироваться
          </button>
        </div>
      </main>
    </div>
  );

  function back() {
    setClosePanel(true);
    setTimeout(() => {
      navigate("/", [navigate]);
    }, 1000);
  }

  function changeLogin(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      login: text,
    });
  }

  function changeEmail(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      email: text,
    });
  }

  function changeFullname(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      fullname: text,
    });
  }

  function changePassword(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      password: text,
    });
  }

  function changePasswordRepeat(e) {
    const text = e.target.value;
    setInputs({
      ...inputs,
      passwordRepeat: text,
    });
  }

  function registration() {
    if (inputs.login !== "" && inputs.email !== "" && inputs.password !== "") {
      if (inputs.password === inputs.passwordRepeat) {
        registrationSend();
      } else {
        alert("Пароли не совпадают");
      }
    } else {
      alert("Не все обязательные поля заполнены");
    }
  }

  async function registrationSend() {
    let response = await fetch("http://localhost:3001/api/createUser", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: inputs.login,
        email: inputs.email,
        fullname: inputs.fullname,
        password: inputs.password,
        passwordRepeat: inputs.passwordRepeat,
      }),
    });

    if (response.ok) {
      let json = await response.json();
      if (json.payload.status === "OK") {
        window.localStorage.setItem("SESSION_TOKEN", json.payload.data.token);
        navigate("/", [navigate]);
      } else {
        alert(json.payload.data);
      }
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }
}
