import './signup.scss';
import {useNavigate} from 'react-router-dom';
import MaterialIcon from 'material-icons-react';

import PosterTitle from '../../components/global/posterTitle/PosterTitle';

import { useState } from 'react';

export default function Signup() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    })

    return (
        <div className='fullscreenBlur'>
            <footer className='signup__footer'>
                <div className='footer__footerContent'>
                    <div className='footerContent__icon' onClick={back}>
                        <MaterialIcon icon="arrow_back" color="#FFFFFF"/>
                    </div>
                    <span className='footerContent__text'>Регистрация в POSTER</span>
                </div>
            </footer>
            <main className='signup__main'>
                <div className='main__content'>
                    <PosterTitle/>
                    <input type="email" pattern=".+@globex\.com" required placeholder='Почта' onChange={changeEmail} value={inputs.email} className="textBox"></input><br/>
                    <input type="password" placeholder='Пароль' onChange={changePassword} value={inputs.password} className="textBox"></input><br/>
                    <button onClick={login} className="button">Войти</button>
                </div>
            </main>
        </div>
    );

    function back() {
        navigate('/', [navigate])
    }

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
                    alert("Успешная авторизация")
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