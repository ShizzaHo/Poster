import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";

export default function User(props) {
    const { id } = useParams();

    const [userData, setUserData] = useState({});
    const [accountInfo, setAccountInfo] = useState({});

    const navigate = useNavigate();
    
    useEffect(() =>{
        const getData = async () => {
            let response = await fetch("http://localhost:3001/api/getUserInfo?login="+id);

            if (response.ok) {
                let json = await response.json();
                if (json.payload.status === "OK") {
                    setUserData(json.payload.data);
                    setAccountInfo(json.payload.data.accountInfo);
                } else {
                    errorPage();
                }
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
        getData();
    }, [id]);

    return (
        <main className=''>
            <p>Логин: {userData.login}</p>
            <p>Полное имя: {userData.fullname}</p>
            <p>Статус пользователя: {accountInfo.profileStatus}</p>
            <p>Email: {userData.email}</p>
            <p>Статус аккаунта: {userData.status}</p>
            <a href='#' onClick={editProfile}>Редактировать данные аккаунта</a><br></br>
            <a href='#' onClick={closeAllSessions}>Завершить все активные сессии</a><br></br>
            <a href='#'>Удалить аккаунт</a><br></br>
        </main>
    );

    function errorPage() {
        window.location.href = "/";
    }

    function editProfile() {
        navigate('/editProfile', [navigate])
    }

    async function closeAllSessions() {
        const password = await prompt("Введите ваш пароль");

        let response = await fetch("http://localhost:3001/api/closeAllSessions", {
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
}