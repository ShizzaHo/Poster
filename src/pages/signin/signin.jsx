import './signin.scss';

import { useState } from 'react';

export default function Signin() {

    const [inputs, setInputs] = useState({
        login: "",
        email: "",
        fullname: "",
        password: "",
        passwordRepeat: "",
    })

    return (
        <>
            <input type="text" placeholder='Логин' onChange={changeLogin} value={inputs.login}></input><br/>
            <input type="email" pattern=".+@globex\.com" required placeholder='Почта' onChange={changeEmail} value={inputs.email}></input><br/>
            <input type="text" placeholder='Полное имя (по желанию)' onChange={changeFullname} value={inputs.fullname}></input><br/>
            <input type="password" placeholder='Пароль' onChange={changePassword} value={inputs.password}></input><br/>
            <input type="password" placeholder='Повторите пароль' onChange={changePasswordRepeat} value={inputs.passwordRepeat}></input><br/>
            <button onClick={registration}>Регистрация</button>
        </>
    );

    function changeLogin(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            login: text
        })
    }

    function changeEmail(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            email: text
        })
    }

    function changeFullname(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            fullname: text
        })
    }

    function changePassword(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            password: text
        })
    }

    function changePasswordRepeat(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            passwordRepeat: text
        })
    }

    function registration() {
        if (inputs.login !== "" && inputs.email !== "" && inputs.password !== "") {
            if (inputs.password === inputs.passwordRepeat) {
                registrationSend();
            } else {
                alert("Пароли не совпадают")
            }
        } else {
            alert("Не все обязательные поля заполнены")
        }
    }

    async function registrationSend() {
        let response = await fetch("http://localhost:3001/api/createUser",{
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: inputs.login,
                email: inputs.email,
                fullname: inputs.fullname,
                password: inputs.password,
                passwordRepeat: inputs.passwordRepeat
            })
            });
        
            if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                alert("Успешная регистрация")
                window.localStorage.setItem("SESSION_TOKEN",json.payload.data.token)
            } else {
                alert(json.payload.data)
            }
            console.log(json);
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
    }
}