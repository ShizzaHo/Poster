import './signin.scss';

import { useState } from 'react';

export default function Signin() {

    const [inputs, setInputs] = useState({
        email: "chekan898@gmail.com",
        password: "Nuamka1234",
    })

    return (
        <>
            <input type="email" pattern=".+@globex\.com" required placeholder='Почта' onChange={changeEmail} value={inputs.email}></input><br/>
            <input type="password" placeholder='Пароль' onChange={changePassword} value={inputs.password}></input><br/>
            <button onClick={login}>Войти</button>
        </>
    );

    function changeEmail(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            email: text
        })
    }

    function changePassword(e) {
        const text = e.target.value;
        setInputs({
            ...inputs,
            password: text
        })
    }

    function login() {
        if (inputs.email !== "" && inputs.password !== "") {
            loginSend();
        } else {
            alert("Не все обязательные поля заполнены")
        }
    }

    async function loginSend() {
        let response = await fetch("http://localhost:3001/api/loginUser",{
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: inputs.email,
                password: inputs.password,
            })
            });
        
            if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                alert("Успешная регистрация")
            } else {
                alert(json.payload.data)
            }
            console.log(json);
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
    }
}